import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Croupier - Flashcards',
  description: 'Apostas inteligentes no seu conhecimento',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="croupier-body">
        
   
        <Navbar />

       
        {children}

      
        <Footer />
        
      </body>
    </html>
  );
}