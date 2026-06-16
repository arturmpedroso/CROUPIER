'use client';

import { useState } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro ao tentar cadastrar.');
      }

      setStatus({ type: 'success', message: `Conta criada com sucesso para ${data.name}!` });
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Não foi possível conectar ao servidor.' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="croupier-game-table">
      {/* 6 Caçapas da Mesa*/}
      <div className="table-pocket pocket-top-left"></div>
      <div className="table-pocket pocket-top-right"></div>
      <div className="table-pocket pocket-middle-left"></div>
      <div className="table-pocket pocket-middle-right"></div>
      <div className="table-pocket pocket-bottom-left"></div>
      <div className="table-pocket pocket-bottom-right"></div>

      <h2 className="croupier-display-title">Criar conta</h2>
      <p>Faça do conhecimento a sua aposta!</p>
      <p>Não há truques nessa proposta...</p>

      <form onSubmit={handleSubmit} className="space-y-1">
        <div>
          <label className="croupier-field-label">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="croupier-table-input"
            placeholder="Fulano de Tal"
          />
        </div>

        <div>
          <label className="croupier-field-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="croupier-table-input"
            placeholder="fulano@email.com"
          />
        </div>

        <div>
          <label className="croupier-field-label">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="croupier-table-input"
            placeholder="E#xop_01"
          />
        </div>

        <div>
          <label className="croupier-field-label">Repetir senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="croupier-table-input"
            placeholder="E#xop_01"
          />
        </div>

        <button type="submit" disabled={loading} className="croupier-btn-submit">
          {loading ? 'Processando...' : 'Criar'}
        </button>

        {status.type && (
          <div className={`mt-4 p-3 rounded-xl text-sm border font-medium text-center ${
            status.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}