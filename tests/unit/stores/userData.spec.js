import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserDataStore } from '../../../stores/userData';

const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

describe('useUserDataStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockFetch.mockReset();
    });

    describe('state', () => {
        it('should initialize with default state', () => {
            const store = useUserDataStore();
            expect(store.favorites).toEqual([]);
            expect(store.playlists).toEqual([]);
            expect(store.loaded).toBe(false);
        });
    });

    describe('actions - load', () => {
        it('should load favorites and playlists if not loaded', async () => {
            const mockFavs = { value: [{ artistId: '1', name: 'Artist 1' }] };
            const mockPlaylists = { value: [{ id: 1, name: 'Playlist 1' }] };

            mockFetch
                .mockResolvedValueOnce(mockFavs)
                .mockResolvedValueOnce(mockPlaylists);

            const store = useUserDataStore();
            await store.load();

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/favorites/list', { credentials: 'include' });
            expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/playlists/list', { credentials: 'include' });
            
            expect(store.favorites).toEqual(mockFavs.value);
            expect(store.playlists).toEqual(mockPlaylists.value);
            expect(store.loaded).toBe(true);
        });

        it('should not fetch again if already loaded', async () => {
            const store = useUserDataStore();
            store.loaded = true;
            store.favorites = [{ artistId: '1' }];

            await store.load();

            expect(mockFetch).not.toHaveBeenCalled();
            expect(store.favorites).toEqual([{ artistId: '1' }]);
        });

        it('should handle empty/undefined values gracefully', async () => {
            mockFetch
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});

            const store = useUserDataStore();
            await store.load();

            expect(store.favorites).toEqual([]);
            expect(store.playlists).toEqual([]);
            expect(store.loaded).toBe(true);
        });

        it('should propagate errors from fetch', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

            const store = useUserDataStore();
            await expect(store.load()).rejects.toThrow('Fetch failed');
            expect(store.loaded).toBe(false);
        });
    });

    describe('isFavorite', () => {
        it('should return true if artistId is in favorites', () => {
            const store = useUserDataStore();
            store.favorites = [{ artistId: '123' }, { artistId: '456' }];

            expect(store.isFavorite('123')).toBe(true);
            expect(store.isFavorite('789')).toBe(false);
        });

        it('should return false if favorites is empty', () => {
            const store = useUserDataStore();
            expect(store.isFavorite('123')).toBe(false);
        });
    });
});
