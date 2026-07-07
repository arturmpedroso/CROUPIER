import { render, screen, fireEvent } from '@testing-library/react';
import UserProfilePage from '../page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('Operação 2: Desconexão do Jogador (Logout)', () => {
  const mockParams = Promise.resolve({ username: 'artur' });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  it('Deve executar o fluxo de logout, limpando a sessão e redirecionando para o login', async () => {
    const mockUser = { id: 'user-uuid-123', username: 'artur' };
    localStorage.setItem('@croupier:user', JSON.stringify(mockUser));
    localStorage.setItem('@croupier:token', 'token-valido-da-banca');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'user-uuid-123', username: 'artur' }),
    });

    render(<UserProfilePage params={mockParams} />);

    const logoutBtn = await screen.findByRole('button', { name: /Sair do Jogo/i });
    fireEvent.click(logoutBtn);

    expect(screen.getByText('Deseja sair?')).toBeInTheDocument();
    
    const confirmBtn = screen.getByRole('button', { name: /^Sair$/i });
    fireEvent.click(confirmBtn);

    expect(localStorage.getItem('@croupier:token')).toBeNull();
    expect(localStorage.getItem('@croupier:user')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});