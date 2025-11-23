import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBodyData, SUN_DATA } from '../constants';
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
          gapSize={1} 
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

  const isSmallBody = ['dwarf', 'asteroid', 'comet', 'interstellar'].includes(data.type);

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
  const description = language === 'PL' ? data.descriptionPL : data.description;
  const typeLabel = data.type.charAt(0).toUpperCase() + data.type.slice(1);

  const showTrail = !isSmallBody && data.type !== 'moon';
  const PlanetMesh = (
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
  );

  return (
    <>
      <OrbitLine 
        radius={data.distance} 
        color={data.orbitColor} 
        dashed={isSmallBody} 
      />
      
      <group ref={meshRef}>
        {/* The Planet Mesh with Trail Effect */}
        {showTrail ? (
            <Trail
                width={data.radius * 1.2} // Width of the trail
                length={12} // Length of the trail
                color={new THREE.Color(data.color)} // Color of the trail
                attenuation={(width) => width * 0.5} // Taper the trail
            >
                {PlanetMesh}
            </Trail>
        ) : (
            PlanetMesh
        )}

        {/* Rings for Saturn-like bodies */}
        {data.ring && <PlanetRing ring={data.ring} />}

        {/* Labels - Enlarged and more readable */}
        {showLabels && (
          <Html 
            position={[0, data.radius + 3, 0]} 
            center 
            distanceFactor={50} 
            // If hovered, force range to strict top (10000), otherwise use normal depth sorting
            zIndexRange={hovered ? [100000, 100000] : [100, 0]}
            // Ensure container doesn't block events, but style helps with layout
            style={{ 
                pointerEvents: 'none',
                width: '100px', // Prevent large invisible hit areas
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
          >
            <div 
              className="relative flex flex-col items-center pointer-events-auto cursor-help"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
                <div className={`
                    px-4 py-2 rounded-lg font-extrabold whitespace-nowrap transition-all duration-300 backdrop-blur-md border border-white/20 shadow-xl origin-center tracking-wide select-none
                    ${hovered 
                    ? 'bg-blue-600 text-white scale-125 z-50 text-3xl border-blue-300 shadow-[0_0_30px_rgba(37,99,235,1)]' 
                    : 'bg-black/70 text-white hover:bg-black/90 text-xl'}
                `}>
                  {displayName}
                </div>

                {/* Tooltip Description */}
                <div className={`
                    absolute top-full mt-4 w-64 p-3 rounded-md bg-black/95 border border-white/30 text-white text-sm backdrop-blur-xl transition-all duration-300 z-50
                    ${hovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                `}>
                    <div className="text-xs text-blue-300 uppercase font-bold mb-1 tracking-wider">{typeLabel}</div>
                    <p className="leading-snug text-gray-200">{description}</p>
                </div>
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

export const Sun: React.FC<{ showLabels: boolean; language: Language }> = ({ showLabels, language }) => {
    const [hovered, setHover] = useState(false);
    const displayName = language === 'PL' ? SUN_DATA.namePL : SUN_DATA.name;
    const description = language === 'PL' ? SUN_DATA.descriptionPL : SUN_DATA.description;

    return (
        <group>
            {/* Core Sun */}
            <mesh 
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[6, 32, 32]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh>
            <pointLight intensity={2} distance={300} decay={1} color="#FFF8E7" />
            
            {/* Outer Glow shell */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                 <sphereGeometry args={[6, 32, 32]} />
                 <meshBasicMaterial color="#FF8C00" transparent opacity={0.3} side={THREE.BackSide}/>
            </mesh>

            {/* Sun Label */}
            {showLabels && (
                <Html 
                    position={[0, 9, 0]} 
                    center 
                    distanceFactor={50} 
                    zIndexRange={hovered ? [100000, 100000] : [100, 0]}
                    style={{ 
                        pointerEvents: 'none',
                        width: '100px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div 
                        className="relative flex flex-col items-center pointer-events-auto cursor-help"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <div className={`
                            px-4 py-2 rounded-lg font-extrabold whitespace-nowrap transition-all duration-300 backdrop-blur-md border border-white/20 shadow-xl origin-center tracking-wide select-none
                            ${hovered 
                            ? 'bg-yellow-600 text-white scale-125 z-50 text-3xl border-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.8)]' 
                            : 'bg-black/70 text-white hover:bg-black/90 text-xl'}
                        `}>
                            {displayName}
                        </div>

                        {/* Sun Tooltip */}
                        <div className={`
                            absolute top-full mt-4 w-64 p-3 rounded-md bg-black/95 border border-yellow-500/50 text-white text-sm backdrop-blur-xl transition-all duration-300 z-50
                            ${hovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                        `}>
                            <div className="text-xs text-yellow-300 uppercase font-bold mb-1 tracking-wider">Star</div>
                            <p className="leading-snug text-gray-200">{description}</p>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}
