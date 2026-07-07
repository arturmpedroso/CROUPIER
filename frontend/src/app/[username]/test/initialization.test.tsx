import { render, screen, waitFor } from '@testing-library/react';
import UserProfilePage from '../page';

// Mock do roteador do Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('Operação 1: Inicialização da Mesa', () => {
  const mockParams = Promise.resolve({ username: 'artur' });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  it('Deve executar o fluxo completo de carregamento do perfil por ID e validar que o usuário é o dono', async () => {
    const mockUser = { id: 'user-uuid-123', username: 'artur' };
    localStorage.setItem('@croupier:user', JSON.stringify(mockUser));
    localStorage.setItem('@croupier:token', 'token-valido-da-banca');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'user-uuid-123', username: 'artur' }),
    });

    render(<UserProfilePage params={mockParams} />);

    expect(screen.getByText(/Identificando jogador.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/user-uuid-123'),
        expect.any(Object)
      );
      expect(screen.getByText('@ artur')).toBeInTheDocument();
      expect(screen.getByText('Sua Mesa (Dono)')).toBeInTheDocument();
    });
  });
});