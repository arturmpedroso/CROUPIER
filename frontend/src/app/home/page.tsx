import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="w-full flex flex-col items-center py-16 px-6">
      <div className="max-w-5xl w-full flex flex-col gap-20">
        <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 flex flex-col items-start gap-6">
            <h1 className="croupier-display-title !text-left !mb-0 md:text-5xl lg:text-6xl">
              Teste seu aprendizado
            </h1>
            
            <p className="croupier-text max-w-md leading-relaxed">
              Crie flashcards, organize seu baralho junto com colegas do grupo. 
              Revise conteúdos, acompanhe seu desempenho e estude com eficiência!
            </p>
            
            <Link href = "/register" className="bg-[#E6FAFC] text-[#1c1e1a] font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors mt-2">
              Cadastrar-se
            </Link>
          </div>

          <div className="flex-1 flex justify-center md:justify-end w-full">
            <img 
              src="/img/wiese-card.png" 
              className="w-full max-w-[400px] object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-300"
            />
          </div>
          
        </section>

        <section className="flex flex-col gap-10 mt-8 md:mt-0">
          
          <div className="flex flex-col gap-1">
            <h2 className="croupier-subtitle">
              Crie seus baralhos
            </h2>
            <p className="croupier-text">
              Organize flashcards por matéria, tema ou dificuldade.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="croupier-subtitle">
              Estude em grupo
            </h2>
            <p className="croupier-text">
              Compartilhe baralhos e colabore com outros usuários.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="croupier-subtitle">
              Aprendizado eficiente
            </h2>
            <p className="croupier-text">
              Revise perguntas e respostas em um modo de estudo simples e rápido.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="croupier-subtitle">
              Acompanhe seu desempenho
            </h2>
            <p className="croupier-text">
              Veja seus acertos, erros e evolução ao longo do tempo.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}