"use client";
import { Canvas } from "@/components/sketches/Canvas";
import { SketchLoading } from "@/components/sketches/SketchLoading";
import { useEffect, useState, useRef, RefObject } from "react";

const GRID_SIZE = 4;

const Sketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWebGPUBrowser, setHasWebGPUBrowser] = useState(false);
  const [hasWebGPUHardware, setHasWebGPUHardware] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const mountCallback = async (canvasRef: RefObject<HTMLCanvasElement>) => {
      console.log("mounting");
      const foundBrowserSupport = !!navigator.gpu;
      if (!foundBrowserSupport) {
        const errorMsg = "WebGPU not supported";
        console.error(errorMsg);
        setHasWebGPUBrowser(false);
        setError(errorMsg);
        return;
      } else if (foundBrowserSupport && hasWebGPUBrowser !== true) {
        setHasWebGPUBrowser(true);
      }
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        const errorMsg = "WebGPU hardware not found";
        console.error(errorMsg);
        setError(errorMsg);
        setHasWebGPUHardware(false);
        return;
      } else if (adapter && hasWebGPUHardware !== true) {
        setHasWebGPUHardware(true);
        setIsLoading(false);
      }

      if (!canvasRef.current) {
        return;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext("webgpu");
      if (!context) {
        setError("WebGPU context not found");
        return;
      }

      const device = await adapter.requestDevice();

      const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device: device,
        format: canvasFormat,
      });

      // two triangles that share an edge
      // prettier-ignore
      const vertices = new Float32Array([
        //   X,    Y,
          -0.8, -0.8, 
           0.8, -0.8,
           0.8,  0.8,
        
          -0.8, -0.8, 
           0.8,  0.8,
          -0.8,  0.8,
        ]);

      /*
    The GPU cannot draw vertices with data from a JavaScript array. 
    GPUs frequently have their own memory that is highly optimized for rendering, 
    and so any data you want the GPU to use while it draws needs to be placed in that memory.

    For a lot of values, including vertex data, the GPU-side memory is managed through GPUBuffer objects. 
    A buffer is a block of memory that's easily accessible to the GPU and flagged for certain purposes. 
    You can think of it a little bit like a GPU-visible TypedArray.
    */

      // webgpu labels are awesome, they help with debugging, no more cryptic webgl errors
      const vertexBuffer = device.createBuffer({
        label: "Cell vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, //have to tell the gpu this is vertex data that can be copied into
      });
      // this buffer object that gets returned is opaque,
      // ie you can't (easily) inspect the data it holds.
      // Additionally, most of its attributes are immutable—you can't resize a GPUBuffer after it's been created,
      // nor can you change the usage flags. What you can change are the contents of its memory.
      device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices);

      const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
      const uniformBuffer = device.createBuffer({
        label: "Grid Uniforms",
        size: uniformArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(uniformBuffer, 0, uniformArray);


      const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8, // number of bytes the GPU needs to skip forward in the buffer when it's looking for the next vertex. Each vertex of your square is made up of two 32-bit floating point numbers. 32-bit float is 4 bytes, so two floats is 8 bytes.
        attributes: [
          {
            format: "float32x2",
            offset: 0,
            shaderLocation: 0, // Position, see vertex shader
          },
        ],
      };

      const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: `
        @group(0) @binding(0) var<uniform> grid: vec2f;

        @vertex
        fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
            
            let cell = vec2f(1, 1);
            // we have to 2x because NDC coordinates are -1 to 1
            let cellOffset = cell / grid * 2; // Updated
            let gridPos = (pos + 1) / grid - 1 + cellOffset;

            return vec4f(gridPos, 0, 1);
        }

        @fragment
        fn fragmentMain() -> @location(0) vec4f {
            return vec4(0.5, 0, 1, 1.0);
        }
        `,
      });

      const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: "auto",
        vertex: {
          module: cellShaderModule,
          entryPoint: "vertexMain",
          buffers: [vertexBufferLayout],
        },
        fragment: {
          module: cellShaderModule,
          entryPoint: "fragmentMain",
          targets: [
            {
              format: canvasFormat,
            },
          ],
        },
      });

      const bindGroup = device.createBindGroup({
        label: "Cell renderer bind group",
        layout: cellPipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: { buffer: uniformBuffer }
        }],
      });

      // provides an interface for recording GPU commands.
      const encoder = device.createCommandEncoder();

      /*
        The texture is given as the view property of a colorAttachment. 
        Render passes require that you provide a GPUTextureView instead of a GPUTexture, which tells it which parts of the texture 
        to render to. This only really matters for more advanced use cases, so here you call createView() with no arguments on the texture, 
        indicating that you want the render pass to use the entire texture.
        
        
        You also have to specify what you want the render pass to do with the texture when it starts and when it ends:
        A loadOp value of "clear" indicates that you want the texture to be cleared when the render pass starts.
        A storeOp value of "store" indicates that once the render pass is finished you want the results 
        of any drawing done during the render pass saved into the texture.
       */
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 1, g: 0, b: 0.4, a: 1 },
          },
        ],
      });

      pass.setPipeline(cellPipeline);
      pass.setVertexBuffer(0, vertexBuffer);

      pass.setBindGroup(0, bindGroup);
      const instances = GRID_SIZE * GRID_SIZE;
      pass.draw(vertices.length / 2, instances); // 2 vertices per cell, in 3d it would be 3

      pass.end();

      /*
    so far we haven't actually done anything
    simply making these calls does not cause the GPU to actually do anything. 
    They're just recording commands for the GPU to do later.
    */

      // In order to create a GPUCommandBuffer, call finish() on the command encoder
      // this is an interface to handle the recorded commands, these are not reuasable

      // const commandBuffer = encoder.finish();
      // device.queue.submit([commandBuffer]);

      // so we prefer to use it like this
      // Finish the command buffer and immediately submit it.
      device.queue.submit([encoder.finish()]);
    };
    mountCallback(canvasRef);
  }, [hasWebGPUBrowser, hasWebGPUHardware]);

  if (isLoading) {
    return <SketchLoading />;
  }

  if (!hasWebGPUBrowser || !hasWebGPUHardware) {
    const message = !hasWebGPUBrowser ? "browser" : "device";
    return (
      <p>
        Your {message} does not support{" "}
        <a href="https://www.w3.org/TR/webgpu/">WebGPU</a>:(
      </p>
    );
  }

  return <Canvas ref={canvasRef} />;
};

export default Sketch;
