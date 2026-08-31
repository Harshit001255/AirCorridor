import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CityGrid from './scene/CityGrid';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#121212' }}>

      {/* LEFT SIDE: The 3D Canvas (Takes up 80% of the screen) */}
      <div style={{ flex: 0.8 }}>
        <Canvas camera={{ position: [0, 10, 15], fov: 45 }}>
          {/* Lighting so our objects aren't pitch black */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} />

          {/* Lets you click and drag to look around the 3D space */}
          <OrbitControls />

          {/* Our custom city grid component */}
          <CityGrid />
        </Canvas>
      </div>

      {/* RIGHT SIDE: The Dashboard (Takes up 20% of the screen) */}
      <div style={{ flex: 0.2, backgroundColor: '#1e1e1e', color: 'white', padding: '24px', fontFamily: 'sans-serif' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '500' }}>AirCorridor Demo</h2>
        <p style={{ color: '#aaaaaa', fontSize: '0.9rem' }}>Awaiting connection...</p>
      </div>

    </div>
  );
}
