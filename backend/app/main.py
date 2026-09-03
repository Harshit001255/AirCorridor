from fastapi import FastAPI

from app.api.routes_plan import router as plan_router
from app.api.ws_live import router as ws_router

app = FastAPI(title="AirCorridor")

app.include_router(plan_router)
app.include_router(ws_router)


@app.get("/health")
def health():
    return {"status": "ok"}
