import React from 'react';
import { Moon, Sun, RefreshCw, Settings, Baby, Heart } from 'lucide-react';
import type { Caregiver } from '../types';

interface HeaderProps {
  caregiver: Caregiver;
  onCaregiverChange: (caregiver: Caregiver) => void;
  onOpenSettings: () => void;
  isSyncing: boolean;
  onSync: () => void;
  babyAge: string;
  babyName: string;
}

export const Header: React.FC<HeaderProps> = ({
  caregiver,
  onCaregiverChange,
  onOpenSettings,
  isSyncing,
  onSync,
  babyAge,
  babyName,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-night-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 pt-safe">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Baby Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg text-white tracking-tight">{babyName}</h1>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-1.5 py-0.5 rounded-full border border-indigo-500/30">
                {babyAge}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Sincronizado en nube
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="Sincronizar"
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 text-slate-300 flex items-center justify-center transition border border-slate-700/60"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Configuración"
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 text-slate-300 flex items-center justify-center transition border border-slate-700/60"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Caregiver Switcher */}
      <div className="max-w-md mx-auto mt-2.5 flex items-center justify-between bg-slate-800/60 p-1 rounded-xl border border-slate-700/40">
        <span className="text-[11px] font-medium text-slate-400 pl-2 flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
          Registrando como:
        </span>
        <div className="flex items-center gap-1">
          {(['Papá', 'Mamá'] as Caregiver[]).map((c) => {
            const active = caregiver === c;
            return (
              <button
                key={c}
                onClick={() => onCaregiverChange(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
