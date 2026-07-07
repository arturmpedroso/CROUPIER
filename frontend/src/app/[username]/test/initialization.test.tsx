import { render, screen, waitFor } from '@testing-library/react';
import UserProfilePage from '../page';

// Mock do router
const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock do use()
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

describe('Operação 1: Inicialização da Mesa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn() as jest.Mock;
  });

  it('Deve executar o fluxo completo...', async () => {
    const mockUser = { id: 'user-uuid-123', username: 'artur' };

    // Mock sessão
    localStorage.setItem('@croupier:user', JSON.stringify(mockUser));
    localStorage.setItem('@croupier:token', 'token-valido-da-banca');

    // Mock API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const mockParams = Promise.resolve({ username: 'artur' });

    render(<UserProfilePage params={mockParams as any} />);

    // Estado inicial (loading)
    expect(
      await screen.findByText(/Identificando jogador/i)
    ).toBeInTheDocument();

    // Verifica chamada da API
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/user-uuid-123'),
        expect.any(Object)
      );
    });

    // Estado final (dados renderizados)
    expect(await screen.findByText('@ artur')).toBeInTheDocument();

    expect(
      await screen.findByText(/Sua Mesa \(Dono\)/i)
    ).toBeInTheDocument();
  });
});