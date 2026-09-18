<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { PhonePrefix } from "@/types";

const router = useRouter();

const phonePrefixes: PhonePrefix[] = [
  { code: "+1", label: "US" },
  { code: "+1", label: "CA" },
  { code: "+44", label: "UK" },
  { code: "+49", label: "DE" },
  { code: "+41", label: "CH" },
  { code: "+43", label: "AT" },
  { code: "+33", label: "FR" },
  { code: "+61", label: "AU" },
  { code: "+81", label: "JP" },
  { code: "+86", label: "CN" },
];

const email = ref<string>("");
const phonePrefix = ref<PhonePrefix["code"]>("+49");
const phone = ref<string>("");
const username = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");

const passwordsMismatch = computed(
  () => repeatPassword.value.length > 0 && password.value !== repeatPassword.value
);

const canSubmit = computed(() =>
    email.value.trim().length > 0 &&
    username.value.trim().length > 0 &&
    password.value.length > 0 &&
    repeatPassword.value.length > 0 &&
    !passwordsMismatch.value
);

function handleRegister() {
  if (!canSubmit.value) return;
  router.push({ name: "login" });
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-bg-primary px-6" :style="{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 40px)` }">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary">HoodPing.</h1>
      <p class="mt-2 text-sm text-text-secondary">Create your account</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
      <div>
        <label for="reg-email" class="sr-only">Email</label>
        <input
          id="reg-email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="Email"
          class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
      </div>

      <div class="flex gap-2">
        <select
          v-model="phonePrefix"
          aria-label="Country code"
          class="shrink-0 appearance-none rounded-xl bg-bg-card px-3 py-3.5 text-sm text-text-primary outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
          <option v-for="p in phonePrefixes" :key="`${p.code}-${p.label}`" :value="p.code">
            {{ p.code }} {{ p.label }}
          </option>
        </select>
        <div class="flex-1">
          <label for="reg-phone" class="sr-only">Phone number</label>
          <input
            id="reg-phone"
            v-model="phone"
            type="tel"
            autocomplete="tel"
            placeholder="Phone number (optional)"
            class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
          >
        </div>
      </div>

      <div>
        <label for="reg-username" class="sr-only">Username</label>
        <input
          id="reg-username"
          v-model="username"
          type="text"
          autocomplete="username"
          placeholder="Username"
          class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
      </div>

      <div>
        <label for="reg-password" class="sr-only">Password</label>
        <input
          id="reg-password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          placeholder="Password"
          class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
      </div>

      <div>
        <label for="reg-repeat-password" class="sr-only">Repeat password</label>
        <input
          id="reg-repeat-password"
          v-model="repeatPassword"
          type="password"
          autocomplete="new-password"
          placeholder="Repeat password"
          class="w-full rounded-xl bg-bg-card px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none ring-1 ring-glass-border transition-colors focus:ring-accent-seeking"
        >
      </div>

      <p v-if="passwordsMismatch" class="text-sm text-accent-danger">Passwords do not match.</p>

      <button
        type="submit"
        :disabled="!canSubmit"
        class="mt-2 w-full rounded-xl bg-gradient-to-br from-accent-seeking to-accent-offering py-3.5 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:opacity-80"
        :class="!canSubmit ? 'opacity-40' : ''"
      >
        Create Account
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
      Already have an account?
      <router-link to="/login" class="font-medium text-accent-seeking">Log in</router-link>
    </p>

    <p class="mt-auto pb-6 text-center text-xs text-text-secondary/50">
      © 2026 Phillip Hemleb. All rights reserved.
    </p>
  </div>
</template>
