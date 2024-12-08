// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "@vueuse/motion/nuxt",
    "@nuxt/fonts",
    "@nuxt/icon",
  ],
  i18n: {
    defaultLocale: "ar",
    locales: [
      {
        code: "ar",
        dir: "rtl",
        file: "ar.json",
      },
      {
        code: "en",
        file: "en.json",
      },
    ],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
    },
  },
  fonts: {
    families: [{ preload: true, name: "Noto Sans Arabic", provider: "google" }],
  },
});