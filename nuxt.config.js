export default defineNuxtConfig({
  css: ['@/assets/styles/main.css'],
  
  modules: ['nuxt-snackbar'],

  //CLient
  auth: {
      baseURL: '/api/auth',
      provider: {
        type: 'zitadel',
        options:{
          baseUrl: process.env.VITE_ZITADEL_ISSUER,
          clientId: process.env.VITE_ZITADEL_CLIENT_ID,
          clientSecret: '',
          redirectUri: 'http://localhost:3000/auth/callback',
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
    VITE_ZITADEL_ISSUER: process.env.VITE_ZITADEL_ISSUER,
    VITE_ZITADEL_CLIENT_ID: process.env.VITE_ZITADEL_CLIENT_ID,
  }
})