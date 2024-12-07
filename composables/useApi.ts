import type { UseFetchOptions } from "#app";

export function useApi() {
  const config = useRuntimeConfig();
  const token = useCookie("auth_token");

  const fetchWithAuth = async <T>(
    endpoint: string,
    options: UseFetchOptions<T> = {}
  ) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token.value}`,
    };

    return useFetch<T>(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers,
    });
  };

  const $fetchWithAuth = async <T>(endpoint: string, options: any = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token.value}`,
    };

    return $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers,
    });
  };

  const fetchWithoutAuth = async <T>(
    endpoint: string,
    options: UseFetchOptions<T> = {}
  ) => {
    return useFetch<T>(`${config.public.apiBase}${endpoint}`, options);
  };

  // Posts API
  const getPosts = async ({ page = 1, limit = 10 } = {}) => {
    const { data } = await fetchWithoutAuth(
      `/posts?page=${page}&limit=${limit}`
    );
    return data.value;
  };

  const getUserPosts = async (
    userId: string,
    { page = 1, limit = 10 } = {}
  ) => {
    const { data } = await fetchWithoutAuth(
      `/posts/user/${userId}?page=${page}&limit=${limit}`
    );
    return data.value;
  };

  const createPost = async (postData: any) => {
    const { data } = await fetchWithAuth("/posts", {
      method: "POST",
      body: postData,
    });
  };

  const deletePost = async (postId: string) => {
    return $fetchWithAuth<void>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  };

  const updatePost = async (postId: string, postData: any) => {
    return $fetchWithAuth<void>(`/posts/${postId}`, {
      method: 'PATCH',
      body: postData,
    });
  };

  // Users API
  const getLatestUsers = () => {
    return $fetch(`${config.public.apiBase}/users/latest`);
  };

  const getUserProfile = (userId: string) => {
    return $fetch(`${config.public.apiBase}/users/${userId}/profile`);
  };

  return {
    fetchWithAuth,
    $fetchWithAuth,
    fetchWithoutAuth,
    // Posts
    getPosts,
    getUserPosts,
    createPost,
    deletePost,
    updatePost,
    getLatestUsers,
    getUserProfile,
  };
}
