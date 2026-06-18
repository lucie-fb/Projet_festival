import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserManager } from 'oidc-client-ts';

vi.hoisted(() => {
  vi.stubGlobal('defineNuxtPlugin', (fn) => fn);
});

import plugin from '../../../plugins/oidc.client';

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

describe('oidc.client Nuxt plugin', () => {
  beforeEach(() => {
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
  });

  it('should initialize UserManager with environment config', () => {
    const result = plugin();

    expect(UserManager).toHaveBeenCalled();
    // Retrieve mock instance configuration
    const mockInstance = vi.mocked(UserManager).mock.instances[0];
    const configPassed = mockInstance.config;
    
    expect(configPassed.authority).toBe('https://auth.example.com');
    expect(configPassed.client_id).toBe('test-client');
    expect(configPassed.redirect_uri).toBe('http://localhost/callback');
    expect(configPassed.post_logout_redirect_uri).toBe('http://localhost/logout');
    expect(configPassed.response_type).toBe('code');
    expect(configPassed.scope).toBe('openid profile email');
    expect(configPassed.loadUserInfo).toBe(true);
    expect(configPassed.automaticSilentRenew).toBe(true);
    expect(configPassed.signinRedirect).toEqual({ prompt: 'login' });

    expect(result).toHaveProperty('provide');
    expect(result.provide).toHaveProperty('oidc');
  });

  it('should set id_token cookie when user is loaded', () => {
    plugin();

    expect(mockAddUserLoaded).toHaveBeenCalled();
    const onUserLoadedCallback = mockAddUserLoaded.mock.calls[0][0];

    const mockUser = { id_token: 'fake-jwt-token' };
    onUserLoadedCallback(mockUser);

    expect(document.cookie).toBe('id_token=fake-jwt-token; path=/; samesite=lax');
  });

  it('should delete id_token cookie when user is unloaded', () => {
    plugin();

    expect(mockAddUserUnloaded).toHaveBeenCalled();
    const onUserUnloadedCallback = mockAddUserUnloaded.mock.calls[0][0];

    onUserUnloadedCallback();

    expect(document.cookie).toBe('id_token=; Max-Age=0; path=/');
  });
});
