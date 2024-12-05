<!--
  This is the homepage of the application. It displays a list of latest members and posts with pagination.
  If there are no posts, it displays a message.
  -->
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Latest Members -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t("home.latest-members") }}</h2>
      <div
        v-if="membersPending"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <UiSkeleton
          v-for="i in 6"
          :key="i"
          class="h-24 w-24 rounded-full mx-auto"
        />
      </div>
      <div v-else-if="membersError" class="text-center py-8">
        <p class="text-red-500">{{ t("error.failed-to-load") }}</p>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="user in latestUsers" :key="user.id" class="text-center">
          <NuxtLink :to="`/profile/${user.id}`" class="block">
            <UiAvatar :author="user" size="lg" class="mx-auto mb-2" />
            <h3 class="font-medium truncate">{{ user.name }}</h3>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section>
      <h2 class="text-2xl font-bold mb-6">{{ t("home.latest-posts") }}</h2>

      <!-- Loading State -->
      <div v-if="postsPending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PostCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <!-- Error State -->
      <div v-else-if="postsError" class="text-center py-8">
        <p class="text-red-500">{{ t("error.failed-to-load") }}</p>
        <button
          @click="refresh"
          class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {{ t("action.retry") }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!posts?.length" class="text-center py-12 text-gray-500">
        {{ t("home.no-posts") }}
      </div>

      <!-- Posts Grid -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
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
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const page = ref(1);
const limit = ref(6);
const { fetchWithoutAuth } = useApi();

// Fetch latest users
const {
  data: usersData,
  pending: membersPending,
  error: membersError,
} = await fetchWithoutAuth("/users/latest");

// Fetch posts with pagination
const {
  data: postsData,
  pending: postsPending,
  error: postsError,
  refresh,
} = await fetchWithoutAuth("/posts", {
  query: {
    page,
    limit,
  },
  watch: [page],
});

// Computed properties
const latestUsers = computed(() => usersData.value || []);
const posts = computed(() => postsData.value?.items || []);
const pagination = computed(() => {
  if (!postsData.value?.meta) return null;
  const { page: currentPage, totalPages } = postsData.value.meta;
  return {
    currentPage,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
});

// Update page title
useHead({
  title: t("nav.home"),
});
</script>
