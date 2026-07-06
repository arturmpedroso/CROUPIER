"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar, { Element } from '@components/layout/Sidebar';
import DeckBox from '@/components/peaces/DeckBox'; 

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const API_ROUTES = {
    decks: `${API_BASE}/decks`,
};

// Interface
interface DeckData {
    id: number;
    name: string;
    groupId: number;
    _count: {
        flashcards: number;
    };
}

export default function GroupDecksPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = Number(params.id); // Pega o ID do grupo na URL

    const [decks, setDecks] = useState<DeckData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);

    // Estados do Modal (Compartilhado entre Criar/Editar)
    const [showModal, setShowModal] = useState(false);
    const [editingDeck, setEditingDeck] = useState<DeckData | null>(null); // null = Criando | DeckData = Editando
    const [newDeckName, setNewDeckName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Busca os baralhos do grupo específico
    const fetchDecks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('@croupier:token');
            if (!token) return;

            const response = await fetch(`${API_ROUTES.decks}/group/${groupId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDecks(data);
            } else {
                console.error("Erro na resposta da API ao buscar baralhos");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) {
            fetchDecks();
        }
    }, [groupId]);

    // Abre o modal limpando os campos para um Novo Baralho
    const handleOpenCreateModal = () => {
        setEditingDeck(null);
        setNewDeckName('');
        setShowModal(true);
    };

    // Abre o modal preenchendo os campos com os dados antigos para Edição
    const handleOpenEditModal = (deck: DeckData) => {
        setEditingDeck(deck);
        setNewDeckName(deck.name);
        setShowModal(true);
    };

    // Fecha o modal limpando os estados de edição
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDeck(null);
    };

    // Submete o formulário de Criação (POST)
    const handleCreateDeck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(API_ROUTES.decks, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newDeckName,
                    groupId: groupId // Passa o ID do grupo atual para o backend
                })
            });

            if (response.ok) {
                handleCloseModal();
                fetchDecks();
            } else {
                alert("Você não tem permissão para adicionar baralhos nesta mesa.");
            }
        } catch (error) {
            console.error("Erro ao criar baralho:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // Submete o formulário de Alteração/Atualização (PATCH)
    const handleUpdateDeck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDeck) return;
        setIsCreating(true);

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(`${API_ROUTES.decks}/${editingDeck.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newDeckName,
                })
            });

            if (response.ok) {
                handleCloseModal();
                fetchDecks();
            } else {
                console.error("Erro ao atualizar o baralho na API");
            }
        } catch (error) {
            console.error("Erro ao atualizar baralho:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // Remove o baralho da mesa (DELETE)
    const handleDeleteDeck = async (id: number) => {
        const confirmed = window.confirm("Tem certeza que deseja recolher este baralho? Todas as cartas nele serão apagadas permanentemente.");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(`${API_ROUTES.decks}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchDecks();
                if (activeId === id) setActiveId(null);
            } else {
                console.error("Erro ao deletar o baralho na API");
            }
        } catch (error) {
            console.error("Erro ao deletar baralho:", error);
        }
    };

    // Lógica da Sidebar
    const findElement = (idElement: number) => {
        setActiveId(idElement);
        const scrollContainer = document.getElementById('scroll-container-decks');
        const elementToScroll = document.getElementById(`deck-${idElement}`);

        if (scrollContainer && elementToScroll) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = elementToScroll.getBoundingClientRect();
            const scrollTopPosition = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - 16;

            scrollContainer.scrollTo({
                top: scrollTopPosition,
                behavior: 'smooth'
            });
        }
    }

    // Acessar o baralho (vai para a tela de flashcards futuramente)
    const selectElement = (idElement: number) => {
        setActiveId(idElement);
        router.push(`/decks/${idElement}`); // Redireciona para as cartas!
    };

    const sidebarElements: Element[] = decks.map(d => ({
        id: d.id,
        name: d.name,
        description: `${d._count.flashcards} cartas na mesa`
    }));

    return (
        <div className="flex relative">
            <Sidebar elements={sidebarElements} activeId={activeId} onFindElement={findElement} />

            <main className="croupier-page-main">
                <div className='flex flex-col gap-4 mb-5'>
                    <button 
                        onClick={() => router.push('/groups')} 
                        className="text-sm text-[#A9BBBD] hover:text-white self-start transition-colors"
                    >
                        ← Voltar para Mesas (Grupos)
                    </button>
                </div>
                
                <div className="croupier-page-header mt-2">
                    <h1 className="croupier-subtitle-white text-4xl">Baralhos da Mesa</h1>

                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="croupier-btn-accent"
                    >
                        + Novo Baralho
                    </button>
                </div>

                <div className="croupier-content-panel">
                    <div
                        id="scroll-container-decks"
                        className="croupier-scroll-area"
                    >
                        {isLoading ? (
                            <div className="croupier-empty-state">Embaralhando as cartas...</div>
                        ) : decks.length === 0 ? (
                            <div className="croupier-empty-state">Nenhum baralho na mesa ainda. Distribua o primeiro!</div>
                        ) : (
                            <div className="croupier-grid-list">
                                {decks.map((deck) => (
                                    <DeckBox
                                        key={deck.id}
                                        id={deck.id}
                                        title={deck.name}
                                        flashcardsCount={deck._count.flashcards}
                                        onSelectDeck={selectElement}
                                        onEdit={() => handleOpenEditModal(deck)}
                                        onDelete={() => handleDeleteDeck(deck.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            {/* MODAL COORDENADO PELO ESTADO 'editingDeck' */}
            {showModal && (
                <div className="croupier-modal-overlay">
                    <div className="croupier-modal">
                        <h2 className="croupier-modal-title">
                            {editingDeck ? 'Renomear Baralho' : 'Distribuir Novo Baralho'}
                        </h2>

                        <form 
                            onSubmit={editingDeck ? handleUpdateDeck : handleCreateDeck} 
                            className="croupier-form-stack"
                        >
                            <div>
                                <label className="croupier-field-label">Nome do Baralho</label>
                                <input
                                    type="text"
                                    required
                                    value={newDeckName}
                                    onChange={(e) => setNewDeckName(e.target.value)}
                                    className="croupier-dark-input"
                                    placeholder="Ex: Anatomia - Sistema Nervoso"
                                />
                            </div>

                            <div className="croupier-form-actions mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="croupier-btn-ghost"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="croupier-btn-accent-block"
                                >
                                    {isCreating ? 'Embaralhando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}