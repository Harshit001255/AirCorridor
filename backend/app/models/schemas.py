from pydantic import BaseModel, Field
from typing import List


class PlanRequest(BaseModel):
    start: List[int] = Field(default=[0, 0, 0], description="3D start coordinate (row, col, altitude)")
    goal: List[int] = Field(default=[2, 2, 0], description="3D goal coordinate (row, col, altitude)")
    hazard_position: list[int] | None = None


class HazardRequest(BaseModel):
    start: List[int] = Field(default=[0, 0, 0])
    goal: List[int] = Field(default=[2, 2, 0])
    obstacles: List[List[int]] = Field(default_factory=list)
