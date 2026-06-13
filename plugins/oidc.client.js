import { UserManager, WebStorageStateStore} from 'oidc-client-ts'

export default defineNuxtPlugin(() => {
  const manager = new UserManager({
    authority: import.meta.env.VITE_ZITADEL_ISSUER,
    client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/auth/callback',
    post_logout_redirect_uri: 'http://localhost:3000/',
    response_type: 'code',
    scope: 'openid profile email',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    loadUserInfo: true,
    automaticSilentRenew: true,
    signinRedirect: {
    prompt: 'login'
}

  })


  manager.events.addUserLoaded(user => {
  document.cookie = `id_token=${user.id_token}; path=/; samesite=lax`;
});

manager.events.addUserUnloaded(() => {
  document.cookie = "id_token=; Max-Age=0; path=/";
});

  return {
    provide: {
      oidc: manager
    }
  }
})
