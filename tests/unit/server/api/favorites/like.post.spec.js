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

describe('Handler API - POST /api/favorites/like', () => {
    let handler;

    beforeEach(async () => {
        vi.clearAllMocks();

        if (!handler) {
            const module = await import('../../../../../server/api/favorites/like.post');
            handler = module.default;
        }
    });

    it('devrait lever une erreur 400 si le corps de la requête est vide ou incomplet', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({});

        const fakeEvent = {};
        
        await expect(handler(fakeEvent)).rejects.toThrow('Donnee invalide');
    });

    it('devrait récupérer l\'identifiant de l\'utilisateur à partir de l\'événement', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({
            artistId: 'art-456',
            name: 'Super Artiste',
            image: 'http://image.png'
        });
        mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }]) 
            .mockResolvedValueOnce([]);  

        mockValuesInsert.mockResolvedValue({ success: true });

        const fakeEvent = { de_l_info: 'utile' };
        await handler(fakeEvent);

        expect(mockGetUserId).toHaveBeenCalledWith(fakeEvent);
    });

    it('devrait retourner success et alreadyLiked si l\'artiste est déjà présent dans la playlist par défaut', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({
            artistId: 'art-456',
            name: 'Super Artiste',
            image: 'http://image.png'
        });

        mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }])
            .mockResolvedValueOnce([{ id: 1001 }]);

        const fakeEvent = {};
        const reponse = await handler(fakeEvent);

        expect(reponse).toEqual({ success: true, alreadyLiked: true });
    });

    it('ne devrait pas insérer de doublon en base de données si l\'artiste est déjà dans les favoris', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({
            artistId: 'art-456',
            name: 'Super Artiste',
            image: 'http://image.png'
        });
        mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }])
            .mockResolvedValueOnce([{ id: 1001 }]);

        const fakeEvent = {};
        await handler(fakeEvent);

        expect(mockInsert).not.toHaveBeenCalled();
    });

    it('devrait enregistrer l\'artiste en base de données s\'il n\'est pas déjà dans les favoris', async () => {
        mockGetUserId.mockReturnValue('utilisateur-123');
        mockReadBody.mockResolvedValue({
            artistId: 'art-456',
            name: 'Super Artiste',
            image: 'http://image.png'
        });

        mockWhereSelect
            .mockResolvedValueOnce([{ id: 99 }])
            .mockResolvedValueOnce([]);

        mockValuesInsert.mockResolvedValue({ success: true });

        const fakeEvent = {};
        const reponse = await handler(fakeEvent);

        expect(reponse).toEqual({ success: true });
        expect(mockValuesInsert).toHaveBeenCalledWith({
            playlistId: 99,
            artistId: 'art-456',
            name: 'Super Artiste',
            image: 'http://image.png'
        });
    });
});
