import type { CelestialBodyData } from './constants';
import { withBaseUrl } from './assetPaths';

const texture = (file: string) => withBaseUrl(`textures/${file}`);

export const BLANK_TEXTURE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HwAFgwJ/lIu05wAAAABJRU5ErkJggg==';

const BODY_TEXTURES: Record<string, string> = {
  mercury: texture('2k_mercury.jpg'),
  venus: texture('2k_venus_surface.jpg'),
  earth: texture('2k_earth_daymap.jpg'),
  moon: texture('2k_moon.jpg'),
  mars: texture('2k_mars.jpg'),
  jupiter: texture('2k_jupiter.jpg'),
  saturn: texture('2k_saturn.jpg'),
  uranus: texture('2k_uranus.jpg'),
  neptune: texture('2k_neptune.jpg'),
  // Dwarfs / fictional stand-ins
  pluto: texture('2k_eris_fictional.jpg'),
  ceres: texture('2k_ceres_fictional.jpg'),
  haumea: texture('2k_haumea_fictional.jpg'),
  makemake: texture('2k_makemake_fictional.jpg'),
  eris: texture('2k_eris_fictional.jpg'),
};

const TYPE_DEFAULTS: Partial<Record<CelestialBodyData['type'], string>> = {
  moon: BODY_TEXTURES.moon,
  dwarf: BODY_TEXTURES.ceres,
  asteroid: BODY_TEXTURES.ceres,
  comet: BODY_TEXTURES.ceres,
  interstellar: BODY_TEXTURES.ceres,
};

export const getBodyTextureUrl = (id: string, type: CelestialBodyData['type']) =>
  BODY_TEXTURES[id] ?? TYPE_DEFAULTS[type];

const RING_TEXTURES: Record<string, string> = {
  saturn: texture('2k_saturn_ring_alpha.png'),
};

export const getRingTextureUrl = (id: string) => RING_TEXTURES[id];

export const EARTH_NIGHT_TEXTURE = texture('2k_earth_nightmap.jpg');
export const EARTH_CLOUDS_TEXTURE = texture('2k_earth_clouds.jpg');
export const SUN_TEXTURE = texture('2k_sun.jpg');
