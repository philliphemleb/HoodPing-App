<script setup lang="ts">
import { useFeedStore } from "@/stores/feed";
import LookingForCard from "./LookingForCard.vue";
import OfferingCard from "./OfferingCard.vue";

const store = useFeedStore();
</script>

<template>
  <div>
    <div v-if="store.filteredItems.length === 0" class="flex flex-col items-center justify-center px-6 py-24 text-center">
      <svg class="h-10 w-10 text-text-secondary/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
      <p class="mt-3 text-sm text-text-secondary">No posts in this category yet.</p>
    </div>
    <div v-else class="columns-2 gap-3 px-3 pb-24">
      <div
        v-for="item in store.filteredItems"
        :key="item.id"
        class="mb-3 break-inside-avoid"
      >
        <LookingForCard v-if="item.type === 'seeking'" :item="item" />
        <OfferingCard v-else :item="item" />
      </div>
    </div>
  </div>
</template>
