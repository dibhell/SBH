import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail, MeshDistortMaterial } from '@react-three/drei';
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
      meshDistortMaterial: any; // Add this for the new star material
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

  // FIX: Rotation must be around X axis to match planet inclination math (y = z * sin(inc))
  const rotationEuler = useMemo(() => {
      const rad = (inclination * Math.PI) / 180;
      return new THREE.Euler(rad, 0, 0); 
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
            opacity={0.2} 
            />
        )}
        </lineLoop>
    </group>
  );
};

const PlanetRing: React.FC<{ ring: NonNullable<CelestialBodyData['ring']> }> = ({ ring }) => {
    return (
        <mesh rotation={[-Math.PI / 2.2, 0, 0]}>
            <ringGeometry args={[ring.inner, ring.outer, 64]} />
            <meshStandardMaterial 
                color={ring.color} 
                side={THREE.DoubleSide} 
                transparent 
                opacity={0.5} 
                emissive={ring.color}
                emissiveIntensity={0.2}
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
  const labelDistanceFactor = isGiant && data.radius > 50 ? Math.max(100, data.radius * 2) : 50;
  const labelYOffset = isGiant && data.radius > 20 ? data.radius * 1.3 : data.radius + 3;

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

    // Apply Inclination logic
    // This rotates the position around the X-axis
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
                {/* Accretion Disk Inner */}
                <mesh ref={accretionRef} rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[data.radius * 1.2, data.radius * 4, 64]} />
                    {/* Animated distorted material for accretion disk could go here, simplifying for performance */}
                    <meshStandardMaterial 
                        color={new THREE.Color("#ff5500")} 
                        emissive="#ff2200"
                        emissiveIntensity={2}
                        transparent 
                        opacity={0.8} 
                        side={THREE.DoubleSide} 
                    />
                </mesh>
                 {/* Accretion Disk Outer Glow */}
                 <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[data.radius * 4, data.radius * 8, 64]} />
                    <meshBasicMaterial color="#aa0000" transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
                {/* Glow */}
                <pointLight intensity={5} distance={data.radius * 15} decay={2} color="#FF4500" />
            </group>
        )
    }

    if (isStar) {
        return (
            <mesh ref={planetRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                <sphereGeometry args={[data.radius, 64, 64]} />
                {/* Animated Plasma Effect */}
                <MeshDistortMaterial 
                    color={data.color}
                    emissive={data.color}
                    emissiveIntensity={1}
                    roughness={0.1}
                    distort={0.3} // Strength of distortion
                    speed={2} // Speed of animation
                />
                 <pointLight intensity={1.5} distance={data.radius * 5} decay={1} color={data.color} />
            </mesh>
        )
    }

    // Planets and others
    return (
        <group>
             {/* Atmosphere Glow for larger planets */}
             {data.radius > 1 && (
                <mesh scale={[1.15, 1.15, 1.15]}>
                    <sphereGeometry args={[data.radius, 32, 32]} />
                    <meshBasicMaterial 
                        color={data.color} 
                        transparent 
                        opacity={0.1} 
                        side={THREE.BackSide}
                    />
                </mesh>
            )}

            <mesh 
                ref={planetRef}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                castShadow={true}
                receiveShadow={true}
            >
                <sphereGeometry args={[data.radius, 64, 64]} />
                <meshStandardMaterial 
                    color={data.color}
                    roughness={data.type === 'planet' ? 0.7 : 0.9}
                    metalness={data.type === 'planet' ? 0.2 : 0.1}
                    emissive={data.color}
                    emissiveIntensity={0.05} // Slight ambient glow so they aren't pitch black in shadow
                />
            </mesh>
        </group>
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
                width={data.radius * 0.8}
                length={15}
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

        {data.ring && <PlanetRing ring={data.ring} />}

        {/* Labels - Enhanced for readability on huge objects */}
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
                {/* Name Badge */}
                <div className={`
                    px-5 py-3 rounded-xl font-extrabold whitespace-nowrap transition-all duration-300 backdrop-blur-md border border-white/20 shadow-xl origin-center tracking-wide select-none
                    ${hovered 
                    ? 'bg-blue-600 text-white scale-125 z-50 text-4xl border-blue-300 shadow-[0_0_40px_rgba(37,99,235,1)]' 
                    : 'bg-black/70 text-white hover:bg-black/90 text-2xl'}
                `}>
                  {displayName}
                </div>

                {/* Tooltip Description - Wider and larger text */}
                <div className={`
                    absolute top-full mt-6 w-80 sm:w-96 max-w-lg p-5 rounded-xl bg-black/95 border border-white/30 text-white backdrop-blur-xl transition-all duration-300 z-50
                    ${hovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
                `}>
                    <div className="text-sm text-blue-300 uppercase font-bold mb-2 tracking-wider">{typeLabel}</div>
                    <p className="leading-relaxed text-base text-gray-200">{description}</p>
                </div>
            </div>
          </Html>
        )}

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
            {/* Main Sun Body with Distortion */}
            <mesh 
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[6, 64, 64]} />
                <MeshDistortMaterial 
                    color="#FFD700" 
                    emissive="#FF8C00"
                    emissiveIntensity={2}
                    roughness={0}
                    distort={0.4}
                    speed={1.5}
                />
            </mesh>
            
            {/* Light Source */}
            <pointLight intensity={3} distance={15000} decay={0.5} color="#FFF8E7" castShadow shadow-mapSize={[2048, 2048]} />
            
            {/* Corona Glow */}
            <mesh scale={[1.4, 1.4, 1.4]}>
                 <sphereGeometry args={[6, 32, 32]} />
                 <meshBasicMaterial color="#FF4500" transparent opacity={0.15} side={THREE.BackSide}/>
            </mesh>
            <mesh scale={[2, 2, 2]}>
                 <sphereGeometry args={[6, 32, 32]} />
                 <meshBasicMaterial color="#FF8C00" transparent opacity={0.05} side={THREE.BackSide}/>
            </mesh>

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
                            px-5 py-3 rounded-xl font-extrabold whitespace-nowrap transition-all duration-300 backdrop-blur-md border border-white/20 shadow-xl origin-center tracking-wide select-none
                            ${hovered 
                            ? 'bg-yellow-600 text-white scale-125 z-50 text-4xl border-yellow-300 shadow-[0_0_40px_rgba(255,215,0,0.8)]' 
                            : 'bg-black/70 text-white hover:bg-black/90 text-2xl'}
                        `}>
                            {displayName}
                        </div>

                        {/* Sun Tooltip - Wider and Larger */}
                        <div className={`
                            absolute top-full mt-6 w-80 sm:w-96 p-5 rounded-xl bg-black/95 border border-yellow-500/50 text-white backdrop-blur-xl transition-all duration-300 z-50
                            ${hovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
                        `}>
                            <div className="text-sm text-yellow-300 uppercase font-bold mb-2 tracking-wider">{typeLabel}</div>
                            <p className="leading-relaxed text-base text-gray-200">{description}</p>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}
