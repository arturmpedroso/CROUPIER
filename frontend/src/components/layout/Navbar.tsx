import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <header className="w-full bg-[#121312] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-wider text-[#E6FAFC]">
          CROUPIER
        </Link>
        <nav className="flex items-center space-x-8">
          <Link href="#" className="text-sm font-medium text-[#A9BBBD] hover:text-[#E6FAFC]">Início</Link>
          <Link href="#" className="text-sm font-medium text-[#A9BBBD] hover:text-[#E6FAFC]">Como Funciona</Link>
          <Link href="#" className="text-sm font-medium text-[#A9BBBD] hover:text-[#E6FAFC]">Sobre</Link>
          <Link href="/login" className="croupier-btn-nav-login">
            Login
          </Link>
        </nav>
      </header>
      
      {/* Linha vermelha divisória do Cassino */}
      <div className="croupier-divider" />
    </>
  );
}