<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '@/data/config.js'

defineProps({ isDark: Boolean })
const emit = defineEmits(['toggle-dark'])

const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Publications', href: '/#publications' },
]

const handleScroll = () => { scrolled.value = window.scrollY > 48 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled
        ? 'bg-white/70 dark:bg-surface-0/70 backdrop-blur-2xl border-b border-light-border dark:border-border-subtle'
        : 'bg-transparent',
    ]"
  >
    <div class="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/" class="type-mono text-sm font-medium">
        <span class="text-zinc-400 dark:text-text-tertiary">&gt;_</span>
        <span class="ml-1">{{ siteConfig.logo }}</span>
      </a>

      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="type-sm text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary transition-colors duration-150"
        >
          {{ link.label }}
        </a>

        <button
          @click="emit('toggle-dark')"
          class="w-8 h-8 rounded-xl flex items-center justify-center border border-light-border dark:border-border hover:border-zinc-400 dark:hover:border-text-tertiary transition-colors duration-150"
          :title="isDark ? 'Light mode' : 'Dark mode'"
        >
          <svg v-if="isDark" class="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
          <svg v-else class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>
      </div>

      <div class="flex md:hidden items-center gap-2">
        <button
          @click="emit('toggle-dark')"
          class="w-8 h-8 rounded-xl flex items-center justify-center border border-light-border dark:border-border transition-colors duration-150"
        >
          <svg v-if="isDark" class="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
          <svg v-else class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>
        <button @click="mobileOpen = !mobileOpen" class="w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-text-secondary">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="md:hidden bg-white/95 dark:bg-surface-0/95 backdrop-blur-xl border-t border-light-border dark:border-border-subtle px-6 py-4 space-y-1">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          @click="mobileOpen = false"
          class="block py-2 type-sm text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary transition-colors"
        >
          {{ link.label }}
        </a>
      </div>
    </transition>
  </nav>
</template>
