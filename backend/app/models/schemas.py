from pydantic import BaseModel
from typing import List


class PlanRequest(BaseModel):
    start: List[int]
    goal: List[int]


class HazardRequest(BaseModel):
    start: List[int]
    goal: List[int]
    obstacles: List[List[int]]