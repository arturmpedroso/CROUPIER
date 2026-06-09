import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="croupier-container">
      <div className="croupier-card text-center space-y-6">
        <div>
          <h1 className="croupier-title">CROUPIER</h1>
          <p className="croupier-subtitle">Gerencie e domine seus flashcards</p>
        </div>

        <div className="border-t border-slate-700/50 pt-6 space-y-3">
          <Link href="/login" className="croupier-btn block text-center">
            Entrar na Conta
          </Link>

          <p className="text-sm text-slate-400 mt-4">
            Novo por aqui?{' '}
            <Link href="/register" className="text-emerald-400 hover:underline font-medium">
              Crie sua conta agora
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}