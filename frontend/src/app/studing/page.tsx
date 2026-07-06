import React from 'react';

// Certifique-se de importar o seu arquivo de CSS aqui, se necessário
// import './seu-arquivo-de-estilos.css'; 

export default function MesaDeEstudos() {
  return (
    // Fundo da página
    <div className="min-h-screen bg-[#35362f] flex items-center justify-center p-4 sm:p-8">
      
      {/* Container Principal usando a sua classe CSS */}
      <div className="croupier-game-table croupier-game-table-landscape flex flex-col">
        
        {/* As 6 Caçapas chamando as suas classes */}
        <div className="table-pocket pocket-top-left" />
        <div className="table-pocket pocket-top-right" />
        <div className="table-pocket pocket-bottom-left" />
        <div className="table-pocket pocket-bottom-right" />
        <div className="table-pocket pocket-middle-up" />
        <div className="table-pocket pocket-middle-down" />

        {/* --- CABEÇALHO --- */}
        <div className="flex justify-between items-start w-full z-10 mb-4">
          <h1 className="text-white text-lg sm:text-xl font-bold tracking-wide drop-shadow-md">
            Álgebra linear pt1
          </h1>

          <div className="flex items-center gap-2 bg-[#693131] rounded-full pl-3 pr-1 py-1 border border-[#522424] shadow-lg cursor-pointer hover:bg-[#7a3939] transition-colors">
            <span className="text-white text-xs sm:text-sm font-medium">Sair do estudo</span>
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-inner">
              <span className="text-gray-800 font-black text-sm leading-none">X</span>
            </div>
          </div>
        </div>

        {/* --- TÍTULO CENTRAL --- */}
        <div className="w-full flex flex-col items-center text-center z-10 mb-8">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold drop-shadow-lg tracking-wide">
            Responda:
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-1 font-medium drop-shadow-md">
            Qual a sua jogada?
          </p>
        </div>

        {/* --- ÁREA CENTRAL (Cartas e Pergunta) --- */}
        {/* Usando flex-col para telas menores e flex-row para telas maiores */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-around w-full gap-8 z-10 mb-12">
          
          {/* Esquerda: Mão de Cartas (Placeholders) */}
          <div className="relative w-48 h-64 flex-shrink-0">
            {/* Carta 1 (Fundo) */}
            <div className="absolute left-0 top-6 w-32 h-48 sm:w-36 sm:h-56 bg-white rounded-xl shadow-xl border border-gray-200 -rotate-12 transform origin-bottom-left flex p-2">
              <span className="text-black font-bold text-xl leading-none">8 ♠</span>
            </div>
            {/* Carta 2 (Meio) */}
            <div className="absolute left-8 top-3 w-32 h-48 sm:w-36 sm:h-56 bg-white rounded-xl shadow-xl border border-gray-200 -rotate-6 transform origin-bottom-left flex p-2">
              <span className="text-red-600 font-bold text-xl leading-none">A ♦</span>
            </div>
            {/* Carta 3 (Frente - Rei) */}
            <div className="absolute left-16 top-0 w-32 h-48 sm:w-36 sm:h-56 bg-white rounded-xl shadow-xl border border-gray-200 rotate-2 transform origin-bottom-left flex flex-col p-2">
              <span className="text-red-600 font-bold text-xl leading-none">K ♥</span>
              <div className="flex-1 mt-1 flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-xs font-semibold text-center px-1">
                    <img
                        src = "/img/KingWise.jpeg"
                    />
                </span>
              </div>
              <span className="text-red-600 font-bold text-xl leading-none self-end rotate-180">K ♥</span>
            </div>
          </div>

          {/* Direita: Carta de Pergunta */}
          <div className="w-full max-w-[260px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col relative border border-gray-300 flex-shrink-0">
            {/* Detalhes do naipe nas pontas */}
            <div className="absolute top-3 left-3 text-red-600 font-bold flex flex-col items-center leading-none">
              <span className="text-sm">3</span>
              <span className="text-lg">♦</span>
            </div>
            <div className="absolute bottom-3 right-3 text-red-600 font-bold flex flex-col items-center leading-none rotate-180">
              <span className="text-sm">3</span>
              <span className="text-lg">♦</span>
            </div>

            <h3 className="text-center text-sm font-extrabold mt-6 mb-5 text-gray-900 leading-snug px-2">
              Qual alternativa apresenta corretamente a formula da área de um circulo?
            </h3>

            <div className="flex flex-col gap-2 mb-4 px-2">
              {[
                'A) A = 2πr', 
                'B) A = b × h', 
                'C) A = πr²', 
                'D) A = l²'
              ].map((alt) => (
                <button 
                  key={alt} 
                  className="bg-[#e4e4e4] hover:bg-[#d4d4d4] transition-colors text-left px-3 py-1.5 rounded-md font-bold text-xs text-gray-900 shadow-sm"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* --- BOTÃO INFERIOR --- */}
        <div className="flex justify-center w-full z-10">
          <button className="bg-white px-12 py-3 rounded-xl font-extrabold text-black shadow-xl hover:-translate-y-1 transition-transform relative border border-gray-200">
            {/* Detalhes de carta no botão */}
            <div className="absolute top-1 left-2 text-red-600 font-bold flex flex-col items-center leading-none">
              <span className="text-[10px]">A</span>
              <span className="text-[10px]">♦</span>
            </div>
            <div className="absolute bottom-1 right-2 text-red-600 font-bold flex flex-col items-center leading-none rotate-180">
              <span className="text-[10px]">A</span>
              <span className="text-[10px]">♦</span>
            </div>
            Próxima
          </button>
        </div>

      </div>
    </div>
  );
}