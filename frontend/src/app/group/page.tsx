"use client"

import { useState, useEffect } from 'react';
import Sidebar, { Element } from '@components/layout/Sidebar';
import GroupBox from '@/components/peaces/GroupBox';
import JoinGroupForm from '@/components/forms/JoinGroupByCodeForm';
import ShareGroupModal from '@/components/modals/ShareCodeGroupModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const API_ROUTES = {
    groups: `${API_BASE}/groups`,
    decks:  `${API_BASE}/decks`,
    cards:  `${API_BASE}/flashcards`,
    study:  `${API_BASE}/study`,
};

interface GroupData {
    id: number;
    name: string;
    description: string | null;
    isPrivate: boolean;
    shareCode: string;
}

export default function GroupePage() {
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);

    // Estados do Modal (Compartilhado entre Criar/Editar)
    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<GroupData | null>(null); // null = Criando | GroupData = Editando
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupPrivate, setNewGroupPrivate] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // ESTADOS PARA O MODAL DE COMPARTILHAMENTO =============
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentShareCode, setCurrentShareCode] = useState(''); // Armazena o código do grupo clicado


    // Busca os grupos do usuário
    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('@croupier:token');
            if (!token) return;

            const response = await fetch(API_ROUTES.groups, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGroups(data);
            } else {
                console.error("Erro na resposta da API");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Abre o modal limpando os campos para um Novo Grupo
    const handleOpenCreateModal = () => {
        setEditingGroup(null);
        setNewGroupName('');
        setNewGroupDesc('');
        setNewGroupPrivate(false);
        setShowModal(true);
    };

    // Abre o modal preenchendo os campos com os dados antigos para Edição
    const handleOpenEditModal = (group: GroupData) => {
        setEditingGroup(group);
        setNewGroupName(group.name);
        setNewGroupDesc(group.description || '');
        setNewGroupPrivate(group.isPrivate);
        setShowModal(true);
    };

    // Fecha o modal limpando os estados de edição
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingGroup(null);
    };

    // Submete o formulário de Criação (POST)
    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(API_ROUTES.groups, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newGroupName,
                    description: newGroupDesc,
                    isPrivate: newGroupPrivate
                })
            });

            if (response.ok) {
                handleCloseModal();
                fetchGroups();
            }
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // Submete o formulário de Alteração/Atualização (PATCH/PUT)
    const handleUpdateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGroup) return;
        setIsCreating(true);

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(`${API_ROUTES.groups}/${editingGroup.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newGroupName,
                    description: newGroupDesc,
                    isPrivate: newGroupPrivate
                })
            });

            if (response.ok) {
                handleCloseModal();
                fetchGroups();
            } else {
                console.error("Erro ao atualizar o grupo na API");
            }
        } catch (error) {
            console.error("Erro ao atualizar grupo:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // Remove o grupo da mesa de apostas (DELETE)
    const handleDeleteGroup = async (id: number) => {
        const confirmed = window.confirm("Tem certeza que deseja recolher as apostas e deletar este grupo? Todos os baralhos dentro dele serão apagados permanentemente.");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('@croupier:token');
            const response = await fetch(`${API_ROUTES.groups}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchGroups();
                if (activeId === id) setActiveId(null); // Reseta a seleção ativa caso o grupo atual suma
            } else {
                console.error("Erro ao deletar o grupo na API");
            }
        } catch (error) {
            console.error("Erro ao deletar grupo:", error);
        }
    };

    const findElement = (idElement: number) => {
        setActiveId(idElement);
        const scrollContainer = document.getElementById('scroll-container-groups');
        const elementToScroll = document.getElementById(`group-${idElement}`);

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

    const selectElement = (idElement: number) => {
        setActiveId(idElement);
        console.log("Acessando o grupo ID:", idElement);
    };

    const sidebarElements: Element[] = groups.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || ""
    }));

    return (
        <div className="flex relative">
            <Sidebar elements={sidebarElements} activeId={activeId} onFindElement={findElement} />
            <main className="croupier-page-main">
                <div className='flex justify-end gap-4 mb-5'>
                    <h1 className='croupier-subtitle-white text-2xl font-bold text-white'>Entrar em um grupo:</h1>
                    <JoinGroupForm onJoinSuccess={fetchGroups} />
                </div>
                <div className="croupier-page-header">
                    <h1 className="croupier-subtitle-white">Seus Grupos</h1>

                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="croupier-btn-accent"
                    >
                        + Novo Grupo
                    </button>
                </div>

                <div className="croupier-content-panel">
                    <div
                        id="scroll-container-groups"
                        className="croupier-scroll-area"
                    >
                        {isLoading ? (
                            <div className="croupier-empty-state">Buscando cartas na mesa...</div>
                        ) : groups.length === 0 ? (
                            <div className="croupier-empty-state">Nenhum grupo encontrado. Crie sua primeira aposta!</div>
                        ) : (
                            <div className="croupier-grid-list">
                                {groups.map((grupo) => (
                                    <div id={`group-${grupo.id}`} key={grupo.id}>
                                        <GroupBox
                                            id={grupo.id}
                                            title={grupo.name}
                                            description={grupo.description || "Sem descrição"}
                                            onSelectGroup={selectElement}
                                            onEdit={() => handleOpenEditModal(grupo)}
                                            onDelete={() => handleDeleteGroup(grupo.id)}
                                        onShareClick={() => {setCurrentShareCode(grupo.shareCode); setIsModalOpen(true);}}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <ShareGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shareCode={currentShareCode} />

            {/* MODAL COORDENADO PELO ESTADO 'editingGroup' */}
            {showModal && (
                <div className="croupier-modal-overlay">
                    <div className="croupier-modal">
                        <h2 className="croupier-modal-title">
                            {editingGroup ? 'Alterar Mesa do Grupo' : 'Criar Novo Grupo'}
                        </h2>

                        <form 
                            onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup} 
                            className="croupier-form-stack"
                        >
                            <div>
                                <label className="croupier-field-label">Nome do Grupo</label>
                                <input
                                    type="text"
                                    required
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="croupier-dark-input"
                                    placeholder="Ex: Anatomia Humana"
                                />
                            </div>

                            <div>
                                <label className="croupier-field-label">Descrição</label>
                                <textarea
                                    value={newGroupDesc}
                                    onChange={(e) => setNewGroupDesc(e.target.value)}
                                    className="croupier-dark-textarea"
                                    placeholder="Descreva o conteúdo deste baralho..."
                                />
                            </div>

                            <div className="croupier-checkbox-row">
                                <input
                                    type="checkbox"
                                    id="private-group"
                                    checked={newGroupPrivate}
                                    onChange={(e) => setNewGroupPrivate(e.target.checked)}
                                    className="w-4 h-4 accent-[#97DB4F]"
                                />
                                <label htmlFor="private-group" className="croupier-checkbox-label">
                                    Grupo Privado
                                </label>
                            </div>

                            <div className="croupier-form-actions">
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
                                    {isCreating ? 'Processando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}