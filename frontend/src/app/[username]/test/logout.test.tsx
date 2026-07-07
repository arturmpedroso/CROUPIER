import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfilePage from '../page';

// Mock do router
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do Link (Next.js)
jest.mock('next/link', () => {
  return ({ children }: any) => children;
});

//  Mock do use() para resolver Promise de params
jest.mock('react', () => {
  const original = jest.requireActual('react');

  return {
    ...original,
    use: (value: any) => {
      if (value && typeof value.then === 'function') {
        return { username: 'artur' };
      }
      return value;
    },
  };
});

describe('Operação 2: Desconexão do Jogador (Logout)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn() as jest.Mock;
  });

  it('Deve executar o fluxo completo de logout, limpando sessão e redirecionando', async () => {
    const mockUser = { id: 'user-uuid-123', username: 'artur' };

    // Mock da sessão
    localStorage.setItem('@croupier:user', JSON.stringify(mockUser));
    localStorage.setItem('@croupier:token', 'token-valido');

    //  Mock da API (fetch do perfil)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const mockParams = Promise.resolve({ username: 'artur' });

    render(<UserProfilePage params={mockParams as any} />);

    //  Aguarda sair do loading
    expect(
      await screen.findByText(/Identificando jogador/i)
    ).toBeInTheDocument();

    // Aguarda renderização do perfil
    expect(
      await screen.findByText(/@ artur/i)
    ).toBeInTheDocument();

    // Botão de logout visível
    const logoutBtn = await screen.findByRole('button', {
      name: /Sair do Jogo/i,
    });

  
    fireEvent.click(logoutBtn);

   
    expect(
      await screen.findByText(/Sair da Mesa/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Tem certeza/i)
    ).toBeInTheDocument();

    //  Botões do modal
    const confirmBtn = screen.getByRole('button', {
      name: /^Sair$/i,
    });

    const cancelBtn = screen.getByRole('button', {
      name: /Ficar/i,
    });

    expect(confirmBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();

    // Confirma logout
    fireEvent.click(confirmBtn);

    //  Verifica efeitos colaterais
    await waitFor(() => {
      expect(localStorage.getItem('@croupier:token')).toBeNull();
      expect(localStorage.getItem('@croupier:user')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});