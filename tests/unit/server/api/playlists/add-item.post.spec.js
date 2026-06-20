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

const mockValuesInsert = vi.fn();
const mockInsert = vi.fn(() => ({ values: mockValuesInsert }));

const mockDb = {
  select: mockSelect,
  insert: mockInsert
};

vi.mock('~/server/db', () => ({
  db: mockDb
}));

const mockGetUserId = vi.fn();
vi.mock('~/server/utils/auth', () => ({
  getUserId: mockGetUserId
}));

describe('Handler API - POST /api/playlists/add-item', () => {
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();

    if (!handler) {
      const module = await import('../../../../../server/api/playlists/add-item.post');
      handler = module.default;
    }
  });

  it('devrait lever une erreur 400 si les données envoyées (body) sont invalides', async () => {
    mockGetUserId.mockReturnValue('user-123');
    mockReadBody.mockResolvedValue({}); 

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('Invalid data');
  });

  it('devrait lever une erreur 403 si la playlist n\'existe pas ou n\'appartient pas à l\'utilisateur', async () => {
    mockGetUserId.mockReturnValue('user-123');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'artiste-99',
      name: 'Nom Artiste',
      image: 'http://img.jpg'
    });
    mockWhereSelect.mockResolvedValueOnce([]);

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('Playlist not found or not yours');
  });

  it('devrait renvoyer un indicateur si l\'artiste est déjà dans la playlist', async () => {
    mockGetUserId.mockReturnValue('user-123');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'artiste-99',
      name: 'Nom Artiste',
      image: 'http://img.jpg'
    });

    mockWhereSelect
      .mockResolvedValueOnce([{ id: 42, userId: 'user-123' }])
      .mockResolvedValueOnce([{ id: 500 }]);

    const fakeEvent = {};
    const reponse = await handler(fakeEvent);

    expect(reponse).toEqual({ success: true, alreadyInPlaylist: true });
  });

  it('ne devrait pas ajouter de doublons dans la table playlistItems', async () => {
    mockGetUserId.mockReturnValue('user-123');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'artiste-99',
      name: 'Nom Artiste',
      image: 'http://img.jpg'
    });

    mockWhereSelect
      .mockResolvedValueOnce([{ id: 42, userId: 'user-123' }])
      .mockResolvedValueOnce([{ id: 500 }]);

    const fakeEvent = {};
    await handler(fakeEvent);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('devrait ajouter l\'artiste à la playlist s\'il n\'y est pas encore', async () => {
    mockGetUserId.mockReturnValue('user-123');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'artiste-99',
      name: 'Nom Artiste',
      image: 'http://img.jpg'
    });

    mockWhereSelect
      .mockResolvedValueOnce([{ id: 42, userId: 'user-123' }])
      .mockResolvedValueOnce([]); 

    mockValuesInsert.mockResolvedValue({ success: true });

    const fakeEvent = {};
    const reponse = await handler(fakeEvent);

    expect(reponse).toEqual({ success: true });
    expect(mockValuesInsert).toHaveBeenCalledWith({
      playlistId: 42,
      artistId: 'artiste-99',
      name: 'Nom Artiste',
      image: 'http://img.jpg'
    });
  });
});
