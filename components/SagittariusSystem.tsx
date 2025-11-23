import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GALAXY_DATA } from '../constants';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

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

export const SagittariusSystem: React.FC<{ timeScale: number }> = ({ timeScale }) => {
  const solarSystemRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // Rotate the accretion disk
    if (diskRef.current) {
        diskRef.current.rotation.z -= 0.2 * delta;
    }

    // Orbit the Solar System
    if (solarSystemRef.current) {
      const speed = GALAXY_DATA.orbitSpeed * delta * (timeScale > 0 ? 1 : 0); // Always moving slightly for effect
      solarSystemRef.current.rotation.y += speed * 0.5;
    }
  });

  return (
    <group>
        {/* Black Hole Center */}
        <mesh>
            <sphereGeometry args={[GALAXY_DATA.blackHoleRadius, 64, 64]} />
            <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Accretion Disk (Visual Stylized) */}
        <group rotation={[Math.PI / 3, 0, 0]}>
            <mesh ref={diskRef}>
                <torusGeometry args={[GALAXY_DATA.blackHoleRadius * 2.5, 8, 2, 100]} />
                <meshBasicMaterial color="#FF6B00" transparent opacity={0.6} />
            </mesh>
             {/* Glow */}
            <pointLight intensity={5} distance={300} color="#FF4500" />
        </group>

        {/* Solar System Representation */}
        <group ref={solarSystemRef}>
            <group position={[GALAXY_DATA.orbitRadius, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[2, 16, 16]} />
                    <meshBasicMaterial color="#FFFF00" />
                </mesh>
                <Text 
                    position={[0, 4, 0]} 
                    fontSize={5} 
                    color="white"
                    anchorX="center" 
                    anchorY="middle"
                    outlineWidth={0.2}
                    outlineColor="#000"
                >
                    Solar System
                </Text>
            </group>
        </group>

         {/* Orbit Path of Solar System */}
         <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[GALAXY_DATA.orbitRadius - 0.5, GALAXY_DATA.orbitRadius + 0.5, 128]} />
            <meshBasicMaterial color="#333" side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>

    </group>
  );
};