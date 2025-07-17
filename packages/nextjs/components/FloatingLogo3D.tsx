"use client";

import { Suspense, useRef } from "react";
import { Environment, Float, MeshTransmissionMaterial, OrbitControls, Text3D } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "three";

const FloatingText = () => {
  const meshRef = useRef<Mesh>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8} floatingRange={[-0.5, 0.5]}>
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1.2}
        height={0.3}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={8}
        position={[-3, 0, 0]}
      >
        StuCredi
        <MeshTransmissionMaterial
          thickness={0.5}
          roughness={0.1}
          transmission={0.9}
          ior={1.2}
          chromaticAberration={0.5}
          anisotropy={0.5}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ff00ff"
          color="#00ffff"
        />
      </Text3D>
    </Float>
  );
};

const MetallicText = () => {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1} floatingRange={[-0.3, 0.3]}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.8}
        height={0.2}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        position={[-2, -1.5, 0.5]}
      >
        Student Credit
        <meshStandardMaterial metalness={1} roughness={0.1} color="#8b00ff" envMapIntensity={2} />
      </Text3D>
    </Float>
  );
};

const ParticleField = () => {
  const points = [];
  for (let i = 0; i < 200; i++) {
    points.push(
      <mesh key={i} position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial color={Math.random() > 0.5 ? "#ff00ff" : "#00ffff"} transparent opacity={0.6} />
      </mesh>,
    );
  }
  return <group>{points}</group>;
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[0, 0, 5]} intensity={2} color="#8b00ff" />

      <Suspense fallback={null}>
        <FloatingText />
        <MetallicText />
        <ParticleField />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-2xl neon-text">Loading 3D Scene...</div>
  </div>
);

interface FloatingLogo3DProps {
  className?: string;
  height?: string;
}

export const FloatingLogo3D: React.FC<FloatingLogo3DProps> = ({ className = "", height = "400px" }) => {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Gradient overlay for extra glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default FloatingLogo3D;
