import React, { useState, useCallback } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    viewMode: 'SOLAR_DETAILED',
    timeScale: 1,
    isRealTime: false,
    showLabels: true,
    language: 'PL', // Default to Polish as requested
  });

  const [resetTrigger, setResetTrigger] = useState(0);

  const handleStateChange = useCallback((newState: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...newState }));
  }, []);

  const handleResetCamera = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative font-sans">
      <Scene state={appState} resetTrigger={resetTrigger} />
      <UIOverlay 
        state={appState} 
        onStateChange={handleStateChange} 
        onResetCamera={handleResetCamera}
      />
    </div>
  );
};

export default App;