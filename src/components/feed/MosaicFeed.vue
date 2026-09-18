<script setup lang="ts">
import { useFeedStore } from "@/stores/feed";
import LookingForTile from "./LookingForTile.vue";
import OfferingTile from "./OfferingTile.vue";

const store = useFeedStore();
</script>

<template>
  <div>
    <div v-if="store.filteredItems.length === 0" class="flex flex-col items-center justify-center px-6 py-24 text-center">
      <span class="text-4xl" aria-hidden="true">📭</span>
      <p class="mt-3 text-sm text-text-secondary">No posts in this category yet.</p>
    </div>
    <div v-else class="columns-2 gap-3 px-3 pb-24">
      <div
        v-for="item in store.filteredItems"
        :key="item.id"
        class="mb-3 break-inside-avoid"
      >
        <LookingForTile v-if="item.type === 'seeking'" :item="item" />
        <OfferingTile v-else :item="item" />
      </div>
    </div>
  </div>
</template>
