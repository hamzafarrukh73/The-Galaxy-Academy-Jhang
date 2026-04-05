import { profileRepository, type Profile } from '~/repository/profileRepository'
import type { ApiError } from '~/plugins/errors'

export type UIProfile = {
  [K in keyof Profile]: NonNullable<Profile[K]>
}

export const useProfileStore = defineStore('profileStore', () => {
  const toast = useToast()
  const { $formatError } = useNuxtApp()

  const avatarUploading = ref(false)
  const avatarFile = ref<File | null>(null)

  const profileFetched = ref(false)
  const profile = ref<Partial<UIProfile>>({
    first_name: '',
    last_name: '',
    full_name: '',
    cnic: '',
    dob: undefined,
    gender: '',
    blood_group: '',
    address: '',
    city: '',
    province: '',
    avatar_url: ''
  })

  const displayAvatarUrl = ref(profile.value.avatar_url)

  const fullName = computed(() => {
    return `${profile.value.first_name} ${profile.value.last_name}`
  })

  const getProfile = async () => {
    const authStore = useAuthStore()
    if (profileFetched.value || !authStore.user?.sub) return

    try {
      const data = await profileRepository.get(authStore.user.sub)
      if (data) {
        profile.value = data as Partial<UIProfile>
        displayAvatarUrl.value = profile.value.avatar_url
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      profileFetched.value = true
    }
  }

  const upsertProfile = async () => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      if (avatarFile.value) {
        await handleAvatarUpload()
      }

      const data = await profileRepository.upsert(
        {
          ...profile.value,
          full_name: fullName.value,
          id: authStore.userId
        }
      )

      profile.value = data as Partial<UIProfile>
      toast.add({ title: 'Success', description: 'Profile Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      displayAvatarUrl.value = profile.value.avatar_url
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
        const url = await uploadFile(`${authStore.userId}/avatar.png`, avatarFile.value)
        if (url) {
          profile.value.avatar_url = url
        }
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

  return {
    profile,
    fullName,
    avatarUploading,
    displayAvatarUrl,
    getProfile,
    upsertProfile,
    handleAvatarSelect
  }
})
