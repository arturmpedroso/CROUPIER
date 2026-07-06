import React from 'react';

// Elemtos da sidebar, os nomes dos grupos/baralhos que ficam do lado
export type Element = {
    id: number;
    name: string;
    description: string;
}
type ElementsProp = {
    elements: Element[];
    activeId: number | null;
    onFindElement: (id: number) => void;
}

export default function Sidebar({ elements, activeId, onFindElement }: ElementsProp) {
    return (
        <aside className="w-64 bg-[#222420] border-r border-zinc-800 flex flex-col py-8 min-h-[92vh] max-h-[92vh] overflow-y-auto">
            <div className="px-6 mb-6">
                <h2 className="croupier-subtitle-white border-b-2 border-gray-600 pb-2">
                    Meus grupos
                </h2>
            </div>

            <nav className="flex flex-col gap-2 px-4">
                {elements.map((element) => {
                    const isAtivo = element.id === activeId;
                    return (
                        <button
                            key={element.id}
                            onClick={() => onFindElement(element.id)}
                            className={`font-semibold py-2 px-4 rounded-full text-left w-full transition-colors ${isAtivo
                                ? 'bg-[#4a4d46] text-white'
                                : 'text-gray-300 hover:bg-[#333530]'
                                }`}
                        >
                            {element.name}
                        </button>
                    );
                })}
            </nav>
        </aside>
    )
}