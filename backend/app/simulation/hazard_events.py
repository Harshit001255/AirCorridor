import time
import uuid

from fastapi import APIRouter

from app.models.schemas import PlanRequest
from app.engine.planner_service import plan_path, replan_path
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
    if request.start == request.goal:
        return {
            "hazard": None,
            "new_path": {
                "success": False,
                "path": None,
                "path_length": 0,
                "message": "Drone is already at the goal — nothing to replan."
            }
        }
    current_plan = plan_path(TEST_GRID, request.start, request.goal)

    if not current_plan["success"]:
        return {
            "hazard": None,
            "new_path": current_plan
        }

    path = current_plan["path"]
    midpoint_index = len(path) // 2
    hazard_center = tuple(path[midpoint_index])

    new_obstacles = hazard_cells_from_center(hazard_center, radius=1, grid=TEST_GRID)

    hazard = {
        "id": str(uuid.uuid4()),
        "center": list(hazard_center),
        "radius": 1,
        "triggered_at": time.time(),
    }
    active_hazards.append(hazard)

    new_path = replan_path(TEST_GRID, request.start, request.goal, new_obstacles)

    if new_path["success"]:
        await manager.broadcast(new_path)

    return {
        "hazard": hazard,
        "new_path": new_path,
    }


@router.get("/hazards")
def list_hazards() -> list[dict]:
    return active_hazards