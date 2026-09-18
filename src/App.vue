<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "@/components/layout/BottomNav.vue";
import CreateSheet from "@/components/layout/CreateSheet.vue";

const route = useRoute();
const showCreate = ref(false);

const isAuthPage = computed(() => route.name === "login" || route.name === "register");
</script>

<template>
  <main>
    <router-view />
  </main>
  <BottomNav v-if="!isAuthPage" @create="showCreate = true" />
  <CreateSheet v-if="!isAuthPage" :open="showCreate" @update:open="showCreate = $event" />
</template>
