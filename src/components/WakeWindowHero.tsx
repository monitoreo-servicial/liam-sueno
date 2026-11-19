import React from 'react';
import { Moon, Sun, Clock, Sparkles, AlertCircle, CheckCircle2, BedDouble, Eye } from 'lucide-react';
import type { WakeWindowState, BabySettings } from '../types';
import { formatTime } from '../utils/sleepMath';

interface WakeWindowHeroProps {
  state: WakeWindowState;
  settings: BabySettings | null;
  onStartSleepClick: () => void;
  onEndSleepClick: () => void;
}

export const WakeWindowHero: React.FC<WakeWindowHeroProps> = ({
  state,
  settings,
  onStartSleepClick,
  onEndSleepClick,
}) => {
  const minWake = settings?.wake_window_min_minutes || 90;
  const maxWake = settings?.wake_window_max_minutes || 120;

  if (!state.isAwake && state.currentSession) {
    // Liam is currently SLEEPING
    return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/40 p-6 shadow-2xl shadow-indigo-950/60">
        {/* Soft background ambient glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-violet-600/15 blur-2xl pointer-events-none" />

        {/* Status header */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Moon className="w-3.5 h-3.5 fill-indigo-300 animate-pulse" />
            {state.currentSession.type === 'night' ? 'Sueño Nocturno' : 'Siesta en curso'}
          </span>
          <span className="text-xs text-slate-400">
            Inició a las {formatTime(state.currentSession.start_time)}
          </span>
        </div>

        {/* Live Timer */}
        <div className="text-center my-6">
          <span className="text-xs uppercase tracking-widest text-indigo-300/80 font-bold">
            Liam está durmiendo hace
          </span>
          <div className="text-5xl font-extrabold text-white tracking-tight mt-1 mb-2 font-mono drop-shadow-md">
            {state.formattedElapsed}
          </div>
          <p className="text-sm text-slate-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Descansando • {state.currentSession.location} ({state.currentSession.method})
          </p>
        </div>

        {/* Wake Up Button (Big 1-Tap) */}
        <button
          onClick={onEndSleepClick}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 font-bold text-slate-950 text-lg shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          <Sun className="w-6 h-6 fill-amber-950 text-amber-950 group-hover:rotate-45 transition-transform duration-300" />
          <span>Liam se despertó</span>
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-2.5">
          Registrado por <span className="font-semibold text-slate-300">{state.currentSession.logged_by}</span>
        </p>
      </section>
    );
  }

  // Liam is AWAKE
  const badgeColors = {
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    red: 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse',
  };

  const progressColors = {
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-400',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl shadow-black/40">
      {/* Top badges */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Eye className="w-3.5 h-3.5" />
          Liam está despierto
        </span>
        <span className="text-xs text-slate-400">
          Meta ventana: {minWake} - {maxWake}m
        </span>
      </div>

      {/* Awake Timer */}
      <div className="text-center my-4">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
          Tiempo despierto
        </span>
        <div className="text-5xl font-extrabold text-white tracking-tight mt-1 mb-2 font-mono">
          {state.formattedElapsed}
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border max-w-sm mx-auto transition-colors duration-300 text-left sm:text-center">
          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${badgeColors[state.statusColor]}`}>
            {state.statusLevel === 'fresh' && 'Calmo'}
            {state.statusLevel === 'sweet_spot' && 'Ventana Óptima'}
            {state.statusLevel === 'tired' && 'Hora de Dormir'}
            {state.statusLevel === 'overtired' && 'Sobrecansado'}
          </span>
          <span className="text-slate-300 text-xs">{state.statusText}</span>
        </div>
      </div>

      {/* Wake Window Progress Bar */}
      <div className="my-5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Progreso ventana de vigilia
          </span>
          <span className="font-semibold text-slate-200">
            {state.minutesElapsed} / {maxWake} min
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColors[state.statusColor]}`}
            style={{ width: `${Math.min(100, Math.max(5, state.progressPercent))}%` }}
          />
        </div>

        {/* Estimation info */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {state.lastCompletedSession ? (
              <>Despertó {formatTime(state.lastCompletedSession.end_time)}</>
            ) : (
              <>Sin siestas registradas aún</>
            )}
          </span>
          <span className="font-semibold text-indigo-300">
            {state.nextNapTime ? (
              <>Próxima siesta: ~{formatTime(state.nextNapTime.toISOString())}</>
            ) : null}
          </span>
        </div>
      </div>

      {/* Sleep Button (Big 1-Tap) */}
      <button
        onClick={onStartSleepClick}
        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 p-4 font-bold text-white text-lg shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
      >
        <Moon className="w-6 h-6 fill-white text-white group-hover:-rotate-12 transition-transform duration-300" />
        <span>Liam se durmió</span>
      </button>
    </section>
  );
};
