import { Vector3 } from 'three';

export interface CelestialBodyData {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'dwarf' | 'moon';
  radius: number; // Visual scale radius
  distance: number; // Distance from parent
  color: string;
  speed: number; // Orbital speed multiplier
  rotationSpeed: number;
  texture?: string; // Optional texture path (using colors for stability)
  moons?: CelestialBodyData[];
  orbitColor?: string;
  ring?: { inner: number; outer: number; color: string };
}

// Scales are stylized for visibility, not 1:1 reality (as per BRD)
export const SOLAR_SYSTEM_DATA: CelestialBodyData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    radius: 0.8,
    distance: 12,
    color: '#A5A5A5',
    speed: 4.1,
    rotationSpeed: 0.02,
    orbitColor: '#555',
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    radius: 1.5,
    distance: 18,
    color: '#E3BB76',
    speed: 1.6,
    rotationSpeed: -0.01, // Retrograde
    orbitColor: '#766',
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    radius: 1.6,
    distance: 26,
    color: '#22A6B3',
    speed: 1.0,
    rotationSpeed: 0.05,
    orbitColor: '#357',
    moons: [
      {
        id: 'moon',
        name: 'Moon',
        type: 'moon',
        radius: 0.4,
        distance: 3.5,
        color: '#DDDDDD',
        speed: 12.0, // Fast orbit around Earth
        rotationSpeed: 0.01,
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    radius: 1.1,
    distance: 34,
    color: '#EB4D4B',
    speed: 0.53,
    rotationSpeed: 0.04,
    orbitColor: '#733',
  },
  {
    id: 'ceres',
    name: 'Ceres',
    type: 'dwarf',
    radius: 0.5,
    distance: 42,
    color: '#999999',
    speed: 0.4,
    rotationSpeed: 0.05,
    orbitColor: '#333',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    radius: 4.5,
    distance: 60,
    color: '#F9CA24',
    speed: 0.08,
    rotationSpeed: 0.1,
    orbitColor: '#652',
    moons: [
      { id: 'io', name: 'Io', type: 'moon', radius: 0.5, distance: 6, color: '#F8C291', speed: 8, rotationSpeed: 0.01 },
      { id: 'europa', name: 'Europa', type: 'moon', radius: 0.45, distance: 7.5, color: '#DFF9FB', speed: 6, rotationSpeed: 0.01 },
      { id: 'ganymede', name: 'Ganymede', type: 'moon', radius: 0.6, distance: 9.5, color: '#95A5A6', speed: 4, rotationSpeed: 0.01 },
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    radius: 3.8,
    distance: 85,
    color: '#F0DF90',
    speed: 0.03,
    rotationSpeed: 0.09,
    orbitColor: '#654',
    ring: { inner: 4.5, outer: 7.5, color: '#C0A080' },
    moons: [
      { id: 'titan', name: 'Titan', type: 'moon', radius: 0.7, distance: 10, color: '#F39C12', speed: 3, rotationSpeed: 0.01 },
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    radius: 2.5,
    distance: 110,
    color: '#7ED6DF',
    speed: 0.01,
    rotationSpeed: 0.06,
    orbitColor: '#256',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    radius: 2.4,
    distance: 130,
    color: '#30336B',
    speed: 0.006,
    rotationSpeed: 0.06,
    orbitColor: '#225',
    moons: [
      { id: 'triton', name: 'Triton', type: 'moon', radius: 0.5, distance: 5, color: '#ECF0F1', speed: -2, rotationSpeed: 0.01 }, // Retrograde
    ]
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'dwarf',
    radius: 0.4,
    distance: 150,
    color: '#D1CCC0',
    speed: 0.004,
    rotationSpeed: 0.01,
    orbitColor: '#444',
  },
  {
    id: 'eris',
    name: 'Eris',
    type: 'dwarf',
    radius: 0.4,
    distance: 170,
    color: '#FFFFFF',
    speed: 0.003,
    rotationSpeed: 0.01,
    orbitColor: '#333',
  },
  {
    id: 'haumea',
    name: 'Haumea',
    type: 'dwarf',
    radius: 0.35, // Actually ellipsoidal, simplified here
    distance: 160,
    color: '#BDC3C7',
    speed: 0.0035,
    rotationSpeed: 0.15, // Fast spinner
    orbitColor: '#333',
  },
  {
    id: 'makemake',
    name: 'Makemake',
    type: 'dwarf',
    radius: 0.38,
    distance: 165,
    color: '#E67E22',
    speed: 0.0032,
    rotationSpeed: 0.02,
    orbitColor: '#333',
  }
];

export const GALAXY_DATA = {
    blackHoleRadius: 20,
    orbitRadius: 200,
    orbitSpeed: 0.5, // Visual speed
};