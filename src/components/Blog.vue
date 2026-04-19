<script setup>
import { posts, formatDate } from '@/data/blog.js'
</script>

<template>
  <section id="blog" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">04</span>
        <h2 class="type-h2">Blog</h2>
        <div class="divider"></div>
      </div>

      <div class="scroll-panel">
      <div class="space-y-4">
        <router-link
          v-for="post in posts"
          :key="post.slug"
          :to="{ name: 'blog-post', params: { slug: post.slug } }"
          class="group card p-6 block"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">{{ formatDate(post.date) }}</span>

              <h3 class="type-h3 mt-2 mb-2 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150">
                {{ post.title }}
              </h3>

              <p class="type-sm text-zinc-500 dark:text-text-tertiary mb-4">{{ post.excerpt }}</p>

              <div class="flex flex-wrap gap-2">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>

            <svg class="w-4 h-4 text-zinc-300 dark:text-text-tertiary group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150 shrink-0 mt-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </router-link>
      </div>
      </div>
    </div>
  </section>
</template>
