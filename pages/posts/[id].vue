<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <p class="text-gray-500">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <StatusViewer
      v-else
      :post="post"
      :can-delete="isAuthor"
      @delete="deletePost"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { locale } = useI18n();
const authStore = useAuthStore()
const postsStore = usePostsStore()

const loading = ref(true)
const error = ref<string | null>(null)
const post = ref<any>(null)

const isAuthor = computed(() => {
  return post.value?.author.id === authStore.user?.id
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const fetchPost = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch(`/api/posts/${route.params.id}`)
    post.value = response.post
  } catch (err) {
    console.error('Failed to fetch post:', err)
    error.value = 'Failed to load post'
  } finally {
    loading.value = false
  }
}

const deletePost = async (postId: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return

  try {
    await postsStore.deletePost(postId);
    router.push('/my-posts')
  } catch (err) {
    console.error('Failed to delete post:', err)
  }
}

onMounted(() => {
  fetchPost()
})
</script>
