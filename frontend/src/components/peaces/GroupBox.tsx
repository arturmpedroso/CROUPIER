"use client";

import React, { useState, useEffect, useRef } from 'react';

type GroupProps = {
    id: number;
    title: string;
    description?: string;
    onSelectGroup: (id: number) => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function GroupBox({ id, title, description, onSelectGroup, onEdit, onDelete }: GroupProps) {
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
            className="croupier-group-card relative"
        >
            {/* MENU DE OPÇÕES FLUTUANTE (LÁPIS) */}
            <div className="absolute top-4 right-4 z-20" ref={menuRef}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}
                    className="text-[#A9BBBD] hover:text-[#97DB4F] transition-colors p-1.5 bg-[#121312]/80 rounded-lg border border-zinc-800"
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

            <div>
                {/* Adicionado pr-10 para o texto não encostar no ícone do lápis */}
                <h3 className="croupier-group-card-title pr-10">
                    {title}
                </h3>
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