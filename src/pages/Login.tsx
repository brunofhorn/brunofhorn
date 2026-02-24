import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrl, login } from '../lib/api';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await login({ email, password });
      localStorage.setItem('session:user', email);
      localStorage.setItem('session:loginResponse', JSON.stringify(response));
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao autenticar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-default border border-slate-800 bg-slate-900/80 p-6 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-xs text-slate-400 mt-1">Backend: {apiBaseUrl}</p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-default border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-default border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-default bg-primary px-4 py-2 font-semibold disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
