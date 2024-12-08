<template>
  <div class="min-h-96 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ t("auth.login") }}</h1>
      <button
        @click="loginWithGoogle"
        class="w-full py-2 px-4 flex justify-center items-center gap-4 rounded-lg transition duration-300 border shadow-lg"
      >
        {{ t("auth.login-with-google") }}
        <Icon name="i-devicon:google" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRuntimeConfig } from "#imports";

const { t } = useI18n();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const loginWithGoogle = () => {
  window.location.href = `${config.public.apiBase}/auth/google`;
};
</script>

<style scoped>
body {
  font-family: "Noto Sans Arabic", sans-serif;
}
</style>
