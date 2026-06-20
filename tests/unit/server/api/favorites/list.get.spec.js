import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.stubGlobal('defineEventHandler', (fn) => fn);

const mockWhereSelect = vi.fn();
const mockFromSelect = vi.fn(() => ({ where: mockWhereSelect }));
const mockSelect = vi.fn(() => ({ from: mockFromSelect }));

const mockDb = {
    select: mockSelect
};

vi.mock('~/server/db', () => ({
    db: mockDb
}));

const mockGetUserId = vi.fn();
vi.mock('~/server/utils/auth', () => ({
    getUserId: mockGetUserId
}));

describe('Handler API - GET /api/favorites/list', () => {
    let handler;

    beforeEach(async () => {
        vi.clearAllMocks();

        if (!handler) {
            const module = await import('../../../../../server/api/favorites/list.get');
            handler = module.default;
        }
    });

    it('devrait renvoyer un tableau de favoris vide si la playlist par défaut n\'existe pas', async () => {
        mockGetUserId.mockReturnValue('utilisateur-456');
        
        mockWhereSelect.mockResolvedValueOnce([]);

        const fakeEvent = {};
        const reponse = await handler(fakeEvent);

        expect(reponse).toEqual({ favorites: [] });
    });

    it('devrait récupérer la liste des favoris de l\'utilisateur si la playlist par défaut existe', async () => {
        mockGetUserId.mockReturnValue('utilisateur-456');

        const mockFavoris = [
            { id: 1, name: 'Artiste Pop', artistId: 'pop-1' },
            { id: 2, name: 'Artiste Jazz', artistId: 'jazz-2' }
        ];

        mockWhereSelect
            .mockResolvedValueOnce([{ id: 88 }])
            .mockResolvedValueOnce(mockFavoris);

        const fakeEvent = {};
        const reponse = await handler(fakeEvent);

        expect(reponse).toEqual({ favorites: mockFavoris });
    });
});
