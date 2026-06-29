'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'E-mail ou senha incorretos.');
      }

      // guardame os dados do usuário no LocalStorage.
      localStorage.setItem('@croupier:token', data.backend_token);
      localStorage.setItem('@croupier:user', JSON.stringify(data.user));

      router.push(`/${data.user.username}`);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 bg-[#232621]">
      <div className="croupier-game-table">
        <div className="table-pocket pocket-top-left"></div>
        <div className="table-pocket pocket-top-right"></div>
        <div className="table-pocket pocket-middle-left"></div>
        <div className="table-pocket pocket-middle-right"></div>
        <div className="table-pocket pocket-bottom-left"></div>
        <div className="table-pocket pocket-bottom-right"></div>

        <h2 className="croupier-display-title">Entrar no Jogo</h2>

        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="croupier-field-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="croupier-table-input"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="croupier-field-label">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="croupier-table-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="croupier-btn-submit">
            {loading ? 'Verificando as cartas...' : 'Pedir Carta (Entrar)'}
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-xl text-sm border font-medium text-center bg-rose-500/20 border-rose-500/40 text-rose-300">
              {error}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}