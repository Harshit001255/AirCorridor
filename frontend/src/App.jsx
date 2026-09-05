import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CityGrid from './scene/CityGrid';
import ControlPanel from './dashboard/controlpanel';
import DronePath from './scene/dronepath';

export default function App() {
    const [start] = useState([0, 0, 0]);
    const [goal] = useState([2, 2, 0]);
    const [hazardCoord, setHazardCoord] = useState([0, 1, 0]);
    
    // Initial default Manhattan path for instant visual display
    const [path, setPath] = useState([
        [0, 0, 0],
        [0, 1, 0],
        [0, 2, 0],
        [1, 2, 0],
        [2, 2, 0]
    ]);
    const [pathInfo, setPathInfo] = useState({ success: true, path_length: 5, message: "Baseline optimal route active" });
    const [activeHazards, setActiveHazards] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isRerouted, setIsRerouted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastEvent, setLastEvent] = useState({
        type: 'info',
        title: 'System Initialized',
        detail: 'Ready for flight corridor simulation & hazard injection.'
    });

    // Setup Live WebSocket Connection
    useEffect(() => {
        let ws;
        let isMounted = true;

        function connectWs() {
            try {
                ws = new WebSocket('ws://localhost:8000/ws/live');

                ws.onopen = () => {
                    if (!isMounted) return;
                    setIsConnected(true);
                    ws.send(JSON.stringify({ start, goal }));
                };

                ws.onmessage = (event) => {
                    if (!isMounted) return;
                    try {
                        const data = JSON.parse(event.data);
                        if (data.path) {
                            setPath(data.path);
                            setPathInfo(data);
                        }
                        if (data.active_hazards !== undefined) {
                            setActiveHazards(data.active_hazards);
                            setIsRerouted(data.active_hazards.length > 0);
                        }
                    } catch (err) {
                        console.error("Error parsing WS packet:", err);
                    }
                };

                ws.onclose = () => {
                    if (!isMounted) return;
                    setIsConnected(false);
                    setTimeout(connectWs, 3000);
                };

                ws.onerror = () => {
                    if (!isMounted) return;
                    setIsConnected(false);
                };
            } catch (err) {
                console.warn("WebSocket initialization error:", err);
            }
        }

        connectWs();

        // Fetch initial baseline path via REST
        fetch('http://localhost:8000/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start, goal })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.path) {
                    setPath(data.path);
                    setPathInfo(data);
                }
            })
            .catch(() => {});

        return () => {
            isMounted = false;
            if (ws) ws.close();
        };
    }, []);

    // Handle Trigger Hazard Action
    const handleTriggerHazard = async (coordToTrigger) => {
        setIsLoading(true);
        const target = coordToTrigger || hazardCoord;
        try {
            const response = await fetch('http://localhost:8000/trigger-hazard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start,
                    goal,
                    hazard_position: target
                })
            });

            const data = await response.json();

            if (data.new_path && data.new_path.success && data.new_path.path) {
                setPath(data.new_path.path);
                setPathInfo(data.new_path);
                const updatedHazards = data.active_hazards || (data.hazard ? [data.hazard] : []);
                setActiveHazards(updatedHazards);
                setIsRerouted(true);
                setLastEvent({
                    type: 'reroute',
                    title: `Hazard Deployed at [${target.join(', ')}]`,
                    detail: `Corridor dynamically rerouted (${data.new_path.path_length} waypoints).`
                });
            } else if (data.new_path && !data.new_path.success) {
                setLastEvent({
                    type: 'error',
                    title: 'Airspace Corridor Blocked',
                    detail: data.new_path.message || 'No alternative path found with current obstacles.'
                });
            }
        } catch (error) {
            console.error("Failed to trigger hazard:", error);
            setLastEvent({
                type: 'error',
                title: 'Hazard Trigger Error',
                detail: 'Could not connect to backend server at http://localhost:8000'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Clear Hazards Action
    const handleClearHazards = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/clear-hazards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start, goal })
            });

            const data = await response.json();
            if (data.new_path && data.new_path.path) {
                setPath(data.new_path.path);
                setPathInfo(data.new_path);
                setActiveHazards([]);
                setIsRerouted(false);
                setLastEvent({
                    type: 'success',
                    title: 'Hazards Cleared',
                    detail: 'All obstacles removed. Restored baseline flight path.'
                });
            }
        } catch (error) {
            console.error("Failed to clear hazards:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#07090e', overflow: 'hidden' }}>
            {/* 3D WEBGL SIMULATION CANVAS */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* 3D Scene Controls Overlay Banner */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    zIndex: 10,
                    backgroundColor: 'rgba(13, 19, 31, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #1e293b',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span>🖱️ <strong>Left Click + Drag:</strong> Rotate Orbit</span>
                    <span>⚲ <strong>Scroll:</strong> Zoom</span>
                    <span>✋ <strong>Right Click:</strong> Pan</span>
                </div>

                <Canvas camera={{ position: [0, 10, 14], fov: 45 }}>
                    <color attach="background" args={['#07090e']} />
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 18, 10]} intensity={1.8} castShadow />
                    <pointLight position={[0, 5, 0]} intensity={0.8} color="#00ffcc" />
                    
                    <OrbitControls
                        makeDefault
                        minDistance={5}
                        maxDistance={30}
                        maxPolarAngle={Math.PI / 2.05}
                    />
                    
                    <CityGrid />
                    
                    <DronePath
                        path={path}
                        start={start}
                        goal={goal}
                        activeHazards={activeHazards}
                        isRerouted={isRerouted}
                    />
                </Canvas>
            </div>

            {/* FLIGHT CONTROL DASHBOARD */}
            <div style={{ width: '380px', flexShrink: 0, height: '100vh' }}>
                <ControlPanel
                    isConnected={isConnected}
                    path={path}
                    pathInfo={pathInfo}
                    activeHazards={activeHazards}
                    hazardCoord={hazardCoord}
                    setHazardCoord={setHazardCoord}
                    start={start}
                    goal={goal}
                    onTriggerHazard={handleTriggerHazard}
                    onClearHazards={handleClearHazards}
                    lastEvent={lastEvent}
                    isRerouted={isRerouted}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}