const DEFAULT_API_BASE_URL = 'https://brunofhorn-backend.vercel.app';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || DEFAULT_API_BASE_URL;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonRecord = Record<string, JsonValue>;

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: JsonRecord;
};

async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function healthCheck() {
  return request('/health');
}

export function login(payload: JsonRecord) {
  return request('/api/auth/login', { method: 'POST', body: payload });
}

export function logout(payload: JsonRecord = {}) {
  return request('/api/auth/logout', { method: 'POST', body: payload });
}

export function trackGoal(payload: JsonRecord) {
  return request('/api/track/goal', { method: 'POST', body: payload });
}

export function trackSession(payload: JsonRecord) {
  return request('/api/track/session', { method: 'POST', body: payload });
}

export function trackView(payload: JsonRecord) {
  return request('/api/track/view', { method: 'POST', body: payload });
}

export function trackPing(payload: JsonRecord) {
  return request('/api/track/ping', { method: 'POST', body: payload });
}

export function trackClick(payload: JsonRecord) {
  return request('/api/track/click', { method: 'POST', body: payload });
}

export function getStatsSummary() {
  return request('/api/stats/summary');
}
