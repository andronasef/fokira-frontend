<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-1 space-x-reverse hover:text-green-200"
    >
      <span>{{ currentLocale === 'ar' ? 'العربية' : 'English' }}</span>
      <ChevronDownIcon class="w-4 h-4" />
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {{ locale.code === 'ar' ? 'العربية' : 'English' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const { locale, locales } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

const switchLocale = (code: string) => {
  locale.value = code
  isOpen.value = false
}

onClickOutside(isOpen, () => {
  isOpen.value = false
})
</script>
