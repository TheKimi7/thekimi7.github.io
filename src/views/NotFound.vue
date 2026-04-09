<script setup>
import Navbar from '@/components/Navbar.vue'

defineProps({ isDark: Boolean })
const emit = defineEmits(['toggle-dark'])
</script>

<template>
  <div class="min-h-screen bg-light-bg text-zinc-900 dark:bg-surface-0 dark:text-text-primary font-sans">
    <Navbar :isDark="isDark" @toggle-dark="emit('toggle-dark')" />

    <div class="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h1 class="type-display mb-4">404</h1>
      <p class="type-body-lg text-zinc-500 dark:text-text-secondary mb-10">This page doesn't exist.</p>
      <a
        href="/"
        class="px-7 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 type-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-200"
      >
        Return to Home
      </a>
    </div>
  </div>
</template>
