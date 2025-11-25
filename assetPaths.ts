const normalizeBase = (base: string) => (base.endsWith('/') ? base : `${base}/`);

/**
 * Prefixes an asset path with the configured BASE_URL, trimming duplicate slashes.
 */
export const withBaseUrl = (assetPath: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = normalizeBase(base);
  const trimmedPath = assetPath.replace(/^\/+/, '');
  return `${normalizedBase}${trimmedPath}`;
};

export const COSMIC_ICON_URL = withBaseUrl('cosmic-icon.svg');
