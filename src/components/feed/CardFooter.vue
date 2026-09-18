<script setup lang="ts">
defineProps<{
  authorName: string;
  distance: string;
  timeLeft: string;
  accentClass: string;
}>();
</script>

<template>
  <div class="flex items-center justify-between text-xs">
    <span class="text-text-secondary">{{ authorName }} &middot; {{ distance }}</span>
    <span class="flex items-center gap-1 font-medium" :class="accentClass">
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {{ timeLeft }}
    </span>
  </div>
</template>
