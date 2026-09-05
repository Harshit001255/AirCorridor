import React from 'react';
import { gridToWorld } from './coords';

export default function CityGrid() {
    // City obstacle buildings: at grid [1, 1] representing the central skyscraper in TEST_GRID
    const bldgCenter = gridToWorld([1, 1, 0]);

    // Architectural backdrop buildings
    const perimeterBuildings = [
        { id: 1, pos: gridToWorld([1, 1, 0]), width: 2.2, depth: 2.2, height: 1.4, color: "#0f172a" },
        { id: 2, pos: [-8, 0, -8], width: 3, depth: 3, height: 7, color: "#080e1a" },
        { id: 3, pos: [8, 0, -8], width: 2.5, depth: 4, height: 8, color: "#080e1a" },
        { id: 4, pos: [-8, 0, 8], width: 4, depth: 2.5, height: 6, color: "#080e1a" },
        { id: 5, pos: [8, 0, 8], width: 3.5, depth: 3.5, height: 9, color: "#080e1a" },
    ];

    return (
        <group>
            {/* THE GROUND BASE */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <planeGeometry args={[26, 26]} />
                <meshStandardMaterial color="#0b0f19" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* CYBER AIR CORRIDOR GRID */}
            <gridHelper args={[24, 24, "#00ffcc", "#1e293b"]} position={[0, -0.48, 0]} />

            {/* BUILDINGS & STRUCTURES */}
            {perimeterBuildings.map((bldg) => (
                <group key={bldg.id} position={[bldg.pos[0], bldg.height / 2 - 0.5, bldg.pos[2]]}>
                    <mesh>
                        <boxGeometry args={[bldg.width, bldg.height, bldg.depth]} />
                        <meshStandardMaterial
                            color={bldg.color}
                            metalness={0.85}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* Architectural roof edge glow */}
                    <mesh position={[0, bldg.height / 2 + 0.02, 0]}>
                        <boxGeometry args={[bldg.width * 0.95, 0.04, bldg.depth * 0.95]} />
                        <meshStandardMaterial color="#00e5ff" emissive="#0088aa" emissiveIntensity={0.6} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}