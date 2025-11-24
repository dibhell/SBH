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
      coneGeometry: any;
      cylinderGeometry: any;
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
      coneGeometry: any;
      cylinderGeometry: any;
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

        {/* Solar Orbit Line - Visible Path */}
        <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
                 <ringGeometry args={[GALAXY_DATA.orbitRadius - 0.5, GALAXY_DATA.orbitRadius + 0.5, 128]} />
                 <meshBasicMaterial color="#555" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
            <mesh>
                 <ringGeometry args={[GALAXY_DATA.orbitRadius - 20, GALAXY_DATA.orbitRadius + 20, 128]} />
                 <meshBasicMaterial color="#555" side={THREE.DoubleSide} transparent opacity={0.05} />
            </mesh>
        </group>

        {/* Solar System Representation */}
        <group ref={solarSystemRef}>
            <group position={[GALAXY_DATA.orbitRadius, 0, 0]}>
                {/* Sun Marker */}
                <mesh>
                    <sphereGeometry args={[4, 16, 16]} />
                    <meshBasicMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
                </mesh>

                 {/* Planetary Orbits Visual Hints - Shows it's a System */}
                 <mesh rotation={[Math.PI/2, 0, 0]}>
                    <ringGeometry args={[8, 8.5, 32]} />
                    <meshBasicMaterial color="#444" side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>
                <mesh rotation={[Math.PI/2, 0, 0]}>
                    <ringGeometry args={[12, 12.5, 32]} />
                    <meshBasicMaterial color="#444" side={THREE.DoubleSide} transparent opacity={0.3} />
                </mesh>
                {/* Mini planet dots */}
                <mesh position={[8.2, 0, 0]}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color="#22A6B3" />
                </mesh>
                <mesh position={[-12.2, 0, 0]}>
                    <sphereGeometry args={[1.5, 8, 8]} />
                    <meshBasicMaterial color="#F9CA24" />
                </mesh>
                
                {/* Trajectory Vector */}
                <mesh position={[0, 0, 20]} rotation={[Math.PI/2, 0, 0]}>
                     <coneGeometry args={[2, 6, 8]} />
                     <meshBasicMaterial color="#FFFF00" />
                </mesh>
                <mesh position={[0, 0, 10]} rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.3, 0.3, 20]} />
                     <meshBasicMaterial color="#FFFF00" opacity={0.5} transparent />
                </mesh>

                <Text 
                    position={[0, 15, 0]} 
                    fontSize={6} 
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
        
        {/* Galaxy Context Text */}
        <Text
             position={[0, -100, 0]}
             rotation={[-Math.PI/2, 0, 0]}
             fontSize={10}
             color="#555"
        >
            Milky Way Galactic Center
        </Text>

    </group>
  );
};