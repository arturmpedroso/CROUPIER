'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmLogoutModal from '@/components/modals/ConfirmLogoutModal';

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserPageProps) {
  const { username } = use(params);
  const router = useRouter();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('@croupier:user');
    const token = localStorage.getItem('@croupier:token');

    if (storedUser && token) {
      const userObj = JSON.parse(storedUser);
      setLoggedInUser(userObj);

      if (userObj.username === username) {
        setIsOwner(true);
      }
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('@croupier:token');
    localStorage.removeItem('@croupier:user');
    setIsLogoutModalOpen(false);
    router.push('/login');
  };

  // PLACEHOLDER DA TELA DE GRUPOS

  return (
    <main className="flex-1 bg-[#1c1e1a] text-[#E6FAFC] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        

        <div className="flex justify-between items-center bg-[#232621] p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <div>
            <h1 className="text-3xl font-black text-[#97DB4F]">@ {username}</h1>
            <p className="text-sm text-[#A9BBBD]">Mesa de Estudos e Flashcards</p>
          </div>
          

          {isOwner ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs bg-[#567D2D] px-3 py-1 rounded-full font-bold text-white">
                Sua Mesa (Dono)
              </span>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="bg-[#A21C0A] hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Sair do Jogo
              </button>
            </div>
          ) : (
            <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full font-bold text-zinc-400">
              Modo Visitante
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {isOwner && (
            <div className="bg-[#354727] p-6 rounded-2xl border-2 border-[#567D2D] md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-[#E6FAFC]">📊 Seu Desempenho</h3>
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-xl">
                  <p className="text-xs text-[#A9BBBD]">Cards com maior índice de erro</p>
                  <p className="text-2xl font-black text-[#A21C0A] mt-1">42%</p>
                </div>
                <div className="bg-black/30 p-3 rounded-xl">
                  <p className="text-xs text-[#A9BBBD]">Baralhos Revisados</p>
                  <p className="text-2xl font-black text-[#97DB4F] mt-1">12</p>
                </div>
              </div>
            </div>
          )}


          <div className={`bg-[#232621] p-6 rounded-2xl border border-zinc-800 ${isOwner ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <h3 className="text-lg font-bold mb-4">🃏 Grupos de Baralhos</h3>
            

            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
              <p className="font-medium">Nenhum baralho público compartilhado nesta mesa ainda.</p>
              {isOwner && (
                <button className="mt-4 bg-[#97DB4F] text-black font-bold px-4 py-2 rounded-lg text-xs hover:bg-[#567D2D] hover:text-white transition">
                  + Criar Primeiro Baralho
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
      <ConfirmLogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={() =>{handleLogout(); setIsLogoutModalOpen(false);}} title="Deseja sair?" message="Você será desconectado da sua conta. Tem certeza que deseja continuar?" confirmText="Sair"/>
    </main>
  );
}