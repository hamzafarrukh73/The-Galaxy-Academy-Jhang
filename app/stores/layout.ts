import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

export const useLayoutStore = defineStore('layoutStore', () => {
  // --- STATE ---
  const isLoading = ref(false)
  const websiteTitle = ref('The Galaxy Academy Jhang')
  const navMenu = ref<NavigationMenuItem[]>([
    { icon: ICONS.nav.home, label: 'Home', to: URLS.landing.hero, exactHash: true },
    { icon: ICONS.nav.benefits, label: 'Benefits', to: URLS.landing.benefits, exactHash: true },
    { icon: ICONS.nav.pricing, label: 'Pricing', to: URLS.landing.pricing, exactHash: true },
    { icon: ICONS.nav.getStarted, label: 'Get Started', to: URLS.landing.getStarted, exactHash: true }
  ])

  // --- GETTERS ---
  const dashboardMenu = computed<NavigationMenuItem[][]>(() => {
    // LAZY ACCESS: Call the store inside the computed body
    const authStore = useAuthStore()

    return [
      [{
        icon: ICONS.dashboard.home,
        label: 'Overview',
        to: URLS.dashboard.home
      }, {
        icon: ICONS.dashboard.personal,
        label: 'Personal',
        to: URLS.dashboard.personal
      }, {
        icon: ICONS.dashboard.history,
        label: 'Academic History',
        to: URLS.dashboard.history
      }, {
        icon: ICONS.dashboard.interests,
        label: 'Interests',
        to: URLS.dashboard.interests
      }],
      [{
        icon: ICONS.nav.user,
        label: authStore.user?.email,
        children: [{
          icon: ICONS.nav.logout,
          label: 'Logout',
          onClick: () => authStore.logout()
        }]
      }]
    ]
  })

  const profileMenu = computed<DropdownMenuItem[]>(() => {
    // LAZY ACCESS: Call the store here as well
    const authStore = useAuthStore()

    return [
      { slot: 'profile' as const },
      { type: 'separator' },
      {
        icon: ICONS.nav.user,
        label: 'Profile'
      }, {
        icon: ICONS.nav.logout,
        label: 'Logout',
        color: 'error',
        onClick: () => authStore.logout()
      }
    ]
  })

  // --- EXPOSE ---
  return {
    isLoading,
    websiteTitle,
    navMenu,
    dashboardMenu,
    profileMenu
  }
})
