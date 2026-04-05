export const useLayoutStore = defineStore('layoutStore', () => {
  // --- STATE ---
  const isLoading = ref(false)
  const websiteTitle = ref('The Galaxy Academy Jhang')

  // --- EXPOSE ---
  return {
    isLoading,
    websiteTitle
  }
})
