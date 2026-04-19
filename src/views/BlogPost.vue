<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
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

const currentPage = computed(() => {
  const p = parseInt(route.params.page) || 1
  return Math.max(1, Math.min(p, post.value?.totalPages || 1))
})

const pageContent = computed(() => {
  if (!post.value) return ''
  return post.value.pages[currentPage.value - 1] || ''
})

const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => post.value && currentPage.value < post.value.totalPages)
const isMultiPage = computed(() => post.value && post.value.totalPages > 1)

function goToPage(page) {
  const params = page === 1
    ? { slug: route.params.slug }
    : { slug: route.params.slug, page }
  router.push({ name: 'blog-post', params })
}

function addCopyButtons() {
  document.querySelectorAll('.blog-content pre').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-wrapper')) return
    const wrapper = document.createElement('div')
    wrapper.className = 'code-wrapper'
    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)

    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    const copyIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
    const checkIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
    btn.innerHTML = copyIcon
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code')
      navigator.clipboard.writeText(code?.textContent || pre.textContent).then(() => {
        btn.innerHTML = checkIcon
        setTimeout(() => { btn.innerHTML = copyIcon }, 1500)
      })
    })
    wrapper.appendChild(btn)
  })
}

onMounted(addCopyButtons)
watch([() => route.params.slug, () => route.params.page], () => {
  nextTick(addCopyButtons)
})
</script>

<template>
  <div v-if="post" class="min-h-screen bg-light-bg text-zinc-900 dark:bg-surface-0 dark:text-text-primary font-sans">
    <Navbar :isDark="isDark" @toggle-dark="emit('toggle-dark')" />

    <article class="pt-28 pb-24 px-6">
      <div class="max-w-[720px] mx-auto">
        <header class="mb-12">
          <div class="flex items-center gap-3 mb-4">
            <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">{{ formatDate(post.date) }}</span>
            <span v-if="isMultiPage" class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">
              · Page {{ currentPage }} of {{ post.totalPages }}
            </span>
          </div>
          <h1 class="type-display mb-6">{{ post.title }}</h1>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>

        <!-- top pagination -->
        <div v-if="isMultiPage" class="mb-10 flex items-center justify-between">
          <button
            @click="hasPrev && goToPage(currentPage - 1)"
            :disabled="!hasPrev"
            :class="[
              'flex items-center gap-2 type-sm transition-colors duration-150',
              hasPrev
                ? 'text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary cursor-pointer'
                : 'text-zinc-300 dark:text-zinc-700 cursor-default'
            ]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Previous
          </button>

          <button
            @click="hasNext && goToPage(currentPage + 1)"
            :disabled="!hasNext"
            :class="[
              'flex items-center gap-2 type-sm transition-colors duration-150',
              hasNext
                ? 'text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary cursor-pointer'
                : 'text-zinc-300 dark:text-zinc-700 cursor-default'
            ]"
          >
            Next
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div class="blog-content" v-html="pageContent"></div>

        <!-- bottom pagination -->
        <div v-if="isMultiPage" class="mt-12 flex items-center justify-between border-t border-light-border dark:border-border-subtle pt-8">
          <button
            @click="hasPrev && goToPage(currentPage - 1)"
            :disabled="!hasPrev"
            :class="[
              'flex items-center gap-2 type-sm transition-colors duration-150',
              hasPrev
                ? 'text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary cursor-pointer'
                : 'text-zinc-300 dark:text-zinc-700 cursor-default'
            ]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Previous
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="p in post.totalPages"
              :key="p"
              @click="goToPage(p)"
              :class="[
                'w-8 h-8 rounded-lg type-mono type-xs flex items-center justify-center transition-colors duration-150',
                p === currentPage
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'text-zinc-400 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary'
              ]"
            >
              {{ p }}
            </button>
          </div>

          <button
            @click="hasNext && goToPage(currentPage + 1)"
            :disabled="!hasNext"
            :class="[
              'flex items-center gap-2 type-sm transition-colors duration-150',
              hasNext
                ? 'text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary cursor-pointer'
                : 'text-zinc-300 dark:text-zinc-700 cursor-default'
            ]"
          >
            Next
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  </div>
</template>
