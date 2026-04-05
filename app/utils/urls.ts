export const URLS = {
  home: '/',
  landing: {
    hero: '/#home',
    benefits: '/#benefits',
    pricing: '/#pricing',
    contact: '/#contact'
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
    academic: '/dashboard/academic',
    interests: '/dashboard/academic',
    guardian: '/dashboard/guardian'
  }
}
