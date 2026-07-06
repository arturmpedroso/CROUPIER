"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar, { Element } from '@components/layout/Sidebar';
import GroupBox from '@/components/peaces/GroupBox';
import JoinGroupForm from '@/components/forms/JoinGroupByCodeForm';
import ShareGroupModal from '@/components/modals/ShareCodeGroupModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL; // Rota Base

// Rotas
const API_ROUTES = {
    groups: `${API_BASE}/groups`,
    decks:  `${API_BASE}/decks`,      // Rota dos baralhos
    cards:  `${API_BASE}/flashcards`, // Rota dos flashcards
    study:  `${API_BASE}/study`,      // Rota do modo estudo
};

interface GroupData {
    id: number;
    name: string;
    description: string | null;
    isPrivate: boolean;
    shareCode: string;
}

export default function GroupePage() {
    // ESTADOS PARA OS DADOS DO BACKEND =====================
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);

    // ESTADOS PARA O MODAL DE CRIAÇÃO ======================
    const [showModal, setShowModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupPrivate, setNewGroupPrivate] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // ESTADOS PARA O MODAL DE COMPARTILHAMENTO =============
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentShareCode, setCurrentShareCode] = useState(''); // Armazena o código do grupo clicado


    // FUNÇÃO PARA BUSCAR OS GRUPOS NA API ==================
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

    // CARREGA OS GRUPOS QUANDO A PÁGINA ABRE ===============
    useEffect(() => {
        fetchGroups();
    }, []);

    // FUNÇÃO PARA CRIAR UM NOVO GRUPO ======================
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
                setNewGroupName('');
                setNewGroupDesc('');
                setNewGroupPrivate(false);
                setShowModal(false);
                fetchGroups();
            }
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // FUNÇÕES DE NAVEGAÇÃO DA SIDEBAR ======================
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
        // Futuro redirecionamento: router.push(`/groups/${idElement}`)
    };

    const sidebarElements: Element[] = groups.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || ""
    }));

    return (
        <div className="flex relative">
            <Sidebar elements={sidebarElements} activeId={activeId} onFindElement={findElement} />
            
            <main className='flex-1 p-8 h-[92vh] flex flex-col relative'>
                <div className='flex justify-end gap-4 mb-5'>
                    <h1 className='croupier-subtitle-white text-2xl font-bold text-white'>Entrar em um grupo:</h1>
                    <JoinGroupForm onJoinSuccess={fetchGroups} />
                </div>
                <div className='flex justify-between items-center mb-5'>
                    <h1 className='croupier-subtitle-white text-4xl font-bold text-white'>Seus Grupos</h1>
                    
                    <button 
                        onClick={() => setShowModal(true)}
                        className='bg-[#97DB4F] hover:bg-[#8add40] text-[#1c1e1a] font-bold px-4 py-2 rounded-lg transition-transform active:scale-95'
                    >
                        + Novo Grupo
                    </button>
                </div>

                <div className='bg-[#233119] flex-1 rounded-2xl border border-zinc-800 flex overflow-hidden'>
                    <div
                        id="scroll-container-groups"
                        className='flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent'>
                        
                        {isLoading ? (
                            <div className="text-center text-zinc-400 mt-10">Buscando cartas na mesa...</div>
                        ) : groups.length === 0 ? (
                            <div className="text-center text-zinc-400 mt-10">Nenhum grupo encontrado. Crie sua primeira aposta!</div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6'>
                                {groups.map((grupo) => (
                                    <GroupBox
                                        key={grupo.id}
                                        id={grupo.id}
                                        title={grupo.name}
                                        description={grupo.description || "Sem descrição"}
                                        onSelectGroup={selectElement}
                                        onShareClick={() => {setCurrentShareCode(grupo.shareCode); setIsModalOpen(true);}}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <ShareGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shareCode={currentShareCode} />
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1c1e1a] border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Criar Novo Grupo</h2>
                        
                        <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-bold text-zinc-400 mb-1 block">Nome do Grupo</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="w-full bg-[#2a2d28] border border-zinc-700 text-white rounded-lg p-3 focus:outline-none focus:border-[#97DB4F]"
                                    placeholder="Ex: Anatomia Humana"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-zinc-400 mb-1 block">Descrição</label>
                                <textarea 
                                    value={newGroupDesc}
                                    onChange={(e) => setNewGroupDesc(e.target.value)}
                                    className="w-full bg-[#2a2d28] border border-zinc-700 text-white rounded-lg p-3 focus:outline-none focus:border-[#97DB4F] resize-none h-24"
                                    placeholder="Descreva o conteúdo deste baralho..."
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <input 
                                    type="checkbox" 
                                    id="private-group"
                                    checked={newGroupPrivate}
                                    onChange={(e) => setNewGroupPrivate(e.target.checked)}
                                    className="w-4 h-4 accent-[#97DB4F]"
                                />
                                <label htmlFor="private-group" className="text-sm text-zinc-300 cursor-pointer">
                                    Grupo Privado
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-transparent border border-zinc-600 text-zinc-300 font-bold py-3 rounded-lg hover:bg-zinc-800 transition"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 bg-[#97DB4F] text-[#1c1e1a] font-bold py-3 rounded-lg hover:bg-[#8add40] transition disabled:opacity-50"
                                >
                                    {isCreating ? 'Criando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}