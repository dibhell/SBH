import React from 'react';
import { AppState, ViewMode } from '../types';
import { Maximize, Play, Clock, Info } from 'lucide-react';

interface UIOverlayProps {
  state: AppState;
  onStateChange: (newState: Partial<AppState>) => void;
  onResetCamera: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ state, onStateChange, onResetCamera }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-2xl max-w-md">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Solar System 3D
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {state.viewMode === 'SOLAR_DETAILED' 
              ? 'Interactive Heliocentric Model' 
              : 'Galactic Scale: Sagittarius A*'}
          </p>
        </div>

        <div className="flex gap-2">
            <button
                onClick={() => onStateChange({ viewMode: 'SOLAR_DETAILED' })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                    state.viewMode === 'SOLAR_DETAILED'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'bg-black/60 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
            >
                Solar View
            </button>
            <button
                onClick={() => onStateChange({ viewMode: 'SAGITTARIUS_A' })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                    state.viewMode === 'SAGITTARIUS_A'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                    : 'bg-black/60 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
            >
                Sagittarius A*
            </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 items-end pointer-events-auto">
        
        {/* Info Box */}
        <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 w-64 text-xs text-gray-300">
          <div className="flex items-center gap-2 mb-2 text-white font-bold">
            <Info size={14} /> <span>Controls</span>
          </div>
          <ul className="space-y-1 list-disc pl-4">
            <li>LMB + Drag to Rotate</li>
            <li>RMB + Drag to Pan</li>
            <li>Scroll to Zoom</li>
          </ul>
        </div>

        {/* Playback Controls */}
        <div className="bg-black/80 backdrop-blur-lg p-4 rounded-xl border border-white/20 text-white shadow-2xl w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm font-semibold">Time Simulation</span>
            </div>
            <button 
                onClick={onResetCamera}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition"
            >
                Reset Camera
            </button>
          </div>

          <div className="space-y-4">
            <div>
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                 <span>Speed</span>
                 <span>{state.timeScale.toFixed(1)}x</span>
               </div>
               <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={state.timeScale}
                disabled={state.isRealTime}
                onChange={(e) => onStateChange({ timeScale: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Labels</span>
                <button
                    onClick={() => onStateChange({ showLabels: !state.showLabels })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${state.showLabels ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.showLabels ? 'left-6' : 'left-1'}`} />
                </button>
            </div>

            <button
              onClick={() => onStateChange({ isRealTime: !state.isRealTime, timeScale: !state.isRealTime ? 1 : 10 })}
              className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border ${
                state.isRealTime 
                ? 'bg-green-600/20 border-green-500 text-green-400' 
                : 'bg-white/10 border-transparent hover:bg-white/20'
              }`}
            >
              {state.isRealTime ? (
                <>Real-Time (J2000) Active</>
              ) : (
                <>
                    <Play size={14} fill="currentColor" /> Set Real-Time
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;