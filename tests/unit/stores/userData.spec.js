import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserDataStore } from '../../../stores/userData';

const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

describe('Store Pinia - userData', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockFetch.mockReset();
    });

    describe('État initial (State)', () => {
        it('devrait commencer avec une liste de favoris vide', () => {
            const store = useUserDataStore();
            expect(store.favorites).toEqual([]);
        });

        it('devrait commencer avec une liste de playlists vide', () => {
            const store = useUserDataStore();
            expect(store.playlists).toEqual([]);
        });

        it('devrait commencer avec l\'état de chargement "loaded" égal à faux', () => {
            const store = useUserDataStore();
            expect(store.loaded).toBe(false);
        });
    });

    describe('Action - load()', () => {
        it('devrait appeler l\'API de favoris et l\'API de playlists', async () => {
            mockFetch
                .mockResolvedValueOnce({ value: [] })
                .mockResolvedValueOnce({ value: [] });

            const store = useUserDataStore();
            await store.load();

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/favorites/list', { credentials: 'include' });
            expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/playlists/list', { credentials: 'include' });
        });

        it('devrait enregistrer les favoris récupérés de l\'API dans le store', async () => {
            const mockFavoris = [{ artistId: 'art-1', name: 'Artiste un' }];
            mockFetch
                .mockResolvedValueOnce({ value: mockFavoris })
                .mockResolvedValueOnce({ value: [] });

            const store = useUserDataStore();
            await store.load();

            expect(store.favorites).toEqual(mockFavoris);
        });

        it('devrait enregistrer les playlists récupérées de l\'API dans le store', async () => {
            const mockPlaylists = [{ id: 1, name: 'Ma super Playlist' }];
            mockFetch
                .mockResolvedValueOnce({ value: [] })
                .mockResolvedValueOnce({ value: mockPlaylists });

            const store = useUserDataStore();
            await store.load();

            expect(store.playlists).toEqual(mockPlaylists);
        });

        it('devrait passer le témoin "loaded" à vrai après le chargement des données', async () => {
            mockFetch
                .mockResolvedValueOnce({ value: [] })
                .mockResolvedValueOnce({ value: [] });

            const store = useUserDataStore();
            await store.load();

            expect(store.loaded).toBe(true);
        });

        it('ne devrait faire aucun appel API si "loaded" est déjà à vrai', async () => {
            const store = useUserDataStore();
            store.loaded = true;
            store.favorites = [{ artistId: 'deja-la' }];

            await store.load();

            expect(mockFetch).not.toHaveBeenCalled();
            expect(store.favorites).toEqual([{ artistId: 'deja-la' }]);
        });

        it('devrait initialiser avec des tableaux vides si l\'API renvoie des valeurs indéfinies ou vides', async () => {
            mockFetch
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});

            const store = useUserDataStore();
            await store.load();

            expect(store.favorites).toEqual([]);
            expect(store.playlists).toEqual([]);
        });

        it('devrait lever une erreur si le chargement des favoris échoue', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Erreur réseau'));

            const store = useUserDataStore();
            
            await expect(store.load()).rejects.toThrow('Erreur réseau');
        });

        it('devrait laisser "loaded" à faux si le chargement échoue', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Erreur réseau'));

            const store = useUserDataStore();
            
            try {
                await store.load();
            } catch (e) {
                // Ignore l'erreur pour inspecter l'état du store
            }

            expect(store.loaded).toBe(false);
        });
    });

    describe('Méthode - isFavorite(id)', () => {
        it('devrait renvoyer vrai si l\'artiste est présent dans les favoris', () => {
            const store = useUserDataStore();
            store.favorites = [
                { artistId: 'artiste-123' },
                { artistId: 'artiste-456' }
            ];

            expect(store.isFavorite('artiste-123')).toBe(true);
        });

        it('devrait renvoyer faux si l\'artiste n\'est pas présent dans les favoris', () => {
            const store = useUserDataStore();
            store.favorites = [
                { artistId: 'artiste-123' }
            ];

            expect(store.isFavorite('artiste-999')).toBe(false);
        });

        it('devrait renvoyer faux si la liste des favoris est vide', () => {
            const store = useUserDataStore();
            store.favorites = [];

            expect(store.isFavorite('artiste-123')).toBe(false);
        });
    });
});
