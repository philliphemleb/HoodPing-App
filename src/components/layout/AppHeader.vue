<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useLocationStore } from "@/stores/location";
import { useUserStore } from "@/stores/user";
import ProfileMenu from "./ProfileMenu.vue";

const locationStore = useLocationStore();
const userStore = useUserStore();
const showMenu = ref(false);
const avatarRef = ref<HTMLButtonElement>();
const avatarRect = ref<{ top: number; right: number } | null>(null);

function closeMenu() {
  showMenu.value = false;
}

function toggleMenu() {
  if (!showMenu.value && avatarRef.value) {
    const rect = avatarRef.value.getBoundingClientRect();
    avatarRect.value = { top: rect.top, right: rect.right };
    window.addEventListener("scroll", closeMenu, { once: true });
  }

  showMenu.value = !showMenu.value;
}

function onMenuUpdate(val: boolean) {
  showMenu.value = val;
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', closeMenu);
})
</script>

<template>
  <header
    class="sticky top-0 z-50 flex items-center justify-between bg-bg-primary px-4 pb-2"
    :style="{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 12px)` }"
  >
    <h1 class="text-xl font-bold tracking-tight text-text-primary">
      HoodPing.
    </h1>

    <div class="flex items-center gap-3">
      <button
        class="flex items-center gap-2"
        aria-label="Change location"
        @click="locationStore.showModal = true"
      >
        <svg
          class="h-5 w-5 text-text-secondary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
        </svg>
        <div class="flex flex-col">
          <span class="text-xs text-text-secondary leading-none">
            {{ locationStore.locationName }}, {{ locationStore.formattedRadius }}
          </span>
        </div>
      </button>

      <button ref="avatarRef" class="relative h-8 w-8" aria-label="Open menu" @click="toggleMenu">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated">
          <svg class="h-4 w-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span v-if="userStore.karma > 0" class="absolute -bottom-1 -right-1.5 rounded-full bg-accent-seeking px-1.5 py-0.5 text-[9px] font-semibold leading-none text-white">
          +{{ userStore.karma }}
        </span>
      </button>
    </div>

    <ProfileMenu :open="showMenu" :avatar-rect="avatarRect" @update:open="onMenuUpdate" />
  </header>
</template>
