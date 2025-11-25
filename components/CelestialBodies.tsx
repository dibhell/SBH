
import React, { useRef, useMemo, useState, useLayoutEffect, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail, MeshDistortMaterial, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBodyData, SUN_DATA } from '../constants';
import { Language } from '../types';
import { BLANK_TEXTURE_DATA_URL, EARTH_CLOUDS_TEXTURE, EARTH_NIGHT_TEXTURE, getBodyTextureUrl, getRingTextureUrl, SUN_TEXTURE } from '../textures';
import { getRotationSpeed } from '../rotations';

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
      meshDistortMaterial: any;
      points: any;
      pointsMaterial: any;
      coneGeometry: any;
      cylinderGeometry: any;
      bufferAttribute: any;
      // line: any; // Removed to avoid conflict with SVG line type
    }
  }
}

// Helper to bypass TS conflict with SVG <line>
const ThreeLine = 'line' as any;

interface BodyProps {
  data: CelestialBodyData;
  timeScale: number;
  isRealTime: boolean;
  showLabels: boolean;
  language: Language;
}

interface OrbitLineProps {
    radius: number;
    color?: string;
    dashed?: boolean;
    inclination: number;
    eccentricity?: number;
    argumentOfPeriapsis?: number;
    opacity?: number;
}

const OrbitLine: React.FC<OrbitLineProps> = ({ 
    radius, 
    color = '#444', 
    dashed = false, 
    inclination,
    eccentricity = 0,
    argumentOfPeriapsis = 0,
    opacity = 0.3 // Default opacity
}) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 256; // Smoother lines
    // a = semi-major axis (radius)
    // e = eccentricity
    const a = radius;
    const e = eccentricity;
    
    // Rotation for argument of periapsis
    const omega = (argumentOfPeriapsis * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      
      // Polar equation of an ellipse relative to focus (Sun)
      // r = a(1-e^2) / (1 + e*cos(theta))
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
      
      // Convert to Cartesian
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      // Rotate by argument of periapsis (in the XZ plane)
      const xRot = x * Math.cos(omega) - z * Math.sin(omega);
      const zRot = x * Math.sin(omega) + z * Math.cos(omega);

      pts.push(new THREE.Vector3(xRot, 0, zRot));
    }
    return pts;
  }, [radius, eccentricity, argumentOfPeriapsis]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const lineRef = useRef<THREE.LineLoop>(null);

  // Inclination rotation around X axis
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
            opacity={opacity} 
            dashSize={1} 
            gapSize={1} 
            />
        ) : (
            <lineBasicMaterial 
            attach="material" 
            color={color} 
            transparent 
            opacity={opacity} 
            />
        )}
        </lineLoop>
    </group>
  );
};

const PlanetRing: React.FC<{
    ring: NonNullable<CelestialBodyData['ring']>;
    texture?: THREE.Texture | null;
    hasTexture?: boolean;
}> = ({ ring, texture, hasTexture }) => {
    return (
        <mesh rotation={[-Math.PI / 2.2, 0, 0]}>
            <ringGeometry args={[ring.inner, ring.outer, 64]} />
            <meshStandardMaterial 
                map={hasTexture ? texture ?? undefined : undefined}
                color={hasTexture ? undefined : ring.color} 
                side={THREE.DoubleSide} 
                transparent 
                opacity={hasTexture ? 0.9 : 0.6} 
                emissive={ring.color}
                emissiveIntensity={hasTexture ? 0.4 : 0.2}
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

const getSeasonalOrbitAngle = (id: string) => {
  if (id === 'earth') {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = (now.getTime() - start.getTime()) / 86400000;
    const yearLength = 365.25;
    const seasonalPhase = (dayOfYear / yearLength) * Math.PI * 2;
    const vernalEquinoxOffset = -Math.PI / 2; // set March equinox near +X axis
    return seasonalPhase + vernalEquinoxOffset;
  }
  return Math.random() * Math.PI * 2;
};

export const CelestialBody: React.FC<BodyProps> = ({ data, timeScale, isRealTime, showLabels, language }) => {
  const meshRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const accretionRef = useRef<THREE.Mesh>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const axialTilt = data.axialTilt ?? 0;
  
  // Angle state
  const initialAngle = useMemo(() => getSeasonalOrbitAngle(data.id), [data.id]);
  const angleRef = useRef(initialAngle);

  const isSmallBody = ['dwarf', 'asteroid', 'comet', 'interstellar'].includes(data.type);
  const isStar = data.type === 'star';
  const isBlackHole = data.type === 'blackhole';
  const isGiant = isStar || isBlackHole;
  const isEarth = data.id === 'earth';

  const surfaceTextureUrl = useMemo(() => getBodyTextureUrl(data.id, data.type), [data.id, data.type]);
  const surfaceTexture = useTexture(surfaceTextureUrl ?? BLANK_TEXTURE_DATA_URL);
  const hasSurfaceTexture = Boolean(surfaceTextureUrl);

  const ringTextureUrl = useMemo(() => (data.ring ? getRingTextureUrl(data.id) : undefined), [data.id, data.ring]);
  const ringTexture = useTexture(ringTextureUrl ?? BLANK_TEXTURE_DATA_URL);
  const hasRingTexture = Boolean(ringTextureUrl);

  const earthNightTexture = useTexture(isEarth ? EARTH_NIGHT_TEXTURE : BLANK_TEXTURE_DATA_URL);
  const earthCloudTexture = useTexture(isEarth ? EARTH_CLOUDS_TEXTURE : BLANK_TEXTURE_DATA_URL);
  const spinSpeed = useMemo(
    () => getRotationSpeed(data.id, data.type, data.rotationSpeed, timeScale),
    [data.id, data.rotationSpeed, data.type, timeScale]
  );
  useEffect(() => {
    if (tiltRef.current) {
        tiltRef.current.rotation.z = THREE.MathUtils.degToRad(axialTilt);
    }
  }, [axialTilt]);

  // Scaling logic for labels of massive objects
  const labelDistanceFactor = isGiant && data.radius > 50 ? Math.max(100, data.radius * 2) : 50;
  const labelYOffset = isGiant && data.radius > 20 ? data.radius * 1.3 : data.radius + 3;

  const inclinationRad = (data.inclination || 0) * (Math.PI / 180);
  const eccentricity = data.eccentricity || 0;
  const omega = ((data.argumentOfPeriapsis || 0) * Math.PI) / 180;

  useEffect(() => {
    if (surfaceTexture) {
        surfaceTexture.colorSpace = THREE.SRGBColorSpace;
        surfaceTexture.anisotropy = 8;
        surfaceTexture.wrapS = surfaceTexture.wrapT = THREE.ClampToEdgeWrapping;
    }
    if (ringTexture) {
        ringTexture.colorSpace = THREE.SRGBColorSpace;
        ringTexture.anisotropy = 8;
        ringTexture.wrapS = ringTexture.wrapT = THREE.ClampToEdgeWrapping;
    }
    if (earthNightTexture) {
        earthNightTexture.colorSpace = THREE.SRGBColorSpace;
        earthNightTexture.anisotropy = 8;
    }
    if (earthCloudTexture) {
        earthCloudTexture.colorSpace = THREE.SRGBColorSpace;
        earthCloudTexture.anisotropy = 8;
    }
  }, [earthCloudTexture, earthNightTexture, ringTexture, surfaceTexture]);

  const accretionTexture = useMemo(() => {
    if (!isBlackHole) return null;
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
    gradient.addColorStop(0, '#ffd27f');
    gradient.addColorStop(0.4, '#ff9900');
    gradient.addColorStop(0.65, '#7a1f00');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [isBlackHole]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Calculate Angle (True Anomaly approx)
    let currentAngle = 0;
    
    if (isRealTime) {
      if (data.speed === 0) {
         currentAngle = 0;
      } else {
        const now = Date.now() / 1000;
        const orbitalPeriodSeconds = 365.25 * 24 * 3600 / (data.speed || 1);
        currentAngle = (now / orbitalPeriodSeconds) * Math.PI * 2;
      }
    } else {
      // Keplers 2nd law approximation (faster near perihelion)
      // r is current distance. v ~ 1/r. 
      // Simplified: Just use constant angular speed for visualization unless very eccentric
      const variableSpeed = eccentricity > 0.3 
         ? data.speed * (1 + eccentricity * Math.cos(angleRef.current)) 
         : data.speed;
         
      angleRef.current += variableSpeed * 0.1 * delta * timeScale;
      currentAngle = angleRef.current;
    }

    // Keplerian Orbit Math (Same as OrbitLine)
    const a = data.distance;
    const r = (a * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(currentAngle));
    
    // Orbital Plane Coordinates
    const xOrb = r * Math.cos(currentAngle);
    const zOrb = r * Math.sin(currentAngle);

    // Apply Argument of Periapsis Rotation (in XZ plane)
    const xPeri = xOrb * Math.cos(omega) - zOrb * Math.sin(omega);
    const zPeri = xOrb * Math.sin(omega) + zOrb * Math.cos(omega);

    // Apply Inclination (Rotate around X axis)
    // IMPORTANT: The sign of the sin term must oppose the rotation direction 
    // to match the Three.js group rotation logic used in OrbitLine.
    // Three.js group rotation [inc, 0, 0] rotates +Y towards +Z. 
    // Manual point rotation must match this transformation matrix:
    // y' = y*cos - z*sin => 0 - z*sin
    // z' = y*sin + z*cos => 0 + z*cos
    const xFinal = xPeri;
    const yFinal = -zPeri * Math.sin(inclinationRad); 
    const zFinal = zPeri * Math.cos(inclinationRad);

    meshRef.current.position.set(xFinal, yFinal, zFinal);

    // Body Rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += spinSpeed * delta;
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

  const showTrail = !isSmallBody && data.type !== 'moon' && !isGiant && eccentricity < 0.2;
  
  const renderBody = () => {
    if (isBlackHole) {
        return (
            <group>
                {/* Event Horizon */}
                <mesh ref={planetRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                    <sphereGeometry args={[data.radius, 64, 64]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
                </mesh>
                {/* Accretion Disk Inner */}
                <mesh ref={accretionRef} rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[data.radius * 1.2, data.radius * 4, 64]} />
                    <meshStandardMaterial 
                        map={accretionTexture ?? undefined}
                        color={accretionTexture ? undefined : new THREE.Color("#ff5500")} 
                        emissive="#ff2200"
                        emissiveIntensity={2}
                        transparent 
                        opacity={0.9} 
                        side={THREE.DoubleSide} 
                    />
                </mesh>
                 {/* Accretion Disk Outer Glow */}
                 <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[data.radius * 4, data.radius * 8, 64]} />
                    <meshBasicMaterial 
                        map={accretionTexture ?? undefined}
                        color={accretionTexture ? undefined : "#aa0000"} 
                        transparent 
                        opacity={0.35} 
                        side={THREE.DoubleSide} 
                    />
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
        <group ref={tiltRef}>
            <mesh 
                ref={planetRef}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                castShadow={true}
                receiveShadow={true}
            >
                <sphereGeometry args={[data.radius, 64, 64]} />
                <meshStandardMaterial 
                    map={hasSurfaceTexture ? surfaceTexture : undefined}
                    color={hasSurfaceTexture ? '#ffffff' : data.color}
                    roughness={hasSurfaceTexture ? 0.9 : data.type === 'planet' ? 0.7 : 0.9}
                    metalness={hasSurfaceTexture ? 0.1 : data.type === 'planet' ? 0.2 : 0.1}
                    emissive={isEarth ? '#ffffff' : hasSurfaceTexture ? '#0a0a0a' : data.color}
                    emissiveMap={isEarth ? earthNightTexture : undefined}
                    emissiveIntensity={
                        isEarth 
                        ? 0.35 
                        : hasSurfaceTexture 
                        ? 0.08 
                        : 0.05
                    } // Slight ambient glow so they aren't pitch black in shadow
                />
            </mesh>
            {isEarth && (
                <mesh scale={[1.02, 1.02, 1.02]}>
                    <sphereGeometry args={[data.radius, 64, 64]} />
                    <meshStandardMaterial 
                        map={earthCloudTexture}
                        alphaMap={earthCloudTexture}
                        transparent 
                        opacity={0.6}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
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
            eccentricity={data.eccentricity}
            argumentOfPeriapsis={data.argumentOfPeriapsis}
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

        {data.ring && (
            <PlanetRing 
                ring={data.ring} 
                texture={hasRingTexture ? ringTexture : undefined} 
                hasTexture={hasRingTexture} 
            />
        )}

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

const GalacticTrajectory = ({ language }: { language: Language }) => {
    // We visualize a segment of the massive Galactic Orbit
    const curveRadius = 1500;
    const arcLength = 500;
    
    const points = useMemo(() => {
        const pts = [];
        // Center of orbit is at (+curveRadius, 0, 0)
        // We generate points for a large arc passing through (0,0,0)
        // Equation: (x - R)^2 + z^2 = R^2
        // We iterate Z to generate X
        for (let z = -arcLength; z <= arcLength; z += 5) {
             // x = R - sqrt(R^2 - z^2)
             const x = curveRadius - Math.sqrt(curveRadius * curveRadius - z * z);
             pts.push(new THREE.Vector3(x, 0, z));
        }
        return pts;
    }, []);

    const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    const centerText = language === 'PL' ? "Centrum Galaktyki (Sgr A*)" : "Galactic Center (Sgr A*)";
    const orbitText = language === 'PL' ? "Orbita Galaktyczna (T=230mln lat)" : "Galactic Orbit Path (T=230Myr)";
    const velocityText = language === 'PL' ? "Wektor Prędkości (220 km/s)" : "Velocity Vector (220 km/s)";

    return (
        <group rotation={[0, Math.PI, 0]}> 
             {/* The Orbit Path Segment */}
             <ThreeLine>
                <bufferGeometry attach="geometry" {...geometry} />
                <lineBasicMaterial color="#9c27b0" linewidth={2} transparent opacity={0.6} />
             </ThreeLine>
             
             {/* Pointer to Galactic Center */}
             <group position={[100, 0, 0]}>
                <mesh rotation={[0, 0, -Math.PI/2]}>
                    <coneGeometry args={[2, 6, 8]} />
                    <meshBasicMaterial color="#9c27b0" />
                </mesh>
                <mesh position={[50, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.3, 0.3, 100]} />
                    <meshBasicMaterial color="#9c27b0" transparent opacity={0.4} /> 
                </mesh>
                <Text position={[110, 0, 0]} fontSize={6} color="#e1bee7" anchorX="left">
                    {centerText} (~26,000 ly)
                </Text>
             </group>

             {/* Solar Apex / Velocity */}
             <group position={[0,0,-80]}>
                <mesh rotation={[Math.PI/2, 0, 0]}>
                    <coneGeometry args={[1.5, 5, 8]} />
                    <meshBasicMaterial color="#03a9f4" />
                </mesh>
                <Text position={[0, 4, 0]} fontSize={3} color="#03a9f4">
                    {velocityText}
                </Text>
             </group>

             {/* Label on the path */}
             <Text 
                position={[15, -5, -40]} 
                rotation={[-Math.PI/2, 0, 0]} 
                fontSize={4} 
                color="#ba68c8"
                anchorX="left"
            >
                {orbitText}
            </Text>
        </group>
    )
}

// Particle System simulating movement through Interstellar Medium
const InterstellarStream = () => {
    const count = 300;
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            // Random spread around the solar system
            positions[i * 3] = (Math.random() - 0.5) * 400; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400 - 200; // z (start ahead)
            speeds[i] = 1 + Math.random() * 2;
        }
        
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return { geo, speeds, positions };
    }, []);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        // Move particles along Z axis (towards camera) to simulate Sun moving forward (Negative Z)
        for (let i = 0; i < count; i++) {
            // Move along +Z (past camera)
            positions[i * 3 + 2] += geometry.speeds[i] * 50 * delta; 

            // Reset if passed camera
            if (positions[i * 3 + 2] > 200) {
                positions[i * 3 + 2] = -300;
                positions[i * 3] = (Math.random() - 0.5) * 400; // Randomize X again
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group rotation={[0, 0, 0]}> 
             <points ref={pointsRef}>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={geometry.positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial 
                    attach="material" 
                    size={0.8} 
                    color="#88ccff" 
                    transparent 
                    opacity={0.4} 
                    sizeAttenuation 
                />
            </points>
        </group>
    );
};

export const Sun: React.FC<{ showLabels: boolean; language: Language; timeScale: number; isRealTime: boolean; showStarDust: boolean }> = ({ showLabels, language, timeScale, isRealTime, showStarDust }) => {
    const [hovered, setHover] = useState(false);
    const displayName = language === 'PL' ? SUN_DATA.namePL : SUN_DATA.name;
    const description = language === 'PL' ? SUN_DATA.descriptionPL : SUN_DATA.description;
    const typeLabel = BODY_TYPE_TRANSLATIONS['star'][language];
    const sunTexture = useTexture(SUN_TEXTURE);
    useEffect(() => {
        if (sunTexture) {
            sunTexture.colorSpace = THREE.SRGBColorSpace;
            sunTexture.anisotropy = 8;
        }
    }, [sunTexture]);
    
    const sunGroupRef = useRef<THREE.Group>(null);
    const sunSurfaceRef = useRef<THREE.Mesh>(null);
    const angleRef = useRef(0);
    const sunSpin = useMemo(() => getRotationSpeed('sun', 'star', 0.0004, timeScale), [timeScale]);
    const flareTexture = useMemo(() => {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.translate(size / 2, size / 2);
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.3;
            const length = size * (0.2 + Math.random() * 0.25);
            const width = size * 0.05;
            const grad = ctx.createLinearGradient(0, 0, length, 0);
            grad.addColorStop(0, 'rgba(255,255,255,0.9)');
            grad.addColorStop(0.3, 'rgba(255,200,80,0.7)');
            grad.addColorStop(1, 'rgba(255,80,0,0)');
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, -width);
            ctx.lineTo(length, 0);
            ctx.lineTo(0, width);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.needsUpdate = true;
        return tex;
    }, []);

    const prominences = useMemo(() => {
        const entries = [];
        for (let i = 0; i < 6; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 6.5;
            const pos = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
            const scale = 1.5 + Math.random();
            entries.push({ pos, rotY: Math.random() * Math.PI * 2, scale });
        }
        return entries;
    }, []);

    // Wobble Animation (Barycentric Orbit)
    useFrame((_, delta) => {
        if (sunGroupRef.current) {
            let currentAngle = 0;
            const speed = SUN_DATA.wobbleSpeed;
            const distance = SUN_DATA.barycentricRadius;

            if (isRealTime) {
                const now = Date.now() / 1000;
                // Simplified real-time period calculation based on wobbleSpeed ratio
                const period = 365.25 * 24 * 3600 / speed; 
                currentAngle = (now / period) * Math.PI * 2;
            } else {
                 angleRef.current += speed * 0.1 * delta * timeScale;
                 currentAngle = angleRef.current;
            }

            // Move sun opposite to where planets generally are (simplified logic, usually opposite Jupiter)
            // But since planets move independently, we just animate the sun in a circle to show the concept.
            const x = Math.cos(currentAngle) * distance;
            const z = Math.sin(currentAngle) * distance;
            
            sunGroupRef.current.position.set(x, 0, z);
        }
        if (sunSurfaceRef.current) {
            sunSurfaceRef.current.rotation.y += sunSpin * delta;
        }
    });

    return (
        <group>
             {/* Barycenter Center Point */}
             <mesh position={[0,0,0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="white" opacity={0.6} transparent />
             </mesh>
             <Text 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, 0, 0]} 
                fontSize={2} 
                color="#777" 
                anchorX="center" 
                anchorY="middle"
             >
                + Barycenter
             </Text>

             {/* Sun's Orbit around Barycenter */}
             <OrbitLine 
                radius={SUN_DATA.barycentricRadius} 
                color="#FF4500" 
                inclination={0} 
                dashed={true} 
                opacity={0.6}
             />

             {/* Galactic Context - Fixed relative to Barycenter */}
             <GalacticTrajectory language={language} />
             
             {/* Star Dust / Interstellar Stream */}
             {showStarDust && <InterstellarStream />}

            <group ref={sunGroupRef}>
                
                 {/* Main Sun Body with animated surface */}
                <mesh 
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    ref={sunSurfaceRef}
                >
                    <sphereGeometry args={[6, 128, 128]} />
                    <meshStandardMaterial 
                        map={sunTexture}
                        emissiveMap={sunTexture}
                        emissiveIntensity={2.4}
                        emissive="#ffffff"
                        roughness={0.1}
                        metalness={0.05}
                        color="#ffffff"
                    />
                </mesh>
                
                {/* Prominence sprites */}
                {flareTexture && prominences.map((p, idx) => (
                    <mesh key={idx} position={p.pos} rotation={[0, p.rotY, 0]}>
                        <planeGeometry args={[4 * p.scale, 2 * p.scale]} />
                        <meshBasicMaterial 
                            map={flareTexture} 
                            transparent 
                            opacity={0.9} 
                            depthWrite={false} 
                            blending={THREE.AdditiveBlending}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))}
                
                {/* Light Source */}
                <pointLight intensity={3} distance={15000} decay={0.5} color="#FFF8E7" castShadow shadow-mapSize={[2048, 2048]} />
                
                {/* Corona Glow */}
                <mesh scale={[1.35, 1.35, 1.35]}>
                    <sphereGeometry args={[6, 32, 32]} />
                    <meshBasicMaterial color="#FFB347" transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
                </mesh>
                <mesh scale={[1.8, 1.8, 1.8]}>
                    <sphereGeometry args={[6, 32, 32]} />
                    <meshBasicMaterial color="#FF6B00" transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
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
        </group>
    )
}
