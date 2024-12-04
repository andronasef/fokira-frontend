import messages from "@intlify/unplugin-vue-i18n/messages";

export default defineI18nConfig(() => ({
  messages,
  legacy: false,
  locale: "ar",
  fallbackLocale: "ar",
}));
