
import React from 'react';
import { AppState } from '../types';
import { Play, Clock, Info, Languages, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MousePointer2 } from 'lucide-react';
import { UI_TRANSLATIONS, SOLAR_SYSTEM_DATA, SUN_DATA } from '../constants';

interface UIOverlayProps {
  state: AppState;
  onStateChange: (newState: Partial<AppState>) => void;
  onResetCamera: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ state, onStateChange, onResetCamera }) => {
  const t = UI_TRANSLATIONS[state.language];

  const dispatchMove = (x: number, y: number) => {
      const event = new CustomEvent('camera-move', { detail: { x, y } });
      window.dispatchEvent(event);
  };

  const handleJumpTo = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e?.target?.value;
      if (!val) return;
      onStateChange({ targetBody: val });
  };

  // Filter objects for the dropdown
  const jumpableObjects = SOLAR_SYSTEM_DATA.filter(b => {
      if (!state.showGiantObjects && (b.type === 'star' || b.type === 'blackhole')) return false;
      return true;
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-2xl max-w-md">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {t.title}
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {state.viewMode === 'SOLAR_DETAILED' ? t.subtitleDetailed : t.subtitleGalaxy}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
                <button
                    onClick={() => onStateChange({ language: state.language === 'EN' ? 'PL' : 'EN' })}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border bg-black/60 border-white/10 text-gray-200 hover:bg-white/10 flex items-center gap-2"
                >
                    <Languages size={16} />
                    {state.language}
                </button>
                <div className="w-px h-8 bg-white/20 mx-1 self-center" />
                <button
                    onClick={() => onStateChange({ viewMode: 'SOLAR_DETAILED' })}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                        state.viewMode === 'SOLAR_DETAILED'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                        : 'bg-black/60 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    {t.modeSolar}
                </button>
                <button
                    onClick={() => onStateChange({ viewMode: 'SAGITTARIUS_A' })}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                        state.viewMode === 'SAGITTARIUS_A'
                        ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                        : 'bg-black/60 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    {t.modeGalaxy}
                </button>
            </div>

            {/* Jump To Dropdown (Navigation Fix) */}
            {state.viewMode === 'SOLAR_DETAILED' && (
                <div className="w-full bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-2 flex items-center gap-2">
                    <MousePointer2 size={16} className="text-blue-400 ml-1" />
                    <select 
                        className="bg-transparent text-white text-sm outline-none w-full cursor-pointer"
                        onChange={handleJumpTo}
                        value={state.targetBody || ""}
                    >
                        <option value="" disabled className="bg-gray-900 text-white">{t.jumpTo}</option>
                        <option value="sun" className="bg-gray-900 text-white">{state.language === 'PL' ? SUN_DATA.namePL : SUN_DATA.name}</option>
                        {jumpableObjects.map(b => (
                            <option key={b.id} value={b.id} className="bg-gray-900 text-white">
                                {state.language === 'PL' ? b.namePL : b.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
      </div>

      {/* Navigation D-Pad (Bottom Left) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto hidden md:block">
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-sm">
            <div />
            <button 
                onClick={() => dispatchMove(0, 1)}
                className="w-10 h-10 bg-white/10 hover:bg-blue-600/50 rounded flex items-center justify-center transition-colors active:scale-95"
            >
                <ArrowUp size={20} />
            </button>
            <div />
            <button 
                onClick={() => dispatchMove(-1, 0)}
                className="w-10 h-10 bg-white/10 hover:bg-blue-600/50 rounded flex items-center justify-center transition-colors active:scale-95"
            >
                <ArrowLeft size={20} />
            </button>
            <button 
                onClick={() => dispatchMove(0, -1)}
                className="w-10 h-10 bg-white/10 hover:bg-blue-600/50 rounded flex items-center justify-center transition-colors active:scale-95"
            >
                <ArrowDown size={20} />
            </button>
            <button 
                onClick={() => dispatchMove(1, 0)}
                className="w-10 h-10 bg-white/10 hover:bg-blue-600/50 rounded flex items-center justify-center transition-colors active:scale-95"
            >
                <ArrowRight size={20} />
            </button>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">Pan Camera</div>
      </div>

      {/* Controls (Right Side) */}
      <div className="flex flex-col gap-4 items-end pointer-events-auto">
        
        {/* Info Box */}
        <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 w-64 text-xs text-gray-300">
          <div className="flex items-center gap-2 mb-2 text-white font-bold">
            <Info size={14} /> <span>{t.controls}</span>
          </div>
          <ul className="space-y-1 list-disc pl-4">
            {t.controlsList.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
             <li>Arrow keys to Pan</li>
             <li>Use Dropdown to Jump</li>
          </ul>
        </div>

        {/* Playback Controls */}
        <div className="bg-black/80 backdrop-blur-lg p-4 rounded-xl border border-white/20 text-white shadow-2xl w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm font-semibold">{t.timeSim}</span>
            </div>
            <button 
                onClick={onResetCamera}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition"
            >
                {t.resetCam}
            </button>
          </div>

          <div className="space-y-4">
            <div>
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                 <span>{t.speed}</span>
                 <span>{state.timeScale.toFixed(1)}x</span>
               </div>
               <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={state.timeScale}
                disabled={state.isRealTime}
                onChange={(e) => {
                    const newValue = e?.target?.value;
                    if (newValue !== undefined) {
                        onStateChange({ timeScale: parseFloat(newValue) });
                    }
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Toggles Grid */}
            <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{t.labels}</span>
                    <button
                        onClick={() => onStateChange({ showLabels: !state.showLabels })}
                        className={`w-10 h-5 rounded-full relative transition-colors ${state.showLabels ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.showLabels ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{t.giantObjects}</span>
                    <button
                        onClick={() => onStateChange({ showGiantObjects: !state.showGiantObjects })}
                        className={`w-10 h-5 rounded-full relative transition-colors ${state.showGiantObjects ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.showGiantObjects ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{t.starDust}</span>
                    <button
                        onClick={() => onStateChange({ showStarDust: !state.showStarDust })}
                        className={`w-10 h-5 rounded-full relative transition-colors ${state.showStarDust ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.showStarDust ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
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
                <>{t.realTimeActive}</>
              ) : (
                <>
                    <Play size={14} fill="currentColor" /> {t.realTime}
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
