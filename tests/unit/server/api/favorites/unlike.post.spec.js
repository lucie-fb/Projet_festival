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

import handler from '../../../../../server/api/favorites/unlike.post';
import { getUserId } from '~/server/utils/auth';

describe('favorites/unlike.post api handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw 400 error when request body is invalid', async () => {
        getUserId.mockReturnValue('user-123');
        mockReadBody.mockResolvedValue({});

        const event = {};
        await expect(handler(event)).rejects.toThrow('Donnee invalide');
    });

    it('should unlike/delete the item successfully', async () => {
        getUserId.mockReturnValue('user-123');
        mockReadBody.mockResolvedValue({ artistId: 'art-456' });

        mockDb.mockWhereSelect.mockResolvedValueOnce([{ id: 99 }]);
        mockDb.mockWhereDelete.mockResolvedValue({ count: 1 });

        const event = {};
        const result = await handler(event);

        expect(result).toEqual({ success: true });
        expect(getUserId).toHaveBeenCalledWith(event);
        expect(mockDb.select).toHaveBeenCalledTimes(1);
        expect(mockDb.delete).toHaveBeenCalledTimes(1);
        expect(mockDb.mockWhereDelete).toHaveBeenCalled();
    });
});
