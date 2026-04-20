<script setup>
import { processSteps } from '../../../data/home.js'
</script>

<template>
  <section id="proceso" class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-moss-300">Proceso</p>
        <h2 class="font-display text-3xl">Del primer mensaje a la experiencia final</h2>
      </div>
      <p class="max-w-xl text-sm text-moss-300">
        La plataforma se construye paso a paso contigo. Arrancamos con una guia clara para que
        el desarrollo se sienta ordenado y transparente.
      </p>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="step in processSteps" :key="step.number" class="rounded-2xl bg-moss-700/70 p-5">
        <p class="text-sm font-semibold text-sun-400">{{ step.number }}</p>
        <h3 class="mt-3 text-lg font-semibold">{{ step.title }}</h3>
        <p class="mt-2 text-sm text-moss-100">{{ step.description }}</p>
      </div>
    </div>
  </section>
</template>
