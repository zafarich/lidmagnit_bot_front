// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: {enabled: true},
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3005",
    },
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            "brand-bg": "#F8FAFC",
            "brand-dark": "#1E293B",
            "brand-primary": "#3B82F6",
            "brand-soft": "#EFF6FF",
            "brand-success": "#10B981",
          },
        },
      },
    },
  },

  app: {
    head: {
      script: [
        {
          src: "https://telegram.org/js/telegram-web-app.js",
          defer: true,
        },
      ],
    },
  },
});
