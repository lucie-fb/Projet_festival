export default defineNuxtConfig({
  modules: ['nuxt-snackbar'],

  //CLient
  auth: {
      baseURL: '/api/auth',
      provider: {
        type: 'zitadel',
        options:{
          baseUrl: process.env.ZITADEL_ISSUER,
          clientId: process.env.ZITADEL_CLIENT_ID,
          clientSecret: '',
          redirectUri: 'http://localhost:3000/auth/callback/zitadel',
          logoutRedirectUri: 'http://localhost:3000/'
        }
      }
    },

  // Serveur
  runtimeConfig: {
    TM_KEY: process.env.TM_KEY,
    SPOTIFY_ID: process.env.SPOTIFY_ID,
    SPOTIFY_KEY: process.env.SPOTIFY_KEY,
    POSTGRES_URL: process.env.POSTGRES_URL,
    ZITADEL_ISSUER: process.env.ZITADEL_ISSUER,
    ZITADEL_CLIENT_ID: process.env.ZITADEL_CLIENT_ID,
  }
})