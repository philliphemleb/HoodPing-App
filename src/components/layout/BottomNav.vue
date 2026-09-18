<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

defineEmits<{ create: [] }>();
</script>

<template>
  <nav class="fixed left-1/2 z-50 -translate-x-1/2" aria-label="Main navigation" style="bottom: env(safe-area-inset-bottom, 0px)">
    <div
      class="flex items-center gap-8 rounded-full border border-glass-border px-6 py-3"
      style="background: var(--color-glass-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px)"
    >
      <button
        class="flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        :class="route.name === 'feed' ? 'bg-text-primary/10 text-text-primary' : 'text-text-secondary hover:bg-text-primary/10'"
        aria-label="Home"
        @click="router.push('/')"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      <button
        class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-seeking to-accent-offering text-2xl font-bold text-white shadow-lg shadow-accent-seeking/20 transition-transform hover:scale-105 active:scale-95"
        aria-label="Create"
        @click="$emit('create')"
      >
        +
      </button>

      <button
        class="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        :class="route.name === 'chat' ? 'bg-text-primary/10 text-text-primary' : 'text-text-secondary hover:bg-text-primary/10'"
        aria-label="Chat"
        @click="router.push('/chat')"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span
          v-if="userStore.unreadCount > 0"
          class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-danger px-1 text-[10px] font-bold text-white"
        >
          {{ userStore.unreadCount }}
        </span>
      </button>
    </div>
  </nav>
</template>
