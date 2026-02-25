import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, LogOut, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getReportBaseAccesses,
  getReportButtonClicks,
  getReportCities,
  getReportDevices,
  getReportDeviceTop,
  getReportPages,
  getReportSessionDuration,
  getReportTimeseries,
  getReportTopLinks,
  getReportTopSetupItems,
  logout,
} from '../../lib/api';

type Period = 'day' | 'week' | 'month' | 'year';

type RankedItem = {
  name: string;
  value: number;
};

type TimeseriesPoint = {
  label: string;
  sessions: number;
  clicks: number;
};

type DashboardData = {
  baseAccesses: number;
  buttonClicks: number;
  topDevice: string;
  topDeviceSessions: number;
  timeseries: TimeseriesPoint[];
  sessionDuration: TimeseriesPoint[];
  pages: RankedItem[];
  devices: RankedItem[];
  cities: RankedItem[];
  topLinks: RankedItem[];
  topSetupItems: RankedItem[];
};

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

const DEVICE_COLORS = ['#38bdf8', '#22c55e', '#f59e0b', '#a78bfa', '#f43f5e', '#14b8a6'];

function getStoredLoginResponse(): LoginResponse | null {
  const raw = localStorage.getItem('session:loginResponse');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<LoginResponse>;
    if (!parsed.token || !parsed.user?.email) return null;
    return parsed as LoginResponse;
  } catch {
    return null;
  }
}

function pickFirstNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'object') return 0;

  const obj = value as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    const candidate = obj[key];
    if (typeof candidate === 'number') return candidate;
  }

  return 0;
}

function extractRankedList(payload: unknown): RankedItem[] {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? ((payload as Record<string, unknown>).items ?? (payload as Record<string, unknown>).data)
      : [];

  if (!Array.isArray(source)) return [];

  return source
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const obj = entry as Record<string, unknown>;
      const name =
        (typeof obj.name === 'string' && obj.name) ||
        (typeof obj.city === 'string' && obj.city) ||
        (typeof obj.label === 'string' && obj.label) ||
        (typeof obj.url === 'string' && obj.url) ||
        (typeof obj.element_text === 'string' && obj.element_text) ||
        (typeof obj.device === 'string' && obj.device) ||
        'N/A';

      const value =
        (typeof obj.value === 'number' && obj.value) ||
        (typeof obj.count === 'number' && obj.count) ||
        (typeof obj.clicks === 'number' && obj.clicks) ||
        (typeof obj.sessions === 'number' && obj.sessions) ||
        0;

      return { name, value };
    })
    .filter((entry): entry is RankedItem => Boolean(entry));
}

function extractTimeseries(payload: unknown): TimeseriesPoint[] {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? ((payload as Record<string, unknown>).items ??
          (payload as Record<string, unknown>).data ??
          (payload as Record<string, unknown>).series)
      : [];

  if (!Array.isArray(source)) return [];

  return source.map((entry, index) => {
    const obj = (entry ?? {}) as Record<string, unknown>;

    const label =
      (typeof obj.date === 'string' && obj.date) ||
      (typeof obj.day === 'string' && obj.day) ||
      (typeof obj.label === 'string' && obj.label) ||
      (typeof obj.timestamp === 'string' && obj.timestamp) ||
      String(index + 1);

    const sessions =
      (typeof obj.sessions === 'number' && obj.sessions) ||
      (typeof obj.accesses === 'number' && obj.accesses) ||
      (typeof obj.views === 'number' && obj.views) ||
      (typeof obj.duration === 'number' && obj.duration) ||
      (typeof obj.avgDuration === 'number' && obj.avgDuration) ||
      0;

    const clicks =
      (typeof obj.clicks === 'number' && obj.clicks) ||
      (typeof obj.buttonClicks === 'number' && obj.buttonClicks) ||
      0;

    return { label, sessions, clicks };
  });
}

function NumberCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
      <p className="text-xs uppercase tracking-widest text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function HorizontalBars({ title, items, color, valueLabel }: { title: string; items: RankedItem[]; color: string; valueLabel: string }) {
  const chartData = items.slice(0, 10);

  return (
    <div className="rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <div className="mt-4 h-[320px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sem dados no período.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                width={140}
                tickFormatter={(value: string) => (value.length > 24 ? `${value.slice(0, 24)}...` : value)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Bar dataKey="value" name={valueLabel} fill={color} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function CompareBaseVsClicksChart({ baseAccesses, buttonClicks }: { baseAccesses: number; buttonClicks: number }) {
  const chartData = [
    { name: 'Acessos base', value: baseAccesses },
    { name: 'Cliques', value: buttonClicks },
  ];
  const ctr = baseAccesses > 0 ? (buttonClicks / baseAccesses) * 100 : 0;

  return (
    <div className="rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
      <h3 className="text-sm font-semibold text-slate-200">Comparativo: Acessos base vs Cliques</h3>
      <p className="mt-1 text-xs text-slate-400">Taxa de clique (CTR): {ctr.toFixed(2)}%</p>
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              <Cell fill="#60a5fa" />
              <Cell fill="#22c55e" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SessionDurationChart({ series }: { series: TimeseriesPoint[] }) {
  return (
    <div className="rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
      <h3 className="text-sm font-semibold text-slate-200">Duração média de sessão</h3>
      <div className="mt-4 h-[280px] w-full">
        {series.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sem dados no período.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              <Line type="monotone" dataKey="sessions" name="Segundos" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function TopPagesChart({ items }: { items: RankedItem[] }) {
  const chartData = items.slice(0, 10);
  return (
    <div className="rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
      <h3 className="text-sm font-semibold text-slate-200">Top páginas (barras)</h3>
      <div className="mt-4 h-[320px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sem dados no período.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                width={140}
                tickFormatter={(value: string) => (value.length > 24 ? `${value.slice(0, 24)}...` : value)}
              />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="value" name="Acessos" fill="#fb7185" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function DevicesDonutChart({ items }: { items: RankedItem[] }) {
  const chartData = items.slice(0, 6);

  return (
    <div className="rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
      <h3 className="text-sm font-semibold text-slate-200">Dispositivos (donut)</h3>
      <div className="mt-4 h-[320px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sem dados no período.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={3}>
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#cbd5e1' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {chartData.map((entry, index) => (
          <span key={`${entry.name}-legend-${index}`} className="inline-flex items-center gap-1 rounded-default bg-slate-900/60 px-2 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length] }} />
            {entry.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const [period, setPeriod] = useState<Period>('day');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  const auth = useMemo(() => getStoredLoginResponse(), []);

  useEffect(() => {
    if (!auth?.token) {
      localStorage.removeItem('session:loginResponse');
      localStorage.removeItem('session:user');
      navigate('/login', { replace: true });
      return;
    }

    async function fetchReports() {
      setLoading(true);
      setError('');

      try {
        const query = { period, limit: 20, path: '/' } as const;

        const [baseRes, clicksRes, deviceTopRes, timeseriesRes, sessionDurationRes, citiesRes, linksRes, setupRes, devicesRes, pagesRes] = await Promise.all([
          getReportBaseAccesses(query, auth.token),
          getReportButtonClicks(query, auth.token),
          getReportDeviceTop(query, auth.token),
          getReportTimeseries(query, auth.token),
          getReportSessionDuration(query, auth.token),
          getReportCities(query, auth.token),
          getReportTopLinks(query, auth.token),
          getReportTopSetupItems(query, auth.token),
          getReportDevices(query, auth.token),
          getReportPages(query, auth.token),
        ]);

        const topObj =
          deviceTopRes && typeof deviceTopRes === 'object' && 'top' in (deviceTopRes as Record<string, unknown>)
            ? (deviceTopRes as { top?: Record<string, unknown> }).top
            : undefined;

        const topDevice =
          (topObj && typeof topObj.device === 'string' && topObj.device) ||
          (topObj && typeof topObj.name === 'string' && topObj.name) ||
          'N/A';

        const topDeviceSessions =
          (topObj && typeof topObj.sessions === 'number' && topObj.sessions) ||
          (topObj && typeof topObj.value === 'number' && topObj.value) ||
          0;

        setData({
          baseAccesses: pickFirstNumber(baseRes),
          buttonClicks: pickFirstNumber(clicksRes),
          topDevice,
          topDeviceSessions,
          timeseries: extractTimeseries(timeseriesRes),
          sessionDuration: extractTimeseries(sessionDurationRes),
          pages: extractRankedList(pagesRes),
          devices: extractRankedList(devicesRes),
          cities: extractRankedList(citiesRes),
          topLinks: extractRankedList(linksRes),
          topSetupItems: extractRankedList(setupRes),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (message.toLowerCase().includes('unauthorized') || message.includes('401')) {
          localStorage.removeItem('session:loginResponse');
          localStorage.removeItem('session:user');
          navigate('/login', { replace: true });
          return;
        }

        setError('Não foi possível carregar os relatórios do dashboard.');
      } finally {
        setLoading(false);
      }
    }

    void fetchReports();
  }, [auth?.token, navigate, period, refreshKey]);

  const handleLogout = () => {
    void logout(auth?.token).finally(() => {
      localStorage.removeItem('session:loginResponse');
      localStorage.removeItem('session:user');
      navigate('/login', { replace: true });
    });
  };

  return (
    <div className="min-h-screen bg-[#161022] p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-default p-2 hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-xs text-slate-400">Relatórios por período</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="rounded-default border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="day">Hoje</option>
              <option value="week">Semana</option>
              <option value="month">Mês</option>
              <option value="year">Ano</option>
            </select>

            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              className="rounded-default border border-slate-700 bg-slate-900 p-2"
              title="Atualizar"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={handleLogout}
              className="rounded-default bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="rounded-default border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <NumberCard title="Acessos na URL base" value={data.baseAccesses} />
              <NumberCard title="Cliques em botões" value={data.buttonClicks} />
              <NumberCard title="Dispositivo mais acessado" value={`${data.topDevice} (${data.topDeviceSessions})`} />
            </div>

            <div className="mt-5 rounded-default border border-slate-700/50 bg-slate-800/50 p-5">
              <h3 className="text-sm font-semibold text-slate-200">Linha temporal de tráfego e cliques</h3>
              <div className="mt-4 h-[320px] w-full">
                {data.timeseries.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Sem dados para o período selecionado.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeseries}>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                        labelStyle={{ color: '#cbd5e1' }}
                      />
                      <Line type="monotone" dataKey="sessions" name="Tráfego" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="clicks" name="Cliques" stroke="#22c55e" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <HorizontalBars title="Top cidades (barras)" items={data.cities} color="#34d399" valueLabel="Acessos" />
              <DevicesDonutChart items={data.devices} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <HorizontalBars title="Top links (barras)" items={data.topLinks} color="#38bdf8" valueLabel="Cliques" />
              <HorizontalBars title="Top itens do setup (barras)" items={data.topSetupItems} color="#a78bfa" valueLabel="Cliques" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TopPagesChart items={data.pages} />
              <SessionDurationChart series={data.sessionDuration} />
            </div>

            <div className="mt-5">
              <CompareBaseVsClicksChart baseAccesses={data.baseAccesses} buttonClicks={data.buttonClicks} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
