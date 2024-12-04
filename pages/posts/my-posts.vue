<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">{{ $t("nav.my-posts") }}</h1>
      <NuxtLink
        to="/posts/create"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {{ $t("post.create") }}
      </NuxtLink>
    </div>

    <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <PostCardSkeleton v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="posts?.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ $t("post.no-my-posts") }}</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :show-actions="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCardSkeleton from '@/components/PostCardSkeleton.vue';

const { fetchWithAuth } = useApi();

const {
  data: posts,
  pending,
  error,
  refresh,
} = await fetchWithAuth("/posts/my-posts");
</script>
