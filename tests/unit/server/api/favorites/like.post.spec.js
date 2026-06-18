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

import handler from '../../../../../server/api/favorites/like.post';
import { getUserId } from '~/server/utils/auth';

describe('favorites/like.post api handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw 400 error when request body is invalid', async () => {
        getUserId.mockReturnValue('user-123');
        mockReadBody.mockResolvedValue({}); // missing required 'name' and 'artistId'

        const event = {};
        await expect(handler(event)).rejects.toThrow('Donnee invalide');
    });

    it('should like an artist successfully when not already liked', async () => {
        getUserId.mockReturnValue('user-123');
        mockReadBody.mockResolvedValue({
            artistId: 'art-456',
            name: 'Super Artist',
            image: 'http://image.png'
        });

        mockDb.mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }])
            .mockResolvedValueOnce([]);

        mockDb.mockValuesInsert.mockResolvedValue({ success: true });

        const event = {};
        const result = await handler(event);

        expect(result).toEqual({ success: true });
        expect(getUserId).toHaveBeenCalledWith(event);
        expect(mockDb.select).toHaveBeenCalledTimes(2);
        expect(mockDb.mockValuesInsert).toHaveBeenCalledWith({
            playlistId: 99,
            artistId: 'art-456',
            name: 'Super Artist',
            image: 'http://image.png'
        });
    });

    it('should return alreadyLiked: true if item already exists in default playlist', async () => {
        getUserId.mockReturnValue('user-123');
        mockReadBody.mockResolvedValue({
            artistId: 'art-456',
            name: 'Super Artist',
            image: 'http://image.png'
        });

        mockDb.mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }])
            .mockResolvedValueOnce([{ id: 1001 }]);

        const event = {};
        const result = await handler(event);

        expect(result).toEqual({ success: true, alreadyLiked: true });
        expect(mockDb.insert).not.toHaveBeenCalled();
    });
});
