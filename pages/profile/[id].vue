<template>
  <div class="max-w-4xl mx-auto px-4">
    <!-- User Profile Header -->
    <div
      class="bg-white rounded-lg shadow-sm p-6 mb-8"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <UiAvatar v-if="profile" :author="profile" size="48" />
        <div>
          <h1 class="text-2xl font-bold">{{ profile?.name }}</h1>
          <p class="text-gray-600">{{ profile?.email }}</p>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold mb-4">{{ t("profile.posts") }}</h2>

      <!-- Loading State -->
      <div v-if="pending" class="grid gap-6 md:grid-cols-2">
        <PostCardSkeleton v-for="i in 4" :key="i" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500">{{ t("error.failed-to-load") }}</p>
        <button
          @click="refresh"
          class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {{ t("action.retry") }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!posts?.length" class="text-center py-8 text-gray-500">
        {{ t("profile.no-posts") }}
      </div>

      <!-- Posts List -->
      <div v-else class="grid gap-6 md:grid-cols-2">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @deleted="refresh"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.totalPages > 1"
        class="flex justify-center items-center space-x-2 rtl:space-x-reverse mt-8"
      >
        <button
          :disabled="!pagination.hasPreviousPage"
          @click="page--"
          class="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          :class="{ 'hover:bg-gray-50': pagination.hasPreviousPage }"
        >
          {{ t("pagination.previous") }}
        </button>

        <span class="text-gray-600">
          {{
            t("pagination.page-of-total", {
              current: pagination.currentPage,
              total: pagination.totalPages,
            })
          }}
        </span>

        <button
          :disabled="!pagination.hasNextPage"
          @click="page++"
          class="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          :class="{ 'hover:bg-gray-50': pagination.hasNextPage }"
        >
          {{ t("pagination.next") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const userId = route.params.id as string;
const page = ref(1);
const limit = ref(4);
const { fetchWithoutAuth } = useApi();

// Fetch user profile and posts
const {
  data: profile,
  pending: profilePending,
  error: profileError,
} = await fetchWithoutAuth(`/users/${userId}/profile`);

const {
  data: postsData,
  pending: postsPending,
  error: postsError,
  refresh,
} = await fetchWithoutAuth(`/posts/user/${userId}`, {
  query: {
    page,
    limit,
  },
  watch: [page],
});

const posts = computed(() => postsData.value?.posts || []);
const pagination = computed(() => postsData.value?.pagination);
const pending = computed(() => profilePending.value || postsPending.value);
const error = computed(() => profileError.value || postsError.value);

// Update page title
useHead({
  title: computed(() =>
    profile.value?.name
      ? `${profile.value.name} - ${t("site.name")}`
      : t("site.name")
  ),
});
</script>
