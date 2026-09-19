<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const error = ref(false);

async function handleLogin() {
  error.value = false;
  const success = await userStore.login(email.value.trim(), password.value);
  if (success) {
    router.replace("/");
  } else {
    error.value = true;
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-bg-primary px-6" :style="{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 60px)` }">
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary">HoodPing.</h1>
      <p class="mt-2 text-sm text-text-secondary">Sign in to your neighborhood</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
      <div>
        <label for="login-email" class="sr-only">Email</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="Email"
          class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
      </div>

      <div>
        <label for="login-password" class="sr-only">Password</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
      </div>

      <p v-if="error" class="text-sm text-accent-danger">Invalid email or password.</p>

      <button
        type="submit"
        class="mt-2 w-full rounded-xl bg-gradient-to-br from-accent-seeking to-accent-offering py-3.5 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:opacity-80"
      >
        Log In
      </button>
    </form>

    <div class="my-8 flex items-center gap-4">
      <div class="h-px flex-1 bg-glass-border" />
      <span class="text-xs text-text-secondary">or</span>
      <div class="h-px flex-1 bg-glass-border" />
    </div>

    <div class="flex flex-col gap-3">
      <button
        disabled
        class="flex items-center justify-center gap-3 rounded-xl border border-glass-border bg-bg-card py-3.5 text-sm font-medium text-text-primary opacity-50"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Continue with Apple
      </button>

      <button
        disabled
        class="flex items-center justify-center gap-3 rounded-xl border border-glass-border bg-bg-card py-3.5 text-sm font-medium text-text-primary opacity-50"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </div>

    <p class="mt-6 text-center text-sm text-text-secondary">
      Don't have an account?
      <router-link to="/register" class="font-medium text-accent-seeking">Sign up</router-link>
    </p>

    <p class="mt-auto pb-6 text-center text-xs text-text-secondary/50">
      © 2026 Phillip Hemleb. All rights reserved.
    </p>
  </div>
</template>
