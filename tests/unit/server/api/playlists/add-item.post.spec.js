import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mockDb, mockReadBody } = vi.hoisted(() => {
  vi.stubGlobal('defineEventHandler', (fn) => fn);
  const readBodyFn = vi.fn();
  vi.stubGlobal('readBody', readBodyFn);
  vi.stubGlobal('createError', vi.fn((error) => {
    const err = new Error(error.statusMessage);
    err.statusCode = error.statusCode;
    err.data = error.data;
    return err;
  }));

  const mockWhereSelect = vi.fn();
  const mockFromSelect = vi.fn(() => ({ where: mockWhereSelect }));
  const mockSelect = vi.fn(() => ({ from: mockFromSelect }));

  const mockValuesInsert = vi.fn();
  const mockInsert = vi.fn(() => ({ values: mockValuesInsert }));

  return {
    mockDb: {
      select: mockSelect,
      insert: mockInsert,
      mockWhereSelect,
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

import handler from '../../../../../server/api/playlists/add-item.post';
import { getUserId } from '~/server/utils/auth';

describe('playlists/add-item.post api handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw 400 error when request body is invalid', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({});

    const event = {};
    await expect(handler(event)).rejects.toThrow('Invalid data');
  });

  it('should throw 403 error when playlist is not found or not owned by user', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'art-99',
      name: 'Artist Name',
      image: 'http://img.jpg'
    });

    mockDb.mockWhereSelect.mockResolvedValueOnce([]);

    const event = {};
    await expect(handler(event)).rejects.toThrow('Playlist not found or not yours');
  });

  it('should return alreadyInPlaylist: true if item already exists', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'art-99',
      name: 'Artist Name',
      image: 'http://img.jpg'
    });

    mockDb.mockWhereSelect
      .mockResolvedValueOnce([{ id: 42, userId: 'user-1' }])
      .mockResolvedValueOnce([{ id: 500 }]);

    const event = {};
    const result = await handler(event);

    expect(result).toEqual({ success: true, alreadyInPlaylist: true });
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('should insert and add item to playlist successfully', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({
      playlistId: 42,
      artistId: 'art-99',
      name: 'Artist Name',
      image: 'http://img.jpg'
    });

    mockDb.mockWhereSelect
      .mockResolvedValueOnce([{ id: 42, userId: 'user-1' }])
      .mockResolvedValueOnce([]); 

    mockDb.mockValuesInsert.mockResolvedValue({ success: true });

    const event = {};
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(mockDb.mockValuesInsert).toHaveBeenCalledWith({
      playlistId: 42,
      artistId: 'art-99',
      name: 'Artist Name',
      image: 'http://img.jpg'
    });
  });
});
