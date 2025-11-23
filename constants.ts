import { Vector3 } from 'three';

export interface CelestialBodyData {
  id: string;
  name: string;
  namePL: string;
  type: 'star' | 'planet' | 'dwarf' | 'moon';
  radius: number; // Visual scale radius
  distance: number; // Distance from parent
  color: string; // Material color
  speed: number; // Orbital speed multiplier
  rotationSpeed: number;
  moons?: CelestialBodyData[];
  orbitColor?: string;
  ring?: { inner: number; outer: number; color: string; };
}

export const SOLAR_SYSTEM_DATA: CelestialBodyData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    namePL: 'Merkury',
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
    namePL: 'Wenus',
    type: 'planet',
    radius: 1.5,
    distance: 18,
    color: '#E3BB76',
    speed: 1.6,
    rotationSpeed: -0.01,
    orbitColor: '#766',
  },
  {
    id: 'earth',
    name: 'Earth',
    namePL: 'Ziemia',
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
        namePL: 'Księżyc',
        type: 'moon',
        radius: 0.4,
        distance: 3.5,
        color: '#DDDDDD',
        speed: 12.0,
        rotationSpeed: 0.01,
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    namePL: 'Mars',
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
    namePL: 'Ceres',
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
    namePL: 'Jowisz',
    type: 'planet',
    radius: 4.5,
    distance: 60,
    color: '#F9CA24',
    speed: 0.08,
    rotationSpeed: 0.1,
    orbitColor: '#652',
    moons: [
      { id: 'io', name: 'Io', namePL: 'Io', type: 'moon', radius: 0.5, distance: 6, color: '#F8C291', speed: 8, rotationSpeed: 0.01 },
      { id: 'europa', name: 'Europa', namePL: 'Europa', type: 'moon', radius: 0.45, distance: 7.5, color: '#DFF9FB', speed: 6, rotationSpeed: 0.01 },
      { id: 'ganymede', name: 'Ganymede', namePL: 'Ganimedes', type: 'moon', radius: 0.6, distance: 9.5, color: '#95A5A6', speed: 4, rotationSpeed: 0.01 },
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    namePL: 'Saturn',
    type: 'planet',
    radius: 3.8,
    distance: 85,
    color: '#F0DF90',
    speed: 0.03,
    rotationSpeed: 0.09,
    orbitColor: '#654',
    ring: { inner: 4.5, outer: 7.5, color: '#C0A080' },
    moons: [
      { id: 'titan', name: 'Titan', namePL: 'Tytan', type: 'moon', radius: 0.7, distance: 10, color: '#F39C12', speed: 3, rotationSpeed: 0.01 },
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    namePL: 'Uran',
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
    namePL: 'Neptun',
    type: 'planet',
    radius: 2.4,
    distance: 130,
    color: '#30336B',
    speed: 0.006,
    rotationSpeed: 0.06,
    orbitColor: '#225',
    moons: [
      { id: 'triton', name: 'Triton', namePL: 'Tryton', type: 'moon', radius: 0.5, distance: 5, color: '#ECF0F1', speed: -2, rotationSpeed: 0.01 }, 
    ]
  },
  {
    id: 'pluto',
    name: 'Pluto',
    namePL: 'Pluton',
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
    namePL: 'Eris',
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
    namePL: 'Haumea',
    type: 'dwarf',
    radius: 0.35, 
    distance: 160,
    color: '#BDC3C7',
    speed: 0.0035,
    rotationSpeed: 0.15,
    orbitColor: '#333',
  },
  {
    id: 'makemake',
    name: 'Makemake',
    namePL: 'Makemake',
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

export const UI_TRANSLATIONS = {
  EN: {
    title: "Solar System 3D",
    subtitleDetailed: "Interactive Heliocentric Model",
    subtitleGalaxy: "Galactic Scale: Sagittarius A*",
    modeSolar: "Solar View",
    modeGalaxy: "Sagittarius A*",
    controls: "Controls",
    controlsList: [
      "LMB + Drag to Rotate",
      "RMB + Drag to Pan",
      "Scroll to Zoom"
    ],
    timeSim: "Time Simulation",
    resetCam: "Reset Camera",
    speed: "Speed",
    labels: "Labels",
    realTime: "Set Real-Time",
    realTimeActive: "Real-Time (J2000) Active"
  },
  PL: {
    title: "Układ Słoneczny 3D",
    subtitleDetailed: "Interaktywny Model Heliocentryczny",
    subtitleGalaxy: "Skala Galaktyczna: Sagittarius A*",
    modeSolar: "Widok Solarny",
    modeGalaxy: "Sagittarius A*",
    controls: "Sterowanie",
    controlsList: [
      "LPM + Przesuń by obracać",
      "PPM + Przesuń by przesuwać",
      "Scroll by przybliżać"
    ],
    timeSim: "Symulacja Czasu",
    resetCam: "Reset Kamery",
    speed: "Prędkość",
    labels: "Etykiety",
    realTime: "Tryb Rzeczywisty",
    realTimeActive: "Czas Rzeczywisty (J2000)"
  }
};