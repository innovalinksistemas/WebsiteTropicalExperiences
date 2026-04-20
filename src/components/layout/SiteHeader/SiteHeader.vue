<script setup>
import { navLinks } from '../../../data/home.js'
import logoUrl from '../../../assets/logo.png'
</script>

<template>
  <header class="w-full border-b border-white/10 bg-black/50 px-6 py-4 backdrop-blur lg:px-10">
    <div
      class="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex items-center gap-4">
        <img :src="logoUrl" alt="Tropical Experiences logo" class="h-12 w-auto" />
      </div>
      <nav class="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-moss-100">
        <a
          v-for="link in navLinks"
          :key="`${link.id}-${link.label}`"
          :href="`#${link.id}`"
          class="transition hover:text-white"
        >
          {{ link.label }}
        </a>
      </nav>
      <button
        class="rounded-full bg-gradient-to-r from-sun-400 to-sun-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 shadow-glow transition hover:-translate-y-0.5"
      >
        Get in touch
      </button>
    </div>
  </header>
</template>
