export const URLS = {
  home: '/',
  landing: {
    hero: '/#home',
    benefits: '/#benefits',
    pricing: '/#pricing',
    getStarted: '/#get-started'
  },
  auth: {
    login: '/auth/login',
    registration: {
      home: '/auth/registration',
      verifyEmail: '/auth/registration/verify-email'
    },
    password: {
      reset: '/auth/password/reset',
      change: '/auth/password/change'
    }
  },
  users: {
    profile: '/users/me'
  },
  dashboard: {
    home: '/dashboard',
    personal: '/dashboard/personal',
    history: '/dashboard/history',
    interests: '/dashboard/interests',
    dummy: '/dashboard/dummy'
  }
}
