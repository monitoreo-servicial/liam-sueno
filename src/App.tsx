import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WakeWindowHero } from './components/WakeWindowHero';
import { TodayTimeline } from './components/TodayTimeline';
import { StartSleepModal } from './components/StartSleepModal';
import { EndSleepModal } from './components/EndSleepModal';
import { ManualEntryModal } from './components/ManualEntryModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallPromptModal } from './components/InstallPromptModal';
import { api } from './api/client';
import type { SleepSession, BabySettings, Caregiver, SleepType, SleepMethod, SleepLocation, SleepQuality } from './types';
import { computeWakeWindowState, calculateBabyAge } from './utils/sleepMath';
import { Download, Sparkles } from 'lucide-react';

export function App() {
  const [sessions, setSessions] = useState<SleepSession[]>(() => {
    try {
      const cached = localStorage.getItem('liam_cached_sessions');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<BabySettings | null>(() => {
    try {
      const cached = localStorage.getItem('liam_cached_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [caregiver, setCaregiver] = useState<Caregiver>(() => {
    return (localStorage.getItem('liam_caregiver') as Caregiver) || 'Papá';
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  // Standalone detection (PWA installed vs browser tab)
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  });

  // Modals
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Caregiver persistence
  const handleCaregiverChange = (c: Caregiver) => {
    setCaregiver(c);
    localStorage.setItem('liam_caregiver', c);
  };

  // Sync Data
  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsSyncing(true);
    try {
      const [fetchedSettings, fetchedSessions] = await Promise.all([
        api.getSettings(),
        api.getSessions(50),
      ]);
      setSettings(fetchedSettings);
      setSessions(fetchedSessions);
    } catch (err) {
      console.error('Error fetching Liam sleep data:', err);
    } finally {
      if (showLoading) setIsSyncing(false);
    }
  }, []);

  // Initial load and periodic interval
  useEffect(() => {
    fetchData(true);

    // Live clock ticker every 15s for exact wake window calculations
    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 15000);

    // Polling sync every 12s so both mom and dad see updates live
    const pollInterval = setInterval(() => {
      fetchData(false);
    }, 12000);

    // Sync on page focus
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData(false);
        setNow(new Date());
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [fetchData]);

  // Calculations
  const wakeState = computeWakeWindowState(sessions, settings);
  const babyAge = settings?.birth_date ? calculateBabyAge(settings.birth_date) : '4 meses';

  // Handlers
  const handleConfirmStartSleep = async (payload: {
    type: SleepType;
    startTime: string;
    method: SleepMethod;
    location: SleepLocation;
  }) => {
    setIsSyncing(true);
    try {
      const newSession = await api.startSleep({
        type: payload.type,
        start_time: payload.startTime,
        method: payload.method,
        location: payload.location,
        logged_by: caregiver,
      });
      setSessions((prev) => [newSession, ...prev.filter((s) => s.id !== newSession.id)]);
    } catch (err) {
      console.error(err);
      alert('Error al registrar inicio de siesta');
    } finally {
      setIsSyncing(false);
      fetchData(false);
    }
  };

  const handleConfirmEndSleep = async (payload: {
    endTime: string;
    quality: SleepQuality;
    notes?: string;
  }) => {
    if (!wakeState.currentSession) return;
    setIsSyncing(true);
    try {
      const updated = await api.endSleep(wakeState.currentSession.id, {
        end_time: payload.endTime,
        quality: payload.quality,
        notes: payload.notes,
      });
      setSessions((prev) => [updated, ...prev.filter((s) => s.id !== updated.id)]);
    } catch (err) {
      console.error(err);
      alert('Error al registrar despertar');
    } finally {
      setIsSyncing(false);
      fetchData(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
    setIsSyncing(true);
    try {
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar registro');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveManual = async (session: Partial<SleepSession>) => {
    setIsSyncing(true);
    try {
      const added = await api.addManualSession(session);
      setSessions((prev) => [added, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Error guardando siesta');
    } finally {
      setIsSyncing(false);
      fetchData(false);
    }
  };

  const handleSaveSettings = async (updated: Partial<BabySettings>) => {
    const saved = await api.updateSettings(updated);
    setSettings(saved);
  };

  return (
    <div className="min-h-screen bg-night-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header & Caregiver toggle */}
      <Header
        caregiver={caregiver}
        onCaregiverChange={handleCaregiverChange}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        isStandalone={isStandalone}
        isSyncing={isSyncing}
        onSync={() => fetchData(true)}
        babyAge={babyAge}
        babyName={settings?.baby_name || 'Liam'}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 pb-20">
        {/* Banner for quick install on iPhone/Android */}
        {!isStandalone && (
          <div className="mb-4 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg shadow-indigo-950/30">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📲</span>
              <div>
                <p className="text-xs font-bold text-white">¿Querés tenerla como App?</p>
                <p className="text-[11px] text-slate-400">Instálala en tu iPhone o Android</p>
              </div>
            </div>
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 whitespace-nowrap flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          </div>
        )}

        {/* Wake Window Status & 1-Tap Sleep/Wake Hero Card */}
        <WakeWindowHero
          state={wakeState}
          settings={settings}
          onStartSleepClick={() => setIsStartModalOpen(true)}
          onEndSleepClick={() => setIsEndModalOpen(true)}
        />

        {/* Today's Timeline & Stats */}
        <TodayTimeline
          sessions={sessions}
          onOpenManualEntry={() => setIsManualModalOpen(true)}
          onEditSession={() => {}}
          onDeleteSession={handleDeleteSession}
          targetNaps={settings?.target_naps || 4}
        />
      </main>

      {/* Modals */}
      <StartSleepModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onConfirm={handleConfirmStartSleep}
      />

      <EndSleepModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={handleConfirmEndSleep}
      />

      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleSaveManual}
        defaultCaregiver={caregiver}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}

export default App;
