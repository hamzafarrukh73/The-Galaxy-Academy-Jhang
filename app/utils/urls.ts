export const URLS = {
  home: '/#home',
  benefits: '/#benefits',
  pricing: '/#pricing',
  getStarted: '/#get-started',
  auth: {
    registration: {
      home: '/auth/registration',
      verifyEmail: '/auth/registration/verify-email'
    },
    login: '/auth/login'
  },
  users: {
    profile: '/users/me'
  },
  dashboard: {
    home: '/dashboard',
    dummy: '/dashboard/dummy'
  },
  api: {
    get base() {
      const config = useRuntimeConfig()
      return config.public.apiBase
    },
    get v1() {
      const config = useRuntimeConfig()
      return `${config.public.apiBase}/api/v1`
    },
    auth: '/auth/'
  }
}
