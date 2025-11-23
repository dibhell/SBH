import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBodyData } from '../constants';

interface BodyProps {
  data: CelestialBodyData;
  timeScale: number;
  isRealTime: boolean;
  showLabels: boolean;
}

const OrbitLine: React.FC<{ radius: number; color?: string; dashed?: boolean }> = ({ radius, color = '#444', dashed = false }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial 
        attach="material" 
        color={color} 
        transparent 
        opacity={0.3} 
        dashSize={dashed ? 1 : 0} 
        gapSize={dashed ? 0.5 : 0} 
      />
    </line>
  );
};

export const CelestialBody: React.FC<BodyProps> = ({ data, timeScale, isRealTime, showLabels }) => {
  const meshRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  
  // Random start angle based on name length to avoid "lineing up" visually unless in real mode
  const startAngle = useMemo(() => (data.name.length * 13) % 360, [data.name]); 
  
  // Current accumulated angle
  const angleRef = useRef(startAngle);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (isRealTime) {
      // Very simplified J2000-ish calc: Just using time to drive angle linearly from a "now" timestamp
      // Real orbital mechanics require Keplerian elements, out of scope for simplified FRD
      const now = Date.now() / 1000;
      const orbitalPeriodSeconds = 365.25 * 24 * 3600 / data.speed; // Rough approximation
      const currentAngle = (now / orbitalPeriodSeconds) * Math.PI * 2;
      meshRef.current.position.x = Math.cos(currentAngle) * data.distance;
      meshRef.current.position.z = Math.sin(currentAngle) * data.distance;
    } else {
      // Animated Time
      angleRef.current += data.speed * 0.1 * delta * timeScale;
      meshRef.current.position.x = Math.cos(angleRef.current) * data.distance;
      meshRef.current.position.z = Math.sin(angleRef.current) * data.distance;
    }

    // Self Rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += data.rotationSpeed * delta * (isRealTime ? 1 : 1);
    }
  });

  const [hovered, setHover] = useState(false);

  return (
    <>
      <OrbitLine radius={data.distance} color={data.orbitColor} dashed={data.type === 'dwarf'} />
      
      <group ref={meshRef}>
        {/* The Planet Mesh */}
        <mesh 
          ref={planetRef}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial 
            color={data.color} 
            roughness={0.7}
            metalness={0.2}
            emissive={data.color}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>

        {/* Rings for Saturn-like bodies */}
        {data.ring && (
            <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
                <ringGeometry args={[data.ring.inner, data.ring.outer, 64]} />
                <meshStandardMaterial color={data.ring.color} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
        )}

        {/* Labels - Always face camera */}
        {showLabels && (
          <Html position={[0, data.radius + 1.5, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
            <div className={`px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-opacity duration-300 ${hovered ? 'bg-blue-600 text-white opacity-100' : 'bg-black/40 text-gray-300 opacity-70'}`}>
              {data.name}
            </div>
          </Html>
        )}

        {/* Recursively render moons */}
        {data.moons && data.moons.map((moon) => (
          <CelestialBody 
            key={moon.id} 
            data={moon} 
            timeScale={timeScale} 
            isRealTime={isRealTime} 
            showLabels={showLabels && hovered} // Only show moon labels if parent is hovered or specialized toggle
          />
        ))}
      </group>
    </>
  );
};

export const Sun: React.FC = () => {
    return (
        <group>
            <mesh>
                <sphereGeometry args={[6, 32, 32]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh>
            <pointLight intensity={2} distance={300} decay={1} color="#FFF8E7" />
            <mesh scale={[1.05, 1.05, 1.05]}>
                 <sphereGeometry args={[6, 32, 32]} />
                 <meshBasicMaterial color="#FF8C00" transparent opacity={0.2} side={THREE.BackSide}/>
            </mesh>
        </group>
    )
}