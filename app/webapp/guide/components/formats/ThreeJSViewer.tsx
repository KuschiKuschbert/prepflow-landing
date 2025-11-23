/**
 * Three.js viewer implementation.
 * Renders 3D scenes with camera controls and annotations.
 */

'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeJSContent } from '../../data/guide-types';

interface ThreeJSViewerProps {
  content: ThreeJSContent;
}

/**
 * Annotations component that displays text labels in 3D space.
 */
function Annotations({ annotations }: { annotations: ThreeJSContent['annotations'] }) {
  if (!annotations || annotations.length === 0) return null;

  return (
    <>
      {annotations.map((annotation, index) => (
        <group key={index} position={annotation.position}>
          <Html
            position={[0, 0.5, 0]}
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-2 text-sm text-white backdrop-blur-sm">
              {annotation.text}
            </div>
          </Html>
          {/* Small sphere indicator */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#29E7CD" emissive="#29E7CD" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/**
 * Rotating scene component for demo purposes.
 * In production, this would load the actual scene from content.scene.
 */
function SceneContent({ content }: { content: ThreeJSContent }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate mesh for visual interest
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Directional light */}
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Demo geometry - replace with actual scene loading */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#29E7CD" />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1f1f1f" />
      </mesh>

      {/* Annotations */}
      {content.annotations && <Annotations annotations={content.annotations} />}
    </>
  );
}

export default function ThreeJSViewer({ content }: ThreeJSViewerProps) {
  const cameraPosition: [number, number, number] = content.camera?.position || [5, 5, 5];
  const cameraTarget: [number, number, number] = content.camera?.target || [0, 0, 0];

  return (
    <div className="h-96 w-full overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: cameraPosition, fov: 50 }}
        dpr={[1, 2]}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="text-center text-white">
                <div className="mb-2 animate-spin text-2xl">🎨</div>
                <p className="text-sm">Loading 3D scene...</p>
              </div>
            </Html>
          }
        >
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <OrbitControls
            target={cameraTarget}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
          />
          <SceneContent content={content} />
        </Suspense>
      </Canvas>
    </div>
  );
}
