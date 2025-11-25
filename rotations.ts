import type { CelestialBodyData } from './constants';

// Sidereal rotation periods in hours (retrograde values are negative).
const ROTATION_PERIOD_HOURS: Record<string, number> = {
  mercury: 1407.5,
  venus: -5832.5,
  earth: 23.934,
  moon: 655.7,
  mars: 24.6,
  jupiter: 9.9,
  saturn: 10.7,
  uranus: -17.2,
  neptune: 16.1,
  pluto: -153.3,
  ceres: 9.1,
  halley: 52, // nucleus spin ~52h
  io: 42.5,
  europa: 85.2,
  ganymede: 171.7,
  callisto: 400.5,
  titan: 382.7,
  enceladus: 33,
  triton: -141,
  charon: 152.9,
};

// Keep proportions realistic but speed up to make spins visible.
const SPIN_VISIBILITY_MULTIPLIER = 4500;

export const getRotationSpeed = (
  id: string,
  _type: CelestialBodyData['type'],
  fallback: number,
  timeScale: number
) => {
  const periodHours = ROTATION_PERIOD_HOURS[id];
  if (!periodHours) return fallback;
  const radiansPerSecond = (Math.PI * 2) / (periodHours * 3600);
  const timeBoost = Math.max(1, timeScale * 0.5);
  return radiansPerSecond * SPIN_VISIBILITY_MULTIPLIER * timeBoost;
};
