// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@nuxtjs/supabase'],

  ssr: false,

  devtools: {
    enabled: false
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    }
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-02-27',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  supabase: {
    redirect: false
    // redirectOptions: {
    //   login: URLS.auth.login,
    //   callback: URLS.auth.confirm,
    //   exclude: [
    //     URLS.home,
    //     URLS.landing.hero,
    //     URLS.auth.resetPassword,
    //     URLS.auth.registration.home
    //   ]
    // }
  }
})
