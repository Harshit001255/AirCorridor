import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { gridToWorld } from './coords';

export default function DronePath({ path = [], start = [0, 0, 0], goal = [2, 2, 0], activeHazards = [], isRerouted = false }) {
    const droneRef = useRef();
    const hazardPulseRef = useRef([]);

    // Convert grid coordinates to 3D world coordinates
    const pathWorldPoints = useMemo(() => {
        if (!path || path.length === 0) return [];
        return path.map(pt => gridToWorld(pt));
    }, [path]);

    const startWorld = useMemo(() => gridToWorld(start), [start]);
    const goalWorld = useMemo(() => gridToWorld(goal), [goal]);

    // Animate the drone traveling along the path
    useFrame(({ clock }) => {
        if (!droneRef.current || pathWorldPoints.length < 2) return;
        
        const t = (clock.getElapsedTime() * 0.4) % 1; // 0 to 1 cycle
        const totalSegments = pathWorldPoints.length - 1;
        const currentSegmentProgress = t * totalSegments;
        const segmentIndex = Math.min(Math.floor(currentSegmentProgress), totalSegments - 1);
        const segmentT = currentSegmentProgress - segmentIndex;

        const p1 = new THREE.Vector3(...pathWorldPoints[segmentIndex]);
        const p2 = new THREE.Vector3(...pathWorldPoints[segmentIndex + 1]);

        droneRef.current.position.lerpVectors(p1, p2, segmentT);
        droneRef.current.rotation.y = clock.getElapsedTime() * 2;
    });

    return (
        <group>
            {/* GLOWING NEON AIR CORRIDOR */}
            {pathWorldPoints.length >= 2 && (
                <>
                    {/* Primary bright neon line */}
                    <Line
                        points={pathWorldPoints}
                        color={isRerouted ? "#ffaa00" : "#00ffcc"}
                        lineWidth={5}
                    />

                    {/* Secondary neon glow halo */}
                    <Line
                        points={pathWorldPoints}
                        color={isRerouted ? "#ff5500" : "#0099ff"}
                        lineWidth={10}
                        transparent
                        opacity={0.35}
                    />
                </>
            )}

            {/* WAYPOINT BEACONS ALONG PATH */}
            {pathWorldPoints.map((pt, idx) => (
                <group key={`waypoint-${idx}`} position={pt}>
                    <mesh>
                        <sphereGeometry args={[0.18, 16, 16]} />
                        <meshStandardMaterial
                            color={isRerouted ? "#ffbb33" : "#00ffff"}
                            emissive={isRerouted ? "#ff8800" : "#00e5ff"}
                            emissiveIntensity={2.5}
                        />
                    </mesh>

                    {/* Altitude vertical guide line down to ground plane */}
                    <line>
                        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
                            new THREE.Vector3(0, 0, 0),
                            new THREE.Vector3(0, -pt[1] - 0.49, 0)
                        ])} />
                        <lineBasicMaterial attach="material" color="#445566" transparent opacity={0.4} />
                    </line>
                </group>
            ))}

            {/* START PAD */}
            <group position={startWorld}>
                <mesh position={[0, -0.4, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
                    <meshStandardMaterial color="#00ff88" emissive="#00cc66" emissiveIntensity={1.2} />
                </mesh>
                <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.9, 1.05, 32]} />
                    <meshBasicMaterial color="#00ff88" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* GOAL PAD */}
            <group position={goalWorld}>
                <mesh position={[0, -0.4, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
                    <meshStandardMaterial color="#00aaff" emissive="#0077dd" emissiveIntensity={1.2} />
                </mesh>
                <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.9, 1.05, 32]} />
                    <meshBasicMaterial color="#00aaff" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* AUTONOMOUS DRONE */}
            <group ref={droneRef} position={pathWorldPoints[0] || startWorld}>
                {/* Drone Core Body */}
                <mesh>
                    <sphereGeometry args={[0.32, 16, 16]} />
                    <meshStandardMaterial
                        color="#ff0055"
                        emissive="#ff0055"
                        emissiveIntensity={2.5}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>

                {/* Quad-Rotor Arms */}
                <mesh rotation={[0, 0, 0]}>
                    <boxGeometry args={[1.0, 0.05, 0.05]} />
                    <meshStandardMaterial color="#333333" metalness={0.8} />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[1.0, 0.05, 0.05]} />
                    <meshStandardMaterial color="#333333" metalness={0.8} />
                </mesh>

                {/* Rotor Navigation Lights */}
                {[-0.5, 0.5].map((rx, i) =>
                    [-0.5, 0.5].map((rz, j) => (
                        <mesh key={`rotor-${i}-${j}`} position={[rx, 0.05, rz]}>
                            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={3} />
                        </mesh>
                    ))
                )}
            </group>

            {/* ACTIVE 3D HAZARD DANGER ZONES */}
            {activeHazards.map((hazard, index) => {
                const hazardWorld = gridToWorld(hazard.center);
                return (
                    <group key={hazard.id || `hazard-${index}`} position={hazardWorld}>
                        {/* Glowing Red Danger Core */}
                        <mesh>
                            <sphereGeometry args={[0.7, 24, 24]} />
                            <meshStandardMaterial
                                color="#ff1133"
                                emissive="#ff0022"
                                emissiveIntensity={2.8}
                                transparent
                                opacity={0.85}
                            />
                        </mesh>

                        {/* Wireframe Shield Sphere */}
                        <mesh>
                            <sphereGeometry args={[1.1, 16, 16]} />
                            <meshBasicMaterial color="#ff3355" wireframe transparent opacity={0.7} />
                        </mesh>

                        {/* Ground Warning Zone Ring */}
                        <mesh position={[0, -hazardWorld[1] - 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[1.2, 1.5, 32]} />
                            <meshBasicMaterial color="#ff2244" transparent opacity={0.7} side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}