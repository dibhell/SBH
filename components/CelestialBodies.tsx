import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBodyData } from '../constants';
import { Language } from '../types';

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

interface BodyProps {
  data: CelestialBodyData;
  timeScale: number;
  isRealTime: boolean;
  showLabels: boolean;
  language: Language;
}

const OrbitLine: React.FC<{ radius: number; color?: string; dashed?: boolean }> = ({ radius, color = '#444', dashed = false }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const lineRef = useRef<THREE.LineLoop>(null);

  useLayoutEffect(() => {
    if (dashed && lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [dashed, lineGeometry]);

  return (
    <lineLoop ref={lineRef} geometry={lineGeometry}>
      {dashed ? (
        <lineDashedMaterial 
          attach="material" 
          color={color} 
          transparent 
          opacity={0.3} 
          dashSize={1} 
          gapSize={0.5} 
        />
      ) : (
        <lineBasicMaterial 
          attach="material" 
          color={color} 
          transparent 
          opacity={0.3} 
        />
      )}
    </lineLoop>
  );
};

const PlanetRing: React.FC<{ ring: NonNullable<CelestialBodyData['ring']> }> = ({ ring }) => {
    return (
        <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[ring.inner, ring.outer, 64]} />
            <meshStandardMaterial 
                color={ring.color} 
                side={THREE.DoubleSide} 
                transparent 
                opacity={0.6} 
            />
        </mesh>
    );
};

export const CelestialBody: React.FC<BodyProps> = ({ data, timeScale, isRealTime, showLabels, language }) => {
  const meshRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  
  // Random start angle
  const startAngle = useMemo(() => (data.name.length * 13) % 360, [data.name]); 
  const angleRef = useRef(startAngle);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (isRealTime) {
      const now = Date.now() / 1000;
      const orbitalPeriodSeconds = 365.25 * 24 * 3600 / data.speed;
      const currentAngle = (now / orbitalPeriodSeconds) * Math.PI * 2;
      meshRef.current.position.x = Math.cos(currentAngle) * data.distance;
      meshRef.current.position.z = Math.sin(currentAngle) * data.distance;
    } else {
      angleRef.current += data.speed * 0.1 * delta * timeScale;
      meshRef.current.position.x = Math.cos(angleRef.current) * data.distance;
      meshRef.current.position.z = Math.sin(angleRef.current) * data.distance;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += data.rotationSpeed * delta;
    }
  });

  const [hovered, setHover] = useState(false);
  const displayName = language === 'PL' ? data.namePL : data.name;

  return (
    <>
      <OrbitLine radius={data.distance} color={data.orbitColor} dashed={data.type === 'dwarf'} />
      
      <group ref={meshRef}>
        {/* The Planet Mesh with Trail Effect */}
        <Trail
            width={data.radius * 1.2} // Width of the trail
            length={12} // Length of the trail
            color={new THREE.Color(data.color)} // Color of the trail
            attenuation={(width) => width * 0.5} // Taper the trail
            transparent
            opacity={0.6}
        >
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
                emissiveIntensity={0.1}
            />
            </mesh>
        </Trail>

        {/* Rings for Saturn-like bodies */}
        {data.ring && <PlanetRing ring={data.ring} />}

        {/* Labels - Enlarged and more readable */}
        {showLabels && (
          <Html 
            position={[0, data.radius + 3, 0]} 
            center 
            distanceFactor={50} 
            style={{ pointerEvents: 'none' }}
            zIndexRange={[100, 0]}
          >
            <div className={`
                px-4 py-2 rounded-lg font-extrabold whitespace-nowrap transition-all duration-300 backdrop-blur-md border border-white/20 shadow-xl origin-center tracking-wide
                ${hovered 
                ? 'bg-blue-600 text-white scale-125 z-50 text-3xl border-blue-300 shadow-[0_0_30px_rgba(37,99,235,1)]' 
                : 'bg-black/70 text-white hover:bg-black/90 text-xl'}
            `}>
              {displayName}
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
            showLabels={showLabels}
            language={language}
          />
        ))}
      </group>
    </>
  );
};

export const Sun: React.FC = () => {
    return (
        <group>
            {/* Core Sun */}
            <mesh>
                <sphereGeometry args={[6, 32, 32]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh>
            <pointLight intensity={2} distance={300} decay={1} color="#FFF8E7" />
            
            {/* Outer Glow shell */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                 <sphereGeometry args={[6, 32, 32]} />
                 <meshBasicMaterial color="#FF8C00" transparent opacity={0.3} side={THREE.BackSide}/>
            </mesh>
        </group>
    )
}