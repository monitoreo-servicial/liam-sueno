import React, { useState } from 'react';
import { X, Settings, HelpCircle, Save, Check } from 'lucide-react';
import type { BabySettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BabySettings | null;
  onSave: (updated: Partial<BabySettings>) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  if (!isOpen || !settings) return null;

  const [babyName, setBabyName] = useState(settings.baby_name);
  const [birthDate, setBirthDate] = useState(settings.birth_date);
  const [minWake, setMinWake] = useState(settings.wake_window_min_minutes);
  const [maxWake, setMaxWake] = useState(settings.wake_window_max_minutes);
  const [targetNaps, setTargetNaps] = useState(settings.target_naps);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        baby_name: babyName,
        birth_date: birthDate,
        wake_window_min_minutes: Number(minWake),
        wake_window_max_minutes: Number(maxWake),
        target_naps: Number(targetNaps),
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      alert('Error guardando configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-safe shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-base text-white">Configuración del Sueño</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Baby Name */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Nombre del bebé</label>
            <input
              type="text"
              required
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Fecha de nacimiento</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Wake Windows */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-indigo-300">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ventana de Vigilia Sugerida (Minutos)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Mínimo (alerta)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="45"
                    max="300"
                    step="5"
                    required
                    value={minWake}
                    onChange={(e) => setMinWake(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-500">min</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Máximo (límite)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="60"
                    max="360"
                    step="5"
                    required
                    value={maxWake}
                    onChange={(e) => setMaxWake(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-500">min</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              💡 Para 4 meses se aconsejan de 90 a 120 min (1.5h a 2h). A medida que crezca podés aumentarla gradualmente.
            </p>
          </div>

          {/* Target Naps */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Meta de siestas diarias
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTargetNaps(num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    targetNaps === num
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {num} siestas
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 font-bold text-white text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Guardado con éxito!</span>
                </>
              ) : isSaving ? (
                <span>Guardando en Oracle...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
