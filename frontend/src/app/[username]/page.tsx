'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfirmLogoutModal from '@/components/modals/ConfirmLogoutModal';

interface UserProfile {
  id: string;
  username: string;
}

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserPageProps) {
  const { username } = use(params);
  const router = useRouter();

  // Estados de Autenticação e Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  // Estados de Dados da API
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      try {
        const token = localStorage.getItem('@croupier:token');
        const storedUser = localStorage.getItem('@croupier:user');
        
        if (!storedUser) {
          throw new Error("Nenhum jogador identificado na mesa. Faça login novamente.");
        }

        const userObj = JSON.parse(storedUser);

        // Se o username da URL bater com o do usuário logado, usamos o ID dele!
        if (userObj.username === username) {
          setIsOwner(true);
          
          const isValidToken = token && token !== 'null' && token !== 'undefined';
          const headers = isValidToken ? { Authorization: `Bearer ${token}` } : {};

          const response = await fetch(`${BASE_URL}/users/${userObj.id}`, { headers });

          if (!response.ok) {
            throw new Error(`Erro ${response.status}: Não foi possível carregar os dados da mesa.`);
          }
          
          const profileData = await response.json();
          setProfileUser(profileData);
        } else {
          // Se o username da URL for diferente do logado (Modo Visitante)
          setIsOwner(false);
          
          throw new Error(`Para visualizar a mesa de @${username}, o backend precisaria de uma rota de busca por username.`);
        }
      } catch (err: any) {
        console.error("Erro ao carregar perfil:", err);
        setError(err.message || 'Erro ao conectar com o servidor da banca.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('@croupier:token');
    localStorage.removeItem('@croupier:user');
    setIsLogoutModalOpen(false);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-[#1c1e1a] text-[#E6FAFC] p-8 flex justify-center items-center">
        <p className="text-xl font-bold text-[#97DB4F] animate-pulse">Identificando jogador...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-[#1c1e1a] text-[#E6FAFC] p-8 flex flex-col justify-center items-center space-y-4">
        <h2 className="text-3xl font-black text-[#A21C0A]">Mesa Não Encontrada</h2>
        <p className="text-[#A9BBBD] text-center max-w-md">{error}</p>
        <button onClick={() => router.push('/')} className="text-[#97DB4F] hover:underline">
          Voltar ao Lobby
        </button>
      </main>
    );
  }

return (
  <main className="flex-1 bg-[#1c1e1a] text-[#E6FAFC] p-8">
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* CABEÇALHO DO PERFIL */}
      <div className="flex justify-between items-center bg-[#232621] p-6 rounded-2xl border border-zinc-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-black text-[#97DB4F]">@ {profileUser?.username || username}</h1>
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
          {/* ESTATÍSTICAS 
          {isOwner && (
            <div className="bg-[#354727] p-6 rounded-2xl border-2 border-[#567D2D] md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-[#E6FAFC]">📊 Seu Desempenho</h3>
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-xl">
                  <p className="text-xs text-[#A9BBBD]">Cards com maior índice de erro</p>
                  <p className="text-2xl font-black text-[#A21C0A] mt-1">42%</p>
                </div>
                <div className="bg-black/30 p-3 rounded-xl">
                  <p className="text-xs text-[#A9BBBD]">Ações Pendentes</p>
                  <p className="text-2xl font-black text-[#97DB4F] mt-1">Ativo</p>
                </div>
              </div>
            </div>
          )}*/}
      {/* CARD DE REDIRECIONAMENTO (Agora sem col-span e sem grid, cobrindo toda a largura) */}
      <div className="bg-[#232621] p-8 rounded-2xl border border-zinc-800 flex flex-col justify-center items-center text-center w-full shadow-xl">
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold text-white">🃏 Grupos de Baralhos</h3>
          <p className="text-sm text-[#A9BBBD]">
            Os baralhos e mesas de estudo foram centralizados na nossa área de gerenciamento coletivo.
          </p>
        </div>
        
        <Link 
          href="/groups"
          className="mt-6 bg-[#97DB4F] text-black font-black px-6 py-3 rounded-xl text-xs hover:bg-[#567D2D] hover:text-white transition uppercase tracking-wider shadow-md"
        >
          Acessar Meus Grupos →
        </Link>
      </div>

    </div>
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => { handleLogout(); setIsLogoutModalOpen(false); }}
      />
    </main>
  );
}