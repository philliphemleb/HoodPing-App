import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { apiLogin, apiLogout, isBackendConfigured } from "@/lib/api";

const STORAGE_KEY = "hoodping_auth";

// Dev login until VITE_API_URL is set.
const VALID_EMAIL = "test@example.com";
const VALID_PASSWORD = "testpassword";

function loadIsLoggedIn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref(loadIsLoggedIn());
  const unreadCount = ref(0);
  const karma = ref(0);

  async function login(email: string, password: string): Promise<boolean> {
    if (isBackendConfigured) {
      const success = await apiLogin(email, password);
      isLoggedIn.value = success;
      return success;
    }
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      isLoggedIn.value = true;
      return true;
    }
    return false;
  }

  function logout() {
    if (isBackendConfigured) {
      void apiLogout();
    }
    isLoggedIn.value = false;
    unreadCount.value = 0;
    karma.value = 0;
  }

  watch(isLoggedIn, (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {
      // storage full or unavailable
    }
  });

  return { isLoggedIn, unreadCount, karma, login, logout };
});
