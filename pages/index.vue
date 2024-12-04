<!--
  This is the homepage of the application. It displays a list of posts in a 3-column grid.
  If there are no posts, it displays a loading message.
  If there is an error fetching the posts, it displays the error message.
  -->
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ $t("nav.home") }}</h1>

    <div v-if="postsStore.loading" class="text-center py-8">
      {{ $t("common.loading") }}
    </div>

    <div v-else-if="postsStore.error" class="text-red-500 text-center py-8">
      {{ postsStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in postsStore.posts"
        :key="post.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <StatusViewer :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const postsStore = usePostsStore();

onMounted(async () => {
  await postsStore.fetchPosts();
});
</script>
