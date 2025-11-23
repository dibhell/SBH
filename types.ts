export type ViewMode = 'SOLAR_DETAILED' | 'SAGITTARIUS_A';

export interface AppState {
  viewMode: ViewMode;
  timeScale: number;
  isRealTime: boolean;
  showLabels: boolean;
}