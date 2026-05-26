import { UserManager } from 'oidc-client-ts'

export default defineNuxtPlugin(() => {
  const manager = new UserManager({
    authority: import.meta.env.VITE_ZITADEL_ISSUER,
    client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/auth/callback',
    post_logout_redirect_uri: 'http://localhost:3000/',
    response_type: 'code',
    scope: 'openid profile email',
    signinRedirect: {
    prompt: 'login'
}

  })

  return {
    provide: {
      oidc: manager
    }
  }
})
