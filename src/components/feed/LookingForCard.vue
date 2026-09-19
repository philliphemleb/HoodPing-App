<script setup lang="ts">
import CardFooter from "./CardFooter.vue";
import CategoryIcon from "@/components/icons/CategoryIcon.vue";
import type { FeedItem } from "@/types";

defineProps<{ item: FeedItem }>();
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-[var(--radius-card)] border-l-2 border-accent-seeking bg-bg-card p-4 transition-transform hover:scale-[1.01]"
  >
    <div class="flex items-center justify-between">
      <CategoryIcon :category="item.category" class="h-5 w-5 text-text-secondary" />
    </div>

    <p class="text-sm font-semibold leading-snug text-text-primary">
      {{ item.title }}
    </p>

    <CardFooter
      :author-name="item.authorName"
      :distance="item.distance"
      :time-left="item.timeLeft"
      accent-class="text-accent-seeking"
    />
  </article>
</template>
