"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar, { Element } from '@/components/layout/Sidebar';
import FlashcardBox from '@/components/peaces/FlashcardBox';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const API_ROUTES = {
    decks: `${API_BASE}/decks`,
    cards: `${API_BASE}/cards`,
};

interface FlashcardData {
    id: number;
    question: string;
    answer: string;
}

export default function DeckCardsPage() {
    const params = useParams();
    const router = useRouter();
    const deckId = Number(params.id);

    const [cards, setCards] = useState<FlashcardData[]>([]);
    const [deckName, setDeckName] = useState('Carregando mesa...');
    const [groupId, setGroupId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [canEditDeck, setCanEditDeck] = useState(false);

    // Estados do Modal
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);
    const [cardData, setCardData] = useState({ question: '', answer: '' });
    const [isCreating, setIsCreating] = useState(false);

    // Busca as informações do baralho (para pegar permissão e nome)
    const fetchDeckDetails = async () => {
        try {
            const token = localStorage.getItem('@croupier:token');
            const storedUser = localStorage.getItem('@croupier:user');
            if (!token || !storedUser) return;

            const response = await fetch(`${API_ROUTES.decks}/${deckId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const deck = await response.json();
                setDeckName(deck.name);
                setGroupId(deck.groupId);
                
                // Lógica simplificada de permissão. Idealmente o backend já diz se ele tem acesso,
                // ou você repete a lógica do GroupDecksPage consultando o Group.
                // Para o exemplo, vamos assumir que buscar as cartas validará isso, 
                // mas você pode ajustar chamando o /groups aqui.
                setCanEditDeck(true); 
            }
        } catch (error) {
            console.error("Erro ao buscar baralho:", error);
        }
    };

    // Busca as cartas
    const fetchCards = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(`${API_ROUTES.cards}/deck/${deckId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCards(data);
            }
        } catch (error) {
            console.error("Erro ao buscar cartas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (deckId) {
            fetchDeckDetails();
            fetchCards();
        }
    }, [deckId]);

    const handleOpenModal = (card?: FlashcardData) => {
        if (card) {
            setEditingCard(card);
            setCardData({question: card.question, answer: card.answer });
        } else {
            setEditingCard(null);
            setCardData({question: '', answer: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCard(null);
    };

    const handleSaveCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const method = editingCard ? 'PATCH' : 'POST';
        const url = editingCard ? `${API_ROUTES.cards}/${editingCard.id}` : API_ROUTES.cards;
        
        // Se for POST, injeta o deckId.
        const bodyPayload = editingCard 
            ? { ...cardData } 
            : { ...cardData, deckId };

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyPayload)
            });

            if (response.ok) {
                handleCloseModal();
                fetchCards();
            } else {
                alert("Erro ao salvar carta. Verifique suas permissões.");
            }
        } catch (error) {
            console.error("Erro na operação:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
        const confirmed = window.confirm("Recolher esta carta? Ela será rasgada permanentemente.");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(`${API_ROUTES.cards}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchCards();
                if (activeId === id) setActiveId(null);
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const sidebarElements: Element[] = cards.map((c, i) => ({
        id: c.id,
        name: c.question || `Carta ${i + 1}`,
        description: c.answer || '',
    }));

    return (
        <div className="flex relative h-screen bg-[#121312] overflow-hidden">
            <Sidebar elements={sidebarElements} activeId={activeId} onFindElement={setActiveId} />

            <main className="flex-1 flex flex-col p-8 overflow-y-auto w-full">
                {/* BOTÃO VOLTAR E TÍTULO */}
                <div className="flex flex-col gap-2 mb-8">
                    <button 
                        onClick={() => groupId ? router.push(`/groups/${groupId}`) : router.back()} 
                        className="text-sm text-[#A9BBBD] hover:text-white self-start transition-colors"
                    >
                        ← Voltar para o Baralho
                    </button>
                    
                    <div className="flex justify-between items-end">
                        <h1 className="croupier-subtitle-white text-3xl font-bold">{deckName}</h1>
                        <button 
                            onClick={() => router.push(`/study/${deckId}`)}
                            className="croupier-btn-accent flex items-center gap-2 shadow-lg"
                        >
                            Iniciar estudo <span className="bg-white/20 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">▶</span>
                        </button>
                    </div>
                </div>

                {/* MESA DE CARTAS (Grid) */}
                <div id="scroll-container-cards" className="flex-1 pb-20">
                    {isLoading ? (
                        <div className="text-[#A9BBBD]">Distribuindo as cartas na mesa...</div>
                    ) : (
                        <div className="flex flex-wrap gap-8 items-start">
                            {cards.map((card, index) => (
                                <FlashcardBox 
                                    key={card.id}
                                    id={card.id}
                                    index={index}
                                    question={card.question}
                                    canEdit={canEditDeck}
                                    onEdit={() => handleOpenModal(card)}
                                    onDelete={() => handleDeleteCard(card.id)}
                                    onClickCard={() => setActiveId(card.id)}
                                />
                            ))}

                            {/* CARTA DE ADICIONAR (Se tiver permissão) */}
                            {canEditDeck && (
                                <div 
                                    onClick={() => handleOpenModal()}
                                    className="flex flex-col items-center gap-2 cursor-pointer group mt-0"
                                >
                                    <div className="w-40 h-56 bg-transparent border-2 border-dashed border-[#A9BBBD]/40 rounded-xl flex items-center justify-center group-hover:border-[#97DB4F] group-hover:bg-white/5 transition-all duration-300">
                                        <span className="text-5xl text-[#A9BBBD]/60 group-hover:text-[#97DB4F]">+</span>
                                    </div>
                                    <span className="text-[#A9BBBD] font-medium text-sm group-hover:text-white transition-colors">
                                        Comprar Carta
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL COORDENADO PELO ESTADO 'editingCard' */}
            {showModal && (
                <div className="croupier-modal-overlay z-50">
                    <div className="croupier-modal w-[500px]"> {/* Um pouco mais largo para as textareas */}
                        <h2 className="croupier-modal-title">
                            {editingCard ? 'Alterar Carta' : 'Preencher Nova Carta'}
                        </h2>

                        <form onSubmit={handleSaveCard} className="croupier-form-stack">
                            <div>
                                <label className="croupier-field-label">Título da Carta (Opcional)</label>
                                <input
                                    type="text"
                                    value={cardData.question}
                                    onChange={(e) => setCardData({...cardData, question: e.target.value})}
                                    className="croupier-dark-input"
                                    placeholder="Ex: Artéria Aorta"
                                />
                            </div>

                            <div>
                                <label className="croupier-field-label">Frente (Pergunta)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={cardData.question}
                                    onChange={(e) => setCardData({...cardData, question: e.target.value})}
                                    className="croupier-dark-input resize-none"
                                    placeholder="Digite a pergunta da carta..."
                                />
                            </div>

                            <div>
                                <label className="croupier-field-label">Verso (Resposta)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={cardData.answer}
                                    onChange={(e) => setCardData({...cardData, answer: e.target.value})}
                                    className="croupier-dark-input resize-none"
                                    placeholder="Digite a resposta oculta..."
                                />
                            </div>

                            <div className="croupier-form-actions mt-4">
                                <button type="button" onClick={handleCloseModal} className="croupier-btn-ghost">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isCreating} className="croupier-btn-accent-block">
                                    {isCreating ? 'Desenhando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}