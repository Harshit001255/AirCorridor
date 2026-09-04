# AirCorridor

**Dynamic 3D VFR Trajectory Optimization Engine for Urban Air Mobility**

AirCorridor is a 3D pathfinding system for drone/UAM routing in city airspace. It plans the shortest, safest route through a 3D grid, and reroutes live when a hazard (like a temporary no-fly zone) appears mid-flight — instead of relying on flat, static 2D GPS routing.

Built for a hackathon (theme: AI/ML / Open Innovation), with a live dashboard visualizing the drone rerouting around obstacles in real time.

## How it works

- The city's airspace is represented as a 3D voxel grid, where each cell is either free or blocked.
- A 3D A* search finds the shortest, lowest-cost path from start to goal.
- When a hazard is triggered, the system marks the affected area blocked and recalculates a new path from the drone's current position — live, over a WebSocket, without the frontend needing to ask again.

## Tech stack

- **Backend:** Python, FastAPI, Pydantic, WebSockets
- **Frontend:** React, Three.js

## Project structure

```
AirCorridor/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── config.py            # Shared constants (test grid, etc.)
│   │   ├── core/
│   │   │   └── pathfinder.py    # 3D A* algorithm
│   │   ├── engine/
│   │   │   └── planner_service.py  # plan_path() + replan_path()
│   │   ├── api/
│   │   │   ├── routes_plan.py   # POST /plan
│   │   │   └── ws_live.py       # WebSocket /ws/live
│   │   ├── simulation/
│   │   │   └── hazard_events.py # POST /trigger-hazard, GET /hazards
│   │   └── models/
│   │       └── schemas.py       # Shared request/response shapes
│   ├── tests/
│   │   ├── test_pathfinder.py
│   │   └── test_planner_service.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api/socket.js
│       ├── scene/
│       │   ├── CityGrid.jsx
│       │   ├── DronePath.jsx
│       │   └── HazardZone.jsx
│       └── dashboard/
│           └── ControlPanel.jsx
└── README.md
```

## Team

| Role | Owner | Scope |
|---|---|---|
| Backend 1 — Algorithm | Harshit | `core/`, `tests/`, `engine/` |
| Backend 2 — API / Systems | Sikha | `api/`, `simulation/`, `models/` |
| Frontend | Niharika | `frontend/` |

## Running it locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`. Interactive API docs at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/plan` | Compute an initial path (`{"start": [x,y,z], "goal": [x,y,z]}`) |
| POST | `/trigger-hazard` | Trigger a hazard on the drone's current path and get a rerouted path |
| GET | `/hazards` | List all hazards triggered so far |
| WS | `/ws/live` | Live connection — sends a path on request, pushes updated paths when a hazard is triggered |

## Status

Backend (algorithm, API, hazard rerouting) and frontend (3D visualization, live hazard trigger) are both built and verified working end-to-end, including the live reroute demo.

**Not yet built / future work:** wind-aware cost function, D* Lite incremental replanning, moving obstacles, multi-drone coordination, real city grid data.