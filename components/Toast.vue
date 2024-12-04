<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
    class="fixed bottom-0 right-0 z-50 p-4 space-y-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-center p-4 rounded-lg shadow-lg min-w-[300px] max-w-md"
      :class="{
        'bg-green-500 text-white': toast.type === 'success',
        'bg-red-500 text-white': toast.type === 'error',
        'bg-blue-500 text-white': toast.type === 'info',
        'bg-yellow-500 text-white': toast.type === 'warning'
      }"
    >
      <div class="flex-1">{{ toast.message }}</div>
      <button
        @click="removeToast(toast.id)"
        class="ml-4 text-white/80 hover:text-white"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>
