export default defineNuxtConfig({
  css: ['@/assets/styles/main.css'],
  
  modules: ['@nuxtjs/i18n'],

  // Client
  auth: {
    baseURL: '/api/auth',
    provider: {
      type: 'zitadel',
      options: {
        baseUrl: process.env.VITE_ZITADEL_ISSUER,
        clientId: process.env.VITE_ZITADEL_CLIENT_ID,
        clientSecret: '',
        redirectUri: process.env.ZITADEL_REDIRECT_URI,
        logoutRedirectUri: process.env.ZITADEL_POST_LOGOUT_REDIRECT_URI
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
  },

  // i18n
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'fr',
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      }
    ]
  }
})