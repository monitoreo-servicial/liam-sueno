import React, { useState } from 'react';
import { X, Moon, Clock, Bed, Armchair } from 'lucide-react';
import type { SleepType, SleepMethod, SleepLocation } from '../types';

interface StartSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    type: SleepType;
    startTime: string;
    method: SleepMethod;
    location: SleepLocation;
  }) => void;
}

export const StartSleepModal: React.FC<StartSleepModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<SleepType>('nap');
  const [minutesAgo, setMinutesAgo] = useState<number>(0);
  const [method, setMethod] = useState<SleepMethod>('brazos');
  const [location, setLocation] = useState<SleepLocation>('cuna');

  const methods: { id: SleepMethod; label: string; icon: string }[] = [
    { id: 'brazos', label: 'Brazos', icon: '🫂' },
    { id: 'teta', label: 'Teta', icon: '🤱' },
    { id: 'biberon', label: 'Mamadera', icon: '🍼' },
    { id: 'cuna_solo', label: 'Cuna solo', icon: '🛏️' },
    { id: 'cochecito', label: 'Cochecito', icon: '🛒' },
    { id: 'porteo', label: 'Porteo / Fular', icon: '🎽' },
  ];

  const locations: { id: SleepLocation; label: string }[] = [
    { id: 'cuna', label: 'Cuna' },
    { id: 'cama', label: 'Cama' },
    { id: 'cochecito', label: 'Cochecito' },
    { id: 'brazos', label: 'Brazos' },
  ];

  const handleSave = () => {
    const startTime = new Date(Date.now() - minutesAgo * 60000).toISOString();
    onConfirm({ type, startTime, method, location });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-safe shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-base text-white">¿A qué hora se durmió?</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Time Selector */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            Momento en que se durmió:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 0, label: 'Ahora' },
              { val: 5, label: 'Hace 5m' },
              { val: 10, label: 'Hace 10m' },
              { val: 15, label: 'Hace 15m' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setMinutesAgo(opt.val)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition border ${
                  minutesAgo === opt.val
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type: Nap vs Night */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            Tipo de sueño:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('nap')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                type === 'nap'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
              }`}
            >
              <span>💤 Siesta</span>
            </button>
            <button
              type="button"
              onClick={() => setType('night')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                type === 'night'
                  ? 'bg-violet-600 text-white border-violet-500'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
              }`}
            >
              <span>🌙 Sueño Nocturno</span>
            </button>
          </div>
        </div>

        {/* How did he fall asleep? */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            ¿Cómo se durmió? (Método)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`py-2 px-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 border ${
                  method === m.id
                    ? 'bg-slate-700 text-white border-indigo-400'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/40 hover:bg-slate-700/50'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            ¿Dónde está durmiendo?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setLocation(loc.id)}
                className={`py-2 px-1.5 rounded-xl text-xs font-medium transition text-center border ${
                  location === loc.id
                    ? 'bg-slate-700 text-white border-indigo-400'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/40'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 font-bold text-white text-base shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition"
          >
            Confirmar y Empezar a Contar 💤
          </button>
        </div>
      </div>
    </div>
  );
};
