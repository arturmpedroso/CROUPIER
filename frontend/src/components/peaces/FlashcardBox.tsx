import React from 'react';

type FlashcardBoxProps = {
    index: number;
    title: string;
    onClick?: () => void;
}

export default function FlashcardBox({ index, title, onClick }: FlashcardBoxProps) {
    // Array de naipes para rotacionar visualmente igual ao seu protótipo
    const suits = [
        { symbol: '♠', color: 'text-black' }, // Espadas
        { symbol: '♣', color: 'text-black' }, // Paus
        { symbol: '♦', color: 'text-red-600' }, // Ouros
        { symbol: '♥', color: 'text-red-600' }, // Copas
    ];

    const currentSuit = suits[index % 4];

    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onClick}>
            {/* A Carta Física */}
            <div className="w-32 h-48 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-transparent group-hover:border-[#97DB4F] transition-all duration-300 relative overflow-hidden">
                {/* Detalhe sutil do naipe nos cantos (opcional, mas dá um charme) */}
                <span className={`absolute top-2 left-2 text-sm ${currentSuit.color}`}>{currentSuit.symbol}</span>
                <span className={`absolute bottom-2 right-2 text-sm rotate-180 ${currentSuit.color}`}>{currentSuit.symbol}</span>

                {/* Naipe Gigante no Centro */}
                <span className={`text-6xl ${currentSuit.color}`}>
                    {currentSuit.symbol}
                </span>
            </div>
            
            {/* Nome da carta embaixo */}
            <span className="text-[#A9BBBD] font-medium text-sm group-hover:text-white transition-colors">
                {title}
            </span>
        </div>
    );
}