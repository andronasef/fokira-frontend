import { defineStore } from 'pinia';

interface Slide {
  id: string;
  content: string;
  duration: number;
  order: number;
}

interface Post {
  id: string;
  slides: Slide[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch<Post[]>(`${config.public.apiBase}/posts`);
        this.posts = response;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        this.error = 'Failed to fetch posts';
      } finally {
        this.loading = false;
      }
    },

    async createPost(slides: { content: string }[]) {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        if (!authStore.token) {
          throw new Error('Not authenticated');
        }

        const config = useRuntimeConfig();
        const response = await $fetch<Post>(`${config.public.apiBase}/posts`, {
          method: 'POST',
          body: { slides },
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.posts.unshift(response);
      } catch (error) {
        console.error('Failed to create post:', error);
        this.error = 'Failed to create post';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(postId: string) {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        if (!authStore.token) {
          throw new Error('Not authenticated');
        }

        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBase}/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.posts = this.posts.filter(post => post.id !== postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
        this.error = 'Failed to delete post';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
