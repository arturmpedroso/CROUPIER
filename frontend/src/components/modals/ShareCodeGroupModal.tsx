import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    shareCode: string;
}

export default function ShareGroupModal({ isOpen, onClose, shareCode }: Props) {
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-green/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="croupier-game-table !my-0 !w-full !max-w-sm relative">
            <div className="table-pocket pocket-top-left" />
            <div className="table-pocket pocket-top-right" />
            <div className="table-pocket pocket-middle-left" />
            <div className="table-pocket pocket-middle-right" />
            <div className="table-pocket pocket-bottom-left" />
            <div className="table-pocket pocket-bottom-right" />

            <button onClick={onClose} className="absolute top-6 right-6 text-[#A9BBBD] hover:text-white font-bold text-xl z-20">✕</button>

            <h2 className="croupier-display-title !mb-2 !text-3xl">Convite</h2>
            <p className="text-center text-[#A9BBBD] text-sm mb-8 px-4">Passe este código para os colegas.</p>

            <div className="bg-[#1c1e1a] border border-[#5d4037] rounded-xl p-4 flex items-center justify-between mb-4 shadow-inner">
            <span className="text-3xl font-mono font-bold tracking-[0.3em] pl-2 text-[#97DB4F]">{shareCode}</span>
            <button onClick={copyToClipboard} className="bg-[#A9BBBD] hover:bg-[#E6FAFC] text-[#1c1e1a] px-4 py-2 rounded-lg font-bold transition">
                {isCopied ? 'Copiado!' : 'Copiar'}
            </button>
            </div>
        </div>
        </div>
    );
}