<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(true)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved ? saved === 'dark' : true
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<template>
  <div
    :class="isDark ? 'dark' : ''"
    class="min-h-screen bg-light-bg text-zinc-800 dark:bg-surface-0 dark:text-text-primary font-sans transition-colors duration-200"
  >
    <router-view :isDark="isDark" @toggle-dark="toggleDark" />
  </div>
</template>
