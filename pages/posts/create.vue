<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ $t('post.create') }}</h1>

    <div v-if="!authStore.isAuthenticated" class="text-center py-8">
      <p class="text-xl mb-4">{{ $t('auth.loginRequired') }}</p>
      <button
        @click="login"
        class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500"
      >
        {{ $t('auth.loginWithGoogle') }}
      </button>
    </div>

    <form v-else @submit.prevent="createPost" class="max-w-2xl mx-auto">
      <div class="space-y-6">
        <div v-for="(slide, index) in slides" :key="index" class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold">{{ $t('post.slideContent') }} #{{ index + 1 }}</h3>
            <button
              v-if="slides.length > 1"
              @click="removeSlide(index)"
              type="button"
              class="text-red-500 hover:text-red-600"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>

          <textarea
            v-model="slide.content"
            :placeholder="$t('post.maxWords')"
            rows="4"
            class="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="{ 'border-red-500': isOverWordLimit(slide.content) }"
          ></textarea>

          <div class="text-sm text-gray-500 mt-2">
            {{ wordCount(slide.content) }}/30 {{ $t('post.maxWords') }}
          </div>
        </div>

        <button
          type="button"
          @click="addSlide"
          class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-500"
        >
          {{ $t('post.addSlide') }}
        </button>

        <div class="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            @click="router.back()"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {{ $t('post.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="!isValid || isSubmitting"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
          >
            {{ $t('post.publish') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()

const slides = ref([{ content: '' }])
const isSubmitting = ref(false)

const wordCount = (text: string) => {
  return text.trim().split(/\s+/).length
}

const isOverWordLimit = (text: string) => {
  return wordCount(text) > 30
}

const isValid = computed(() => {
  return slides.value.every(slide => 
    slide.content.trim() !== '' && 
    !isOverWordLimit(slide.content)
  )
})

const addSlide = () => {
  slides.value.push({ content: '' })
}

const removeSlide = (index: number) => {
  slides.value.splice(index, 1)
}

const login = () => {
  window.location.href = `${useRuntimeConfig().public.apiBase}/auth/google`
}

const createPost = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  try {
    await postsStore.createPost(slides.value)
    router.push('/')
  } catch (error) {
    console.error('Failed to create post:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
