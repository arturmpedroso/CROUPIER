"use client"

import React, { useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Interface do Flashcard vinda do seu banco/schema corrigido (sem description)
interface Flashcard {
  id: number;
  nomeBaralho: string;
  pergunta: string;
  resposta: string;
  quantErros: number;
  quantAcertos: number;
}

// Histórico individual de cada jogada nesta partida
interface CardResult {
  flashcardId: number;
  isCorrect: boolean;
}

// Estados possíveis da Máquina de Estados da Mesa de Estudos
type StudyStatus = 'LOADING' | 'PLAYING' | 'SUMMARY';

// Estrutura do Estado Centralizada (Padrão State)
interface StudySessionState {
  status: StudyStatus;
  cards: Flashcard[];
  currentIndex: number;
  currentAlternatives: string[];
  respostaSelecionada: string | null;
  roundResults: CardResult[]; // Armazena os erros/acertos da partida atual
  totalAcertosPartida: number;
  totalErrosPartida: number;
}

// Ações possíveis disparadas pelo jogador ou pelo sistema
type StudyAction =
  | { type: 'START_GAME'; cards: Flashcard[] }
  | { type: 'SET_ALTERNATIVES'; alternatives: string[] }
  | { type: 'SELECT_ANSWER'; answer: string }
  | { type: 'NEXT_CARD' };

// O CARTEADOR (Reducer): Controla rigorosamente as transições de estado
function studySessionReducer(state: StudySessionState, action: StudyAction): StudySessionState {
  switch (state.status) {
    case 'LOADING':
      if (action.type === 'START_GAME') {
        return {
          ...state,
          status: 'PLAYING',
          cards: action.cards,
          currentIndex: 0,
          respostaSelecionada: null,
          roundResults: [],
          totalAcertosPartida: 0,
          totalErrosPartida: 0,
        };
      }
      return state;

    case 'PLAYING':
      if (action.type === 'SET_ALTERNATIVES') {
        return { ...state, currentAlternatives: action.alternatives };
      }

      if (action.type === 'SELECT_ANSWER') {
        // Evita responder duas vezes a mesma carta
        if (state.respostaSelecionada !== null) return state;

        const currentCard = state.cards[state.currentIndex];
        const isCorrect = action.answer === currentCard.resposta;

        const newResult: CardResult = {
          flashcardId: currentCard.id,
          isCorrect,
        };

        return {
          ...state,
          respostaSelecionada: action.answer,
          roundResults: [...state.roundResults, newResult],
          totalAcertosPartida: isCorrect ? state.totalAcertosPartida + 1 : state.totalAcertosPartida,
          totalErrosPartida: !isCorrect ? state.totalErrosPartida + 1 : state.totalErrosPartida,
        };
      }

      if (action.type === 'NEXT_CARD') {
        const isLastCard = state.currentIndex === state.cards.length - 1;
        if (isLastCard) {
          return { ...state, status: 'SUMMARY' };
        }
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
          respostaSelecionada: null,
          currentAlternatives: [],
        };
      }
      return state;

    case 'SUMMARY':
      // Estado final estabilizado aguardando ações globais (como reiniciar ou sair)
      return state;

    default:
      return state;
  }
}

export default function MesaDeEstudos() {
  const router = useRouter();

  // Estado Inicial da Sessão
  const [state, dispatch] = useReducer(studySessionReducer, {
    status: 'LOADING',
    cards: [],
    currentIndex: 0,
    currentAlternatives: [],
    respostaSelecionada: null,
    roundResults: [],
    totalAcertosPartida: 0,
    totalErrosPartida: 0,
  });

  // MOCK: Simulando carga inicial vinda do Banco de Dados (Substitua pelo seu fetch real do backend futuramente)
  useEffect(() => {
    const cartasDoBanco: Flashcard[] = [
      { id: 1, nomeBaralho: "Geometria", pergunta: "Qual alternativa apresenta a fórmula da área de um círculo?", resposta: "A = πr²", quantErros: 3, quantAcertos: 6 },
      { id: 2, nomeBaralho: "Geometria", pergunta: "Qual alternativa apresenta a fórmula da área de um quadrado?", resposta: "A = l²", quantErros: 4, quantAcertos: 5 },
      { id: 3, nomeBaralho: "Geometria", pergunta: "Qual alternativa apresenta a fórmula da hipotenusa?", resposta: "h² = ca² + co²", quantErros: 5, quantAcertos: 4 },
      { id: 4, nomeBaralho: "Geometria", pergunta: "Qual alternativa apresenta a fórmula da área de um cilindro?", resposta: "A = 2πrh + 2πr²", quantErros: 6, quantAcertos: 3 }
    ];

    // Embaralha o deck inteiro ao iniciar a partida
    const deckEmbaralhado = [...cartasDoBanco].sort(() => Math.random() - 0.5);
    dispatch({ type: 'START_GAME', cards: deckEmbaralhado });
  }, []);

  // Lógica de Geração de Alternativas: pega as respostas das OUTRAS questões do mesmo baralho!
  useEffect(() => {
    if (state.status !== 'PLAYING' || state.cards.length === 0) return;

    const cardAtual = state.cards[state.currentIndex];

    // Regra do Backend no Frontend: Pega as respostas de todos os OUTROS flashcards do baralho carregado
    const respostasIncorretasDisponiveis = state.cards
      .filter(c => c.id !== cardAtual.id)
      .map(c => c.resposta);

    // Embaralha e seleciona até 3 erradas
    const tresErradasAleatorias = respostasIncorretasDisponiveis
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Garante que se houverem poucas cartas no baralho, preenchemos com placeholders genéricos
    while (tresErradasAleatorias.length < 3) {
      tresErradasAleatorias.push("Alternativa Sem Registro " + (tresErradasAleatorias.length + 1));
    }

    // Une com a certa e embaralha o bloco final de 4 opções
    const blocoFinalAlternativas = [...tresErradasAleatorias, cardAtual.resposta].sort(() => Math.random() - 0.5);

    dispatch({ type: 'SET_ALTERNATIVES', alternatives: blocoFinalAlternativas });
  }, [state.currentIndex, state.status, state.cards]);

  // Função para persistir os dados coletados de erros e acertos no NestJS
  const salvarDadosNoBanco = async () => {
    try {
      console.log("Enviando payload estruturado para o backend...", {
        results: state.roundResults, 
        // Exemplo de Payload ideal para o seu NestService processar:
        // Contém o ID do flashcard e se o usuário acertou ou errou.
        // O backend usará isso para dar um 'increment' na entidade global do flashcard
        // E criar/atualizar a linha na tabela de relacionamento do UserFlashcard correspondente.
      });

      // Exemplo de chamada real do seu axios/fetch:
      // await api.post('/study-sessions/save', { results: state.roundResults });

      alert("Sua pontuação foi registrada na banca! Retornando ao menu...");
      router.push('/decks'); // Substitua pela sua rota real da mesa/baralhos
    } catch (error) {
      console.error("Erro ao salvar dados", error);
    }
  };

  // Dispara o salvamento assim que o estado transita para SUMMARY
  useEffect(() => {
    if (state.status === 'SUMMARY') {
      salvarDadosNoBanco();
    }
  }, [state.status]);

  const sairDaSessao = () => {
    if (window.confirm("Deseja interromper o estudo? Seus acertos atuais serão salvos.")) {
      dispatch({ type: 'NEXT_CARD' });
      // Força a transição para salvar o progresso acumulado até o momento
      salvarDadosNoBanco();
    }
  };

  // Renderizador de Loading de Segurança
  if (state.status === 'LOADING') {
    return (
      <div className="min-h-screen bg-[#35362f] flex items-center justify-center">
        <p className="text-white font-bold animate-pulse">Preparando a Mesa e Embaralhando...</p>
      </div>
    );
  }

  // Captura o Flashcard atual de forma segura baseada no índice do Estado
  const flashcardAtual = state.cards[state.currentIndex];

  return (
    <div className="min-h-screen bg-[#35362f] flex items-center justify-center p-4 sm:p-8">
      <div className="croupier-game-table croupier-game-table-landscape flex flex-col relative">

        {/* Caçapas do Cassino */}
        <div className="table-pocket pocket-top-left" />
        <div className="table-pocket pocket-top-right" />
        <div className="table-pocket pocket-bottom-left" />
        <div className="table-pocket pocket-bottom-right" />
        <div className="table-pocket pocket-middle-up" />
        <div className="table-pocket pocket-middle-down" />

        {/* --- CABEÇALHO --- */}
        <div className="flex justify-between items-start w-full z-10 mb-4">
          <h1 className="text-white text-lg sm:text-xl font-bold tracking-wide drop-shadow-md">
            {flashcardAtual?.nomeBaralho || "Mesa de Estudos"}
          </h1>

          <div 
            onClick={sairDaSessao}
            className="flex items-center gap-2 bg-[#693131] rounded-full pl-3 pr-1 py-1 border border-[#522424] shadow-lg cursor-pointer hover:bg-[#7a3939] transition-colors"
          >
            <button className="text-white text-xs sm:text-sm font-medium">
              Sair do estudo
            </button>
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-inner">
              <span className="text-gray-800 font-black text-sm leading-none">X</span>
            </div>
          </div>
        </div>

        {/* --- ÁREA DINÂMICA BASEADA NO ESTADO --- */}
        {state.status === 'PLAYING' && flashcardAtual ? (
          <>
            {/* TÍTULO CENTRAL */}
            <div className="w-full flex flex-col items-center text-center z-10 mb-8">
              <h2 className="text-white text-2xl sm:text-3xl font-extrabold drop-shadow-lg tracking-wide">
                Responda:
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mt-1 font-medium drop-shadow-md">
                Carta {state.currentIndex + 1} de {state.cards.length} — Qual a sua jogada?
              </p>
            </div>

            {/* ÁREA CENTRAL (Cartas e Pergunta) */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-around w-full gap-8 z-10 mb-12">
              
              {/* Esquerda: Mão de Cartas Estéticas */}
              <div className="relative w-48 h-64 flex-shrink-0">
                <div className="absolute left-0 top-6 w-32 h-48 sm:w-36 sm:h-56 bg-white rounded-xl shadow-xl border border-gray-200 -rotate-12 transform origin-bottom-left flex p-2">
                  <span className="text-black font-bold text-xl leading-none">{state.currentIndex + 1} ♠</span>
                </div>
                <div className="absolute left-8 top-3 w-32 h-48 sm:w-36 sm:h-56 bg-white rounded-xl shadow-xl border border-gray-200 -rotate-6 transform origin-bottom-left flex p-2">
                  <span className="text-red-600 font-bold text-xl leading-none">A ♦</span>
                </div>
                <div className="absolute left-16 top-0 w-32 h-48 sm:w-36 sm:h-56 bg-white rounded-xl shadow-xl border border-gray-200 rotate-2 transform origin-bottom-left flex flex-col p-2">
                  <span className="text-red-600 font-bold text-xl leading-none">K ♥</span>
                  <div className="flex-1 mt-1 flex items-center justify-center bg-gray-50 overflow-hidden rounded-md">
                    <img src="/img/KingWise.jpeg" alt="King" className="object-cover w-full h-full" />
                  </div>
                  <span className="text-red-600 font-bold text-xl leading-none self-end rotate-180">K ♥</span>
                </div>
              </div>

              {/* Direita: Carta de Pergunta Dinâmica */}
              <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col relative border border-gray-300 flex-shrink-0">
                <div className="absolute top-3 left-3 text-red-600 font-bold flex flex-col items-center leading-none">
                  <span className="text-xs">?</span>
                  <span className="text-sm">♦</span>
                </div>
                <div className="absolute bottom-3 right-3 text-red-600 font-bold flex flex-col items-center leading-none rotate-180">
                  <span className="text-xs">?</span>
                  <span className="text-sm">♦</span>
                </div>

                <h3 className="text-center text-sm font-extrabold mt-6 mb-5 text-gray-900 leading-snug px-2 min-h-[40px] flex items-center justify-center">
                  {flashcardAtual.pergunta}
                </h3>

                {/* Grid das Alternativas Inteligentes */}
                <div className="flex flex-col gap-2 mb-4 px-2">
                  {state.currentAlternatives.map((alt) => {
                    let corDoBotao = "bg-[#e4e4e4] hover:bg-[#d4d4d4] text-gray-900";

                    if (state.respostaSelecionada) {
                      if (alt === flashcardAtual.resposta) {
                        corDoBotao = "bg-green-500 text-white shadow-green-200";
                      } else if (alt === state.respostaSelecionada) {
                        corDoBotao = "bg-red-500 text-white shadow-red-200";
                      } else {
                        corDoBotao = "bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={alt}
                        disabled={state.respostaSelecionada !== null}
                        onClick={() => dispatch({ type: 'SELECT_ANSWER', answer: alt })}
                        className={`transition-all duration-200 text-left px-3 py-2 rounded-lg font-bold text-xs shadow-sm border border-zinc-300/40 ${corDoBotao}`}
                      >
                        {alt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* --- CONTROLES E PLACAR INFERIOR --- */}
            <div className="relative flex justify-center items-center w-full z-10 mt-auto">
              <button
                onClick={() => dispatch({ type: 'NEXT_CARD' })}
                disabled={state.respostaSelecionada === null}
                className={`px-12 py-3 rounded-xl font-extrabold text-black shadow-xl transition-all relative border border-gray-200 ${
                  state.respostaSelecionada === null 
                    ? 'bg-gray-300 opacity-50 cursor-not-allowed text-zinc-500' 
                    : 'bg-white hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <div className="absolute top-1 left-2 text-red-600 font-bold flex flex-col items-center leading-none">
                  <span className="text-[10px]">A</span>
                  <span className="text-[10px]">♦</span>
                </div>
                <div className="absolute bottom-1 right-2 text-red-600 font-bold flex flex-col items-center leading-none rotate-180">
                  <span className="text-[10px]">A</span>
                  <span className="text-[10px]">♦</span>
                </div>
                {state.currentIndex === state.cards.length - 1 ? 'Finalizar' : 'Próxima'}
              </button>

              {/* Placar Real-Time acumulado nesta rodada */}
              <div className="absolute right-0 flex items-center gap-4 bg-[#2a2b26] border-2 border-[#1a1b18] rounded-xl px-4 py-2 shadow-inner">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Acertos</span>
                  <span className="text-green-500 font-black text-lg leading-none">{state.totalAcertosPartida}</span>
                </div>
                <div className="w-px h-6 bg-gray-600/50"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Erros</span>
                  <span className="text-red-500 font-black text-lg leading-none">{state.totalErrosPartida}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* --- ESTADO SUMMARY: FIM DE JOGO --- */
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full py-12">
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-wide drop-shadow-md text-[#97DB4F]">
              Fim da Rodada! 🎲
            </h2>
            <p className="text-zinc-300 text-base font-medium mt-2 max-w-md">
              O croupier recolheu as cartas. Seus resultados estão sendo registrados nas tabelas com sucesso.
            </p>

            <div className="bg-[#22231f] border-2 border-zinc-800 rounded-2xl p-6 my-8 flex gap-8 shadow-2xl">
              <div className="text-center">
                <p className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Total Acertos</p>
                <p className="text-green-400 text-4xl font-black mt-1">{state.totalAcertosPartida}</p>
              </div>
              <div className="w-px bg-zinc-800 h-14 my-auto"></div>
              <div className="text-center">
                <p className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Total Erros</p>
                <p className="text-red-400 text-4xl font-black mt-1">{state.totalErrosPartida}</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/decks')}
              className="bg-[#97DB4F] hover:bg-[#83c242] transition-colors text-black font-black px-8 py-3 rounded-xl shadow-lg border-b-4 border-[#699c33]"
            >
              Voltar para as Mesas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}