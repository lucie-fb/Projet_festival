import { UserManager } from 'oidc-client-ts'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const manager = new UserManager({
    authority: config.public.ZITADEL_ISSUER,
    client_id: config.public.ZITADEL_CLIENT_ID,
    redirect_uri: config.public.ZITADEL_REDIRECT_URL,
    post_logout_redirect_uri: config.public.ZITADEL_POST_LOGOUT_REDIRECT_URL,
    response_type: 'code',
    scope: 'openid profile email'
  })

  return {
    provide: {
      oidc: manager
    }
  }
})
