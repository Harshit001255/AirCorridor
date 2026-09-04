import React, { useEffect, useState } from 'react';

export default function ControlPanel() {
    const [isConnected, setIsConnected] = useState(false);
    const [latestPath, setLatestPath] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/live');

        socket.onopen = () => {
            setIsConnected(true);
            socket.send(JSON.stringify({
                start: [0, 0, 0],
                goal: [2, 2, 0]
            }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received path update from backend:", data);
            setLatestPath(data);
        };

        socket.onclose = () => setIsConnected(false);

        return () => socket.close();
    }, []);

    const handleTriggerHazard = async () => {
        try {
            const response = await fetch('http://localhost:8000/trigger-hazard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start: [0, 0, 0],
                    goal: [2, 2, 0],
                    hazard_position: [2, 0, 0]
                })
            });
            const result = await response.json();
            console.log("Hazard triggered successfully:", result);
        } catch (error) {
            console.error("Failed to trigger hazard:", error);
        }
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '24px', fontFamily: 'sans-serif', height: '100%', width: '300px' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '500' }}>AirCorridor Controls</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isConnected ? '#4caf50' : '#f44336'
                }} />
                <span style={{ fontSize: '0.9rem', color: '#aaaaaa' }}>
                    {isConnected ? 'Connected to Backend' : 'Disconnected'}
                </span>
            </div>

            <button
                onClick={handleTriggerHazard}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                🚨 Trigger Hazard [2, 0, 0]
            </button>

            <div style={{ backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <p style={{ margin: '0 0 8px 0', color: '#888', fontWeight: 'bold' }}>Live Path Status:</p>
                <pre style={{ margin: 0, color: '#4caf50', overflowX: 'auto' }}>
                    {latestPath ? JSON.stringify(latestPath, null, 2) : 'Awaiting path data...'}
                </pre>
            </div>
        </div>
    );
}