<script setup>
import { siteConfig } from '@/data/config.js'
</script>

<template>
  <footer class="py-8 px-6 border-t border-light-border dark:border-border-subtle">
    <div class="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">&copy; {{ new Date().getFullYear() }} {{ siteConfig.name }}</p>
      <p class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">Built with Vue + Tailwind</p>
    </div>
  </footer>
</template>
