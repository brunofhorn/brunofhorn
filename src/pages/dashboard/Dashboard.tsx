import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiBaseUrl, getStatsSummary, logout } from '../../lib/api';

export function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const user = localStorage.getItem('session:user');

  useEffect(() => {
    let isMounted = true;

    async function fetchSummary() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getStatsSummary();
        if (isMounted) {
          setSummary(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Erro ao buscar resumo.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout({ email: user ?? 'anonymous' });
    } catch {
      // Intentionally ignore API failures to avoid trapping the user in this page.
    } finally {
      localStorage.removeItem('session:user');
      localStorage.removeItem('session:loginResponse');
      setIsLoggingOut(false);
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <main className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Usuário: {user ?? 'não identificado'} | Backend: {apiBaseUrl}
            </p>
          </div>
          <div className="flex gap-3">
            <Link className="px-3 py-2 rounded-default border border-slate-700" to="/">
              Voltar para home
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-3 py-2 rounded-default bg-primary font-semibold disabled:opacity-60"
            >
              {isLoggingOut ? 'Saindo...' : 'Logout'}
            </button>
          </div>
        </header>

        <section className="rounded-default border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="font-semibold mb-3">Resumo de stats (`GET /api/stats/summary`)</h2>
          {isLoading ? <p>Carregando...</p> : null}
          {error ? <p className="text-red-400">{error}</p> : null}
          {!isLoading && !error ? (
            <pre className="text-xs overflow-auto bg-slate-950 p-3 rounded-default border border-slate-800">
              {JSON.stringify(summary, null, 2)}
            </pre>
          ) : null}
        </section>
      </main>
    </div>
  );
}
