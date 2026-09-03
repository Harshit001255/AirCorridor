"""
[... your original docstring, unchanged ...]
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from app.models.schemas import PlanRequest
from app.engine.planner_service import plan_path
from app.config import TEST_GRID

router = APIRouter()


class ConnectionManager:
    # ... unchanged, this part was already correct ...
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict) -> None:
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                dead_connections.append(connection)
        for connection in dead_connections:
            self.disconnect(connection)


manager = ConnectionManager()


@router.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            raw = await websocket.receive_json()
            try:
                request = PlanRequest(**raw)
            except ValidationError as e:
                await websocket.send_json({"error": "invalid request", "detail": e.errors()})
                continue

            result = plan_path(TEST_GRID, request.start, request.goal)
            await websocket.send_json(result)

    except WebSocketDisconnect:
        manager.disconnect(websocket)