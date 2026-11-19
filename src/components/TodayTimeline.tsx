import React from 'react';
import { Moon, Sun, Trash2, Edit3, Plus, Clock, Sparkles } from 'lucide-react';
import type { SleepSession } from '../types';
import { formatTime, formatDuration, formatDateLabel } from '../utils/sleepMath';

interface TodayTimelineProps {
  sessions: SleepSession[];
  onOpenManualEntry: () => void;
  onEditSession: (session: SleepSession) => void;
  onDeleteSession: (id: string) => void;
  targetNaps: number;
}

export const TodayTimeline: React.FC<TodayTimelineProps> = ({
  sessions,
  onOpenManualEntry,
  onEditSession,
  onDeleteSession,
  targetNaps,
}) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todaySessions = sessions.filter((s) => new Date(s.start_time) >= startOfDay);
  const napsToday = todaySessions.filter((s) => s.type === 'nap');

  let totalNapMinutes = 0;
  napsToday.forEach((s) => {
    const start = new Date(s.start_time).getTime();
    const end = s.end_time ? new Date(s.end_time).getTime() : now.getTime();
    totalNapMinutes += Math.max(0, Math.floor((end - start) / 60000));
  });

  return (
    <section className="mt-6">
      {/* Daily Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Siestas de hoy</span>
            <span className="text-sm">💤</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{napsToday.length}</span>
            <span className="text-xs text-slate-400 font-medium">de {targetNaps} sugeridas</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total en siestas</span>
            <span className="text-sm">⏱️</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-300">
              {formatDuration(totalNapMinutes)}
            </span>
            <span className="text-xs text-slate-400 font-medium">acumulado</span>
          </div>
        </div>
      </div>

      {/* Header and Manual Button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <span>Historial de hoy</span>
          <span className="text-xs font-normal text-slate-400">({todaySessions.length})</span>
        </h3>
        <button
          onClick={onOpenManualEntry}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-xl border border-indigo-500/20 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cargar siesta</span>
        </button>
      </div>

      {/* Session Cards */}
      {sessions.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800/60 p-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">Aún no hay siestas registradas</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Toca el botón "Liam se durmió" para registrar la primera siesta del día.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sessions.slice(0, 15).map((session, index) => {
            const start = new Date(session.start_time);
            const end = session.end_time ? new Date(session.end_time) : null;
            const durationMins = end
              ? Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000))
              : Math.max(0, Math.floor((now.getTime() - start.getTime()) / 60000));

            const isCurrent = !session.end_time;
            const dateLabel = formatDateLabel(session.start_time);

            return (
              <div
                key={session.id}
                className={`relative rounded-2xl p-3.5 border transition ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        session.type === 'night'
                          ? 'bg-violet-600/20 text-violet-300'
                          : 'bg-indigo-600/20 text-indigo-300'
                      }`}
                    >
                      {session.type === 'night' ? '🌙' : '💤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">
                          {session.type === 'night' ? 'Sueño Nocturno' : `Siesta`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({dateLabel})
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        {formatTime(session.start_time)} -{' '}
                        {isCurrent ? (
                          <span className="text-emerald-400 font-semibold animate-pulse">
                            durmiendo...
                          </span>
                        ) : (
                          formatTime(session.end_time)
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Duration badge */}
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-indigo-300 border border-slate-700/60 font-mono">
                        {formatDuration(durationMins)}
                      </span>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    📍 {session.location}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    🧸 {session.method}
                  </span>
                  {session.quality && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {session.quality === 'tranquilo' && '😊 Tranquilo'}
                      {session.quality === 'inquieto' && '🥱 Inquieto'}
                      {session.quality === 'corto' && '⚡ Corto'}
                      {session.quality === 'lloroso' && '😢 Lloroso'}
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-slate-400 font-medium">
                    por {session.logged_by}
                  </span>
                </div>

                {/* Notes */}
                {session.notes && (
                  <p className="mt-1.5 text-xs text-slate-400 italic bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/40">
                    "{session.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
