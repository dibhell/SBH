import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Loader } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AppState } from '../types';
import { SOLAR_SYSTEM_DATA } from '../constants';
import { CelestialBody, Sun } from './CelestialBodies';
import { SagittariusSystem } from './SagittariusSystem';
import * as THREE from 'three';

// Augment React's JSX namespace for R3F elements
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      lineLoop: any;
      lineDashedMaterial: any;
      lineBasicMaterial: any;
      mesh: any;
      ringGeometry: any;
      meshStandardMaterial: any;
      group: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      pointLight: any;
      torusGeometry: any;
      bufferGeometry: any;
      ambientLight: any;
    }
  }
}

// Augment global JSX namespace as backup
declare global {
  namespace JSX {
    interface IntrinsicElements {
      lineLoop: any;
      lineDashedMaterial: any;
      lineBasicMaterial: any;
      mesh: any;
      ringGeometry: any;
      meshStandardMaterial: any;
      group: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      pointLight: any;
      torusGeometry: any;
      bufferGeometry: any;
      ambientLight: any;
    }
  }
}

interface SceneProps {
  state: AppState;
  resetTrigger: number;
}

const Scene: React.FC<SceneProps> = ({ state, resetTrigger }) => {
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Reset Camera Logic
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      if (state.viewMode === 'SAGITTARIUS_A') {
          controlsRef.current.object.position.set(0, 150, 300);
      } else {
          controlsRef.current.object.position.set(0, 60, 90);
      }
    }
  }, [resetTrigger, state.viewMode]);

  // Keyboard and UI Navigation Logic
  useEffect(() => {
    const handleNavigation = (x: number, z: number) => {
        if (controlsRef.current && cameraRef.current) {
            const cam = cameraRef.current;
            
            // Get camera direction vectors (projected to XZ plane)
            const forward = new THREE.Vector3();
            cam.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3();
            right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

            // Calculate movement vector
            const moveVector = new THREE.Vector3();
            moveVector.addScaledVector(right, x);
            moveVector.addScaledVector(forward, z); // "Up" on D-pad moves forward

            // Move both camera and target
            const speed = 5; // Adjustment speed
            controlsRef.current.target.addScaledVector(moveVector, speed);
            cam.position.addScaledVector(moveVector, speed);
            controlsRef.current.update();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'ArrowUp': handleNavigation(0, 1); break;
            case 'ArrowDown': handleNavigation(0, -1); break;
            case 'ArrowLeft': handleNavigation(-1, 0); break;
            case 'ArrowRight': handleNavigation(1, 0); break;
        }
    };

    const handleCustomEvent = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail) {
            handleNavigation(detail.x, detail.y);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('camera-move', handleCustomEvent);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('camera-move', handleCustomEvent);
    };
  }, []);

  return (
    <>
    <Canvas className="w-full h-full bg-black">
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 60, 90]} fov={50} far={10000} />
      
      <OrbitControls 
        ref={controlsRef}
        makeDefault
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={5}
        maxDistance={8000} // Increased significantly for supermassive objects
      />

      <ambientLight intensity={0.2} />
      
      {/* Background Stars - Increased radius */}
      <Stars radius={9000} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

      {state.viewMode === 'SOLAR_DETAILED' ? (
        <group>
          <Sun showLabels={state.showLabels} language={state.language} />
          {SOLAR_SYSTEM_DATA.map((body) => (
            <CelestialBody 
              key={body.id} 
              data={body} 
              timeScale={state.timeScale} 
              isRealTime={state.isRealTime}
              showLabels={state.showLabels}
              language={state.language}
            />
          ))}
        </group>
      ) : (
        <SagittariusSystem timeScale={state.timeScale} />
      )}

      {/* Post Processing for Glow */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
    </Canvas>
    <Loader />
    </>
  );
};

export default Scene;
