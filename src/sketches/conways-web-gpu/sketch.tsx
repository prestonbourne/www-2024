"use client";
import { SketchLoading } from "@/components/sketches/loading";
import { useEffect, useState, useRef, RefObject } from "react";
import shader from "./shader.wgsl";
import simulationShader from "./compute-shader.wgsl";
import { SketchWrapper } from "@/components/sketch-wrapper";
const GRID_SIZE = 32;

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
        alphaMode: "premultiplied",
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

      const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);

      const cellStateStorage = [
        device.createBuffer({
          label: "Cell State A",
          size: cellStateArray.byteLength,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        }),
        device.createBuffer({
          label: "Cell State B",
          size: cellStateArray.byteLength,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        }),
      ];

      // initialize state
      for (let i = 0; i < cellStateArray.length; i++) {
        const rndValue = Math.random();
        const state = rndValue > 0.4 ? 1 : 0;
        cellStateArray[i] = state;
      }

      device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);

      // Mark every other cell of the second grid as active.
      for (let i = 0; i < cellStateArray.length; i++) {
        cellStateArray[i] = i % 2;
      }
      device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);

      const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: shader,
      });

      const simulationShaderModule = device.createShaderModule({
        label: "Simulation shader",
        code: simulationShader,
      });

      const bindGroupLayout = device.createBindGroupLayout({
        label: "Cell Bind Group Layout",
        entries: [
          {
            binding: 0,
            // Add GPUShaderStage.FRAGMENT here if you are using the `grid` uniform in the fragment shader.
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
            buffer: {}, // Grid uniform buffer
          },
          {
            binding: 1,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
            buffer: { type: "read-only-storage" }, // Cell state input buffer
          },
          {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "storage" }, // Cell state output buffer
          },
        ],
      });

      // A bind group is a collection of resources (like buffers and textures) that are
      // bound together and made accessible to a shader. It maps directly to the @group
      // declarations in WGSL shaders, allowing efficient access to these resources.

      // We need two bind groups here to implement double buffering for the cellular automaton:
      // 1. It allows us to read from one buffer and write to another in each simulation step.
      // 2. We can then swap them for the next step, preventing race conditions.
      // 3. This ensures all cells are updated based on the same initial state.

      // In GPU terms, these bind groups correspond to sets of memory locations and
      // their access patterns, optimized for parallel processing on the GPU.
      const bindGroups = [
        device.createBindGroup({
          label: "Cell renderer bind group A",
          layout: bindGroupLayout,
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer },
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[0] },
            },
            {
              binding: 2,
              resource: { buffer: cellStateStorage[1] },
            },
          ],
        }),
        device.createBindGroup({
          label: "Cell renderer bind group B",
          layout: bindGroupLayout,
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer },
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[1] },
            },
            {
              binding: 2,
              resource: { buffer: cellStateStorage[0] },
            },
          ],
        }),
      ];

      const pipelineLayout = device.createPipelineLayout({
        label: "Cell Pipeline Layout",
        bindGroupLayouts: [bindGroupLayout],
      });

      const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: pipelineLayout,
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

      const simulationPipeline = device.createComputePipeline({
        label: "Simulation pipeline",
        layout: pipelineLayout,
        compute: {
          module: simulationShaderModule,
          entryPoint: "computeMain",
        },
      });

      let step = 0;
      const UPDATE_INTERVAL_MS = 120;
      const WORKGROUP_SIZE = 8;
      const instances = GRID_SIZE * GRID_SIZE;
      const updateLoop = () => {
        // provides an interface for recording GPU commands.
        const encoder = device.createCommandEncoder();

        const computePass = encoder.beginComputePass();

        // New lines
        computePass.setPipeline(simulationPipeline);
        computePass.setBindGroup(0, bindGroups[step % 2]);

        /*
        Something very important to note here is that the number you pass into dispatchWorkgroups() 
        is not the number of invocations! Instead, it's the number of workgroups to execute, 
        as defined by the @workgroup_size in your shader.

        If you want the shader to execute 32x32 times in order to cover your entire grid, 
        and your workgroup size is 8x8, you need to dispatch 4x4 workgroups (4 * 8 = 32). 
        That's why you divide the grid size by the workgroup size and pass that value into dispatchWorkgroups().
        */
        const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
        computePass.dispatchWorkgroups(workgroupCount, workgroupCount);

        computePass.end();

        step++;
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
        const renderPass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: "clear",
              storeOp: "store",
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
            },
          ],
        });

        renderPass.setPipeline(cellPipeline);
        renderPass.setBindGroup(0, bindGroups[step % 2]);
        renderPass.setVertexBuffer(0, vertexBuffer);

        renderPass.draw(vertices.length / 2, instances); // 2 vertices per cell, in 3d it would be 3

        renderPass.end();

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

      const intervalId = setInterval(updateLoop, UPDATE_INTERVAL_MS);
      return () => {
        clearInterval(intervalId);
      };
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

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <SketchWrapper>
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        style={{
          margin: "0 auto",
        }}
      />
    </SketchWrapper>
  );
};

export default Sketch;
