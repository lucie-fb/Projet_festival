// nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    TM_KEY: process.env.TM_KEY,
    SPOTIFY_ID: process.env.SPOTIFY_ID,
    SPOTIFY_KEY: process.env.SPOTIFY_KEY,

    public: {
      ZITADEL_ISSUER: process.env.ZITADEL_ISSUER,
      ZITADEL_CLIENT_ID: process.env.ZITADEL_CLIENT_ID,
      ZITADEL_REDIRECT_URL: 'http://localhost:3000/auth/callback',
      ZITADEL_POST_LOGOUT_REDIRECT_URL: 'http://localhost:3000/'
    }
  }
})
