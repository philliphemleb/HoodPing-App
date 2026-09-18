<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const props = defineProps<{
  open: boolean;
  avatarRect: { top: number; right: number } | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const themeStore = useThemeStore();
const userStore = useUserStore();
const router = useRouter();

function close() {
  emit("update:open", false);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

watch(() => props.open, (open) => {
  document.getElementById("app")?.toggleAttribute("aria-hidden", open);
});

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});

function handleSettings() {
  close();
  router.push("/settings");
}

function handleLogout() {
  themeStore.logout();
  userStore.logout();
  close();
  router.push("/login");
}

const panelTop = computed(() => {
  if (!props.avatarRect) return "60px";
  return `${props.avatarRect.top + 40}px`;
});

const panelRight = computed(() => {
  if (!props.avatarRect) return "16px";
  return `${window.innerWidth - props.avatarRect.right}px`;
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[200]">
      <div class="absolute inset-0" @click="close" />

      <div
        role="menu"
        class="absolute w-56 overflow-hidden rounded-xl border border-glass-border bg-bg-card shadow-xl"
        :style="{ top: panelTop, right: panelRight }"
      >
        <button
          role="menuitem"
          class="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-primary transition-colors hover:bg-bg-elevated"
          @click="handleSettings"
        >
          <svg class="h-4 w-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </button>

        <div class="mx-3 border-t border-glass-border" />

        <button
          role="menuitem"
          class="flex w-full items-center gap-3 px-4 py-3 text-sm text-accent-danger transition-colors hover:bg-bg-elevated"
          @click="handleLogout"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
