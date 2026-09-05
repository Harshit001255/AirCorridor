// Coordinate helper mapping 3D Grid [row, col, altitude] to Three.js world [x, y, z]
export const GRID_SPACING = 3.5;
export const ALT_BASE = 0.6;
export const ALT_SPACING = 2.0;

export function gridToWorld([row, col, alt = 0]) {
    // col -> x (centered around col 1)
    // alt -> y (height above ground)
    // row -> z (centered around row 1)
    const x = (col - 1) * GRID_SPACING;
    const y = ALT_BASE + alt * ALT_SPACING;
    const z = (row - 1) * GRID_SPACING;
    return [x, y, z];
}
