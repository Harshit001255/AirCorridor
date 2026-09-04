from fastapi import APIRouter

from app.models.schemas import PlanRequest
from app.engine.planner_service import plan_path
from app.config import TEST_GRID

router = APIRouter()


@router.post("/plan")
def plan(request: PlanRequest):
    return plan_path(TEST_GRID, request.start, request.goal)