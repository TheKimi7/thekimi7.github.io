<script setup>
const skillCategories = [
  {
    title: 'Mobile Security',
    skills: ['Android VAPT', 'iOS VAPT', 'Frida', 'Objection', 'MobSF', 'APKTool', 'Jadx'],
  },
  {
    title: 'Web & API Security',
    skills: ['Burp Suite', 'OWASP Top 10', 'API Fuzzing', 'SQLi', 'XSS', 'SSRF', 'IDOR'],
  },
  {
    title: 'Tools & Platforms',
    skills: ['Nmap', 'Wireshark', 'Metasploit', 'Nessus', 'Docker', 'AWS Security', 'Git'],
  },
  {
    title: 'Programming',
    skills: ['Python', 'JavaScript', 'Bash', 'Java', 'Kotlin', 'Swift', 'SQL'],
  },
]

const certifications = [
  { name: 'OSCP', issuer: 'Offensive Security', year: '2024' },
  { name: 'CEH', issuer: 'EC-Council', year: '2023' },
  { name: 'eJPT', issuer: 'INE', year: '2022' },
]
</script>

<template>
  <section id="skills" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">03</span>
        <h2 class="type-h2">Skills & Certifications</h2>
        <div class="divider"></div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <div v-for="category in skillCategories" :key="category.title" class="card p-5">
          <h3 class="type-sm font-semibold mb-4">{{ category.title }}</h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in category.skills"
              :key="skill"
              class="type-mono type-xs px-3 py-1 rounded-full bg-light-bg dark:bg-surface-2 text-zinc-600 dark:text-text-secondary border border-light-border dark:border-border-subtle"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <h3 class="type-mono type-xs uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-4">Certifications</h3>
      <div class="grid sm:grid-cols-3 gap-4">
        <div v-for="cert in certifications" :key="cert.name" class="card p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-light-bg dark:bg-surface-2 flex items-center justify-center type-mono type-xs font-semibold shrink-0">
            {{ cert.name.slice(0, 4) }}
          </div>
          <div>
            <div class="type-sm font-semibold">{{ cert.name }}</div>
            <div class="type-xs text-zinc-500 dark:text-text-tertiary">{{ cert.issuer }} · {{ cert.year }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
