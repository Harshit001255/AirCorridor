from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_plan import router as plan_router
from app.api.ws_live import router as ws_router
from app.simulation.hazard_events import router as hazard_router

app = FastAPI(title="AirCorridor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan_router)
app.include_router(ws_router)
app.include_router(hazard_router)



@app.get("/health")
def health():
    return {"status": "ok"}