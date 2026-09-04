import React, { useEffect, useState } from 'react';
import { socket } from '../api/socket';

export default function ControlPanel() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        // These listeners update our UI the moment the phone line connects or drops
        function onConnect() {
            setIsConnected(true);
        }
        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // Cleanup listeners when the component is removed
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '24px', fontFamily: 'sans-serif', height: '100%' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '500' }}>AirCorridor Controls</h2>

            {/* Visual indicator for the connection status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isConnected ? '#4caf50' : '#f44336' // Green if connected, Red if not
                }} />
                <span style={{ fontSize: '0.9rem', color: '#aaaaaa' }}>
                    {isConnected ? 'Connected to Backend' : 'Disconnected'}
                </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#888' }}>
                Drone and Hazard controls will appear here.
            </p>
        </div>
    );
}