"use client"

import { useState } from 'react';
import Link from 'next/link';
import Sidebar, { Element } from '@components/layout/Sidebar';
import GroupBox from '@/components/peaces/GroupBox';



export default function GroupePage() {
    // VARIAVEIS PARA TESTE =========================
    const idUser = 1;
    const nameUser = "DIOGO";
    const listElement: Element[] = [
        { id: 1, name: "Álgebra Linerar 1", description: "Descrição" },
        { id: 2, name: "Álgebra Linerar 2", description: "Descrição" },
        { id: 3, name: "Química 1", description: "Descrição" },
        { id: 4, name: "Química 2", description: "Descrição" },
        { id: 5, name: "Química 3", description: "Descrição" },
        { id: 6, name: "Estrutura de Dados 1", description: "Descrição" },
        { id: 7, name: "Estrutura de Dados 2", description: "Descrição" },
        { id: 8, name: "Estrutura de Dados 3", description: "Descrição" },
        { id: 9, name: "Cálculo 1", description: "Descrição" },
        { id: 10, name: "Cálculo 2", description: "Descrição" },
        { id: 11, name: "Redes 1", description: "Descrição" },
        { id: 12, name: "Redes 2", description: "Descrição" },
        { id: 13, name: "LP1", description: "Descrição" },
        { id: 14, name: "LP2", description: "Descrição" },
        { id: 15, name: "LP3", description: "Descrição" },
        { id: 16, name: "Redes 1", description: "Descrição" },
        { id: 17, name: "Redes 2", description: "Descrição" },
        { id: 18, name: "Churrasco 1", description: "Descrição" },
        { id: 19, name: "Foguetes 1", description: "Descrição" },
        { id: 20, name: "Pontes 1", description: "Descrição" },
    ];
    //===============================================

    //VARIAVEIS PARA CONTROLE =======================
    const [activeId, setActiveId] = useState<number | null>(null);

    //Funcao para a sidebar encontrar o elemento
    const findElement = (idElement: number) => {
        setActiveId(idElement);

        const scrollContainer = document.getElementById('scroll-container-groups');
        const elementToScroll = document.getElementById(`group-${idElement}`);

        if (scrollContainer && elementToScroll) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = elementToScroll.getBoundingClientRect();

            const scrollTopPosition = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - 16;

            scrollContainer.scrollTo({
                top: scrollTopPosition,
                behavior: 'smooth'
            });
        }
    }

    //Funcao para acessar algum elemento
    const selectElement = (idElement: number) => {
        setActiveId(idElement);

        //Para teste no console
        console.log(idElement);
        /*
        Codigo para acessar o conteudo do grupo
        ...
        */
    };
    //===============================================
    //Futuramente carregar os dados do backend ======
    //UseEffect(() =>{},[]);
    //===============================================
    return (
        <div className="flex">
            <Sidebar elements={listElement} activeId={activeId} onFindElement={findElement} />
            <main className='flex-1 p-8 h-[92vh] flex flex-col'>
                <div className='flex flex-line mb-5'>
                    <h1 className='croupier-subtitle-white'>Seus Grupos</h1>
                </div>
                <div className='bg-[#233119] flex-1 rounded-2xl border border-zinc-800 flex overflow-hidden'>
                    <div
                        id="scroll-container-groups"
                        className='flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent'>
                        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6'>
                            {listElement.map((grupo) => (
                                <GroupBox
                                    key={grupo.id}
                                    id={grupo.id}
                                    title={grupo.name}
                                    description={grupo.description}
                                    onSelectGroup={selectElement}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}