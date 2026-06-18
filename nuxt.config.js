export default defineNuxtConfig({
  css: ['@/assets/styles/main.css'],
  
  modules: ['@nuxtjs/i18n', '@pinia/nuxt'],

  // Client
  auth: {
    baseURL: '/api/auth',
    provider: {
      type: 'zitadel',
      options: {
        baseUrl: process.env.VITE_ZITADEL_ISSUER,
        clientId: process.env.VITE_ZITADEL_CLIENT_ID,
        clientSecret: '',
        redirectUri: process.env.VITE_ZITADEL_REDIRECT_URI,
        logoutRedirectUri: process.env.VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI
      }
    }
  },

  // Serveur
  runtimeConfig: {
    TM_KEY: process.env.TM_KEY,
    SPOTIFY_ID: process.env.SPOTIFY_ID,
    SPOTIFY_KEY: process.env.SPOTIFY_KEY,
    POSTGRES_URL: process.env.POSTGRES_URL,
     public: {
    VITE_ZITADEL_ISSUER: process.env.VITE_ZITADEL_ISSUER,
    VITE_ZITADEL_CLIENT_ID: process.env.VITE_ZITADEL_CLIENT_ID,
    VITE_ZITADEL_REDIRECT_URI: process.env.VITE_ZITADEL_REDIRECT_URI,
    VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI: process.env.VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI
  }
},

routeRules: {
  '/auth/callback': {
    headers: {
      'Content-Security-Policy': "connect-src 'self' http://localhost:3000 https://sun-and-sound-q7pe8b.eu1.zitadel.cloud"
    }
  }
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