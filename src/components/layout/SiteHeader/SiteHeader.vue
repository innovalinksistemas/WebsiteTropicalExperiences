<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { navLinks } from '../../../data/home.js'
import logoUrl from '../../../assets/logo.png'

const isMenuOpen = ref(false)
const activeSection = ref('')

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)

// Detecta sección activa con IntersectionObserver
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0.5 }
  )
  navLinks.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <header class="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 px-6 py-4 backdrop-blur lg:px-10">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between">

      <!-- Logo -->
      <img :src="logoUrl" alt="Tropical Experiences logo" class="h-12 w-auto" />

      <!-- Nav desktop -->
      <nav class="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-moss-100 lg:flex">
        
        <a 
          v-for="link in navLinks"
          :key="link.id"
          :href="`#${link.id}`"
          class="transition hover:text-white"
          :class="{ 'text-white border-b border-sun-400': activeSection === link.id }"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- CTA + hamburguesa -->
      <div class="flex items-center gap-4">
        <a 
          href="#contact"
          class="rounded-full bg-gradient-to-r from-sun-400 to-sun-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Plan My Trip
        </a>

        <!-- Hamburger (mobile only) -->
        <button
          class="flex flex-col gap-1.5 lg:hidden"
          @click="toggleMenu"
          aria-label="Toggle menu"
        >
          <span class="h-0.5 w-6 bg-white transition-all" :class="{ 'rotate-45 translate-y-2': isMenuOpen }" />
          <span class="h-0.5 w-6 bg-white transition-all" :class="{ 'opacity-0': isMenuOpen }" />
          <span class="h-0.5 w-6 bg-white transition-all" :class="{ '-rotate-45 -translate-y-2': isMenuOpen }" />
        </button>
      </div>
    </div>

    <!-- Nav mobile -->
    <nav
      v-show="isMenuOpen"
      class="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.2em] text-moss-100 lg:hidden"
    >
      <a 
        v-for="link in navLinks"
        :key="link.id"
        :href="`#${link.id}`"
        class="transition hover:text-white"
        @click="isMenuOpen = false"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>