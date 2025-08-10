// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3003
  },
  // Disallow indexing globally via headers and meta
  routeRules: {
    '/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    }
  },
  modules: ['@nuxt/eslint', '@nuxtjs/google-fonts', 'nuxt-auth-utils', '@nuxtjs/robots', '@nuxt/image'],
  css: ['primeicons/primeicons.css'],

  site: { indexable: false },

  googleFonts: {
    
    families: {
      Inter: [300, 400, 500, 600, 700]
    }
  },

  image: {
    quality: 80,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    domains: [],
    presets: {
      logo: {
        modifiers: { width: 200, height: 60, format: 'webp' }
      },
      avatar: {
        modifiers: { width: 64, height: 64, format: 'webp' }
      }
    }
  }
  // Nuxt Auth Utils Configuration - remove this as it might not be valid in Nuxt 4
})