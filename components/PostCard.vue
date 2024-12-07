<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0 }"
    :visible="{ opacity: 1, y: 0 }"
    :delay="150"
    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
  >
    <!-- Header -->
    <div class="p-4">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <UiAvatar :author="post.author" size="32" />
          <div>
            <h3 class="font-medium">{{ post.author.name }}</h3>
            <time :datetime="post.createdAt" class="text-sm text-gray-500">
              {{ formatDate(post.createdAt) }}
            </time>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="showActions" class="flex gap-2">
          <!-- Edit Button -->
          <NuxtLink
            :to="`/posts/edit/${post.id}`"
            class="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </NuxtLink>

          <!-- Delete Button -->
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <svg
              v-if="!isDeleting"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div
              v-else
              class="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </button>
        </div>
      </div>

      <!-- Post Content -->
      <div class="space-y-4 cursor-pointer" @click="isViewerOpen = true">
        <h2 class="text-xl font-bold">{{ post.title }}</h2>

        <!-- Preview -->
        <div class="bg-gray-50 rounded-lg p-4 h-full">
          <p class="text-gray-700 h-full">
            {{ post.slides[0].content }}
            <span v-if="post.slides.length > 1" class="text-green-600 h-full">
              +{{ post.slides.length - 1 }} {{ t("post.more-slides") }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <StatusViewer
        v-if="isViewerOpen"
        :post="post"
        @close="isViewerOpen = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import { useApi } from "@/composables/useApi";
import UiAvatar from "./ui/Avatar.vue";
import StatusViewer from "./StatusViewer.vue";

const { t } = useI18n();
const { showToast } = useToast();
const { deletePost: apiDeletePost } = useApi();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const props = defineProps<{
  post: {
    id: string;
    title: string;
    slides: Array<{ content: string }>;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    isOwner: boolean;
  };
  showActions?: boolean;
}>();

const isDeleting = ref(false);
const isViewerOpen = ref(false);

const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = "/default-avatar.png";
};

const handleDelete = async () => {
  if (!confirm(t("post.delete-confirm"))) return;

  isDeleting.value = true;
  try {
    await apiDeletePost(props.post.id);
    showToast({
      type: "success",
      message: t("post.deleted-successfully"),
    });
    emit("deleted");
  } catch (error: any) {
    showToast({
      type: "error",
      message: error.message || t("error.something-went-wrong"),
    });
  } finally {
    isDeleting.value = false;
    location.reload();
  }
};

const formatDate = (date: string) => {
  const dateFormatted = new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return dateFormatted;
};

const openViewer = () => {
  isViewerOpen.value = true;
};

const closeViewer = () => {
  isViewerOpen.value = false;
};
</script>
