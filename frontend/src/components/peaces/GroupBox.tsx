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
            className="croupier-group-card"
        >
            <div>
                <h3 className="croupier-group-card-title">
                    {title}
                </h3>
            </div>

            <div className="flex-1 flex flex-row items-stretch justify-between gap-4 mt-2">
                <div className="w-43 h-43 flex-shrink-0 flex items-center justify-center">
                    <img
                        src="/img/wiese-card.png"
                        alt=""
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-md"
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
