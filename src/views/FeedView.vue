<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import QuickFilterBar from "@/components/layout/QuickFilterBar.vue";
import CardFeed from "@/components/feed/CardFeed.vue";
import LocationModal from "@/components/layout/LocationModal.vue";
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-bg-primary">
    <AppHeader />
    <QuickFilterBar />
    <CardFeed class="mt-4" />
    <LocationModal />
  </div>
</template>
