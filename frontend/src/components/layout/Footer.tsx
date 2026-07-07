export default function Footer() {
  return (
    <footer className="w-full bg-[#121312] text-[#E6FAFC] text-sm">
      
      {/* Linha de Destaque Vermelho Cassino vinda do seu style.css */}
      <div className="croupier-divider" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        
        {/* Identificação do Projeto */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-wider text-white">CROUPIER</h3>
          <div className="space-y-1 text-xs text-[#A9BBBD]">
            <p className="text-[#E6FAFC] text-base font-medium>">
              Disciplina: <span className="text-[#E6FAFC] text-base font-medium">Engenharia de Software</span>
            </p>
            <p className="text-[#E6FAFC] text-base font-medium>">
              Professor: <span className="text-[#E6FAFC] text-base font-medium">Igor Wiese</span>
            </p>
            <p>
              <a 
                href="https://github.com/igorwiese" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#97DB4F] hover:text-[#E6FAFC] transition-colors text-base font-medium"
              >
                GitHub do Professor
              </a>
            </p>
          </div>
        </div>

        {/* Links Externos e Logo Institucional */}
        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
          
          {/* Link para o Repositório do GitHub com hover no tom Verde Ficha do sistema */}
          <a 
            href="https://github.com/arturmpedroso/CROUPIER" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#A9BBBD] hover:text-[#97DB4F] transition-colors font-bold group"
          >
            <svg 
              className="w-10 h-10 fill-current text-[#A9BBBD] group-hover:text-[#97DB4F] transition-colors" 
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            Repositório do Projeto
          </a>

          {/* Logo da UTFPR em conformidade com o tema escuro da mesa */}
          <div className="h-40 sm:h-40 w-auto opacity-70 hover:opacity-100 transition-opacity flex items-center">
            <img 
              src="img/utfpr-logo.png" 
              alt="Logo UTFPR" 
              className="h-full object-contain filter brightness-0 invert" 
            />
          </div>

        </div>

      </div>
    </footer>
  );
}