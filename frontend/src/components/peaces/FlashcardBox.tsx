"use client";

import React, { useState, useEffect, useRef } from 'react';

type FlashcardProps = {
    id: number;
    index: number;
    question: string;
    canEdit: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onClickCard?: () => void;
}

export default function FlashcardBox({ id, index, question, canEdit, onEdit, onDelete, onClickCard }: FlashcardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Naipes do Cassino
    const suits = [
        { symbol: '♠', color: 'text-black' },
        { symbol: '♣', color: 'text-black' },
        { symbol: '♦', color: 'text-[#A21C0A]' }, 
        { symbol: '♥', color: 'text-[#A21C0A]' },
    ];
    const currentSuit = suits[index % 4];

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
        <div id={`card-${id}`} className="flex flex-col items-center gap-2 relative">
            {/* A CARTA FÍSICA */}
            <div 
                className="w-40 h-56 bg-[#E6FAFC] rounded-xl shadow-lg flex items-center justify-center border border-zinc-300 hover:border-[#97DB4F] transition-all duration-300 relative cursor-pointer group"
                onClick={onClickCard}
            >
                {canEdit && (
                    <div className="absolute top-2 right-2 z-20" ref={menuRef}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="text-zinc-400 hover:text-black transition-colors p-1.5 bg-white/80 rounded-md border border-zinc-200 opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Opções da Carta"
                        >
                            ✏️
                        </button>

                        {menuOpen && (
                            <div
                                className="absolute right-0 mt-1 w-40 bg-[#121312] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
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
                                    Editar Carta
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

                <span className={`absolute top-3 left-3 text-lg ${currentSuit.color} leading-none`}>
                    {currentSuit.symbol}
                </span>
                <span className={`absolute bottom-3 right-3 text-lg rotate-180 ${currentSuit.color} leading-none`}>
                    {currentSuit.symbol}
                </span>

                <span className={`text-7xl ${currentSuit.color} group-hover:scale-110 transition-transform duration-300`}>
                    {currentSuit.symbol}
                </span>
            </div>

            {/* Mostra a pergunta embaixo da carta*/}
            <span className="text-[#A9BBBD] font-medium text-sm text-center px-2 truncate w-40" title={question}>
                {question}
            </span>
        </div>
    );
}