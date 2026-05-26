import { UserManager } from 'oidc-client-ts'

export default defineNuxtPlugin(() => {
  const config = {
    authority: import.meta.env.VITE_ZITADEL_ISSUER,
    client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
    redirectUri: 'http://localhost:3000/auth/callback/zitadel',
    logoutRedirectUri: 'http://localhost:3000/',
    response_type: 'code',
    scope: 'openid profile email'
  }

  const manager = new UserManager(config)

  return {
    provide: {
      oidc: manager
    }
  }
})
