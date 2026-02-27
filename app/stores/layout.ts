import { defineStore } from 'pinia'
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
// import { useAuthStore } from './auth'

export const useLayoutStore = defineStore('layoutStore', () => {
  // --- STATE ---
  const websiteTitle = ref('The Galaxy Academy Jhang')
  const navMenu = ref<NavigationMenuItem[]>([
    { icon: ICONS.nav.home, label: 'Home', to: URLS.home, exactHash: true },
    { icon: ICONS.nav.benefits, label: 'Benefits', to: URLS.benefits, exactHash: true },
    { icon: ICONS.nav.pricing, label: 'Pricing', to: URLS.pricing, exactHash: true },
    { icon: ICONS.nav.getStarted, label: 'Get Started', to: URLS.getStarted, exactHash: true }
  ])

  // --- GETTERS ---
  const dashboardMenu = computed<NavigationMenuItem[][]>(() => [
    [{
      icon: ICONS.dashboard.home,
      label: 'Dashboard',
      to: URLS.dashboard.home
    }, {
      icon: ICONS.dashboard.settings,
      label: 'Dummy',
      to: URLS.dashboard.dummy
    }],
    [{
      icon: ICONS.nav.user,
      label: 'username',
      children: [{
        icon: ICONS.nav.logout,
        label: 'Logout'
        // onClick: () => useAuthStore().logout()
      }]
    }]
  ])

  const profileMenu = computed<DropdownMenuItem[]>(() => [
    {
      slot: 'profile' as const
    }, {
      type: 'separator'
    }, {
      slot: 'utils' as const
    }, {
      type: 'separator'
    }, {
      icon: ICONS.nav.user,
      label: 'Profile'
    }, {
      icon: ICONS.nav.logout,
      label: 'Logout',
      color: 'error',
      onClick: () => useAuthStore().logout()
    }
  ])

  // --- EXPOSE ---
  return {
    websiteTitle,
    navMenu,
    dashboardMenu,
    profileMenu
  }
})
