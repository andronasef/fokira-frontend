<template>
  <div class="relative">
    <!-- Header -->
    <div class="flex items-center space-x-3 space-x-reverse p-4 border-b">
      <img 
        :src="post.author.avatar || '/default-avatar.png'" 
        :alt="post.author.name"
        class="w-10 h-10 rounded-full"
      >
      <div>
        <h3 class="font-semibold">{{ post.author.name }}</h3>
        <p class="text-sm text-gray-500">
          {{ new Date(post.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <!-- Slides -->
    <div class="relative h-[400px] bg-gray-900">
      <TransitionGroup name="fade">
        <div 
          v-for="(slide, index) in post.slides" 
          :key="slide.id"
          v-show="currentSlide === index"
          class="absolute inset-0 flex items-center justify-center p-8"
        >
          <p class="text-white text-xl text-center">{{ slide.content }}</p>
        </div>
      </TransitionGroup>

      <!-- Progress bars -->
      <div class="absolute top-0 left-0 right-0 flex gap-1 p-2">
        <div 
          v-for="(slide, index) in post.slides" 
          :key="slide.id"
          class="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
        >
          <div 
            class="h-full bg-white transition-all duration-100"
            :style="{ width: getProgressWidth(index) }"
          ></div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <button 
        @click="prevSlide" 
        class="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2"
        v-show="currentSlide > 0"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <button 
        @click="nextSlide" 
        class="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2"
        v-show="currentSlide < post.slides.length - 1"
      >
        <ChevronRightIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Delete button for owner -->
    <button 
      v-if="canDelete" 
      @click="deletePost"
      class="absolute top-4 right-4 text-red-500 hover:text-red-600"
    >
      <TrashIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  post: {
    id: string
    slides: Array<{
      id: string
      content: string
      duration: number
    }>
    author: {
      id: string
      name: string
      avatar?: string
    }
    createdAt: string
  }
}>()

const authStore = useAuthStore()
const postsStore = usePostsStore()

const currentSlide = ref(0)
const progress = ref(0)
const timer = ref<NodeJS.Timeout>()

const canDelete = computed(() => {
  return authStore.user?.id === props.post.author.id
})

const getProgressWidth = (index: number) => {
  if (index < currentSlide.value) return '100%'
  if (index > currentSlide.value) return '0%'
  return `${progress.value}%`
}

const startTimer = () => {
  const duration = props.post.slides[currentSlide.value].duration
  const interval = 50 // Update every 50ms
  const steps = duration / interval
  let currentStep = 0

  clearInterval(timer.value)
  progress.value = 0

  timer.value = setInterval(() => {
    currentStep++
    progress.value = (currentStep / steps) * 100

    if (currentStep >= steps) {
      clearInterval(timer.value)
      if (currentSlide.value < props.post.slides.length - 1) {
        nextSlide()
      }
    }
  }, interval)
}

const nextSlide = () => {
  if (currentSlide.value < props.post.slides.length - 1) {
    currentSlide.value++
    startTimer()
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
    startTimer()
  }
}

const deletePost = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await postsStore.deletePost(props.post.id)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
