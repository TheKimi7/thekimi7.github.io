<script setup>
const experiences = [
  {
    role: 'Cybersecurity Associate',
    company: 'PwC India',
    period: 'Oct 2024 - Present',
    current: true,
    description: 'Conducted 100+ Android and mobile application security assessments across banking, fintech, and blockchain clients, identifying critical vulnerabilities including account takeover via session token leakage, privilege escalation, insecure data storage, hardcoded API keys, and deep link hijacking. Built custom Magisk modules to unblock assessment capability on Android 14+ devices where standard tooling failed. Performed n8n workflow security reviews and Web3 wallet integration assessments on mobile DeFi surfaces. Delivered findings with business impact analysis for both technical teams and executive stakeholders.',
    tags: ['Mobile Application VAPT', 'Android', 'iOS', 'Web Application VAPT', 'API Security', 'AI Security', 'Prompt Injection', 'Frida', 'Burp Suite', 'JADX', 'Apktool', 'MobSF', 'Magisk', 'OWASP Mobile Top 10', 'CIS Benchmarks', 'Config Reviews', 'n8n Security'],
  },
]

const education = [
  {
    degree: 'B.Sc in Data Science and Programming',
    school: 'Indian Institute of Technology, Madras, TN, India',
    period: '2021 - 2025',
  },
  {
    degree: 'B.Tech in Electronics and Communication Engineering',
    school: 'Amrita Vishwa Vidyapeetham, Coimbatore, TN, India',
    period: '2020 - 2024',
  },
]
</script>

<template>
  <section id="experience" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">02</span>
        <h2 class="type-h2">Experience</h2>
        <div class="divider"></div>
      </div>

      <div class="space-y-4">
        <div v-for="(exp, i) in experiences" :key="i" class="card p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="type-h3">{{ exp.role }}</h3>
                <span v-if="exp.current" class="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white shrink-0"></span>
              </div>
              <p class="type-xs type-mono text-zinc-500 dark:text-text-secondary mt-1">{{ exp.company }}</p>
            </div>
            <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary shrink-0">{{ exp.period }}</span>
          </div>

          <p class="type-body text-zinc-600 dark:text-text-secondary mb-4">{{ exp.description }}</p>

          <div class="flex flex-wrap gap-2">
            <span v-for="tag in exp.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <h3 class="type-mono type-sm uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-4">Education</h3>
        <div class="space-y-4">
          <div v-for="edu in education" :key="edu.degree" class="card p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 class="type-h3">{{ edu.degree }}</h4>
                <p class="type-sm text-zinc-500 dark:text-text-tertiary mt-1">{{ edu.school }}</p>
              </div>
              <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary mt-2 sm:mt-0">{{ edu.period }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
