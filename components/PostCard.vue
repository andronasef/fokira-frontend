<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0 }"
    :visible="{ opacity: 1, y: 0 }"
    :delay="150"
    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
  >
    <div class="p-4">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <UiAvatar :author="post.author" size="md" />
          <div>
            <h3 class="font-medium">{{ post.author.name }}</h3>
            <time :datetime="post.createdAt" class="text-sm text-gray-500">
              {{ formatDate(post.createdAt) }}
            </time>
          </div>
        </div>

        <div
          v-if="showActions"
          class="flex items-center space-x-2 space-x-reverse"
        >
          <!-- View Status Button -->
          <button
            @click="isViewerOpen = true"
            class="text-green-600 hover:text-green-700 transition-colors"
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <!-- Delete Button -->
          <button
            v-if="post.isOwner"
            @click="deletePost"
            :disabled="isDeleting"
            class="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="isDeleting" class="flex items-center">
              <div
                class="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full mr-2"
              ></div>
              {{ t("common.deleting") }}
            </div>
            <span v-else>{{ t("post.delete") }}</span>
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
const { $fetchWithAuth } = useApi();

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

const deletePost = async () => {
  if (!confirm(t("post.confirm-delete"))) return;

  isDeleting.value = true;
  try {
    await $fetchWithAuth(`/posts/${props.post.id}`, {
      method: "DELETE",
    });
    showToast(t("post.delete-success"), "success");
    window.location.reload();
  } catch (error) {
    showToast(t("post.delete-error"), "error");
  } finally {
    isDeleting.value = false;
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
