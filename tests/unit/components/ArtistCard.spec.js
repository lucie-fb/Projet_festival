import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ArtistCard from '../../../components/ArtistCard.vue';
import { useUserDataStore } from '../../../stores/userData';

const mockPush = vi.fn();
const mockRoute = { path: '/' };
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useRoute: () => mockRoute
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key, params) => `${key} ${JSON.stringify(params || {})}`
  })
}));

const mockLocalePath = vi.fn((path) => path);
vi.stubGlobal('useLocalePath', () => mockLocalePath);

const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

describe('ArtistCard.vue', () => {
  let pinia;
  let userDataStore;
  const mockArtist = {
    id: 'art-123',
    name: 'Jane Doe',
    image: 'http://jane.jpg'
  };

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    userDataStore = useUserDataStore();
    
    mockPush.mockReset();
    mockFetch.mockReset();
    mockLocalePath.mockClear();
    mockRoute.path = '/';
    
    userDataStore.favorites = [];
    userDataStore.playlists = [
      { id: 10, name: 'My Rock' },
      { id: 20, name: 'My Pop' }
    ];
  });

  const createWrapper = (props = {}) => {
    return mount(ArtistCard, {
      global: {
        plugins: [pinia]
      },
      props: {
        artist: mockArtist,
        ...props
      }
    });
  };

  it('renders artist information correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h2').text()).toBe('Jane Doe');
    expect(wrapper.find('img').attributes('src')).toBe('http://jane.jpg');
    expect(wrapper.find('.fav-btn').exists()).toBe(true);
    expect(wrapper.find('.menu-btn').exists()).toBe(true);
  });

  it('renders in compact mode without buttons', () => {
    const wrapper = createWrapper({ compact: true });
    expect(wrapper.find('.fav-btn').exists()).toBe(false);
    expect(wrapper.find('.menu-btn').exists()).toBe(false);
    expect(wrapper.find('img').classes()).toContain('compact');
    expect(wrapper.find('h2').classes()).toContain('compact');
  });

  describe('Navigation', () => {
    it('redirects to artist page if route is not /artists', async () => {
      mockRoute.path = '/home';
      const wrapper = createWrapper();
      await wrapper.trigger('click');
      expect(mockLocalePath).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/artists/[id]?name=Jane%20Doe');
    });

    it('emits select event if route is /artists', async () => {
      mockRoute.path = '/artists';
      const wrapper = createWrapper();
      await wrapper.trigger('click');
      expect(mockPush).not.toHaveBeenCalled();
      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual(['Jane Doe']);
    });
  });

  describe('Favorites toggle', () => {
    it('adds to favorites if not already a favorite', async () => {
      userDataStore.isFavorite = vi.fn().mockReturnValue(false);
      mockFetch.mockResolvedValue({ success: true });

      const wrapper = createWrapper();
      const favBtn = wrapper.find('.fav-btn');
      await favBtn.trigger('click');

      expect(mockFetch).toHaveBeenCalledWith('/api/favorites/like', {
        method: 'POST',
        body: {
          artistId: 'art-123',
          name: 'Jane Doe',
          image: 'http://jane.jpg'
        },
        credentials: 'include'
      });
      expect(userDataStore.favorites).toContainEqual({
        artistId: 'art-123',
        name: 'Jane Doe',
        image: 'http://jane.jpg'
      });
    });

    it('removes from favorites if already a favorite', async () => {
      userDataStore.favorites = [
        { artistId: 'art-123', name: 'Jane Doe', image: 'http://jane.jpg' }
      ];
      userDataStore.isFavorite = vi.fn().mockReturnValue(true);
      mockFetch.mockResolvedValue({ success: true });

      const wrapper = createWrapper();
      const favBtn = wrapper.find('.fav-btn');
      await favBtn.trigger('click');

      expect(mockFetch).toHaveBeenCalledWith('/api/favorites/unlike', {
        method: 'POST',
        body: {
          artistId: 'art-123'
        },
        credentials: 'include'
      });
      expect(userDataStore.favorites).toEqual([]);
    });
  });

  describe('Menu & playlists operations', () => {
    it('toggles menu display when menu button is clicked', async () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.menu-popup').exists()).toBe(false);
      
      const menuBtn = wrapper.find('.menu-btn');
      await menuBtn.trigger('click');
      expect(wrapper.find('.menu-popup').exists()).toBe(true);

      await menuBtn.trigger('click');
      expect(wrapper.find('.menu-popup').exists()).toBe(false);
    });

    it('adds artist to playlist and closes menu', async () => {
      mockFetch.mockResolvedValue({ success: true });
      const wrapper = createWrapper();
      
      await wrapper.find('.menu-btn').trigger('click');
      
      const playlistBtns = wrapper.findAll('.menu-popup button');
      const rockPlaylistBtn = playlistBtns.find(btn => btn.text().includes('My Rock'));
      
      await rockPlaylistBtn.trigger('click');
      expect(mockFetch).toHaveBeenCalledWith('/api/playlists/add-item', {
        method: 'POST',
        body: {
          playlistId: 10,
          artistId: 'art-123',
          name: 'Jane Doe',
          image: 'http://jane.jpg'
        },
        credentials: 'include'
      });
      expect(wrapper.find('.menu-popup').exists()).toBe(false);
    });

    it('redirects to create playlist page', async () => {
      const wrapper = createWrapper();
      await wrapper.find('.menu-btn').trigger('click');
      
      const createBtn = wrapper.find('.create-btn');
      await createBtn.trigger('click');
      
      expect(mockLocalePath).toHaveBeenCalledWith('/favorites');
      expect(mockPush).toHaveBeenCalledWith('/favorites');
    });
  });
});
