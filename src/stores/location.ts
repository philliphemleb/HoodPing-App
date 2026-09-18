import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Coordinates } from "@/types";

const CACHE_KEY = "hoodping_location";

interface MaptilerContext {
  id: string;
  text: string;
}

interface MaptilerFeature {
  text: string;
  place_name: string;
  context: MaptilerContext[];
}

interface MaptilerGeocodingResponse {
  features: MaptilerFeature[];
}

interface CachedLocation {
  lat: number;
  lon: number;
  name: string;
}

function loadCache(): CachedLocation | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(lat: number, lon: number, name: string) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ lat, lon, name }));
  } catch {
    // storage full or unavailable
  }
}

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

let isRequesting = false;

function extractDistrictName(context: MaptilerContext[]): string | null {
  if (!Array.isArray(context)) return null;

  const priorityTypes = [
    "neighbourhood",
    "municipal_district",
    "suburb",
    "localadmin",
    "municipality",
    "city",
    "town",
  ];

  for (const type of priorityTypes) {
    const match = context.find((c) => c.id?.startsWith(type + "."));
    if (match?.text) return match.text;
  }

  return null;
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  if (!MAPTILER_KEY || MAPTILER_KEY === "your_key_here") {
    return "My Location (Offline)";
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${MAPTILER_KEY}&limit=1&language=de,en`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) return "My Location (Offline)";

    const data: MaptilerGeocodingResponse = await res.json();
    const feature = data.features?.[0];
    if (!feature) return "My Hood";

    return (
      extractDistrictName(feature.context) ||
      feature.text ||
      "My Hood"
    );
  } catch {
    return "My Location (Offline)";
  }
}

export const useLocationStore = defineStore("location", () => {
  const cached = loadCache();

  const coordinates = ref<Coordinates>(
    cached ? { latitude: cached.lat, longitude: cached.lon } : { latitude: 0, longitude: 0 }
  );
  const radius = ref(500);
  const locationName = ref(cached?.name ?? "Locating...");
  const showModal = ref(false);
  const loading = ref(false);

  const formattedRadius = computed(() => {
    if (radius.value >= 1000) {
      return `${(radius.value / 1000).toFixed(radius.value % 1000 === 0 ? 0 : 1)} km`;
    }
    return `${radius.value}m`;
  });

  async function requestLocation() {
    if (isRequesting) return;
    isRequesting = true;
    loading.value = true;

    try {
      const { checkPermissions, getCurrentPosition } = await import(
        "@tauri-apps/plugin-geolocation"
      );

      let permissions = await checkPermissions();
      if (permissions.location === "granted" || permissions.location === "prompt" || permissions.location === "prompt-with-rationale") {
        const pos = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        coordinates.value = { latitude: lat, longitude: lon };

        const name = await reverseGeocode(lat, lon);
        locationName.value = name;
        saveCache(lat, lon, name);
      }
    } catch {
      if (!cached) {
        locationName.value = "My Location";
      }
    } finally {
      isRequesting = false;
      loading.value = false;
    }
  }

  function applyRadius(newRadius: number) {
    radius.value = newRadius;
    showModal.value = false;
  }

  return {
    coordinates,
    radius,
    locationName,
    showModal,
    loading,
    formattedRadius,
    requestLocation,
    applyRadius,
  };
});
