import React from 'react';

type GroupProps = {
    id: number
    title: string;
    description?: string;
    onSelectGroup: (id: number) => void;
    onShareClick: () => void;
}

export default function GroupBox({ id, title, description, onSelectGroup, onShareClick }: GroupProps) {
    return (
        <div
            id={`group-${id}`}
            className="bg-[#1c1e1a] border border-zinc-800 rounded-xl p-6 cursor-pointer hover:border-[#97DB4F] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#97DB4F]/10 transition-all duration-200 group flex flex-col justify-between min-h-[320px]"
        >
            <div className=' flex  justify-between'>
                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-[#97DB4F] transition-colors">
                    {title}
                </h3>
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

            <div className='flex-1 flex flex-row items-stretch justify-between gap-4 mt-2'>

                <div className="w-43 h-43 flex-shrink-0 flex items-center justify-center">
                    <img
                        src="/img/wiese-card.png"
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-md"
                    />
                </div>

                <div className='w-1/2 max-h-43 h-full bg-[#2a2d28] border border-zinc-700/50 rounded-lg p-3 overflow-y-auto'>
                    <p className='text-gray-400 text-sm text-justify'>
                        {description ? description : "Descrição do grupo aparecerá aqui..."}
                    </p>
                </div>

            </div>

            <div className="mt-4 flex justify-end items-center">
                <button
                    onClick={() => onSelectGroup(id)}
                    className="text-sm font-bold text-[#1c1e1a] bg-[#97DB4F] hover:bg-[#8add40] px-4 py-2 rounded-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                    Acessar grupo ➔
                </button>
            </div>
        </div>
    );
}