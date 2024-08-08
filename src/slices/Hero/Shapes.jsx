"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Shapes = () => {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Geometries = () => {
  const geometries = [
    {
      position: [0, 0, 0],
      r: 0.5,
      geometry: new THREE.DodecahedronGeometry(4.5), //dodecahedron
    },
  ];
  const materials = [
    new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.3,
      color: 0x0f172a,
    }),
    new THREE.MeshStandardMaterial({
      roughness: 0.4,
      metalness: 0.3,
      color: 0x2c3e50,
    }),
    new THREE.MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0.4,
      color: 0x31363f,
    }),
    new THREE.MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0,
      color: 0x2e3229,
    }),
  ];

  const soundEffects = [
    new Audio("/sounds/knock2.ogg"),
    new Audio("/sounds/knock3.ogg"),
  ];

  return geometries.map(({ position, r, geometry }) => (
    <Geometry
      key={JSON.stringify(position)}
      position={position.map((p) => p * 2)}
      soundEffects={soundEffects}
      geometry={geometry}
      materials={materials}
      r={r}
    />
  ));
};

const Geometry = ({ r, position, geometry, materials, soundEffects }) => {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  const getRandomMaterial = () => {
    return gsap.utils.random(materials);
  };

  const startingMaterial = getRandomMaterial();

  const handleClick = (e) => {
    const mesh = e.object;

    gsap.utils.random(soundEffects).play();

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
    });
    mesh.material = getRandomMaterial();
  };

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "elastic.out(1,0.3)",
        delay: 0.3,
      });
    });
    return () => ctx.revert(); //cleanup function
  }, []);

  return (
    <group position={position} ref={meshRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        />
      </Float>
    </group>
  );
};

export default Shapes;
