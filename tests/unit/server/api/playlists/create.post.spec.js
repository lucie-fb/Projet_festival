import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mockDb, mockReadBody } = vi.hoisted(() => {
  vi.stubGlobal('defineEventHandler', (fn) => fn);
  const readBodyFn = vi.fn();
  vi.stubGlobal('readBody', readBodyFn);
  vi.stubGlobal('createError', vi.fn((error) => {
    const err = new Error(error.statusMessage);
    err.statusCode = error.statusCode || error.status;
    err.data = error.data;
    return err;
  }));

  const mockWhereSelect = vi.fn();
  const mockFromSelect = vi.fn(() => ({ where: mockWhereSelect }));
  const mockSelect = vi.fn(() => ({ from: mockFromSelect }));

  const mockReturningInsert = vi.fn();
  const mockValuesInsert = vi.fn(() => ({ returning: mockReturningInsert }));
  const mockInsert = vi.fn(() => ({ values: mockValuesInsert }));

  return {
    mockDb: {
      select: mockSelect,
      insert: mockInsert,
      mockWhereSelect,
      mockReturningInsert,
      mockValuesInsert
    },
    mockReadBody: readBodyFn
  };
});

vi.mock('~/server/db', () => ({
  db: mockDb
}));

vi.mock('~/server/utils/auth', () => ({
  getUserId: vi.fn()
}));

import handler from '../../../../../server/api/playlists/create.post';
import { getUserId } from '~/server/utils/auth';

describe('playlists/create.post api handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw 400 error when playlist name is empty/invalid', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({ name: '' });

    const event = {};
    await expect(handler(event)).rejects.toThrow('Invalid data');
  });

  it('should throw 409 error when playlist with same name already exists', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({ name: 'Chill Vibes' });

    mockDb.mockWhereSelect.mockResolvedValueOnce([{ id: 123, name: 'Chill Vibes', userId: 'user-1' }]);

    const event = {};
    await expect(handler(event)).rejects.toThrow('Une playlist avec ce nom existe déjà');
  });

  it('should create playlist successfully', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({ name: 'Chill Vibes' });

    mockDb.mockWhereSelect.mockResolvedValueOnce([]);
    const createdPlaylist = { id: 777, name: 'Chill Vibes', userId: 'user-1', isDefault: false };
    mockDb.mockReturningInsert.mockResolvedValue([createdPlaylist]);

    const event = {};
    const result = await handler(event);

    expect(result).toEqual({ success: true, playlist: createdPlaylist });
    expect(mockDb.mockValuesInsert).toHaveBeenCalledWith({
      userId: 'user-1',
      name: 'Chill Vibes',
      isDefault: false
    });
  });
});
