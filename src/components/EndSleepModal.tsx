import React, { useState } from 'react';
import { X, Sun, Smile, Frown, Sparkles } from 'lucide-react';
import type { SleepQuality } from '../types';

interface EndSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    endTime: string;
    quality: SleepQuality;
    notes?: string;
  }) => void;
}

export const EndSleepModal: React.FC<EndSleepModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const [minutesAgo, setMinutesAgo] = useState<number>(0);
  const [quality, setQuality] = useState<SleepQuality>('tranquilo');
  const [notes, setNotes] = useState<string>('');

  const qualities: { id: SleepQuality; label: string; icon: string; desc: string }[] = [
    { id: 'tranquilo', label: 'Tranquilo', icon: '😊', desc: 'Despertó bien y contento' },
    { id: 'inquieto', label: 'Inquieto', icon: '🥱', desc: 'Se movió bastante' },
    { id: 'corto', label: 'Siesta corta', icon: '⚡', desc: 'Menos de 35-40 min' },
    { id: 'lloroso', label: 'Lloroso', icon: '😢', desc: 'Le faltó dormir' },
  ];

  const handleSave = () => {
    const endTime = new Date(Date.now() - minutesAgo * 60000).toISOString();
    onConfirm({ endTime, quality, notes: notes.trim() || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-safe shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-base text-white">¡Buen despertar, Liam!</h2>
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
            ¿A qué hora se despertó?
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
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* How did he wake up? */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            ¿Cómo se despertó?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {qualities.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setQuality(q.id)}
                className={`p-3 rounded-2xl text-left transition border ${
                  quality === q.id
                    ? 'bg-slate-800 text-white border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/40 hover:bg-slate-800/80'
                }`}
              >
                <div className="text-xl mb-1">{q.icon}</div>
                <div className="font-bold text-xs text-slate-200">{q.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{q.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            Notas u observaciones (opcional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Se despertó por ruido, tomó teta enseguida..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 font-bold text-slate-950 text-base shadow-lg shadow-amber-500/25 active:scale-[0.98] transition"
          >
            Guardar y Comenzar Ventana de Vigilia ☀️
          </button>
        </div>
      </div>
    </div>
  );
};
