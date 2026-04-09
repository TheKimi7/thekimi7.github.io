<script setup>
const bio = [
  'I\'m an offensive security consultant who breaks mobile apps and AI systems for a living (and occasionally wonders if I should have been a musician instead.)',
  'When I\'m not crawling through APKs or hooking into Android runtimes with Frida, I\'m building AI-assisted tools to make the tedious parts of pentesting faster. I\'ve assessed 100+ apps across banking, fintech, and enterprise, and somehow ended up specialising in the exact intersection of mobile security and AI before it was cool.',
  'Outside of security, I produce music, play guitar and keyboards, and have releases on Spotify too. Right now I\'m deep in the world of agentic AI and offensive tooling. Always up to collaborate on something worth breaking.',
]

const highlights = [
  { value: '100+', label: 'Apps Assessed' },
  { value: '2+', label: 'Years Experience' },
  { value: '3', label: 'Publications' },
]
</script>

<template>
  <section id="about" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">01</span>
        <h2 class="type-h2">About Me</h2>
        <div class="divider"></div>
      </div>

      <div class="grid md:grid-cols-3 gap-12">
        <div class="md:col-span-2 space-y-6">
          <p v-for="(para, i) in bio" :key="i" class="type-body-lg text-zinc-600 dark:text-text-secondary">
            {{ para }}
          </p>
        </div>

        <div class="card p-6">
          <h3 class="type-mono type-xs uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-6">Quick Stats</h3>
          <div class="space-y-6">
            <div v-for="stat in highlights" :key="stat.label">
              <div class="text-2xl type-h2l font-bold">{{ stat.value }}</div>
              <div class="type-sm text-zinc-500 dark:text-text-tertiary mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
