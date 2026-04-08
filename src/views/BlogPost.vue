<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, formatDate } from '@/data/blog.js'
import Navbar from '@/components/Navbar.vue'

defineProps({ isDark: Boolean })
const emit = defineEmits(['toggle-dark'])

const route = useRoute()
const router = useRouter()
const post = computed(() => getPost(route.params.slug))

if (!post.value) {
  router.replace('/')
}
</script>

<template>
  <div v-if="post" class="min-h-screen bg-light-bg text-zinc-900 dark:bg-surface-0 dark:text-text-primary font-sans">
    <Navbar :isDark="isDark" @toggle-dark="emit('toggle-dark')" />

    <article class="pt-28 pb-24 px-6">
      <div class="max-w-[640px] mx-auto">
        <header class="mb-12">
          <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">{{ formatDate(post.date) }}</span>
          <h1 class="type-display mt-4 mb-6">{{ post.title }}</h1>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>

        <div class="blog-content" v-html="post.content"></div>

        <div class="mt-16 pt-8 border-t border-light-border dark:border-border-subtle">
          <button
            @click="router.push('/')"
            class="flex items-center gap-2 type-sm text-zinc-400 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary transition-colors duration-150"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </button>
        </div>
      </div>
    </article>
  </div>
</template>
