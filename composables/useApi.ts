import { UseFetchOptions } from "nuxt/app";

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

  return {
    fetchWithAuth,
    $fetchWithAuth,
    fetchWithoutAuth,
  };
}
