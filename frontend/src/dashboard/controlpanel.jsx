import React, { useState } from 'react';

export default function ControlPanel({
    isConnected,
    path,
    pathInfo,
    activeHazards = [],
    hazardCoord = [0, 1, 0],
    setHazardCoord,
    start = [0, 0, 0],
    goal = [2, 2, 0],
    onTriggerHazard,
    onClearHazards,
    onRecalculatePath,
    lastEvent,
    isRerouted,
    isLoading
}) {
    const [row, setRow] = useState(hazardCoord[0] ?? 0);
    const [col, setCol] = useState(hazardCoord[1] ?? 1);
    const [alt, setAlt] = useState(hazardCoord[2] ?? 0);

    const updateCoord = (newR, newC, newA) => {
        const clampedR = Math.max(0, Math.min(2, newR));
        const clampedC = Math.max(0, Math.min(2, newC));
        const clampedA = Math.max(0, Math.min(2, newA));
        setRow(clampedR);
        setCol(clampedC);
        setAlt(clampedA);
        setHazardCoord([clampedR, clampedC, clampedA]);
    };

    const presetCoordinates = [
        { label: '[0, 1, 0]', coord: [0, 1, 0], desc: 'Mid Route' },
        { label: '[1, 0, 0]', coord: [1, 0, 0], desc: 'Side Route' },
        { label: '[2, 0, 0]', coord: [2, 0, 0], desc: 'Approach' },
        { label: '[1, 2, 0]', coord: [1, 2, 0], desc: 'Final Leg' },
        { label: '[0, 2, 0]', coord: [0, 2, 0], desc: 'Corner' },
        { label: '[1, 1, 1]', coord: [1, 1, 1], desc: 'Airspace 3D' },
    ];

    const randomizeCoordinate = () => {
        const r = Math.floor(Math.random() * 3);
        const c = Math.floor(Math.random() * 3);
        const a = Math.floor(Math.random() * 3);
        // avoid start and goal
        if ((r === start[0] && c === start[1] && a === start[2]) ||
            (r === goal[0] && c === goal[1] && a === goal[2])) {
            updateCoord(0, 1, 0);
        } else {
            updateCoord(r, c, a);
        }
    };

    return (
        <div style={{
            backgroundColor: '#0d131f',
            color: '#f1f5f9',
            padding: '20px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
            borderLeft: '1px solid #1e293b',
            boxShadow: '-8px 0 24px rgba(0,0,0,0.5)'
        }}>
            {/* HEADER */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em', color: '#00f3ff' }}>
                        AIR CORRIDOR
                    </h2>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        backgroundColor: '#1e293b',
                        color: '#94a3b8'
                    }}>
                        v2.4 SIM
                    </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                    3D Autonomous UTM Flight Control
                </p>
            </div>

            {/* CONNECTION STATUS BADGE */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#111927',
                border: '1px solid #1e293b'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: isConnected ? '#00ff88' : '#ef4444',
                        boxShadow: isConnected ? '0 0 10px #00ff88' : '0 0 10px #ef4444'
                    }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isConnected ? '#e2e8f0' : '#f87171' }}>
                        {isConnected ? 'Telemetry WebSocket Live' : 'Offline / Connecting...'}
                    </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>PORT 8000</span>
            </div>

            {/* LIVE FEEDBACK EVENT TOAST */}
            {lastEvent && (
                <div style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: lastEvent.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : lastEvent.type === 'reroute' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: `1px solid ${lastEvent.type === 'error' ? '#ef4444' : lastEvent.type === 'reroute' ? '#f59e0b' : '#10b981'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    animation: 'fadeIn 0.3s ease-in-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>
                            {lastEvent.type === 'error' ? '❌' : lastEvent.type === 'reroute' ? '⚡' : '✅'}
                        </span>
                        <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: lastEvent.type === 'error' ? '#f87171' : lastEvent.type === 'reroute' ? '#fbbf24' : '#34d399'
                        }}>
                            {lastEvent.title}
                        </span>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                        {lastEvent.detail}
                    </span>
                </div>
            )}

            {/* TELEMETRY STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{
                    backgroundColor: '#111927',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #1e293b'
                }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                        Route Status
                    </div>
                    <div style={{
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: isRerouted ? '#fbbf24' : '#00ffcc',
                        marginTop: '2px'
                    }}>
                        {isRerouted ? 'REROUTED' : 'OPTIMAL'}
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#111927',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #1e293b'
                }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                        Waypoints
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                        {path ? `${path.length} nodes` : '0 nodes'}
                    </div>
                </div>
            </div>

            {/* HAZARD CONTROL SECTION */}
            <div style={{
                backgroundColor: '#111927',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #233044',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>
                        🎯 Target Hazard Position
                    </span>
                    <button
                        onClick={randomizeCoordinate}
                        style={{
                            backgroundColor: '#1e293b',
                            color: '#94a3b8',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        🎲 Random
                    </button>
                </div>

                {/* COORDINATE STEPPERS [Row, Col, Alt] */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {[
                        { label: 'ROW (Z)', value: row, set: (v) => updateCoord(v, col, alt) },
                        { label: 'COL (X)', value: col, set: (v) => updateCoord(row, v, alt) },
                        { label: 'ALT (Y)', value: alt, set: (v) => updateCoord(row, col, v) },
                    ].map((axis, i) => (
                        <div key={i} style={{
                            backgroundColor: '#0b111e',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid #1e293b',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                                {axis.label}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <button
                                    onClick={() => axis.set(axis.value - 1)}
                                    disabled={axis.value <= 0}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        backgroundColor: axis.value <= 0 ? '#1e293b' : '#334155',
                                        color: axis.value <= 0 ? '#475569' : '#ffffff',
                                        border: 'none',
                                        cursor: axis.value <= 0 ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    -
                                </button>
                                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#00f3ff', minWidth: '16px' }}>
                                    {axis.value}
                                </span>
                                <button
                                    onClick={() => axis.set(axis.value + 1)}
                                    disabled={axis.value >= 2}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        backgroundColor: axis.value >= 2 ? '#1e293b' : '#334155',
                                        color: axis.value >= 2 ? '#475569' : '#ffffff',
                                        border: 'none',
                                        cursor: axis.value >= 2 ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PRESET CHIPS */}
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                        Quick Select Presets:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {presetCoordinates.map((p, idx) => {
                            const isSelected = row === p.coord[0] && col === p.coord[1] && alt === p.coord[2];
                            return (
                                <button
                                    key={idx}
                                    onClick={() => updateCoord(p.coord[0], p.coord[1], p.coord[2])}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '5px',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'rgba(0, 243, 255, 0.2)' : '#1e293b',
                                        color: isSelected ? '#00f3ff' : '#94a3b8',
                                        border: isSelected ? '1px solid #00f3ff' : '1px solid transparent',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CLICKABLE TRIGGER HAZARD BUTTON */}
                <button
                    onClick={() => onTriggerHazard([row, col, alt])}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        letterSpacing: '0.03em',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 16px rgba(255, 23, 68, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'scale(1)',
                        opacity: isLoading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.boxShadow = '0 6px 22px rgba(255, 23, 68, 0.6)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 23, 68, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onMouseDown={(e) => {
                        if (!isLoading) e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onMouseUp={(e) => {
                        if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                >
                    {isLoading ? (
                        <>⚡ Calculating Reroute...</>
                    ) : (
                        <>🚨 Trigger Hazard [{row}, {col}, {alt}]</>
                    )}
                </button>

                {/* RESET / CLEAR HAZARDS */}
                <button
                    onClick={onClearHazards}
                    disabled={isLoading || activeHazards.length === 0}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: activeHazards.length > 0 ? '#1e293b' : '#141c2c',
                        color: activeHazards.length > 0 ? '#cbd5e1' : '#475569',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: activeHazards.length > 0 && !isLoading ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background-color 0.2s'
                    }}
                >
                    🔄 Clear Hazards ({activeHazards.length}) & Restore Route
                </button>
            </div>

            {/* LIVE WAYPOINTS EXPLORER */}
            <div style={{
                backgroundColor: '#111927',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '140px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                        Active Waypoint Sequence
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {path ? `${path.length} steps` : 'none'}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    overflowY: 'auto',
                    maxHeight: '150px',
                    paddingRight: '4px'
                }}>
                    {path && path.length > 0 ? (
                        path.map((pt, idx) => {
                            const isStart = idx === 0;
                            const isGoal = idx === path.length - 1;
                            return (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '5px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: isStart ? 'rgba(0, 255, 136, 0.1)' : isGoal ? 'rgba(0, 170, 255, 0.1)' : '#0b111e',
                                    border: isStart ? '1px solid rgba(0, 255, 136, 0.3)' : isGoal ? '1px solid rgba(0, 170, 255, 0.3)' : '1px solid #1e293b',
                                    fontSize: '0.76rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ color: '#64748b', fontSize: '0.68rem', width: '16px' }}>
                                            #{idx + 1}
                                        </span>
                                        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>
                                            [{pt.join(', ')}]
                                        </span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        color: isStart ? '#00ff88' : isGoal ? '#00aaff' : pt[2] > 0 ? '#fbbf24' : '#94a3b8'
                                    }}>
                                        {isStart ? 'START' : isGoal ? 'GOAL' : `ALT ${pt[2]}`}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ color: '#ef4444', fontSize: '0.78rem', textAlign: 'center', padding: '12px' }}>
                            No active flight corridor path.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}