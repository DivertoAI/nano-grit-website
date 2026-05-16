"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const HERO_MODEL_PATH = "/models/sf90.lite.centered.glb";

type CarModelProps = {
  onReady: () => void;
  autoRotateEnabled: boolean;
};

function tuneMaterial(material: THREE.MeshStandardMaterial, targetName: string) {

  const name = `${targetName} ${material.name}`.toLowerCase();
  const currentColor = material.color?.clone();
  const lum = currentColor
    ? currentColor.r * 0.299 + currentColor.g * 0.587 + currentColor.b * 0.114
    : 0;

  material.envMapIntensity = 2.2;

  if (
    name.includes("glass") ||
    name.includes("window") ||
    name.includes("windshield") ||
    name.includes("windscreen")
  ) {
    material.color = new THREE.Color("#060e1c");
    material.metalness = 0.05;
    material.roughness = 0.04;
    material.transparent = true;
    material.opacity = 0.52;
  } else if (name.includes("tire") || name.includes("tyre") || name.includes("rubber") || name.includes("sidewall")) {
    material.color = new THREE.Color("#080808");
    material.metalness = 0.0;
    material.roughness = 0.95;
    material.envMapIntensity = 0.05;
  } else if (name.includes("rim") || name.includes("spoke") || name.includes("alloy")) {
    // Dark gunmetal alloy — NOT light grey so it doesn't render white under studio lights
    material.color = new THREE.Color("#3a4050");
    material.metalness = 0.9;
    material.roughness = 0.18;
  } else if (name.includes("wheel")) {
    // Generic "wheel" — treat as tyre unless a more specific match above fires
    material.color = new THREE.Color("#0d0d0d");
    material.metalness = 0.05;
    material.roughness = 0.9;
    material.envMapIntensity = 0.1;
  } else if (
    name.includes("light") ||
    name.includes("head") ||
    name.includes("tail") ||
    name.includes("lamp") ||
    name.includes("lens")
  ) {
    material.color = new THREE.Color("#d0e4ff");
    material.metalness = 0.08;
    material.roughness = 0.06;
    material.transparent = true;
    material.opacity = 0.85;
    material.envMapIntensity = 1.8;
  } else if (
    name.includes("body") ||
    name.includes("paint") ||
    name.includes("car") ||
    name.includes("ferrari") ||
    name.includes("chassis") ||
    name.includes("hood") ||
    name.includes("door") ||
    name.includes("fender") ||
    name.includes("bumper") ||
    name.includes("roof") ||
    name.includes("panel") ||
    name.includes("top") ||
    name.includes("trunk")
  ) {
    // If the original color is suspiciously white/light, override to car red
    if (lum > 0.55) {
      material.color = new THREE.Color("#c0172d");
    } else if (currentColor && lum > 0.04) {
      material.color.copy(currentColor);
    } else {
      material.color = new THREE.Color("#c0172d");
    }
    material.metalness = 0.88;
    material.roughness = 0.12;
    material.envMapIntensity = 3.0;
  } else if (name.includes("chrome") || name.includes("exhaust") || name.includes("grille") || name.includes("trim")) {
    material.color = new THREE.Color("#8090a0");
    material.metalness = 0.98;
    material.roughness = 0.08;
  } else if (name.includes("caliper") || name.includes("brake")) {
    material.color = new THREE.Color("#d4a017");
    material.metalness = 0.7;
    material.roughness = 0.28;
  } else if (name.includes("hub") || name.includes("cap") || name.includes("center")) {
    material.color = new THREE.Color("#1c2030");
    material.metalness = 0.85;
    material.roughness = 0.2;
  } else if (name.includes("interior") || name.includes("seat") || name.includes("leather") || name.includes("cabin") || name.includes("dashboard")) {
    material.color = new THREE.Color("#111418");
    material.metalness = 0.0;
    material.roughness = 0.78;
    material.envMapIntensity = 0.3;
  } else {
    // Catch-all: force any bright/white surface to dark charcoal
    if (lum > 0.55) {
      material.color = new THREE.Color("#141820");
      material.metalness = 0.2;
      material.roughness = 0.6;
    } else {
      material.metalness = Math.max(material.metalness, 0.25);
      material.roughness = Math.min(material.roughness, 0.55);
    }
    material.envMapIntensity = 1.2;
  }

  material.needsUpdate = true;
}

function CarModel({ onReady, autoRotateEnabled }: CarModelProps) {
  const { scene } = useGLTF(HERO_MODEL_PATH);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Auto-normalize scale
    cloned.scale.setScalar(1);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 9.0;
    const normalized = maxDim > 0 ? targetSize / maxDim : 1;
    cloned.scale.setScalar(normalized);

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      // GLB already uses MeshStandardMaterial — tune directly, no conversion needed
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) tuneMaterial(mat, child.name);
      });
    });
    onReady();
  }, [cloned, onReady]);

  useFrame((_, delta) => {
    if (autoRotateEnabled && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.5, 0]}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

export function CarScene({
  posterSrc,
  onReady,
  onError,
  ready,
  mountWhenVisible = true,
  fallbackTimeoutMs = 2400,
}: {
  posterSrc: string;
  onReady: () => void;
  onError: (reason: string) => void;
  ready: boolean;
  mountWhenVisible?: boolean;
  fallbackTimeoutMs?: number;
}) {
  const [enabled, setEnabled] = useState(false);
  const [allowCanvasMount, setAllowCanvasMount] = useState(!mountWhenVisible);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setEnabled(window.innerWidth > 768);
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !mountWhenVisible) {
      setAllowCanvasMount(true);
      return;
    }

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setAllowCanvasMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px", threshold: 0.01 },
    );

    observer.observe(node);

    const maybeRequestIdle = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;

    let idleId: number | null = null;
    if (maybeRequestIdle) {
      idleId = maybeRequestIdle(() => setAllowCanvasMount(true), { timeout: 1200 });
    }

    return () => {
      observer.disconnect();
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
    };
  }, [enabled, mountWhenVisible]);

  useEffect(() => {
    if (!enabled || !allowCanvasMount || ready || timedOut) return;
    fallbackTimerRef.current = window.setTimeout(() => {
      setTimedOut(true);
      onError("hero_3d_timeout");
    }, fallbackTimeoutMs);
    return () => {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    };
  }, [allowCanvasMount, enabled, fallbackTimeoutMs, onError, ready, timedOut]);

  useEffect(() => {
    if (ready || timedOut) {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    }
  }, [ready, timedOut]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="relative z-10 h-full w-full">
      {allowCanvasMount && !timedOut ? (
        <Canvas
          camera={{ position: [0, 1.0, 10], fov: 44 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          shadows="soft"
        >
          {/* Ambient base — keep it dark so reflections pop */}
          <ambientLight intensity={0.35} />

          {/* Key light — strong overhead from front-right */}
          <directionalLight
            position={[6, 10, 8]}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={40}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Fill light — soft from left */}
          <directionalLight position={[-8, 4, 3]} intensity={0.6} color="#b8d4f0" />

          {/* Rim light — back edge highlight */}
          <directionalLight position={[0, 3, -9]} intensity={1.4} color="#ffffff" />

          {/* Cyan accent — left studio pop */}
          <pointLight position={[-6, 3, 5]} intensity={18} color="#22d3ee" distance={18} decay={2} />

          {/* Red accent — right studio pop */}
          <pointLight position={[7, 2.5, -2]} intensity={14} color="#f43f5e" distance={16} decay={2} />

          {/* Top spotlight for roof reflection */}
          <spotLight
            position={[0, 10, 2]}
            intensity={25}
            angle={0.3}
            penumbra={0.9}
            color="#ffffff"
            castShadow={false}
          />

          {/* Under-car glow */}
          <pointLight position={[0, -1.5, 0]} intensity={3} color="#1e293b" distance={5} decay={2} />

          <Suspense fallback={null}>
            <Environment preset="city" />
            <CarModel onReady={onReady} autoRotateEnabled={autoRotateEnabled} />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.55}
              scale={14}
              blur={3}
              far={5}
              resolution={512}
              color="#020617"
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.07}
            minDistance={7}
            maxDistance={18}
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 2.0}
            onStart={() => {
              setAutoRotateEnabled(false);
              if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
            }}
            onEnd={() => {
              resumeTimerRef.current = window.setTimeout(() => setAutoRotateEnabled(true), 1100);
            }}
          />
        </Canvas>
      ) : null}
    </div>
  );
}

useGLTF.preload(HERO_MODEL_PATH);
