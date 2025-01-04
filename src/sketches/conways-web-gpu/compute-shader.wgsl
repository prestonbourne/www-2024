@group(0) @binding(0) var<uniform> grid: vec2f;

@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;
   
fn cellIndex(cell: vec2u) -> u32 {
  return (cell.y % u32(grid.y)) * u32(grid.x) +
         (cell.x % u32(grid.x));
}

fn cellActive(x: u32, y: u32) -> u32 {
  return cellStateIn[cellIndex(vec2(x, y))];
}

@compute @workgroup_size(8,8)
fn computeMain(@builtin(global_invocation_id) cell: vec3u) {

    // Define the relative positions of the neighbors
    let neighbor_offsets = array<vec2i, 8>(
        vec2i(1, 1), vec2i(1, 0), vec2i(1, -1),
        vec2i(0, -1), vec2i(-1, -1), vec2i(-1, 0),
        vec2i(-1, 1), vec2i(0, 1)
    );

    var activeNeighbors: u32 = 0;

    for (var i: u32 = 0; i < 8; i = i + 1) {
        let neighbor = neighbor_offsets[i];
        activeNeighbors = activeNeighbors + cellActive(cell.x + u32(neighbor.x), cell.y + u32(neighbor.y));
    }

    let currCellIdx = cellIndex(cell.xy);
    switch activeNeighbors {
        case 2u: {
            // 2 neighbors means stay the same
            cellStateOut[currCellIdx] = cellStateIn[currCellIdx];
        }
        case 3u: {
            // 3 neighbors means become active
            cellStateOut[currCellIdx] = 1;
        }
        default: {
            // Otherwise, stay inactive
            cellStateOut[currCellIdx] = 0;
        }
    }
}

