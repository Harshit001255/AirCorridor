import React from 'react';
import { Line } from '@react-three/drei';

export default function DronePath() {
    // A temporary hardcoded path just so we can see it on the screen!
    const mockPathPoints = [
        [-3, 2, -3],
        [0, 3, 0],
        [4, 1.5, 4]
    ];

    return (
        <group>
            {/* The glowing neon path */}
            <Line
                points={mockPathPoints}
                color="#00ffcc"
                lineWidth={3}
            />

            {/* The red Drone sitting at the start of the path */}
            <mesh position={mockPathPoints[0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
            </mesh>
        </group>
    );
}