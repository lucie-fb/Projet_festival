import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mockDb } = vi.hoisted(() => {
    vi.stubGlobal('defineEventHandler', (fn) => fn);

    const mockWhereSelect = vi.fn();
    const mockFromSelect = vi.fn(() => ({ where: mockWhereSelect }));
    const mockSelect = vi.fn(() => ({ from: mockFromSelect }));

    return {
        mockDb: {
            select: mockSelect,
            mockWhereSelect
        }
    };
});

vi.mock('~/server/db', () => ({
    db: mockDb
}));

vi.mock('~/server/utils/auth', () => ({
    getUserId: vi.fn()
}));

import handler from '../../../../../server/api/favorites/list.get';
import { getUserId } from '~/server/utils/auth';

describe('favorites/list.get api handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return empty favorites if no default playlist exists', async () => {
        getUserId.mockReturnValue('user-123');
        mockDb.mockWhereSelect.mockResolvedValueOnce([]);

        const event = {};
        const result = await handler(event);

        expect(result).toEqual({ favorites: [] });
        expect(mockDb.select).toHaveBeenCalledTimes(1);
    });

    it('should return list of items in the default playlist', async () => {
        getUserId.mockReturnValue('user-123');
        const mockItems = [
            { id: 1, name: 'Artist A', artistId: 'a' },
            { id: 2, name: 'Artist B', artistId: 'b' }
        ];

        mockDb.mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }])
            .mockResolvedValueOnce(mockItems);

        const event = {};
        const result = await handler(event);

        expect(result).toEqual({ favorites: mockItems });
        expect(mockDb.select).toHaveBeenCalledTimes(2);
    });
});
