import { isTauri, tokenStorage } from "./tokenStorage";

/** API client. Access token stays in memory, refresh is retried once on 401. */

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

/** True once the backend is configured; otherwise the app uses local test login. */
export const isBackendConfigured = BASE_URL.length > 0;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export interface ApiError {
  status: number;
  message: string;
}

interface LoginResponse {
  accessToken: string;
  /** Only returned for non-cookie (Tauri) clients. */
  refreshToken?: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

let refreshPromise: Promise<string | null> | null = null;

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<{ status: number; data: T }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as T;
  return { status: res.status, data };
}

async function doRefresh(): Promise<string | null> {
  try {
    const body: Record<string, unknown> = {};
    if (isTauri()) {
      const stored = await tokenStorage.getRefreshToken();
      if (!stored) return null;
      body.refreshToken = stored;
    }
    const { status, data } = await postJson<RefreshResponse>("/api/v1/refresh", body);
    if (status !== 200 || !data?.accessToken) return null;
    accessToken = data.accessToken;
    if (data.refreshToken) {
      await tokenStorage.setRefreshToken(data.refreshToken);
    }
    return accessToken;
  } catch {
    return null;
  }
}

function refreshOnce(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiLogin(email: string, password: string): Promise<boolean> {
  try {
    const { status, data } = await postJson<LoginResponse>("/api/v1/login", { email, password });
    if (status !== 200 || !data?.accessToken) return false;
    accessToken = data.accessToken;
    if (data.refreshToken) {
      await tokenStorage.setRefreshToken(data.refreshToken);
    }
    return true;
  } catch {
    return false;
  }
}

/** Server logout. Local tokens are cleared no matter the outcome. */
export async function apiLogout(): Promise<void> {
  try {
    const body: Record<string, unknown> = {};
    if (isTauri()) {
      const stored = await tokenStorage.getRefreshToken();
      if (stored) body.refreshToken = stored;
    }
    await postJson("/api/v1/logout", body);
  } catch {
    // ignored
  } finally {
    accessToken = null;
    await tokenStorage.setRefreshToken(null);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isBackendConfigured) {
    throw new Error("Backend not configured (VITE_API_URL is empty).");
  }

  const headers = new Headers(init.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: "include" });

  if (res.status === 401) {
    const renewed = await refreshOnce();
    if (renewed) {
      const retryHeaders = new Headers(init.headers);
      retryHeaders.set("Authorization", `Bearer ${renewed}`);
      if (init.body !== undefined && !retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }
      res = await fetch(`${BASE_URL}${path}`, { ...init, headers: retryHeaders, credentials: "include" });
    }
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    const error: ApiError = {
      status: res.status,
      message: payload?.message ?? `Request failed with status ${res.status}.`,
    };
    throw error;
  }

  return (await res.json().catch(() => null)) as T;
}
