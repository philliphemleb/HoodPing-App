import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FeedItem, FilterCategory } from "@/types";
import { mockFeedItems } from "@/data/mock-feed";

export const useFeedStore = defineStore("feed", () => {
  const activeFilter = ref<FilterCategory>("all");

  const items = ref<FeedItem[]>(mockFeedItems);

  const filteredItems = computed(() => {
    if (activeFilter.value === "all") return items.value;
    return items.value.filter((item) => item.category === activeFilter.value);
  });

  function setFilter(filter: FilterCategory) {
    activeFilter.value = filter;
  }

  function addItem(item: Omit<FeedItem, "id" | "distance">) {
    items.value.unshift({
      ...item,
      id: crypto.randomUUID(),
      distance: "0m",
    });
  }

  return { items, activeFilter, filteredItems, setFilter, addItem };
});
