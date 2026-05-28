import RegisterForm from '@/components/register/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="croupier-container">
      <div className="croupier-card">
        
        <div className="text-center mb-8">
          <h1 className="croupier-title">CROUPIER</h1>
          <p className="croupier-subtitle">Faça o do conhecimento a sua aposta?</p>
          <p className="croupier-subtitle">Não há truques nessa proposta...</p>
        </div>

        <RegisterForm />

      </div>
    </main>
  );
}