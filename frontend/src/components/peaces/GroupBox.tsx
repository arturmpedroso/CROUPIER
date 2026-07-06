import React from 'react';

type GroupProps = {
    id: number
    title: string;
    description?: string;
    onSelectGroup: (id: number) => void;
}

export default function GroupBox({ id, title, description, onSelectGroup }: GroupProps) {
    return (
        <div
            id={`group-${id}`}
            className="bg-[#1c1e1a] border border-zinc-800 rounded-xl p-6 cursor-pointer hover:border-[#97DB4F] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#97DB4F]/10 transition-all duration-200 group flex flex-col justify-between min-h-[320px]"
        >
            <div>
                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-[#97DB4F] transition-colors">
                    {title}
                </h3>
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