<script setup lang="ts">
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const themeStore = useThemeStore();
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-bg-primary px-4" :style="{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 16px)` }">
    <div class="flex items-center gap-3 mb-8">
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-bg-elevated"
        aria-label="Go back"
        @click="router.back()"
      >
        <svg class="h-5 w-5 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="text-lg font-bold text-text-primary">Settings</h1>
    </div>

    <div class="space-y-6">
      <div>
        <h2 class="mb-3 text-[11px] font-semibold tracking-widest text-text-secondary">
          APPEARANCE
        </h2>
        <div class="rounded-xl bg-bg-card p-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-text-primary">Dark Mode</span>
            <button
              role="switch"
              :aria-checked="themeStore.isDark"
              aria-label="Dark Mode"
              class="relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors"
              @click="themeStore.toggle()"
            >
              <div class="relative h-6 w-11 rounded-full transition-colors" :class="themeStore.isDark ? 'bg-accent-seeking' : 'bg-bg-elevated'">
                <div class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-text-primary shadow-sm transition-transform" :class="themeStore.isDark ? 'translate-x-5' : ''" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
