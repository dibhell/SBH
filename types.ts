
export type ViewMode = 'SOLAR_DETAILED' | 'SAGITTARIUS_A';
export type Language = 'PL' | 'EN';

export interface AppState {
  viewMode: ViewMode;
  timeScale: number;
  isRealTime: boolean;
  showLabels: boolean;
  language: Language;
  targetBody: string | null; // For navigation jump
  showGiantObjects: boolean;
  showStarDust: boolean;
}
