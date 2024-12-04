import { useRuntimeConfig } from "#imports";
import { defineStore } from "pinia";
import { useFetch } from "#imports";
import { useCookie } from "#imports";
import { useApi } from "#imports";

interface Slide {
  id: string;
  content: string;
  order: number;
  duration: number;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  slides: Slide[];
  author: Author;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  myPosts: Post[];
  loading: boolean;
  error: string | null;
}

interface CreatePostData {
  title: string;
  slides: {
    content: string;
  }[];
}

export const usePostsStore = defineStore("posts", {
  state: (): PostsState => ({
    posts: [],
    myPosts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;
      const { fetchWithAuth } = useApi();
      
      try {
        const { data } = await fetchWithAuth<{ posts: Post[] }>('/posts');
        if (data.value) {
          this.posts = data.value.posts;
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch posts';
      } finally {
        this.loading = false;
      }
    },

    async fetchMyPosts() {
      this.loading = true;
      this.error = null;
      const { fetchWithAuth } = useApi();
      
      try {
        const { data } = await fetchWithAuth<{ posts: Post[] }>('/posts/my-posts');
        if (data.value) {
          this.myPosts = data.value.posts;
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch your posts';
      } finally {
        this.loading = false;
      }
    },

    async createPost(title: string, slides: { content: string }[]) {
      this.loading = true;
      this.error = null;
      const { $fetchWithAuth } = useApi();
      
      try {
        await $fetchWithAuth('/posts', {
          method: 'POST',
          body: { title, slides }
        });
      } catch (err: any) {
        this.error = err.message || 'Failed to create post';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(id: string) {
      this.loading = true;
      this.error = null;
      const { $fetchWithAuth } = useApi();
      
      try {
        await $fetchWithAuth(`/posts/${id}`, {
          method: 'DELETE'
        });
        
        // Remove post from both lists
        this.posts = this.posts.filter(post => post.id !== id);
        this.myPosts = this.myPosts.filter(post => post.id !== id);
      } catch (err: any) {
        this.error = err.message || 'Failed to delete post';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
