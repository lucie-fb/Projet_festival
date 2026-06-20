import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockReadBody = vi.fn();
vi.stubGlobal('readBody', mockReadBody);
vi.stubGlobal('defineEventHandler', (fn) => fn);
vi.stubGlobal('createError', (errorConfig) => {
  const error = new Error(errorConfig.statusMessage);
  error.statusCode = errorConfig.statusCode || errorConfig.status;
  error.data = errorConfig.data;
  return error;
});

const mockWhereSelect = vi.fn();
const mockFromSelect = vi.fn(() => ({ where: mockWhereSelect }));
const mockSelect = vi.fn(() => ({ from: mockFromSelect }));

const mockReturningInsert = vi.fn();
const mockValuesInsert = vi.fn(() => ({ returning: mockReturningInsert }));
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

describe('Handler API - POST /api/playlists/create', () => {
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();

    if (!handler) {
      const module = await import('../../../../../server/api/playlists/create.post');
      handler = module.default;
    }
  });

  it('devrait lever une erreur 400 si le nom de la playlist est manquant ou vide', async () => {
    mockGetUserId.mockReturnValue('user-789');
    mockReadBody.mockResolvedValue({ name: '' }); 

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('Invalid data');
  });

  it('devrait lever une erreur 409 si une playlist avec ce nom existe déjà pour cet utilisateur', async () => {
    mockGetUserId.mockReturnValue('user-789');
    mockReadBody.mockResolvedValue({ name: 'Ma Playlist Rock' });

    mockWhereSelect.mockResolvedValueOnce([{ id: 123, name: 'Ma Playlist Rock', userId: 'user-789' }]);

    const fakeEvent = {};
    
    await expect(handler(fakeEvent)).rejects.toThrow('Une playlist avec ce nom existe déjà');
  });

  it('devrait insérer la nouvelle playlist dans la base de données avec isDefault à faux', async () => {
    mockGetUserId.mockReturnValue('user-789');
    mockReadBody.mockResolvedValue({ name: 'Ma Playlist Rock' });
    mockWhereSelect.mockResolvedValueOnce([]);
    
    const mockPlaylistCreee = { id: 777, name: 'Ma Playlist Rock', userId: 'user-789', isDefault: false };
    mockReturningInsert.mockResolvedValue([mockPlaylistCreee]);

    const fakeEvent = {};
    await handler(fakeEvent);

    expect(mockValuesInsert).toHaveBeenCalledWith({
      userId: 'user-789',
      name: 'Ma Playlist Rock',
      isDefault: false
    });
  });

  it('devrait renvoyer les informations de la playlist créée en cas de succès', async () => {
    mockGetUserId.mockReturnValue('user-789');
    mockReadBody.mockResolvedValue({ name: 'Ma Playlist Rock' });
    mockWhereSelect.mockResolvedValueOnce([]);
    
    const mockPlaylistCreee = { id: 777, name: 'Ma Playlist Rock', userId: 'user-789', isDefault: false };
    mockReturningInsert.mockResolvedValue([mockPlaylistCreee]);

    const fakeEvent = {};
    const reponse = await handler(fakeEvent);

    expect(reponse).toEqual({ success: true, playlist: mockPlaylistCreee });
  });
});
