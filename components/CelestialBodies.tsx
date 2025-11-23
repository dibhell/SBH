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

const OrbitLine: React.FC<{ radius: number; color?: string; dashed?: boolean; inclination: number }> = ({ radius, color = '#444', dashed = false, inclination }) => {
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

  // Apply inclination rotation to the orbit ring itself
  const rotationEuler = useMemo(() => {
      const rad = (inclination * Math.PI) / 180;
      // Rotate around X axis to tilt the plane
      return new THREE.Euler(0, 0, rad);
  }, [inclination]);

  useLayoutEffect(() => {
    if (dashed && lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [dashed, lineGeometry]);

  return (
    <group rotation={rotationEuler}>
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
    </group>
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

const BODY_TYPE_TRANSLATIONS: Record<string, { EN: string, PL: string }> = {
    star: { EN: 'Star', PL: 'Gwiazda' },
    planet: { EN: 'Planet', PL: 'Planeta' },
    dwarf: { EN: 'Dwarf Planet', PL: 'Planeta Karłowata' },
    moon: { EN: 'Moon', PL: 'Księżyc' },
    asteroid: { EN: 'Asteroid', PL: 'Asteroida' },
    comet: { EN: 'Comet', PL: 'Kometa' },
    interstellar: { EN: 'Interstellar Object', PL: 'Obiekt Międzygwiezdny' },
    blackhole: { EN: 'Black Hole', PL: 'Czarna Dziura' },
};

export const CelestialBody: React.FC<BodyProps> = ({ data, timeScale, isRealTime, showLabels, language }) => {
  const meshRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const accretionRef = useRef<THREE.Mesh>(null);
  
  // Random start angle
  const startAngle = useMemo(() => (data.name.length * 13) % 360, [data.name]); 
  const angleRef = useRef(startAngle);

  const isSmallBody = ['dwarf', 'asteroid', 'comet', 'interstellar'].includes(data.type);
  const isStar = data.type === 'star';
  const isBlackHole = data.type === 'blackhole';
  const isGiant = isStar || isBlackHole;

  // Scaling logic for labels of massive objects
  const labelDistanceFactor = isGiant && data.radius > 50 ? data.radius * 3 : 50;
  const labelYOffset = isGiant && data.radius > 20 ? data.radius * 1.5 : data.radius + 3;

  const inclinationRad = (data.inclination || 0) * (Math.PI / 180);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    let x = 0, z = 0;

    if (isRealTime) {
      if (data.speed === 0) {
         x = data.distance;
         z = 0;
      } else {
        const now = Date.now() / 1000;
        const orbitalPeriodSeconds = 365.25 * 24 * 3600 / data.speed;
        const currentAngle = (now / orbitalPeriodSeconds) * Math.PI * 2;
        x = Math.cos(currentAngle) * data.distance;
        z = Math.sin(currentAngle) * data.distance;
      }
    } else {
      angleRef.current += data.speed * 0.1 * delta * timeScale;
      x = Math.cos(angleRef.current) * data.distance;
      z = Math.sin(angleRef.current) * data.distance;
    }

    // Apply Inclination:
    // Simply rotating (x,0,z) around Z-axis by inclination angle for "visual" tilt
    // Actually standard physics is tilt around line of nodes. 
    // Simplified: Rotate the position vector on the Z-Y plane.
    
    // x remains x (assuming Line of Nodes is X axis for simplicity in visualizer)
    // y = z * sin(inc)
    // z_new = z * cos(inc)
    
    const y_pos = z * Math.sin(inclinationRad);
    const z_pos = z * Math.cos(inclinationRad);

    meshRef.current.position.set(x, y_pos, z_pos);

    if (planetRef.current) {
      planetRef.current.rotation.y += data.rotationSpeed * delta;
    }
    if (accretionRef.current) {
       accretionRef.current.rotation.z -= data.rotationSpeed * 2 * delta; 
    }
  });

  const [hovered, setHover] = useState(false);
  const displayName = language === 'PL' ? data.namePL : data.name;
  const description = language === 'PL' ? data.descriptionPL : data.description;
  
  const rawType = data.type;
  const typeLabel = BODY_TYPE_TRANSLATIONS[rawType] 
    ? BODY_TYPE_TRANSLATIONS[rawType][language] 
    : rawType.toUpperCase();

  const showTrail = !isSmallBody && data.type !== 'moon' && !isGiant;
  
  const renderBody = () => {
    if (isBlackHole) {
        return (
            <group>
                {/* Event Horizon */}
                <mesh ref={planetRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                    <sphereGeometry args={[data.radius, 64, 64]} />
                    <meshBasicMaterial color="black" />
                </mesh>
                {/* Accretion Disk */}
                <mesh ref={accretionRef} rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[data.radius * 1.5, data.radius * 3.5, 64]} />
                    <meshBasicMaterial color="#FF6600" transparent opacity={0.7} side={THREE.DoubleSide} />
                </mesh>
                {/* Glow */}
                <pointLight intensity={3} distance={data.radius * 10} decay={2} color="#FF4500" />
            </group>
        )
    }

    return (
        <mesh 
            ref={planetRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            castShadow={!isStar}
            receiveShadow={!isStar}
        >
            <sphereGeometry args={[data.radius, 64, 64]} />
            {isStar ? (
                <meshBasicMaterial color={data.color} />
            ) : (
                <meshStandardMaterial 
                    color={data.color}
                    roughness={0.8}
                    metalness={0.2}
                    // Removed emissive to allow shadows to work properly for 3D effect
                    // Only add slight emissive if you want "night lights" effect, but flat color is bad for 3D.
                />
            )}
        </mesh>
    );
  }

  return (
    <>
      {!isGiant && (
        <OrbitLine 
            radius={data.distance} 
            color={data.orbitColor} 
            dashed={isSmallBody}
            inclination={data.inclination || 0} 
        />
      )}
      
      <group ref={meshRef}>
        {showTrail ? (
            <Trail
                width={data.radius * 1.2}
                length={12}
                color={new THREE.Color(data.color)}
                attenuation={(width) => width * 0.5}
            >
                {renderBody()}
            </Trail>
        ) : (
            <>
                {renderBody()}
                {isStar && (
                    <pointLight intensity={2} distance={data.radius * 50} decay={1} color={data.color} />
                )}
            </>
        )}

        {/* Rings for Saturn-like bodies */}
        {data.ring && <PlanetRing ring={data.ring} />}

        {/* Labels - Scaled for huge objects */}
        {showLabels && (
          <Html 
            position={[0, labelYOffset, 0]} 
            center 
            distanceFactor={labelDistanceFactor} 
            zIndexRange={hovered ? [100000, 100000] : [100, 0]}
            style={{ 
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'max-content'
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
    const typeLabel = BODY_TYPE_TRANSLATIONS['star'][language];

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
            {/* Main Light Source - Increased Intensity for Shadows */}
            <pointLight intensity={3.5} distance={10000} decay={0.5} color="#FFF8E7" castShadow shadow-mapSize={[2048, 2048]} />
            
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
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'max-content'
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
                            <div className="text-xs text-yellow-300 uppercase font-bold mb-1 tracking-wider">{typeLabel}</div>
                            <p className="leading-snug text-gray-200">{description}</p>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}
