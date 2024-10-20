@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cellState: array<u32>;

struct VertexInput {
  @location(0) pos: vec2f,
  @builtin(instance_index) instanceIdx: u32,
};

struct VertexOutput {
  @builtin(position) pos: vec4f,
  @location(0) cell: vec2f,
};


@vertex
fn vertexMain(input: VertexInput) -> VertexOutput  {
  let i = f32(input.instanceIdx);

  let cellX = i % grid.x;
  let cellY = floor(i / grid.x);
  let binaryCellState = f32(cellState[u32(i)]);
  
 // Calculate the cell coordinates in the grid
 // The x-coordinate is found by taking the remainder of the instance index divided by the grid width.
 // This effectively wraps the instance index around when it exceeds the grid width, placing it in the correct column.
 // The y-coordinate is found by dividing the instance index by the grid width and flooring the result.
 // This gives the row number by counting how many full rows fit into the instance index.
 let cell = vec2f(i % grid.x, floor(i / grid.x));

  let cellOffset = cell / grid * 2;

  // since the binary cell state is either 0 or 1, we can use it to scale the position
  // if its scaled by 0, it becomes a single point (0,0,0,0), which the gpu will discard
  let gridPos = (binaryCellState * input.pos + 1) / grid - 1 + cellOffset;

  
  var output: VertexOutput;
  output.pos = vec4f(gridPos, 0, 1);
  output.cell = cell;
  return output;
}


@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let c = input.cell / grid;
    return vec4(c, 1-c.x, 1.0);
}