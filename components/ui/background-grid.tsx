"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const AnimatedGrid = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 1.5) % 2;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid
        position={[0, -2, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor="#f05a24"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
      />
    </group>
  );
};

export const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden h-full w-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />
        <AnimatedGrid />
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 5, 25]} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
    </div>
  );
};
