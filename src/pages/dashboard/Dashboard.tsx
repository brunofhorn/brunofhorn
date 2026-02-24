import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { ArrowLeft, MousePointer2, Clock, Users, Activity, LogOut, Smartphone, Monitor, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getStatsSummary, logout } from '../../lib/api';

interface Stats {
  totalSessions: number;
  totalClicks: number;
  avgDuration: number;
  activeUsers: number;
  dailyStats: { date: string; sessions: number }[];
  topClicks: { element_text: string; count: number }[];
  deviceStats: { name: string; value: number }[];
  browserStats: { name: string; value: number }[];
  recentClicks: { x: number; y: number }[];
  goalStats: { name: string; value: number }[];
  referrerStats: { name: string; value: number }[];
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

const COLORS = ['#204095', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

function getStoredLoginResponse(): LoginResponse | null {
  const raw = localStorage.getItem('session:loginResponse');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<LoginResponse>;
    if (!parsed.token || !parsed.user?.email) {
      return null;
    }
    return parsed as LoginResponse;
  } catch {
    return null;
  }
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loginResponse = getStoredLoginResponse();
    if (!loginResponse?.token) {
      localStorage.removeItem('session:loginResponse');
      localStorage.removeItem('session:user');
      setLoading(false);
      navigate('/login', { replace: true });
      return;
    }

    const { token } = loginResponse;

    const fetchStats = async () => {
      try {
        const data = await getStatsSummary(token);
        setStats(data as Stats);
        setError('');
        setLoading(false);
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : '';

        if (message.toLowerCase().includes('unauthorized') || message.includes('401')) {
          localStorage.removeItem('session:loginResponse');
          localStorage.removeItem('session:user');
          navigate('/login', { replace: true });
          return;
        }

        setError('Não foi possível carregar os dados do dashboard.');
        setLoading(false);
      }
    };

    void fetchStats();
    const interval = setInterval(() => {
      void fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    const token = getStoredLoginResponse()?.token;
    void logout(token).finally(() => {
      localStorage.removeItem('session:loginResponse');
      localStorage.removeItem('session:user');
      navigate('/login', { replace: true });
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[#161022] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161022] flex items-center justify-center text-slate-100 p-6">
        <div className="max-w-md w-full rounded-default border border-red-400/30 bg-red-500/10 p-5">
          <h2 className="text-base font-semibold">Erro ao carregar dashboard</h2>
          <p className="text-sm text-slate-300 mt-2">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-default bg-primary px-4 py-2 text-sm font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#161022] text-slate-100 font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-medium">{stats.activeUsers} Active Users (last 5m)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 hidden sm:block">
              Auto-refreshing
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Total Sessions</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalSessions}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Total Clicks</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalClicks}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Avg. Duration</span>
            </div>
            <p className="text-3xl font-bold">{stats.avgDuration}s</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Clicks/Session</span>
            </div>
            <p className="text-3xl font-bold">
              {stats.totalSessions ? (stats.totalClicks / stats.totalSessions).toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Chart */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">Traffic (Last 7 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Clicks Chart */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">Top Clicked Elements</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topClicks} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="element_text" type="category" width={150} stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#204095" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Device Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold">Device Type</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.deviceStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.deviceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm text-slate-400">
              {stats.deviceStats.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name || 'Unknown'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Browser Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold">Browser</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.browserStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.browserStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              {stats.browserStats.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name || 'Unknown'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Click Heatmap (Scatter) */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <MousePointer2 className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold">Click Distribution</h3>
            </div>
            <div className="h-[250px] w-full bg-slate-900/50 rounded-xl border border-slate-700/30 relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="x" hide domain={[0, 'dataMax']} />
                  <YAxis type="number" dataKey="y" hide domain={[0, 'dataMax']} reversed />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="bg-slate-800 p-2 rounded border border-slate-700 text-xs text-white">
                            x: {payload[0].value}, y: {payload[1].value}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Clicks" data={stats.recentClicks} fill="#ef4444" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">
                Screen Space Visualization
              </div>
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold">Top Referrers</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.referrerStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Goals */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold">Conversion Goals</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.goalStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
