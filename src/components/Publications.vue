<script setup>
const publications = [
  {
    title: 'Your Publication Title Here',
    venue: 'Conference / Journal Name',
    type: 'IEEE',
    date: 'May 2024',
    authors: 'Pranav Rajendran, Co-Author 1, Co-Author 2',
    description: 'Placeholder: Brief description of the publication and its contribution to the field.',
    link: '#',
  },
  {
    title: 'Another Research Paper Title',
    venue: 'Another Conference Name',
    type: 'SCI',
    date: 'Jul 2024',
    authors: 'Pranav Rajendran, Co-Author',
    description: 'Placeholder: Describe what this paper covers and its significance.',
    link: '#',
  },
]
</script>

<template>
  <section id="publications" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">05</span>
        <h2 class="type-h2">Publications</h2>
        <div class="divider"></div>
      </div>

      <div class="space-y-4">
        <a
          v-for="pub in publications"
          :key="pub.title"
          :href="pub.link"
          target="_blank"
          rel="noopener noreferrer"
          class="group card p-6 block"
        >
          <div class="flex items-center gap-3 mb-3">
            <span class="tag">{{ pub.type }}</span>
            <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">{{ pub.date }}</span>
          </div>

          <h3 class="type-h3 mb-2 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150">
            {{ pub.title }}
          </h3>

          <p class="type-sm text-zinc-500 dark:text-text-secondary mb-1">{{ pub.venue }}</p>
          <p class="type-mono type-xs text-zinc-400 dark:text-text-tertiary mb-3">{{ pub.authors }}</p>
          <p class="type-sm text-zinc-500 dark:text-text-tertiary">{{ pub.description }}</p>
        </a>
      </div>
    </div>
  </section>
</template>
