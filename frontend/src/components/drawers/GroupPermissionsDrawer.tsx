"use client";

import React from 'react';

// Se você tiver um arquivo global de types, pode importar de lá.
// Caso contrário, declare aqui para o componente saber o formato dos dados.
interface Share {
    userId: number;
    canEdit: boolean;
    // Adicione a tipagem do objeto user que vem do backend
    user?: {
        name: string;
        username: string;
    };
}

interface GroupDetails {
    id: number;
    ownerId: number;
    isPrivate?: boolean; 
    shares?: Share[];
}

interface GroupPermissionsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    groupDetails: GroupDetails | null;
    onPrivacyChange: (isPrivate: boolean) => void;
    onPermissionChange: (targetUserId: number, canEdit: boolean) => void;
}

export default function GroupPermissionsDrawer({
    isOpen,
    onClose,
    groupDetails,
    onPrivacyChange,
    onPermissionChange
}: GroupPermissionsDrawerProps) {
    
    // Se não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay escuro que fecha o menu ao clicar fora */}
            <div 
                className="fixed inset-0 bg-black/60 z-40 transition-opacity" 
                onClick={onClose} 
            />

            {/* Painel Lateral */}
            <div className="fixed inset-y-0 right-0 w-96 bg-[#1c1e1a] border-l border-zinc-800 shadow-2xl z-50 p-6 flex flex-col transform transition-transform duration-300 ease-in-out">
                
                {/* Header do Menu */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#E6FAFC]">Configurações da Mesa</h2>
                    <button 
                        onClick={onClose} 
                        className="text-zinc-500 hover:text-[#97DB4F] text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* 1. Controle de Privacidade */}
                <div className="mb-8">
                    <label className="block text-sm text-[#A9BBBD] mb-2 font-semibold uppercase tracking-wider">
                        Privacidade do Grupo
                    </label>
                    <select 
                        className="croupier-dark-input w-full cursor-pointer px-1"
                        defaultValue={groupDetails?.isPrivate ? 'private' : 'public'}
                        onChange={(e) => onPrivacyChange(e.target.value === 'private')}
                    >
                        <option value="public">Público (Qualquer um com o código entra)</option>
                        <option value="private">Privado (Apenas convidados)</option>
                    </select>
                </div>

                {/* 2. Lista de Membros */}
                <div className="flex-1 overflow-y-auto">
                    <label className="block text-sm text-[#A9BBBD] mb-4 font-semibold uppercase tracking-wider">
                        Membros ({groupDetails?.shares?.length || 0})
                    </label>
                    
                    <div className="flex flex-col gap-3">
                        {groupDetails?.shares?.map((share) => (
                            <div key={share.userId} className="flex justify-between items-center bg-[#2a2d28] p-3 rounded-lg border border-zinc-700">
                                
                                {/* Nome/ID do Usuário */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#97DB4F]/20 flex items-center justify-center text-[#97DB4F] font-bold uppercase">
                                        {/* Mostra a inicial do nome ou do username. Fallback para ID */}
                                        {share.user?.name?.[0] || share.user?.username?.[0] || share.userId}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#E6FAFC] font-medium leading-tight">
                                            {share.user?.name || share.user?.username || `Usuário #${share.userId}`}
                                        </span>
                                        {/* Mostra o username pequeno embaixo do nome se ambos existirem */}
                                        {share.user?.name && share.user?.username && (
                                            <span className="text-zinc-500 text-xs">@{share.user.username}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Dropdown de Permissão */}
                                <select 
                                    className="bg-[#1c1e1a] text-[#E6FAFC] text-sm border border-zinc-600 rounded p-1 outline-none focus:border-[#97DB4F] cursor-pointer"
                                    defaultValue={share.canEdit ? 'edit' : 'read'}
                                    onChange={(e) => onPermissionChange(share.userId, e.target.value === 'edit')}
                                >
                                    <option value="read">Leitor</option>
                                    <option value="edit">Editor</option>
                                </select>
                            </div>
                        ))}

                        {(!groupDetails?.shares || groupDetails.shares.length === 0) && (
                            <p className="text-zinc-500 text-sm text-center mt-4">
                                Nenhum membro na mesa ainda.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}