<script setup lang="ts">
import CardFooter from "./CardFooter.vue";
import CategoryIcon from "@/components/icons/CategoryIcon.vue";
import type { FeedItem } from "@/types";

defineProps<{ item: FeedItem }>();
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-[var(--radius-card)] border-l-2 border-accent-offering bg-bg-card p-4 transition-transform hover:scale-[1.01]"
    :class="{ 'col-span-2': item.imageUrl }"
  >
    <div v-if="item.imageUrl" class="relative -mx-4 -mt-4 overflow-hidden rounded-t-[var(--radius-card)]">
      <img
        :src="item.imageUrl"
        :alt="item.title"
        class="h-48 w-full object-cover"
        loading="lazy"
      >
      <span
        v-if="item.badge"
        class="absolute right-3 top-3 rounded-full bg-bg-elevated/80 px-2.5 py-1 text-xs font-semibold text-accent-offering backdrop-blur-sm"
      >
        {{ item.badge }}
      </span>
    </div>

    <div v-else class="flex items-center justify-between">
      <CategoryIcon :category="item.category" class="h-5 w-5 text-text-secondary" />
      <span
        v-if="item.badge"
        class="rounded-full bg-accent-offering/15 px-2 py-0.5 text-xs font-semibold text-accent-offering"
      >
        {{ item.badge }}
      </span>
    </div>

    <p class="text-sm font-semibold leading-snug text-text-primary">
      {{ item.title }}
    </p>

    <CardFooter
      :author-name="item.authorName"
      :distance="item.distance"
      :time-left="item.timeLeft"
      accent-class="text-accent-offering"
    />
  </article>
</template>
