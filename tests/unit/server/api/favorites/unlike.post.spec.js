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

describe('Handler API - POST /api/favorites/unlike', () => {
    let handler;

    beforeEach(async () => {
        vi.clearAllMocks();

        if (!handler) {
            const module = await import('../../../../../server/api/favorites/unlike.post');
            handler = module.default;
        }
    });

    it('devrait lever une erreur 400 si l\'identifiant de l\'artiste (artistId) est manquant', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({}); // Données vides invalides

        const fakeEvent = {};
        
        await expect(handler(fakeEvent)).rejects.toThrow('Donnee invalide');
    });

    it('devrait supprimer l\'artiste de la playlist par défaut avec succès', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({ artistId: 'artiste-999' });

        mockWhereSelect.mockResolvedValueOnce([{ id: 77 }]);
        mockWhereDelete.mockResolvedValue({ count: 1 });

        const fakeEvent = {};
        const reponse = await handler(fakeEvent);

        expect(reponse).toEqual({ success: true });
        expect(mockDelete).toHaveBeenCalled();
        expect(mockWhereDelete).toHaveBeenCalled();
    });
});
