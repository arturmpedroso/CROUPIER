// components/forms/JoinGroupForm.tsx
import { useState } from 'react';

interface JoinGroupFormProps {
    onJoinSuccess: () => void;
}

export default function JoinGroupForm({ onJoinSuccess }: JoinGroupFormProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!code.trim()) return;
        
        setLoading(true);
        
        try {
            const token = localStorage.getItem('@croupier:token'); 

            if (!token) {
                alert("Sua sessão expirou. Faça login novamente.");
                setLoading(false);
                return;
            } 

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ shareCode: code }),
            });

            const data = await response.json();

            // ADAPTADO: Tratamento direto sem dar 'throw' para não travar o Next.js
            if (!response.ok) {
                alert(data.message || 'Código inválido ou ocorreu um erro.');
                setLoading(false);
                return; // Para a execução
            }

            // Sucesso
            console.log("Entrou no grupo:", data);
            alert("Você entrou no grupo com sucesso!");
            setCode(''); 

            // Chama a função do pai para recarregar a mesa de grupos!
            onJoinSuccess();
            
        } catch (error: any) {
            console.error("Erro ao conectar no servidor:", error);
            alert("Não foi possível conectar ao servidor."); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CÓDIGO(ex: A1B2C3)"
                maxLength={6}
                disabled={loading}
                className="croupier-table-input !py-2 !px-4 !w-55 !mb-0 text-center font-mono font-bold tracking-widest uppercase"
            />
            <button 
                onClick={handleJoin}
                disabled={code.length < 3 || loading}
                className="bg-[#026609] hover:bg-green-950 text-[#E6FAFC] px-5 py-2 rounded-xl font-bold transition disabled:opacity-50 border border-zinc-800"
            >
            {loading ? '...' : 'Entrar'}
            </button>
        </div>
    );
}