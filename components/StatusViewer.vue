<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black z-50">
      <div class="h-full">
        <swiper
          :modules="[Navigation, Autoplay]"
          :slides-per-view="1"
          :autoplay="{ delay: 5000 }"
          :navigation="true"
          @swiper="onSwiper"
          @slideChange="handleSlideChange"
          class="h-full"
        >
          <swiper-slide
            v-for="(slide, index) in slides"
            :key="index"
            class="h-full flex items-center justify-center"
          >
            <div
              v-motion
              :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 300 }"
              :class="[
                'w-full h-full flex justify-center items-center bg-gray-800 rounded-lg p-6 text-white text-center relative',
                getSlideGradient(index),
              ]"
            >
              <p class="text-xl">{{ slide.content }}</p>
            </div>
          </swiper-slide>
        </swiper>
        <div class="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div class="bg-white/10 h-2 rounded-full">
            <div
              class="bg-white h-2 rounded-full"
              :style="{ width: `${progressValue * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div
        class="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10"
        @click.stop
      >
        <div class="flex items-center space-x-3 space-x-reverse">
          <UiAvatar 
            :author="post.author"
            size="md"
          />
          <div class="text-white">
            <h3 class="font-semibold">{{ post.author.name }}</h3>
            <p class="text-sm opacity-80">
              {{ formatTimestamp(post.createdAt) }}
            </p>
          </div>
        </div>

        <button
          @click="closeViewer"
          class="text-white p-2 hover:bg-white/10 rounded-full transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import UiAvatar from "./ui/Avatar.vue";

const props = defineProps<{
  post: {
    id: string;
    title: string;
    slides: Array<{ content: string }>;
    author: {
      name: string;
      avatar?: string;
    };
    createdAt: string;
  };
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const swiperInstance = ref(null);
const slides = computed(() => props.post.slides);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const closeViewer = () => {
  emit("close");
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Array of beautiful gradient colors
const gradients = [
  "bg-gradient-to-r from-purple-500 to-pink-500",
  "bg-gradient-to-r from-cyan-500 to-blue-500",
  "bg-gradient-to-r from-emerald-500 to-teal-500",
  "bg-gradient-to-r from-rose-500 to-orange-500",
  "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  "bg-gradient-to-r from-amber-500 to-yellow-500",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-r from-blue-500 to-indigo-500",
  "bg-gradient-to-r from-green-500 to-emerald-500",
  "bg-gradient-to-r from-pink-500 to-rose-500",
];

// Get random gradient for each slide
const getSlideGradient = (index: number) => {
  return gradients[index % gradients.length];
};

// Progress tracking
const currentSlideIndex = ref(0);
const progressValue = ref(0);
let progressInterval: NodeJS.Timer | null = null;

const handleSlideChange = (swiper) => {
  currentSlideIndex.value = swiper.activeIndex;
  startProgress();
};

const startProgress = () => {
  // Reset previous interval
  if (progressInterval) {
    clearInterval(progressInterval);
  }

  // Reset progress
  progressValue.value = 0;

  // Start new progress
  const startTime = Date.now();
  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    progressValue.value = Math.min(elapsed / 5000, 1);

    if (progressValue.value >= 1) {
      clearInterval(progressInterval);
    }
  }, 16); // ~60fps
};

onMounted(() => {
  document.body.style.overflow = "hidden";
  startProgress(); // Start progress for first slide
});

onUnmounted(() => {
  document.body.style.overflow = "";
  if (progressInterval) {
    clearInterval(progressInterval);
  }
});
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-button-next,
.swiper-button-prev {
  color: white !important;
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 24px !important;
}
</style>
