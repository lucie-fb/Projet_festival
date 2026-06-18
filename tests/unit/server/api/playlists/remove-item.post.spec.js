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

  const mockWhereDelete = vi.fn();
  const mockDelete = vi.fn(() => ({ where: mockWhereDelete }));

  return {
    mockDb: {
      select: mockSelect,
      delete: mockDelete,
      mockWhereSelect,
      mockWhereDelete
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

import handler from '../../../../../server/api/playlists/remove-item.post';
import { getUserId } from '~/server/utils/auth';

describe('playlists/remove-item.post api handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw 400 error when request body is invalid', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({});

    const event = {};
    await expect(handler(event)).rejects.toThrow('Invalid data');
  });

  it('should throw 404 error when playlist item is not found', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockDb.mockWhereSelect.mockResolvedValueOnce([]); 

    const event = {};
    await expect(handler(event)).rejects.toThrow('Item not found');
  });

  it('should throw 403 error when playlist is not owned by user', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockDb.mockWhereSelect
      .mockResolvedValueOnce([{ playlistId: 99 }])
      .mockResolvedValueOnce([]);

    const event = {};
    await expect(handler(event)).rejects.toThrow('You cannot remove items from this playlist');
  });

  it('should delete the playlist item successfully', async () => {
    getUserId.mockReturnValue('user-1');
    mockReadBody.mockResolvedValue({ itemId: 123 });

    mockDb.mockWhereSelect
      .mockResolvedValueOnce([{ playlistId: 99 }])
      .mockResolvedValueOnce([{ id: 99, userId: 'user-1' }]);

    mockDb.mockWhereDelete.mockResolvedValue({ count: 1 });

    const event = {};
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(mockDb.delete).toHaveBeenCalledTimes(1);
    expect(mockDb.mockWhereDelete).toHaveBeenCalled();
  });
});
