// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
  ],
  i18n: {
    locales: [
      {
        code: "ar",
        file: "ar.json",
        dir: "rtl",
      },
      {
        code: "en",
        file: "en.json",
      },
    ],
    lazy: false,
    vueI18n: "./i18n.config.ts",
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        dir: "rtl",
        lang: "ar",
      },
    },
  },
});
