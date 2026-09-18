<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useLocationStore } from "@/stores/location";
import { useDragDismiss } from "@/composables/useDragDismiss";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useThemeStore } from "@/stores/theme";

const store = useLocationStore();
const themeStore = useThemeStore();
const mapContainer = ref<HTMLDivElement>();
const backdropRef = ref<HTMLDivElement>();
const tempRadius = ref(store.radius);
let map: L.Map | null = null;
let circle: L.Circle | null = null;

const presets = [
  { label: "250m", value: 250 },
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "3km", value: 3000 },
  { label: "5km", value: 5000 },
];

const pulsingIcon = L.divIcon({
  className: "pulsing-marker",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: `<div class="marker-dot"></div><div class="marker-pulse"></div>`,
});

function initMap() {
  if (!mapContainer.value || map) return;

  const latitude = store.coordinates.latitude;
  const longitude = store.coordinates.longitude;

  map = L.map(mapContainer.value, {
    center: [latitude, longitude],
    zoom: 14,
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer(
    themeStore.isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    {
    maxZoom: 19,
    subdomains: ["a", "b", "c", "d"],
  }).addTo(map);


  L.marker([latitude, longitude], { icon: pulsingIcon }).addTo(map);
  circle = L.circle([latitude, longitude], {
    radius: tempRadius.value,
    color: "var(--color-accent-seeking)",
    fillColor: "var(--color-accent-seeking)",
    fillOpacity: 0.12,
    weight: 1.5,
  }).addTo(map);
}

function updateRadius(val: number) {
  tempRadius.value = val;
  if (circle) circle.setRadius(val);
}

const sliderPct = computed(() =>
    `${Math.min(100, Math.max(0, ((tempRadius.value - 100) / (5000 - 100)) * 100))}%`
);

const displayRadius = computed(() =>
    tempRadius.value >= 1000
        ? `${(tempRadius.value / 1000).toFixed(1)} km`
        : `${tempRadius.value}m`
);

function handleApply() {
  store.applyRadius(tempRadius.value);
}

function close() {
  store.showModal = false;
  tempRadius.value = store.radius;
}

function updateBackdrop(progress: number) {
  if (!backdropRef.value) return;
  backdropRef.value.style.backdropFilter = `blur(${4 * (1 - progress)}px)`;
  backdropRef.value.style.opacity = String(1 - progress * 0.6);
}

function resetBackdrop() {
  if (!backdropRef.value) return;
  backdropRef.value.style.backdropFilter = "";
  backdropRef.value.style.opacity = "";
}

const { dragY, isDragging, onDragStart } = useDragDismiss({
  onDismiss: () => {
    close();
    resetBackdrop();
  },
  onDragProgress: (progress) => updateBackdrop(progress),
  onSnapBack: () => resetBackdrop(),
});

watch(
    () => store.showModal,
    async (open) => {
      document.body.style.overflow = open ? "hidden" : "";

      if (!open) {
        if (map) {
          map.remove();
          map = null;
          circle = null;
        }

        return;
      }

      await nextTick();
      if (store.coordinates.latitude === 0
          && store.coordinates.longitude === 0) {
        return;
      }

      if (!map) {
        initMap();
      }
      setTimeout(() => map?.invalidateSize(), 300);
    }
);

watch(
    () => [store.coordinates.latitude, store.coordinates.longitude],
    ([lat, lon]) => {
      if (store.showModal && !map && lat !== 0 && lon !== 0) {
        initMap();
        setTimeout(() => map?.invalidateSize(), 300);
      }
    }
);

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

watch(() => store.showModal, (open) => {
  document.getElementById("app")?.toggleAttribute("aria-hidden", open);
});

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
  map?.remove();
  map = null;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="store.showModal" class="fixed inset-0 z-100 flex items-end justify-center" role="dialog" aria-modal="true">
        <div ref="backdropRef" class="modal-backdrop absolute inset-0 bg-black/60" @click="close" />

        <div
            class="relative z-10 flex w-full max-w-lg flex-col rounded-t-3xl bg-bg-card pb-8 pt-3"
            :style="{
            transform: `translateY(${dragY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }"
        >
          <div
              class="mx-auto flex h-11 w-full items-center justify-center touch-none"
              aria-label="Drag to dismiss"
              @touchstart="onDragStart"
          >
            <div class="h-1 w-10 rounded-full bg-white/20" />
          </div>

          <div class="mx-4 overflow-hidden rounded-xl">
            <div ref="mapContainer" class="h-52 w-full" />
          </div>

          <div class="mx-5 mt-5">
            <div class="mb-3 flex items-baseline justify-between">
              <span class="text-[11px] font-semibold tracking-widest text-text-secondary">
                DISCOVERY RADIUS
              </span>
              <span class="text-sm font-bold text-text-primary">
                {{ displayRadius }}
              </span>
            </div>

            <input
                type="range"
                min="100"
                max="5000"
                step="50"
                :value="tempRadius"
                aria-label="Discovery radius"
                class="radius-slider w-full"
                :style="{ '--slider-pct': sliderPct }"
                @input="updateRadius(+(($event.target as HTMLInputElement).value))"
            >

            <div class="mt-2 flex justify-between px-1">
              <button
                  v-for="p in presets"
                  :key="p.value"
                  class="text-xs font-medium transition-colors min-h-[44px] px-2 py-2"
                  :class="tempRadius === p.value ? 'text-accent-seeking' : 'text-text-secondary'"
                  @click="updateRadius(p.value)"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <button
              class="mx-5 mt-6 rounded-xl bg-text-primary py-3.5 text-sm font-bold text-bg-primary transition-opacity hover:opacity-90 active:opacity-80"
              @click="handleApply"
          >
            APPLY RADIUS
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  opacity: 1;
  backdrop-filter: blur(4px);
  transition: opacity 0.25s ease, backdrop-filter 0.25s ease;
}

.radius-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--color-accent-seeking) 0%,
    var(--color-accent-seeking) var(--slider-pct, 10%),
    rgba(255, 255, 255, 0.15) var(--slider-pct, 10%),
    rgba(255, 255, 255, 0.15) 100%
  );
  outline: none;
}

.radius-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.4);
  border: none;
}

.radius-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.4);
  border: none;
}

:deep(.pulsing-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.marker-dot) {
  width: 14px;
  height: 14px;
  background: var(--color-accent-seeking);
  border: 3px solid #fff;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  box-shadow: 0 0 8px rgba(0, 210, 255, 0.6);
}

:deep(.marker-pulse) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(0, 210, 255, 0.4);
  position: absolute;
  top: -10px;
  left: -10px;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.modal-enter-from .modal-backdrop {
  opacity: 0;
  backdrop-filter: blur(0);
}

.modal-leave-to .modal-backdrop {
  opacity: 0;
  backdrop-filter: blur(0);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
  visibility: hidden;
}
.modal-enter-from > div:last-child {
  transform: translateY(100%);
}
.modal-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
