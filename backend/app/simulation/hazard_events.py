import time
import uuid

from fastapi import APIRouter

from app.models.schemas import PlanRequest
from app.engine.planner_service import replan_path
from app.api.ws_live import manager
from app.config import TEST_GRID

router = APIRouter()

active_hazards: list[dict] = []


def hazard_cells_from_center(center, radius, grid):
    """Returns every grid cell within `radius` steps of `center`, in bounds."""
    row_c, col_c, alt_c = center
    no_of_rows = len(grid)
    no_of_col = len(grid[0])
    no_of_alt = len(grid[0][0])
    cells = []
    for dr in range(-radius, radius + 1):
        for dc in range(-radius, radius + 1):
            for da in range(-radius, radius + 1):
                r, c, a = row_c + dr, col_c + dc, alt_c + da
                if 0 <= r < no_of_rows and 0 <= c < no_of_col and 0 <= a < no_of_alt:
                    cells.append((r, c, a))
    return cells


@router.post("/trigger-hazard")
async def trigger_hazard(request: PlanRequest) -> dict:
    if getattr(request, "hazard_position", None) is not None:
        hazard_center = tuple(request.hazard_position)
    else:
        start_row, start_col, start_alt = request.start
        goal_row, goal_col, goal_alt = request.goal
        hazard_center = (
            (start_row + goal_row) // 2,
            (start_col + goal_col) // 2,
            (start_alt + goal_alt) // 2,
        )

    # Use radius=0 for exact single-cell obstacle placement on 3D grid
    new_obstacles = hazard_cells_from_center(hazard_center, radius=0, grid=TEST_GRID)

    hazard = {
        "id": str(uuid.uuid4()),
        "center": list(hazard_center),
        "radius": 0,
        "triggered_at": time.time(),
    }
    active_hazards.append(hazard)

    # Collect all active hazard cells
    all_hazard_cells = set()
    for h in active_hazards:
        h_center = tuple(h["center"])
        h_rad = h.get("radius", 0)
        for cell in hazard_cells_from_center(h_center, radius=h_rad, grid=TEST_GRID):
            all_hazard_cells.add(cell)

    new_path = replan_path(TEST_GRID, request.start, request.goal, list(all_hazard_cells))

    broadcast_data = {
        "type": "HAZARD_TRIGGERED",
        "hazard": hazard,
        "active_hazards": list(active_hazards),
        "success": new_path.get("success", False),
        "path": new_path.get("path"),
        "path_length": new_path.get("path_length", 0),
        "message": new_path.get("message", "")
    }

    await manager.broadcast(broadcast_data)

    return {
        "hazard": hazard,
        "active_hazards": active_hazards,
        "new_path": new_path,
    }


@router.post("/clear-hazards")
async def clear_hazards(request: PlanRequest) -> dict:
    active_hazards.clear()
    cleared_path = replan_path(TEST_GRID, request.start, request.goal, [])
    broadcast_data = {
        "type": "HAZARDS_CLEARED",
        "hazard": None,
        "active_hazards": [],
        "success": cleared_path.get("success", False),
        "path": cleared_path.get("path"),
        "path_length": cleared_path.get("path_length", 0),
        "message": "All hazards cleared. Reverted to optimal path."
    }
    await manager.broadcast(broadcast_data)
    return {
        "message": "All hazards cleared",
        "new_path": cleared_path,
    }


@router.get("/hazards")
def list_hazards() -> list[dict]:
    return active_hazards
