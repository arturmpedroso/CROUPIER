"use client";

import React, { useState, useEffect, useRef } from 'react';

type DeckProps = {
    id: number;
    title: string;
    flashcardsCount: number;
    onSelectDeck: (id: number) => void;
    canEdit: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DeckBox({ id, title, flashcardsCount, canEdit, onSelectDeck, onEdit, onDelete }: DeckProps) {
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
        <div id={`deck-${id}`} className="croupier-group-card relative flex flex-col">
            <div className='flex justify-between items-start'>
                <h3 className="croupier-group-card-title pr-10">
                    {title}
                </h3>
                
                <div className='flex'>
                    {/* proteção da condição com o {canEdit && (...)} */}
                    {canEdit && (
                        <div className="relative z-20" ref={menuRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(!menuOpen);
                                }}
                                className="text-[#A9BBBD] hover:text-[#97DB4F] transition-colors p-2 bg-[#121312]/80 rounded-lg border border-zinc-800"
                                title="Opções do Baralho"
                            >
                                ✏️
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
                                    Renomear Baralho
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
                                    Recolher (Excluir)
                                </button>
                            </div>
                        )}
                        </div>
                    )}
                </div>
            </div>

            {/* ÁREA CENTRAL: IMAGEM + CONTAGEM DE CARTAS */}
            <div className="flex-1 flex flex-row items-stretch justify-between gap-4 mt-2">
                <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center">
                    <img
                        src="/img/wiese-card.png"
                        alt=""
                        className="croupier-group-card-image opacity-80"
                    />
                </div>

                <div className="croupier-group-card-desc-panel flex items-center justify-center p-4">
                    <p className="croupier-group-card-desc text-center">
                        <span className="block text-2xl font-bold text-[#97DB4F] mb-1">
                            {flashcardsCount}
                        </span>
                        {flashcardsCount === 1 ? 'carta na mesa' : 'cartas na mesa'}
                    </p>
                </div>
            </div>

            {/* FOOTER: BOTÃO DE ACESSO */}
            <div className="mt-4 flex justify-end items-center">
                <button
                    type="button"
                    onClick={() => onSelectDeck(id)}
                    className="croupier-btn-accent text-sm flex items-center gap-2"
                >
                    Jogar Cartas ➔
                </button>
            </div>
        </div>
    );
}