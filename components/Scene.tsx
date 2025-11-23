import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Loader } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AppState } from '../types';
import { SOLAR_SYSTEM_DATA } from '../constants';
import { CelestialBody, Sun } from './CelestialBodies';
import { SagittariusSystem } from './SagittariusSystem';

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

  return (
    <>
    <Canvas className="w-full h-full bg-black">
      <PerspectiveCamera makeDefault position={[0, 60, 90]} fov={50} />
      
      <OrbitControls 
        ref={controlsRef}
        makeDefault // Helps ensuring this control takes precedence
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        enableDamping={true} // Smoother controls, helps prevent 'stuck' feeling
        dampingFactor={0.1}
        minDistance={5}
        maxDistance={800}
      />

      <ambientLight intensity={0.2} />
      
      {/* Background Stars */}
      <Stars radius={300} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

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
