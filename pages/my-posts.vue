<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ $t('nav.myPosts') }}</h1>

    <div v-if="!authStore.isAuthenticated" class="text-center py-8">
      <p class="text-xl mb-4">{{ $t('auth.loginRequired') }}</p>
      <button
        @click="login"
        class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500"
      >
        {{ $t('auth.loginWithGoogle') }}
      </button>
    </div>

    <template v-else>
      <div v-if="loading" class="text-center py-8">
        {{ $t('common.loading') }}
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
      </div>

      <div v-else-if="myPosts.length === 0" class="text-center py-8">
        <p class="text-xl mb-4">لا توجد منشورات بعد</p>
        <NuxtLink
          to="/posts/create"
          class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500"
        >
          {{ $t('post.create') }}
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="post in myPosts" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <StatusViewer :post="post" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const config = useRuntimeConfig()

const loading = ref(false)
const error = ref<string | null>(null)
const myPosts = ref([])

const login = () => {
  window.location.href = `${config.public.apiBase}/auth/google`
}

const fetchMyPosts = async () => {
  if (!authStore.token) return

  loading.value = true
  error.value = null

  try {
    const response = await $fetch(`${config.public.apiBase}/posts/my-posts`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    myPosts.value = response
  } catch (err) {
    error.value = 'Failed to fetch posts'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchMyPosts()
  }
})

watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    fetchMyPosts()
  }
})
</script>
