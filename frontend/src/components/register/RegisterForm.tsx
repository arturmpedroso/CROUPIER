'use client';

import { useState } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro ao tentar cadastrar.');
      }

      setStatus({
        type: 'success',
        message: `Conta criada com sucesso para ${data.name}!`,
      });
      
      setName('');
      setEmail('');
      setPassword('');

    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Não foi possível conectar ao servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-emerald-400 text-white transition disabled:opacity-50"
          placeholder="Digite seu nome"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-emerald-400 text-white transition disabled:opacity-50"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-emerald-400 text-white transition disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl transition duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
      >
        {loading ? 'Cadastrando...' : 'Criar Conta'}
      </button>

      {status.type && (
        <div
          className={`mt-6 p-4 rounded-xl text-sm border font-medium text-center transition ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}