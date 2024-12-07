<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ t("post.edit") }}</h1>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-48 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="refresh"
        class="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        {{ t("action.retry") }}
      </button>
    </div>

    <!-- Edit Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title Input -->
      <div>
        <label class="block text-sm font-medium mb-2">{{
          t("post.title")
        }}</label>
        <input
          v-model="title"
          type="text"
          :placeholder="t('post.title-placeholder')"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': titleError }"
        />
        <p v-if="titleError" class="mt-1 text-sm text-red-500">
          {{ titleError }}
        </p>
      </div>

      <!-- Slides -->
      <div class="space-y-4">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium">
              {{ t("post.slide-number", { number: index + 1 }) }}
            </h3>
            <button
              v-if="slides.length > 1"
              @click="removeSlide(index)"
              type="button"
              class="text-red-500 hover:text-red-600"
            >
              {{ t("post.remove-slide") }}
            </button>
          </div>

          <textarea
            v-model="slide.content"
            :placeholder="t('post.content-placeholder')"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': slideErrors[index] }"
          ></textarea>

          <div
            class="mt-2 flex justify-between items-center text-sm text-gray-500"
          >
            <p>
              {{
                t("post.words-remaining", {
                  count: 30 - getWordCount(slide.content),
                })
              }}
            </p>
            <p v-if="slideErrors[index]" class="text-red-500">
              {{ slideErrors[index] }}
            </p>
          </div>
        </div>
      </div>

      <!-- Add Slide Button -->
      <button
        type="button"
        @click="addSlide"
        class="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        {{ t("post.add-slide") }}
      </button>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-4 rtl:space-x-reverse">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border rounded-lg hover:bg-gray-50"
          :disabled="isSubmitting"
        >
          {{ t("post.cancel") }}
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
        >
          <div v-if="isSubmitting" class="flex items-center">
            <div
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
            ></div>
            {{ t("common.saving") }}
          </div>
          <span v-else>{{ t("action.save") }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { showToast } = useToast();
const { fetchWithAuth, updatePost } = useApi();

const postId = route.params.id as string;

// Form state
const title = ref("");
const slides = ref([{ content: "" }]);
const isSubmitting = ref(false);
const titleError = ref("");
const slideErrors = ref<string[]>([]);

// Fetch post data
const {
  data: post,
  pending,
  error,
  refresh,
} = await fetchWithAuth(`/posts/${postId}`);

// Initialize form with post data when available
watchEffect(() => {
  if (post.value) {
    title.value = post.value.title;
    slides.value = post.value.slides.map((slide: any) => ({
      content: slide.content,
    }));
  }
});

// Validation helpers
const getWordCount = (text: string) => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const validateTitle = () => {
  if (!title.value.trim()) {
    titleError.value = t("post.validation.title-required");
    return false;
  }
  if (title.value.length > 100) {
    titleError.value = t("post.validation.title-max-length");
    return false;
  }
  titleError.value = "";
  return true;
};

const validateSlides = () => {
  let isValid = true;
  slideErrors.value = slides.value.map((slide) => {
    if (!slide.content.trim()) {
      isValid = false;
      return t("post.validation.content-required");
    }
    const wordCount = getWordCount(slide.content);
    if (wordCount > 30) {
      isValid = false;
      return t("post.validation.max-words", { max: 30 });
    }
    if (wordCount === 0) {
      isValid = false;
      return t("post.validation.min-words");
    }
    return "";
  });
  return isValid;
};

// Slide management
const addSlide = () => {
  if (slides.value.length < 10) {
    slides.value.push({ content: "" });
  }
};

const removeSlide = (index: number) => {
  slides.value.splice(index, 1);
  slideErrors.value.splice(index, 1);
};

// Form submission
const handleSubmit = async () => {
  const isTitleValid = validateTitle();
  const areSlidesValid = validateSlides();

  if (!isTitleValid || !areSlidesValid) {
    return;
  }

  isSubmitting.value = true;
  try {
    await updatePost(postId, {
      title: title.value.trim(),
      slides: slides.value.map((slide) => ({
        content: slide.content.trim(),
      })),
    });

    showToast({
      type: "success",
      message: t("post.updated-successfully"),
    });

    router.push("/posts/my-posts");
  } catch (error: any) {
    showToast({
      type: "error",
      message: error.message || t("error.something-went-wrong"),
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Update page title
useHead({
  title: computed(() => t("post.edit") + " - " + t("site.name")),
});
</script>
