import type { Users } from '~/repository/modules/users'

import type { ApiError } from '~/plugins/errors'

export const useUsersStore = defineStore('usersStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const avatarUploading = ref(false)
  const avatarFile = ref<File | null>(null)

  const userFetched = ref(false)
  const user = ref<Users['Row'] | null>(null)

  const cacheBuster = ref(Date.now())
  const displayAvatarUrl = computed(() => {
    if (avatarFile.value) return URL.createObjectURL(avatarFile.value)
    if (!user.value?.avatar_url) return ''
    return `${user.value.avatar_url}?t=${cacheBuster.value}`
  })

  const completion = computed(() => {
    const fields = ['first_name', 'last_name', 'phone', 'cnic', 'dob', 'address', 'city', 'province', 'avatar_url'] as const
    const filled = fields.filter(f => !!user.value?.[f]).length
    return {
      filled,
      total: fields.length,
      percentage: Math.round((filled / fields.length) * 100)
    }
  })

  const fetchPromise = ref<Promise<void> | null>(null)

  const getUser = async () => {
    const authStore = useAuthStore()
    if (userFetched.value || !authStore.userId) return

    if (fetchPromise.value) return fetchPromise.value

    fetchPromise.value = (async () => {
      try {
        const userId = authStore.userId
        if (!userId) return

        const data = await $api.users.get(userId)

        if (data) {
          user.value = data
          cacheBuster.value = Date.now()
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        userFetched.value = true
        fetchPromise.value = null
      }
    })()

    return fetchPromise.value
  }

  const upsertUser = async (updates: Users['Update']) => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    const userId = authStore.userId
    if (!userId) return

    try {
      if (avatarFile.value) {
        updates.avatar_url = await handleAvatarUpload()
      }

      const data = await $api.users.upsert(
        {
          ...updates,
          id: userId
        } as Users['Insert']
      )

      user.value = data
      toast.add({ title: 'Success', description: 'Profile Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      cacheBuster.value = Date.now()
      useLayoutStore().isLoading = false
    }
  }

  const handleAvatarSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target?.files?.[0]
    if (file) {
      avatarFile.value = file
    }
  }

  const handleAvatarUpload = async () => {
    avatarUploading.value = true
    try {
      const authStore = useAuthStore()
      const userId = authStore.userId
      if (avatarFile.value && userId) {
        return await uploadFile(`${userId}/avatar.png`, avatarFile.value)
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
      const { data } = await supabase.storage.from('galaxy').upload(path, file, { upsert: true })
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
      const { data } = await supabase.storage.from('galaxy').createSignedUrl(path, 60 * 60 * 24)
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
      const { data } = supabase.storage.from('galaxy').getPublicUrl(path)
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
  }

  return {
    user,
    avatarFile,
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
