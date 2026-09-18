import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "hoodping_theme";

function loadIsDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === "dark" : true;
  } catch {
    return true;
  }
}

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(loadIsDark());

  function applyTheme(dark: boolean) {
    document.documentElement.classList.toggle("light", !dark);
  }

  function toggle() {
    isDark.value = !isDark.value;
  }

  function logout() {
    isDark.value = true;
  }

  // Apply on store creation (no flash)
  applyTheme(isDark.value);

  // Persist and apply on change
  watch(isDark, (v) => {
    localStorage.setItem(STORAGE_KEY, v ? "dark" : "light");
    applyTheme(v);
  });

  return { isDark, toggle, logout };
});
