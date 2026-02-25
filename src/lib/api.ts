const DEFAULT_API_BASE_URL = 'https://brunofhorn-backend.onrender.com';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || DEFAULT_API_BASE_URL;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonRecord = Record<string, JsonValue>;

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: JsonRecord;
  token?: string;
};

async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export function logout(token?: string, payload: JsonRecord = {}) {
  return request('/api/auth/logout', { method: 'POST', body: payload, token });
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

export function getStatsSummary(token?: string) {
  return request('/api/stats/summary', { token });
}

type ReportPeriod = 'day' | 'week' | 'month' | 'year' | 'custom';

type ReportQuery = {
  period?: ReportPeriod;
  from?: string;
  to?: string;
  limit?: number;
  path?: string;
  metric?: string;
};

function buildQuery(query: ReportQuery = {}) {
  const params = new URLSearchParams();
  if (query.period) params.set('period', query.period);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (typeof query.limit === 'number') params.set('limit', String(query.limit));
  if (query.path) params.set('path', query.path);
  if (query.metric) params.set('metric', query.metric);
  const str = params.toString();
  return str ? `?${str}` : '';
}

export function getReportBaseAccesses(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/base-accesses${buildQuery(query)}`, { token });
}

export function getReportButtonClicks(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/button-clicks${buildQuery(query)}`, { token });
}

export function getReportDeviceTop(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/device-top${buildQuery(query)}`, { token });
}

export function getReportCities(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/cities${buildQuery(query)}`, { token });
}

export function getReportTopLinks(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/top-links${buildQuery(query)}`, { token });
}

export function getReportTopSetupItems(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/top-setup-items${buildQuery(query)}`, { token });
}

export function getReportTimeseries(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/timeseries${buildQuery(query)}`, { token });
}

export function getReportDevices(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/devices${buildQuery(query)}`, { token });
}

export function getReportPages(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/pages${buildQuery(query)}`, { token });
}

export function getReportSessionDuration(query: ReportQuery = {}, token?: string) {
  return request(`/api/reports/session-duration${buildQuery(query)}`, { token });
}
