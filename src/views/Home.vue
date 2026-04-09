<script setup>
import { onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import About from '@/components/About.vue'
import Experience from '@/components/Experience.vue'
import Skills from '@/components/Skills.vue'
import Projects from '@/components/Projects.vue'
import Publications from '@/components/Publications.vue'
import Blog from '@/components/Blog.vue'
import Footer from '@/components/Footer.vue'

defineProps({ isDark: Boolean })
const emit = defineEmits(['toggle-dark'])

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    },
    { threshold: 0.08 }
  )
  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-section').forEach((el) => observer.observe(el))
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <Navbar :isDark="isDark" @toggle-dark="emit('toggle-dark')" />
  <main>
    <Hero />
    <div class="fade-section"><About /></div>
    <div class="fade-section"><Experience /></div>
    <div class="fade-section"><Skills /></div>
    <div class="fade-section"><Blog /></div>
    <div class="fade-section"><Projects /></div>
    <div class="fade-section"><Publications /></div>
  </main>
  <Footer />
</template>
