"use client";

import { Canvas } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";

/**
 * The ONE 3D scene on the site: a few soft, rounded slabs in the brand palette, floating behind the hero devices.
 * Purely decorative. Loaded only on capable devices (see HeroSceneGate); everyone else sees the static hero.
 * No environment maps, no textures, no models: lights and simple geometry only, so the chunk stays small.
 */
interface SlabProps {
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
  color: string;
  speed?: number;
  opacity?: number;
}

function Slab({ position, size, rotation, color, speed = 1.2, opacity = 1 }: SlabProps) {
  return (
    <Float speed={speed} rotationIntensity={0.35} floatIntensity={1.0} floatingRange={[-0.15, 0.15]}>
      <RoundedBox args={size} radius={0.14} smoothness={4} position={position} rotation={rotation}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.04} transparent={opacity < 1} opacity={opacity} />
      </RoundedBox>
    </Float>
  );
}

export default function HeroScene3D({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={onReady}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#F4A9BA" />

      <Slab position={[-2.3, 1.45, -1.5]} size={[1.15, 0.8, 0.14]} rotation={[0.35, 0.5, -0.2]} color="#FADADF" speed={1.1} />
      <Slab position={[2.35, 1.65, -1.9]} size={[0.95, 0.95, 0.14]} rotation={[0.3, -0.5, 0.25]} color="#F4A9BA" speed={1.4} opacity={0.9} />
      <Slab position={[-2.4, -1.65, -0.9]} size={[0.95, 0.65, 0.14]} rotation={[-0.3, 0.45, 0.2]} color="#FFFFFF" speed={1.0} />
      <Slab position={[2.4, -1.5, -1.3]} size={[1.0, 0.65, 0.14]} rotation={[-0.2, -0.4, -0.15]} color="#6B1220" speed={0.9} opacity={0.85} />
      <Slab position={[0.5, 2.05, -2.6]} size={[0.7, 0.45, 0.12]} rotation={[0.4, 0.2, 0.1]} color="#C8102E" speed={1.6} opacity={0.9} />
    </Canvas>
  );
}
