import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserManager } from 'oidc-client-ts';

const mockAddUserLoaded = vi.fn();
const mockAddUserUnloaded = vi.fn();

vi.mock('oidc-client-ts', () => {
  return {
    UserManager: vi.fn(function (config) {
      this.config = config;
      this.events = {
        addUserLoaded: mockAddUserLoaded,
        addUserUnloaded: mockAddUserUnloaded
      };
    }),
    WebStorageStateStore: vi.fn()
  };
});

describe('Plugin Nuxt - oidc.client', () => {
  let plugin;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    vi.stubEnv('VITE_ZITADEL_ISSUER', 'https://auth.example.com');
    vi.stubEnv('VITE_ZITADEL_CLIENT_ID', 'test-client');
    vi.stubEnv('VITE_ZITADEL_REDIRECT_URI', 'http://localhost/callback');
    vi.stubEnv('VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI', 'http://localhost/logout');
    
    vi.stubGlobal('window', {
      localStorage: {}
    });
    vi.stubGlobal('document', {
      cookie: ''
    });
    
    vi.stubGlobal('defineNuxtPlugin', (callback) => callback);
    
    if (!plugin) {
      const module = await import('../../../plugins/oidc.client');
      plugin = module.default;
    }
  });

  it('devrait instancier UserManager', () => {
    plugin();
    expect(UserManager).toHaveBeenCalled();
  });

  it('devrait configurer l\'autorité (authority) de connexion', () => {
    plugin();
    const instanceMockee = vi.mocked(UserManager).mock.instances[0];
    expect(instanceMockee.config.authority).toBe('https://auth.example.com');
  });

  it('devrait configurer le client_id avec la bonne valeur', () => {
    plugin();
    const instanceMockee = vi.mocked(UserManager).mock.instances[0];
    expect(instanceMockee.config.client_id).toBe('test-client');
  });

  it('devrait configurer redirect_uri avec la bonne valeur', () => {
    plugin();
    const instanceMockee = vi.mocked(UserManager).mock.instances[0];
    expect(instanceMockee.config.redirect_uri).toBe('http://localhost/callback');
  });

  it('devrait enregistrer le jeton (id_token) dans les cookies lors de la connexion', () => {
    plugin();

    const callbackConnexion = mockAddUserLoaded.mock.calls[0][0];

    const mockUser = { id_token: 'fake-jwt-token' };
    callbackConnexion(mockUser);

    expect(document.cookie).toBe('id_token=fake-jwt-token; path=/; samesite=lax');
  });

  it('devrait supprimer le cookie (id_token) lors de la déconnexion', () => {
    plugin();

    const callbackDeconnexion = mockAddUserUnloaded.mock.calls[0][0];

    callbackDeconnexion();

    expect(document.cookie).toBe('id_token=; Max-Age=0; path=/');
  });
});
