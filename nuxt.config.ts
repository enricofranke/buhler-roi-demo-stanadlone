// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3003
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    'nuxt-auth-utils'
  ],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700]
    }
  },
  // Nuxt Auth Utils Configuration - remove this as it might not be valid in Nuxt 4
})