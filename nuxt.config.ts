// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700]
    }
  }
})