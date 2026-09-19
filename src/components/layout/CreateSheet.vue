<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useFeedStore } from "@/stores/feed";
import { useDragDismiss } from "@/composables/useDragDismiss";
import CategoryIcon from "@/components/icons/CategoryIcon.vue";
import type { CardType, FilterCategory } from "@/types";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();

const feedStore = useFeedStore();

const mode = ref<CardType>("seeking");
const title = ref("");
const category = ref<FilterCategory>("everyday");
const badge = ref("");
const visibleFor = ref("24h");
const shareWith = ref("neighborhood");

const categories: { value: FilterCategory; label: string }[] = [
  { value: "everyday", label: "Everyday" },
  { value: "activities", label: "Activities" },
  { value: "events", label: "Events" },
  { value: "sharing", label: "Sharing" },
];

const timerOptions = [
  { value: "2h", label: "2 Hours" },
  { value: "6h", label: "6 Hours" },
  { value: "24h", label: "24 Hours" },
  { value: "3d", label: "3 Days" },
  { value: "1w", label: "1 Week" },
];

const visibilityOptions = [
  { value: "building", label: "My Building" },
  { value: "neighborhood", label: "My Neighborhood" },
  { value: "community", label: "Public Community" },
];

const placeholder = computed(() =>
  mode.value === "seeking"
    ? "What are you looking for?"
    : "What do you want to share?"
);

const canPost = computed(() => title.value.trim().length > 0);

const accentClass = computed(() =>
  mode.value === "seeking" ? "bg-accent-seeking" : "bg-accent-offering"
);

const { dragY, isDragging, onDragStart } = useDragDismiss({
  onDismiss: () => cancel(),
});

function handlePost() {
  if (!canPost.value) return;

  feedStore.addItem({
    type: mode.value,
    category: category.value,
    title: title.value.trim(),
    authorName: "You",
    timeLeft: visibleFor.value,
    badge: badge.value || undefined,
    visibleFor: visibleFor.value,
    shareWith: shareWith.value,
  });

  cancel();
}

function cancel() {
  resetForm();
  emit("update:open", false);
}

function resetForm() {
  mode.value = "seeking";
  title.value = "";
  category.value = "everyday";
  badge.value = "";
  visibleFor.value = "24h";
  shareWith.value = "neighborhood";
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") cancel();
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
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="open"
        class="fixed inset-0 z-[150] flex items-end justify-center"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60" @click="cancel" />

        <div
          class="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-bg-card"
          style="height: 95vh"
          :style="{
            transform: `translateY(${dragY}px)`,
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }"
        >
          <!-- Drag handle -->
          <div
            class="flex justify-center pt-3 pb-2 touch-none"
            aria-label="Drag to dismiss"
            @touchstart="onDragStart"
          >
            <div class="h-1 w-10 rounded-full bg-text-secondary/20" />
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between px-4 pb-3">
            <button
              class="text-sm text-text-secondary transition-colors hover:text-text-primary"
              @click="cancel"
            >
              Cancel
            </button>
            <h2 class="text-base font-bold text-text-primary">
              Create HoodPing
            </h2>
            <button
              class="rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
              :class="
                canPost
                  ? 'bg-text-primary text-bg-primary'
                  : 'bg-text-primary/20 text-text-primary/40 pointer-events-none'
              "
              @click="handlePost"
            >
              Post
            </button>
          </div>

          <!-- Segmented Control -->
          <div class="mx-4 mb-4">
            <div class="relative flex rounded-full bg-bg-elevated p-1">
              <div
                class="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out"
                :class="accentClass"
                :style="{ transform: mode === 'offering' ? 'translateX(100%)' : 'translateX(0)' }"
              />
              <button
                class="relative z-10 flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors"
                :class="mode === 'seeking' ? 'text-text-primary' : 'text-text-secondary'"
                :aria-pressed="mode === 'seeking'"
                @click="mode = 'seeking'"
              >
                I Need Something
              </button>
              <button
                class="relative z-10 flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors"
                :class="mode === 'offering' ? 'text-text-primary' : 'text-text-secondary'"
                :aria-pressed="mode === 'offering'"
                @click="mode = 'offering'"
              >
                I Offer Something
              </button>
            </div>
          </div>

          <!-- Scrollable Form -->
          <div class="flex-1 overflow-y-auto px-4 pb-8" style="overscroll-behavior: contain">
            <!-- Text Area -->
            <textarea
              v-model="title"
              :placeholder="placeholder"
              :aria-label="placeholder"
              rows="4"
              maxlength="500"
              class="w-full resize-none border-none bg-transparent text-lg font-medium text-text-primary placeholder-text-secondary/50 outline-none"
            />
            <div class="mt-1 text-right text-xs text-text-secondary/50">{{ title.length }}/500</div>

            <!-- Category Pills -->
            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                :class="
                  category === cat.value
                    ? mode === 'seeking'
                      ? 'border-accent-seeking text-text-primary'
                      : 'border-accent-offering text-text-primary'
                    : 'border-text-secondary/20 text-text-secondary'
                "
                :aria-pressed="category === cat.value"
                @click="category = cat.value"
              >
                <CategoryIcon :category="cat.value" class="h-4 w-4" />
                <span>{{ cat.label }}</span>
              </button>
            </div>

            <!-- Media Upload Placeholder -->
            <div class="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-text-secondary/20 py-8">
              <svg class="mb-2 h-8 w-8 text-text-secondary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span class="text-xs text-text-secondary/50">Add Photo (Optional)</span>
            </div>

            <!-- Metadata -->
            <div class="mt-6 space-y-4">
              <!-- Badge / Value -->
              <div>
                <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-text-secondary">
                  VALUE OR COUNTER-VALUE
                </label>
                <input
                  v-model="badge"
                  type="text"
                  placeholder="Price or counter-value"
                  class="w-full rounded-xl bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 outline-none"
                >
              </div>

              <!-- Visible For -->
              <div>
                <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-text-secondary">
                  VISIBLE FOR
                </label>
                <div class="relative">
                  <select
                    v-model="visibleFor"
                    class="w-full appearance-none rounded-xl bg-bg-elevated px-4 py-3 pr-10 text-sm text-text-primary outline-none"
                  >
                    <option
                      v-for="opt in timerOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <!-- Share With -->
              <div>
                <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-text-secondary">
                  SHARE WITH
                </label>
                <div class="relative">
                  <select
                    v-model="shareWith"
                    class="w-full appearance-none rounded-xl bg-bg-elevated px-4 py-3 pr-10 text-sm text-text-primary outline-none"
                  >
                    <option
                      v-for="opt in visibilityOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-from,
.sheet-leave-to {
  visibility: hidden;
}
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
