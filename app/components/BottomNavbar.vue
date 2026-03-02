<template>
  <div
    class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-50 px-6 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
  >
    <div class="flex items-center justify-around h-14">
      <!-- Home Link -->
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center gap-1 w-20 transition-colors duration-200 group"
        :class="
          route.path === '/'
            ? 'text-brand-primary'
            : 'text-gray-400 hover:text-gray-600'
        "
      >
        <div
          class="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
          :class="
            route.path === '/'
              ? 'bg-brand-primary/10'
              : 'group-hover:bg-gray-100'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
        </div>
        <span class="text-[10px] font-medium transition-colors"
          >Bosh sahifa</span
        >
      </NuxtLink>

      <!-- Broadcast Link (Admin only) -->
      <NuxtLink
        v-if="isAdmin"
        to="/admin/broadcast"
        class="flex flex-col items-center justify-center gap-1 w-20 transition-colors duration-200 group"
        :class="
          route.path === '/admin/broadcast'
            ? 'text-brand-primary'
            : 'text-gray-400 hover:text-gray-600'
        "
      >
        <div
          class="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
          :class="
            route.path === '/admin/broadcast'
              ? 'bg-brand-primary/10'
              : 'group-hover:bg-gray-100'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 8a3 3 0 0 1 0 6" />
            <path
              d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"
            />
            <path
              d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"
            />
          </svg>
        </div>
        <span class="text-[10px] font-medium transition-colors">Xabar</span>
      </NuxtLink>

      <!-- Profile Link -->
      <NuxtLink
        to="/profile"
        class="flex flex-col items-center justify-center gap-1 w-20 transition-colors duration-200 group"
        :class="
          route.path === '/profile'
            ? 'text-brand-primary'
            : 'text-gray-400 hover:text-gray-600'
        "
      >
        <div
          class="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
          :class="
            route.path === '/profile'
              ? 'bg-brand-primary/10'
              : 'group-hover:bg-gray-100'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
        <span class="text-[10px] font-medium transition-colors">Profil</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";

const route = useRoute();
const isAdmin = inject("isAdmin", ref(false));
</script>
