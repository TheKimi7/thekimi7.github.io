<script setup>
const projects = [
  {
    title: 'AI-Assisted Android APK Analyzer',
    description: 'An open-source Python tool that automates static analysis of Android APKs and uses an LLM to generate structured vulnerability reports. Flags hardcoded secrets, insecure API calls, dangerous permissions, and suspicious behavior patterns.',
    tags: ['Python', 'Android', 'LLM', 'Static Analysis', 'JADX', 'LangChain'],
    link: '#',
    status: 'in-progress',
    date: '2026',
  },
  {
    title: 'TrustMeDarling (Magisk Module)',
    description: 'Custom Magisk module that enables system certificate injection on Android 14+ devices, bypassing trust store and certificate handling restrictions introduced in newer Android versions to restore SSL interception capability for mobile security testing.',
    tags: ['Magisk Module', 'Android', 'Bash'],
    link: 'https://github.com/TheKimi7/TrustMeDarling',
    date: 'Jan 2026',
  },
  {
    title: 'SeQueL (Magisk Module)',
    description: 'Magisk module integrating SQLite3 into Android testing environments to assist with application data analysis and database inspection during mobile security assessments.',
    tags: ['Magisk Module', 'Android', 'Bash'],
    link: 'https://github.com/TheKimi7/SeQueL',
    date: 'Dec 2025',
  },
  {
    title: 'Entrepreneurship Case Study',
    description: 'Mixed-methods research combining qualitative interviews with entrepreneurs across diverse industries. Offered a realistic understanding of entrepreneurial journeys beyond common misconceptions.',
    tags: ['Interviewing', 'Research Skills', 'Team Management', 'Presentation Skills', 'Interpersonal Communication'],
    link: 'https://drive.google.com/drive/folders/19I8zTlzfHfJUC9jIePu3Vjr9iwY5_cc4',
    date: 'Sep 2024',
  },
  {
    title: 'Generative AI Integration into Study Portal',
    description: 'Designed and implemented a GenAI-enhanced learning environment featuring feedback mechanisms, problem-solving support, a live coding IDE integration, and JWT-based authentication. Developed user journey maps, managed sprints in Jira, designed API endpoints, and delivered a working prototype with full test coverage.',
    tags: ['Software Development Life Cycle (SDLC)', 'SQLite', 'Vue.js', 'Team Management', 'Software Engineering Practices', 'Agile Project Management', 'Project Management', 'Jira', 'Flask'],
    link: 'https://drive.google.com/drive/folders/10hT4_DB3SVsBIKL9TDvxRooyndqHsWf7',
    date: 'Sep 2024',
  },
  {
    title: 'Developing a Key Guessing Attack Strategy for Logic Locking using Deep Learning',
    description: 'Developed a deep learning-based attack to break logic-locking mechanisms in hardware circuits using Python and TensorFlow. Automated synthesis workflows via Synopsys Design Compiler and TCL scripting. Achieved 84.81% accuracy, outperforming existing state-of-the-art oracle-less attack techniques.',
    tags: ['Final Year Project', 'Hardware Security', 'Deep Learning', 'Python', 'TensorFlow', 'Synopsys Design Compiler', 'TCL Scripting', 'VLSI', 'Linux'],
    date: 'Jun 2024',
  },
  {
    title: 'Streamly',
    description: 'Streamly is a music streaming application developed using Flask for the backend and Vue.js for the frontend. This project is part of the AppDev2 Project for the Diploma Level of IIT Madras BSc Online Degree in Data Science and Programming. The system is designed to manage and provide services for a music-streaming and management platform.',
    tags: ['Python', 'Web Application Development', 'Problem Solving', 'Database Management System (DBMS)', 'Vue.js', 'Thinking Skills', 'Ubuntu'],
    link: 'https://github.com/pranavrajendran18/Streamly',
    date: 'Dec 2023',
  },
]
</script>

<template>
  <section id="projects" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">05</span>
        <h2 class="type-h2">Projects</h2>
        <div class="divider"></div>
      </div>

      <div class="scroll-panel">
    <div class="grid sm:grid-cols-2 gap-4">
      <component
        :is="project.status === 'in-progress' ? 'div' : 'a'"
        v-for="project in projects"
        :key="project.title"
        v-bind="project.status !== 'in-progress' ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {}"
        class="group card p-6 block"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="type-h3 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150">
            {{ project.title }}
          </h3>
          <svg
            v-if="project.status !== 'in-progress'"
            class="w-4 h-4 text-zinc-300 dark:text-text-tertiary group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150 shrink-0 mt-1"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          <span
            v-else
            class="type-mono type-xs px-2 py-0.5 rounded-full border border-zinc-500 text-zinc-400 shrink-0 mt-1"
          >
            in progress
          </span>
        </div>

        <p class="type-sm text-zinc-500 dark:text-text-tertiary mb-4">{{ project.description }}</p>

        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in project.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          <span class="type-mono type-xs text-zinc-300 dark:text-zinc-700">{{ project.date }}</span>
        </div>
      </component>
    </div>
      </div>
    </div>
  </section>
</template>
