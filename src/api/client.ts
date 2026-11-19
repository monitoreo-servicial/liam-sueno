import type { BabySettings, SleepSession } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://136-248-119-83.sslip.io/liam/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (options.method && options.method !== 'GET') {
    headers.set('Prefer', 'return=representation');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status} on ${endpoint}:`, errorText);
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  async getSettings(): Promise<BabySettings> {
    const data = await request<BabySettings[]>('/baby_settings?limit=1');
    if (data && data.length > 0) {
      localStorage.setItem('liam_cached_settings', JSON.stringify(data[0]));
      return data[0];
    }
    throw new Error('Configuración no encontrada');
  },

  async updateSettings(updates: Partial<BabySettings>): Promise<BabySettings> {
    const data = await request<BabySettings[]>('/baby_settings?id=eq.liam_config', {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    });
    if (data && data[0]) {
      localStorage.setItem('liam_cached_settings', JSON.stringify(data[0]));
      return data[0];
    }
    throw new Error('No se pudo actualizar la configuración');
  },

  async getSessions(limit = 40): Promise<SleepSession[]> {
    const data = await request<SleepSession[]>(`/sleep_sessions?order=start_time.desc&limit=${limit}`);
    localStorage.setItem('liam_cached_sessions', JSON.stringify(data));
    return data;
  },

  async startSleep(payload: {
    type: 'nap' | 'night';
    start_time?: string;
    method?: string;
    location?: string;
    logged_by: string;
  }): Promise<SleepSession> {
    const sessionData = {
      type: payload.type,
      start_time: payload.start_time || new Date().toISOString(),
      end_time: null,
      method: payload.method || 'brazos',
      location: payload.location || 'cuna',
      quality: 'tranquilo',
      logged_by: payload.logged_by,
      notes: null,
    };

    const data = await request<SleepSession[]>('/sleep_sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });

    return data[0];
  },

  async endSleep(
    id: string,
    payload: {
      end_time?: string;
      quality?: string;
      notes?: string;
    }
  ): Promise<SleepSession> {
    const updates = {
      end_time: payload.end_time || new Date().toISOString(),
      ...(payload.quality ? { quality: payload.quality } : {}),
      ...(payload.notes ? { notes: payload.notes } : {}),
      updated_at: new Date().toISOString(),
    };

    const data = await request<SleepSession[]>(`/sleep_sessions?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return data[0];
  },

  async addManualSession(session: Partial<SleepSession>): Promise<SleepSession> {
    const data = await request<SleepSession[]>('/sleep_sessions', {
      method: 'POST',
      body: JSON.stringify({
        ...session,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
    return data[0];
  },

  async updateSession(id: string, updates: Partial<SleepSession>): Promise<SleepSession> {
    const data = await request<SleepSession[]>(`/sleep_sessions?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    });
    return data[0];
  },

  async deleteSession(id: string): Promise<void> {
    await request(`/sleep_sessions?id=eq.${id}`, {
      method: 'DELETE',
    });
  },
};
