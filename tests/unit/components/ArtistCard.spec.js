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

describe('Composant ArtistCard.vue', () => {
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

  describe('Affichage des informations de l\'artiste', () => {
    it('devrait afficher le nom de l\'artiste dans un titre h2', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('h2').text()).toBe('Jane Doe');
    });

    it('devrait charger la photo de l\'artiste dans la balise img', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('img').attributes('src')).toBe('http://jane.jpg');
    });

    it('devrait afficher le bouton pour ajouter aux favoris', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.fav-btn').exists()).toBe(true);
    });

    it('devrait afficher le bouton menu (les trois points)', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.menu-btn').exists()).toBe(true);
    });
  });

  describe('Affichage en mode compact', () => {
    it('ne devrait pas afficher le bouton favori', () => {
      const wrapper = createWrapper({ compact: true });
      expect(wrapper.find('.fav-btn').exists()).toBe(false);
    });

    it('ne devrait pas afficher le bouton menu', () => {
      const wrapper = createWrapper({ compact: true });
      expect(wrapper.find('.menu-btn').exists()).toBe(false);
    });

    it('devrait appliquer la classe CSS "compact" sur l\'image', () => {
      const wrapper = createWrapper({ compact: true });
      expect(wrapper.find('img').classes()).toContain('compact');
    });

    it('devrait appliquer la classe CSS "compact" sur le titre h2', () => {
      const wrapper = createWrapper({ compact: true });
      expect(wrapper.find('h2').classes()).toContain('compact');
    });
  });

  describe('Clic sur la carte (Redirection ou Sélection)', () => {
    it('devrait naviguer vers la page de l\'artiste si la page actuelle n\'est pas la liste d\'artistes', async () => {
      mockRoute.path = '/home';
      const wrapper = createWrapper();
      
      await wrapper.trigger('click');
      
      expect(mockLocalePath).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/artists/[id]?name=Jane%20Doe');
    });

    it('ne devrait pas rediriger si on est déjà sur la page /artists', async () => {
      mockRoute.path = '/artists';
      const wrapper = createWrapper();
      
      await wrapper.trigger('click');
      
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('devrait émettre l\'événement "select" avec le nom de l\'artiste si on est sur la page /artists', async () => {
      mockRoute.path = '/artists';
      const wrapper = createWrapper();
      
      await wrapper.trigger('click');
      
      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual(['Jane Doe']);
    });
  });

  describe('Gestion des favoris', () => {
    it('devrait appeler l\'API POST /api/favorites/like si l\'artiste n\'est pas encore favori', async () => {
      userDataStore.isFavorite = vi.fn().mockReturnValue(false);
      mockFetch.mockResolvedValue({ success: true });
      const wrapper = createWrapper();
      
      await wrapper.find('.fav-btn').trigger('click');

      expect(mockFetch).toHaveBeenCalledWith('/api/favorites/like', {
        method: 'POST',
        body: {
          artistId: 'art-123',
          name: 'Jane Doe',
          image: 'http://jane.jpg'
        },
        credentials: 'include'
      });
    });

    it('devrait ajouter l\'artiste dans la liste locale du store favoris', async () => {
      userDataStore.isFavorite = vi.fn().mockReturnValue(false);
      mockFetch.mockResolvedValue({ success: true });
      const wrapper = createWrapper();
      
      await wrapper.find('.fav-btn').trigger('click');

      expect(userDataStore.favorites).toContainEqual({
        artistId: 'art-123',
        name: 'Jane Doe',
        image: 'http://jane.jpg'
      });
    });

    it('devrait appeler l\'API POST /api/favorites/unlike si l\'artiste est déjà favori', async () => {
      userDataStore.favorites = [
        { artistId: 'art-123', name: 'Jane Doe', image: 'http://jane.jpg' }
      ];
      userDataStore.isFavorite = vi.fn().mockReturnValue(true);
      mockFetch.mockResolvedValue({ success: true });
      const wrapper = createWrapper();
      
      await wrapper.find('.fav-btn').trigger('click');

      expect(mockFetch).toHaveBeenCalledWith('/api/favorites/unlike', {
        method: 'POST',
        body: {
          artistId: 'art-123'
        },
        credentials: 'include'
      });
    });

    it('devrait retirer l\'artiste de la liste locale du store favoris', async () => {
      userDataStore.favorites = [
        { artistId: 'art-123', name: 'Jane Doe', image: 'http://jane.jpg' }
      ];
      userDataStore.isFavorite = vi.fn().mockReturnValue(true);
      mockFetch.mockResolvedValue({ success: true });
      const wrapper = createWrapper();
      
      await wrapper.find('.fav-btn').trigger('click');

      expect(userDataStore.favorites).toEqual([]);
    });
  });

  describe('Menu contextuel et Playlists', () => {
    it('devrait afficher le menu déroulant au clic sur le bouton menu', async () => {
      const wrapper = createWrapper();
      
      await wrapper.find('.menu-btn').trigger('click');
      
      expect(wrapper.find('.menu-popup').exists()).toBe(true);
    });

    it('devrait fermer le menu déroulant si on clique une deuxième fois sur le bouton menu', async () => {
      const wrapper = createWrapper();
      const menuBtn = wrapper.find('.menu-btn');
      
      await menuBtn.trigger('click'); 
      await menuBtn.trigger('click'); 
      
      expect(wrapper.find('.menu-popup').exists()).toBe(false);
    });

    it('devrait appeler l\'API POST /api/playlists/add-item au clic sur une playlist', async () => {
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
    });

    it('devrait fermer le menu déroulant après l\'ajout à une playlist', async () => {
      mockFetch.mockResolvedValue({ success: true });
      const wrapper = createWrapper();
      await wrapper.find('.menu-btn').trigger('click'); 
      
      const playlistBtns = wrapper.findAll('.menu-popup button');
      const rockPlaylistBtn = playlistBtns.find(btn => btn.text().includes('My Rock'));
      await rockPlaylistBtn.trigger('click');

      expect(wrapper.find('.menu-popup').exists()).toBe(false);
    });

    it('devrait rediriger vers /favorites au clic sur "Créer une playlist"', async () => {
      const wrapper = createWrapper();
      await wrapper.find('.menu-btn').trigger('click'); 
      
      await wrapper.find('.create-btn').trigger('click');
      
      expect(mockLocalePath).toHaveBeenCalledWith('/favorites');
      expect(mockPush).toHaveBeenCalledWith('/favorites');
    });
  });
});
