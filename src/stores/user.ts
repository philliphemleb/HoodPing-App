import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "hoodping_auth";
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

  function login(email: string, password: string): boolean {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      isLoggedIn.value = true;
      return true;
    }
    return false;
  }

  function logout() {
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
