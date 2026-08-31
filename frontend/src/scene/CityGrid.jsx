import React from 'react';

export default function CityGrid() {
    // Temporary mock data. Later, your backend WebSocket will provide this!
    const buildings = [
        { id: 1, x: -3, z: -3, height: 4 },
        { id: 2, x: 2, z: -1, height: 6 },
        { id: 3, x: 4, z: 4, height: 3 },
        { id: 4, x: -2, z: 2, height: 5 },
    ];

    return (
        <group>
            {/* THE GROUND LAYER */}
            {/* Rotated flat on the X-axis to serve as the floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#222222" />
            </mesh>

            {/* ARCHITECTURAL GRID */}
            {/* Adds a clean, technical blueprint aesthetic to the floor */}
            <gridHelper args={[20, 20, "#557799", "#333333"]} position={[0, -0.49, 0]} />

            {/* THE BUILDINGS */}
            {/* We loop through the data array to render vertical blocks */}
            {buildings.map((bldg) => (
                <mesh key={bldg.id} position={[bldg.x, bldg.height / 2 - 0.5, bldg.z]}>
                    <boxGeometry args={[1, bldg.height, 1]} />
                    <meshStandardMaterial color="#88aacc" />
                </mesh>
            ))}
        </group>
    );
}