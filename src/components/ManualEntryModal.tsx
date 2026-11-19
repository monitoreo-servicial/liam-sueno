import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import type { SleepType, SleepMethod, SleepLocation, SleepQuality, SleepSession } from '../types';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Partial<SleepSession>) => void;
  defaultCaregiver: string;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultCaregiver,
}) => {
  if (!isOpen) return null;

  // Defaults: 1 hour ago to now
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60000);

  const formatForInput = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [type, setType] = useState<SleepType>('nap');
  const [startTime, setStartTime] = useState<string>(formatForInput(oneHourAgo));
  const [endTime, setEndTime] = useState<string>(formatForInput(now));
  const [method, setMethod] = useState<SleepMethod>('brazos');
  const [location, setLocation] = useState<SleepLocation>('cuna');
  const [quality, setQuality] = useState<SleepQuality>('tranquilo');
  const [notes, setNotes] = useState<string>('');
  const [loggedBy, setLoggedBy] = useState<string>(defaultCaregiver);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
      method,
      location,
      quality,
      notes: notes.trim() || null,
      logged_by: loggedBy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 pb-safe shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="font-bold text-base text-white">Cargar siesta pasada</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Tipo de sueño</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('nap')}
                className={`py-2 rounded-xl text-xs font-bold border ${
                  type === 'nap' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                💤 Siesta
              </button>
              <button
                type="button"
                onClick={() => setType('night')}
                className={`py-2 rounded-xl text-xs font-bold border ${
                  type === 'night' ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                🌙 Sueño nocturno
              </button>
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Hora de inicio</label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Hora de fin (despertar)</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Location & Method */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Lugar</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as SleepLocation)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="cuna">Cuna</option>
                <option value="cama">Cama</option>
                <option value="cochecito">Cochecito</option>
                <option value="brazos">Brazos</option>
                <option value="huevito">Huevito</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Método</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as SleepMethod)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="brazos">Brazos</option>
                <option value="teta">Teta</option>
                <option value="biberon">Mamadera</option>
                <option value="cuna_solo">Cuna solo</option>
                <option value="cochecito">Cochecito</option>
                <option value="porteo">Porteo</option>
              </select>
            </div>
          </div>

          {/* Registered By */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Registrado por</label>
            <div className="grid grid-cols-2 gap-2">
              {['Papá', 'Mamá'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setLoggedBy(c)}
                  className={`py-2 rounded-xl text-xs font-semibold border ${
                    loggedBy === c ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Siesta de la tarde en cochecito"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 font-bold text-white text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition"
            >
              Guardar Siesta Pasada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
