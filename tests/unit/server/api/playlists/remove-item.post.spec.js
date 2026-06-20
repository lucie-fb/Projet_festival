import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockReadBody = vi.fn();
vi.stubGlobal('readBody', mockReadBody);
vi.stubGlobal('defineEventHandler', (fn) => fn);
vi.stubGlobal('createError', (errorConfig) => {
  const error = new Error(errorConfig.statusMessage);
  error.statusCode = errorConfig.statusCode;
  error.data = errorConfig.data;
  return error;
});

const mockWhereSelect = vi.fn();
const mockFromSelect = vi.fn(() => ({ where: mockWhereSelect }));
const mockSelect = vi.fn(() => ({ from: mockFromSelect }));

const mockWhereDelete = vi.fn();
const mockDelete = vi.fn(() => ({ where: mockWhereDelete }));

const mockDb = {
  select: mockSelect,
  delete: mockDelete
};

vi.mock('~/server/db', () => ({
  db: mockDb
}));

const mockGetUserId = vi.fn();
vi.mock('~/server/utils/auth', () => ({
  getUserId: mockGetUserId
}));

describe('Handler API - POST /api/playlists/remove-item', () => {
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();

    if (!handler) {
      const module = await import('../../../../../server/api/playlists/remove-item.post');
      handler = module.default;
    }
  });

  it('devrait lever une erreur 400 si l\'identifiant de l\'élément (itemId) est manquant', async () => {
    mockGetUserId.mockReturnValue('user-999');
    mockReadBody.mockResolvedValue({});

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('Invalid data');
  });

  it('devrait lever une erreur 404 si l\'élément de playlist à retirer n\'existe pas', async () => {
    mockGetUserId.mockReturnValue('user-999');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockWhereSelect.mockResolvedValueOnce([]); 

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('Item not found');
  });

  it('devrait lever une erreur 403 si la playlist contenant l\'élément n\'appartient pas à l\'utilisateur', async () => {
    mockGetUserId.mockReturnValue('user-999');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockWhereSelect
      .mockResolvedValueOnce([{ playlistId: 99 }])
      .mockResolvedValueOnce([]);

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('You cannot remove items from this playlist');
  });

  it('devrait supprimer l\'élément de la playlist en base de données', async () => {
    mockGetUserId.mockReturnValue('user-999');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockWhereSelect
      .mockResolvedValueOnce([{ playlistId: 99 }])
      .mockResolvedValueOnce([{ id: 99, userId: 'user-999' }]);

    mockWhereDelete.mockResolvedValue({ count: 1 });

    const fakeEvent = {};
    await handler(fakeEvent);

    expect(mockDelete).toHaveBeenCalled();
    expect(mockWhereDelete).toHaveBeenCalled();
  });

  it('devrait retourner success en cas de suppression réussie', async () => {
    mockGetUserId.mockReturnValue('user-999');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockWhereSelect
      .mockResolvedValueOnce([{ playlistId: 99 }])
      .mockResolvedValueOnce([{ id: 99, userId: 'user-999' }]);

    mockWhereDelete.mockResolvedValue({ count: 1 });

    const fakeEvent = {};
    const reponse = await handler(fakeEvent);

    expect(reponse).toEqual({ success: true });
  });
});
