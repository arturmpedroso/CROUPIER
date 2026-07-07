import React from 'react';

export default function AboutUs() {
  const team = [
    {
      name: "Artur Myskiw Pedroso",
      img: "img/artur.jpg",
      github: "https://github.com/seu-usuario-artur",
    },
    {
      name: "Pedro Gabriel Figueiroa de Souza",
      img: "img/pedro.jpg",
      github: "https://github.com/seu-usuario-pedro",
    },
    {
      name: "Diogo kovalek de Almeida",
      img: "img/diogo.jpg",
      github: "https://github.com/seu-usuario-diogo",
    },
    {
      name: "Eduardo Marques Carvalho",
      img: "img/eduardo.jpg",
      github: "https://github.com/seu-usuario-eduardo",
    }
  ];

  return (
    <main className="croupier-body min-h-screen flex flex-col justify-center items-center py-16 px-6">
      
      <section id="equipe" className="w-full max-w-6xl mx-auto flex flex-col items-center flex-1 justify-center">
        
        {/* Título da seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-wider border-b-4 border-[#A21C0A] pb-4 text-center w-full max-w-md uppercase whitespace-nowrap">
          Os donos das cartas:
        </h2>

        {/* Grid 2x2 com espaçamento seguro para os nomes planos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-20 gap-x-16 lg:gap-x-48 justify-items-center w-full px-4">
          {team.map((member, index) => (
            <div key={index} className="team-member">
              
              {/* O componente visual da ficha de Poker */}
              <div className="chip-visual">
                <img 
                  src={member.img} 
                  alt={`Foto de ${member.name}`} 
                  className="object-cover w-90 h-90"
                />
              </div>
              
              {/* Nome do integrante (Sem quebras de linha) */}
              <h3 className="text-center font-bold tracking-wide text-white whitespace-nowrap">
                {member.name}
              </h3>

              {/* Link com o Símbolo do GitHub integrado */}
              <p className="text-center mt-2 text-sm flex justify-center">
                <a 
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:brightness-110 transition-all inline-flex items-center gap-2 justify-center"
                >
                  {/* Ícone SVG do GitHub */}
                  <svg 
                    className="w-4 h-4 fill-current transition-colors" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </a>
              </p>
              
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}