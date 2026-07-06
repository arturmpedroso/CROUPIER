"use client";

import React, { useState, useEffect, useRef } from 'react';

type GroupProps = {
    id: number;
    title: string;
    description?: string;
    onSelectGroup: (id: number) => void;
    onEdit: () => void;
    onDelete: () => void;
    onShareClick: () => void;
}

export default function GroupBox({ id, title, description, onSelectGroup, onEdit, onDelete, onShareClick }: GroupProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fecha o menu flutuante se o usuário clicar fora dele
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            id={`group-${id}`}
            className="croupier-group-card relative cursor-pointer"
            onClick={() => onSelectGroup(id)}
        >
            {/* MENU DE OPÇÕES FLUTUANTE (LÁPIS) */}

            <div className=' flex  justify-between'>
                {/* Adicionado pr-10 para o texto não encostar no ícone do lápis */}
                <h3 className="croupier-group-card-title pr-10">
                    {title}
                </h3>
                <div className='flex '>
                    <div className="top-4 right-4 z-20" ref={menuRef}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="text-[#A9BBBD] hover:text-[#97DB4F] transition-colors p-2 bg-[#121312]/80 rounded-lg border border-zinc-800"
                            title="Opções do Grupo"
                        >
                            ✏️ {/*mudar icone futuramente */}
                        </button>

                        {menuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-44 bg-[#121312] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onEdit();
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-white hover:bg-[#354727] hover:text-[#97DB4F] transition-colors"
                                >
                                    Editar Mesa
                                </button>

                                <div className="h-[1px] bg-zinc-800 w-full" />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDelete();
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#A21C0A] hover:bg-red-950/40 transition-colors"
                                >
                                    Recolher Apostas (Excluir)
                                </button>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Evita que o clique abra o grupo
                            onShareClick();
                        }}
                        className="ml-4 p-2 bg-[#354727] hover:bg-[#97DB4F] text-[#E6FAFC] hover:text-black rounded-lg transition"
                        title="Compartilhar grupo"
                    >
                        {/* Ícone de Compartilhar */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-row items-stretch justify-between gap-4 mt-2">
                <div className="w-43 h-43 flex-shrink-0 flex items-center justify-center">
                    <img
                        src="/img/wiese-card.png"
                        alt=""
                        className="croupier-group-card-image"
                    />
                </div>

                <div className="croupier-group-card-desc-panel">
                    <p className="croupier-group-card-desc">
                        {description ? description : "Descrição do grupo aparecerá aqui..."}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-end items-center">
                <button
                    type="button"
                    onClick={() => onSelectGroup(id)}
                    className="croupier-btn-accent text-sm flex items-center gap-2"
                >
                    Acessar grupo ➔
                </button>
            </div>
        </div>
    );
}