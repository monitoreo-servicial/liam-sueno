import type { BabySettings, SleepSession, WakeWindowState } from '../types';

export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function formatTime(isoString: string | null | undefined): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDateLabel(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  }
}

export function calculateBabyAge(birthDateString: string): string {
  const birth = new Date(birthDateString);
  const now = new Date();
  
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  let days = now.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  
  if (months === 0) return `${days} días`;
  if (days === 0) return `${months} meses`;
  return `${months} meses y ${days} días`;
}

export function computeWakeWindowState(
  sessions: SleepSession[],
  settings: BabySettings | null
): WakeWindowState {
  const now = new Date();
  const minWake = settings?.wake_window_min_minutes || 90;
  const maxWake = settings?.wake_window_max_minutes || 120;

  // Find any active session (end_time is null)
  const activeSession = sessions.find((s) => !s.end_time) || null;

  if (activeSession) {
    // Currently asleep
    const start = new Date(activeSession.start_time);
    const diffMins = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60)));

    return {
      isAwake: false,
      minutesElapsed: diffMins,
      formattedElapsed: formatDuration(diffMins),
      progressPercent: Math.min(100, Math.round((diffMins / 90) * 100)),
      statusLevel: 'fresh',
      statusText: activeSession.type === 'night' ? 'Durmiendo sueño nocturno 🌙' : 'Durmiendo siesta 💤',
      statusColor: 'green',
      nextNapTime: null,
      currentSession: activeSession,
      lastCompletedSession: sessions.find((s) => s.id !== activeSession.id && s.end_time) || null,
    };
  }

  // Liam is awake
  // Find the last completed sleep session
  const lastSleep = sessions.find((s) => s.end_time) || null;

  if (!lastSleep || !lastSleep.end_time) {
    // No previous sleep recorded
    return {
      isAwake: true,
      minutesElapsed: 0,
      formattedElapsed: '0m',
      progressPercent: 0,
      statusLevel: 'fresh',
      statusText: 'Liam está despierto',
      statusColor: 'green',
      nextNapTime: new Date(now.getTime() + minWake * 60000),
      currentSession: null,
      lastCompletedSession: null,
    };
  }

  const awakeSince = new Date(lastSleep.end_time);
  const diffMins = Math.max(0, Math.floor((now.getTime() - awakeSince.getTime()) / (1000 * 60)));

  // Target next nap: exactly minWake to maxWake after waking up
  const nextNapTarget = new Date(awakeSince.getTime() + minWake * 60000);

  // Status calculation
  let statusLevel: 'fresh' | 'sweet_spot' | 'tired' | 'overtired' = 'fresh';
  let statusText = 'Liam está tranquilo y descansado';
  let statusColor: 'green' | 'yellow' | 'amber' | 'red' = 'green';

  const sweetSpotStart = Math.max(60, minWake - 20); // e.g. 70 min
  const sweetSpotEnd = minWake; // e.g. 90 min

  if (diffMins < sweetSpotStart) {
    statusLevel = 'fresh';
    statusText = 'Jugando y activo. Todo en orden.';
    statusColor = 'green';
  } else if (diffMins >= sweetSpotStart && diffMins < sweetSpotEnd) {
    statusLevel = 'sweet_spot';
    statusText = 'Ventana óptima: momento de bajar luces y empezar rutina de sueño.';
    statusColor = 'yellow';
  } else if (diffMins >= sweetSpotEnd && diffMins <= maxWake) {
    statusLevel = 'tired';
    statusText = 'Hora de dormir. Atentos a señales de sueño (bostezos, mirada fija).';
    statusColor = 'amber';
  } else {
    statusLevel = 'overtired';
    statusText = 'Alerta: Ventana al límite. Riesgo de sobrecansancio y llanto.';
    statusColor = 'red';
  }

  const progress = Math.min(100, Math.round((diffMins / maxWake) * 100));

  return {
    isAwake: true,
    minutesElapsed: diffMins,
    formattedElapsed: formatDuration(diffMins),
    progressPercent: progress,
    statusLevel,
    statusText,
    statusColor,
    nextNapTime: nextNapTarget,
    currentSession: null,
    lastCompletedSession: lastSleep,
  };
}

export function getTodayStats(sessions: SleepSession[]) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todaySessions = sessions.filter((s) => {
    const sDate = new Date(s.start_time);
    return sDate >= startOfDay;
  });

  const naps = todaySessions.filter((s) => s.type === 'nap');
  
  let totalNapMinutes = 0;
  naps.forEach((s) => {
    const start = new Date(s.start_time).getTime();
    const end = s.end_time ? new Date(s.end_time).getTime() : now.getTime();
    const mins = Math.max(0, Math.floor((end - start) / (1000 * 60)));
    totalNapMinutes += mins;
  });

  return {
    napCount: naps.length,
    totalNapMinutes,
    formattedTotalNap: formatDuration(totalNapMinutes),
    todaySessions,
  };
}
