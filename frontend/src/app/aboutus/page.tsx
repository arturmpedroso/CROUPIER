import React from 'react';

// Certifique-se de que o caminho do seu style.css esteja correto
// O local ideal é no layout.tsx ou importado aqui:
// import './style.css'; 

export default function AboutUs() {
  // Array com os dados dos quatro integrantes principais da banca
  const team = [
    {
      name: "Artur Myskiw Pedroso",
      img: "img/artur.jpg",
      github: "https://github.com/arturMyskiw", // <- Link de exemplo, substitua pelo real
    },
    {
      name: "Pedro Gabriel Figueiroa de Souza",
      img: "img/pedro.jpg",
      github: "https://github.com/pedroFigueiroa",
    },
    {
      name: "Diogo Kovalek de Almeida",
      img: "img/diogo.jpg",
      github: "https://github.com/diogoKovalek",
    },
    {
      name: "Eduardo Marques Carvalho",
      img: "img/eduardo.jpg",
      github: "https://github.com/eduardoMarques",
    }
  ];

  return (
    // 'croupier-body' define o fundo escuro e configurações base do seu CSS
    <main className="croupier-body min-h-screen flex flex-col justify-center items-center py-16 px-6">
      
      <section id="equipe" className="w-full max-w-6xl mx-auto flex flex-col items-center flex-1 justify-center">
        
        {/* Título da seção centralizado com a linha vermelha */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider uppercase mb-1">
            Os donos das cartas:
          </h2>
          <div className="croupier-divider w-full max-w-[300px]" />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-20 gap-x-16 lg:gap-x-48 justify-items-center w-full px-4 items-start">
          {team.map((member, index) => (

            <div key={index} className="team-member group flex flex-col items-center">
              
              <div className="chip-visual relative">

                <img 
                  src={member.img} 
                  alt={`Foto de ${member.name}`} 
                  className="object-cover w-[90%] h-[90%] rounded-full border border-black block"
                />
                
               
                <div className="absolute inset-[10%] bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
            
              <div className="mt-5 flex flex-col items-center">
           
                <h3 className="text-center font-bold tracking-wide text-white text-lg whitespace-nowrap mb-1">
                  {member.name}
                </h3>

                <p className="text-center text-sm flex justify-center">
                  <a 
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:brightness-110 transition-all inline-flex items-center gap-2 justify-center font-bold"
                  >

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
              
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}