import type { Users } from '~/repository/modules/users'

import type { ApiError } from '~/plugins/errors'

export const useUsersStore = defineStore('usersStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const avatarUploading = ref(false)
  const avatarFile = ref<File | null>(null)

  const userFetched = ref(false)
  const user = ref<Users['Row'] | null>(null)

  const displayAvatarUrl = ref(user.value?.avatar_url)

  const completion = computed(() => {
    const fields = ['first_name', 'last_name', 'cnic', 'dob', 'address', 'city', 'province', 'avatar_url'] as const
    const filled = fields.filter(f => !!user.value?.[f]).length
    return {
      filled,
      total: fields.length,
      percentage: Math.round((filled / fields.length) * 100)
    }
  })

  const getUser = async () => {
    const authStore = useAuthStore()
    if (userFetched.value || !authStore.userId) return

    try {
      const data = await $api.users.get(authStore.userId)

      if (data) {
        user.value = data
        displayAvatarUrl.value = user.value?.avatar_url
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      userFetched.value = true
    }
  }

  const upsertUser = async (updates: Users['Update']) => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      if (avatarFile.value) {
        updates.avatar_url = await handleAvatarUpload()
      }

      const data = await $api.users.upsert(
        {
          ...updates,
          id: authStore.userId
        } as Users['Insert']
      )

      user.value = data
      toast.add({ title: 'Success', description: 'Profile Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      displayAvatarUrl.value = user.value?.avatar_url
      useLayoutStore().isLoading = false
    }
  }

  const handleAvatarSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target?.files
    const file = files ? files[0] : null
    if (file) {
      try {
        avatarFile.value = file
        displayAvatarUrl.value = URL.createObjectURL(file)
      } catch (error) {
        toast.add($formatError(error as ApiError))
      }
    }
  }

  const handleAvatarUpload = async () => {
    avatarUploading.value = true
    try {
      const authStore = useAuthStore()
      if (avatarFile.value) {
        return await uploadFile(`${authStore.userId}/avatar.png`, avatarFile.value)
      }
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      avatarFile.value = null
      avatarUploading.value = false
    }
  }

  const uploadFile = async (path: string, file: File, isPublic: boolean = true) => {
    try {
      const supabase = useSupabaseClient()
      const { data } = await supabase.storage.from('galaxyacademy').upload(path, file, { upsert: true })
      if (data) {
        if (isPublic) {
          const url = await getPublicUrl(path)
          return url
        } else {
          const url = await getSignedUrl(path)
          return url
        }
      }
    } catch (error) {
      toast.add($formatError(error as ApiError))
    }
  }

  const getSignedUrl = async (path: string) => {
    try {
      const supabase = useSupabaseClient()
      const { data } = await supabase.storage.from('galaxyacademy').createSignedUrl(path, 60 * 60 * 24)
      if (data) {
        return data.signedUrl
      }
    } catch (error) {
      toast.add($formatError(error as ApiError))
    }
  }

  const getPublicUrl = async (path: string) => {
    try {
      const supabase = useSupabaseClient()
      const { data } = supabase.storage.from('galaxyacademy').getPublicUrl(path)
      if (data) {
        return data.publicUrl
      }
    } catch (error) {
      toast.add($formatError(error as ApiError))
    }
    return ''
  }

  const clearData = () => {
    user.value = null
    userFetched.value = false
    displayAvatarUrl.value = ''
  }

  return {
    user,
    avatarUploading,
    displayAvatarUrl,
    completion,
    getUser,
    upsertUser,
    handleAvatarSelect,
    handleAvatarUpload,
    clearData
  }
})
