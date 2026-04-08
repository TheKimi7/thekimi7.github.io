<script setup>
const bio = [
  `I'm a cybersecurity consultant specialising in Android and mobile application security, with 100+ pentesting assessments across the full mobile attack surface. This includes static analysis, Frida-based runtime instrumentation, SSL unpinning, smali patching, and repackaging attacks. My toolkit includes jadx, apktool, MobSF, Burp Suite, and Magisk, and I work across web VAPT, config reviews, and AI security audits. I'm currently building AI-assisted tooling to augment offensive security workflows.`,
  `Outside security, I'm a music producer, guitarist, and keyboard player with releases on Spotify. I'm drawn to building things from scratch, whether that's a tool, a track, or an idea worth chasing.`
]

const highlights = [
  { value: '2+', label: 'Years Experience' },
  { value: '100+', label: 'Apps Assessed' },
  { value: '2', label: 'Publications' },
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
              <div class="text-2xl font-bold">{{ stat.value }}</div>
              <div class="type-sm text-zinc-500 dark:text-text-tertiary mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
