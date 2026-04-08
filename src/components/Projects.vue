<script setup>
const projects = [
  {
    title: 'Mobile Security Scanner',
    description: 'Placeholder: Describe your project - what it does, why you built it, and the impact.',
    tags: ['Python', 'Android', 'Static Analysis'],
    link: '#',
    date: 'Sep 2024',
  },
  {
    title: 'API Vulnerability Framework',
    description: 'Placeholder: Another project description. Focus on the problem solved and technologies used.',
    tags: ['Python', 'REST API', 'Fuzzing'],
    link: '#',
    date: 'Jun 2024',
  },
  {
    title: 'Secure Code Review Tool',
    description: 'Placeholder: Describe a tool or research project you worked on.',
    tags: ['JavaScript', 'AST Parsing', 'SAST'],
    link: '#',
    date: 'Mar 2024',
  },
  {
    title: 'CTF Challenge Platform',
    description: 'Placeholder: A platform, writeup, or community project you contributed to.',
    tags: ['Docker', 'Python', 'CTF'],
    link: '#',
    date: 'Jan 2024',
  },
]
</script>

<template>
  <section id="projects" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">04</span>
        <h2 class="type-h2">Projects</h2>
        <div class="divider"></div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <a
          v-for="project in projects"
          :key="project.title"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="group card p-6 block"
        >
          <div class="flex items-start justify-between mb-3">
            <h3 class="type-h3 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150">
              {{ project.title }}
            </h3>
            <svg class="w-4 h-4 text-zinc-300 dark:text-text-tertiary group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <p class="type-sm text-zinc-500 dark:text-text-tertiary mb-4">{{ project.description }}</p>

          <div class="flex items-center justify-between">
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in project.tags" :key="tag" class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">
                {{ tag }}
              </span>
            </div>
            <span class="type-mono type-xs text-zinc-300 dark:text-zinc-700">{{ project.date }}</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
