"use client";

import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmLogoutModal({ isOpen, onClose, onConfirm }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            {/* Mantendo a estrutura da sua mesa de jogo */}
            <div className="croupier-game-table croupier-game-table-landscape w-100 h-70 !max-w-sm relative">
                <div className="table-pocket pocket-top-left" />
                <div className="table-pocket pocket-top-right" />
                <div className="table-pocket pocket-middle-left" />
                <div className="table-pocket pocket-middle-right" />
                <div className="table-pocket pocket-bottom-left" />
                <div className="table-pocket pocket-bottom-right" />

                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 text-[#A9BBBD] hover:text-white font-bold text-xl z-20"
                >
                    ✕
                </button>

                <h2 className="croupier-display-title !mb-2 !text-3xl">Sair da Mesa</h2>
                <p className="text-center text-[#A9BBBD] text-sm mb-8 px-4">
                    Você será desconectado da sua sessão. Tem certeza?
                </p>

                <div className="flex gap-4 px-4">
                    <button 
                        onClick={onClose} 
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-[#E6FAFC] py-3 rounded-lg font-bold transition"
                    >
                        Ficar
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="flex-1 bg-[#A21C0A] hover:bg-[#d32f2f] text-white py-3 rounded-lg font-bold transition"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}