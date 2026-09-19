<script setup lang="ts">
import { useFeedStore } from "@/stores/feed";
import CategoryIcon from "@/components/icons/CategoryIcon.vue";
import type { FilterCategory } from "@/types";

const store = useFeedStore();

const filters: { label: string; value: FilterCategory }[] = [
  { label: "All", value: "all" },
  { label: "Activities", value: "activities" },
  { label: "Events", value: "events" },
  { label: "Sharing", value: "sharing" },
  { label: "Everyday", value: "everyday" },
];
</script>

<template>
  <div class="flex gap-2 overflow-x-auto py-2 scrollbar-none">
    <button
      v-for="filter in filters"
      :key="filter.value"
      class="shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors min-h-[44px]"
      :class="
        store.activeFilter === filter.value
          ? 'border-text-primary bg-text-primary text-bg-primary'
          : 'border-text-secondary/20 bg-transparent text-text-primary'
      "
      :aria-pressed="store.activeFilter === filter.value"
      @click="store.setFilter(filter.value)"
    >
      <span class="flex items-center gap-1.5">
        <CategoryIcon :category="filter.value" class="h-4 w-4" />
        {{ filter.label }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
