/** Refresh token storage. Browser uses the HttpOnly cookie, Tauri uses secure native storage once the plugin lands. */
export interface TokenStorage {
  getRefreshToken(): Promise<string | null>;
  setRefreshToken(token: string | null): Promise<void>;
}

const TAURI_REFRESH_KEY = "hoodping_refresh_token";

class BrowserTokenStorage implements TokenStorage {
  async getRefreshToken(): Promise<string | null> {
    return null;
  }

  async setRefreshToken(): Promise<void> {
    return;
  }
}

class TauriTokenStorage implements TokenStorage {
  async getRefreshToken(): Promise<string | null> {
    try {
      return localStorage.getItem(TAURI_REFRESH_KEY);
    } catch {
      return null;
    }
  }

  async setRefreshToken(token: string | null): Promise<void> {
    try {
      if (token === null) {
        localStorage.removeItem(TAURI_REFRESH_KEY);
      } else {
        localStorage.setItem(TAURI_REFRESH_KEY, token);
      }
    } catch {
      // storage full or unavailable
    }
  }
}

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}

export const tokenStorage: TokenStorage = isTauri()
  ? new TauriTokenStorage()
  : new BrowserTokenStorage();
