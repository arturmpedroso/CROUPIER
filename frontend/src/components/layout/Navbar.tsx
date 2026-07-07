"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmLogoutModal from '@/components/modals/ConfirmLogoutModal';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  // Checa o login assim que o componente monta
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('@croupier:token');
      const userStored = localStorage.getItem('@croupier:user');
      
      if (token && userStored) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(userStored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

  // Executa na montagem
  checkAuth();

  // Escuta o evento que disparamos no login
  window.addEventListener('storage', checkAuth);

  // Limpa o listener ao desmontar
  return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem('@croupier:token');
    localStorage.removeItem('@croupier:user');
    setIsLoggedIn(false);
    router.push('/home');
  };

  return (
    <>
      <header className="w-full bg-[#121312] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-wider text-[#E6FAFC]">
          CROUPIER
        </Link>
        
        <nav className="flex items-center  space-x-2">
          
          {isLoggedIn && user ? (
            // MENU DO USUÁRIO LOGADO
            <>
              <Link href="/groups" className="croupier-btn-nav-ghost">Grupos</Link>
              <Link href={`/${user.username}`} className="croupier-btn-nav-ghost">Perfil</Link>
              <Link href="/about" className="croupier-btn-nav-ghost">Sobre nós</Link>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="croupier-btn-logout"
              >
                Sair
              </button>
            </>
          ) : (
            // MENU DO USUÁRIO VISITANTE
            <>
              <Link href="/how-it-works" className="croupier-btn-nav-ghost]">Como Funciona</Link>
              <Link href="/about" className="croupier-btn-nav-ghost">Sobre</Link>
              <Link href="/login" className="croupier-btn-nav-login">
                Login
              </Link>
            </>
          )}
        </nav>
      </header>
      <ConfirmLogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={() =>{handleLogout(); setIsLogoutModalOpen(false);}} title="Deseja sair?" message="Você será desconectado da sua conta. Tem certeza que deseja continuar?" confirmText="Sair"/>
      <div className="croupier-divider" />
    </>
  );
}