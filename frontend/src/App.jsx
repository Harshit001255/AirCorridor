import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CityGrid from './scene/CityGrid';
import ControlPanel from './dashboard/controlpanel'; // Import our new dashboard

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#121212' }}>

      {/* 3D CANVAS */}
      <div style={{ flex: 0.8 }}>
        <Canvas camera={{ position: [0, 10, 15], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} />
          <OrbitControls />
          <CityGrid />
        </Canvas>
      </div>

      {/* DASHBOARD */}
      <div style={{ flex: 0.2 }}>
        {/* We place the imported component here */}
        <ControlPanel />
      </div>

    </div>
  );
}