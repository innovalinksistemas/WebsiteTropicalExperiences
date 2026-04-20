<script setup>
import { ref } from 'vue'
import { faqItems } from '../../../data/home.js'

const openFaqIndex = ref(0)
const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}
</script>

<template>
  <section id="faq" class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-moss-300">FAQ</p>
        <h2 class="font-display text-3xl">Preguntas frecuentes</h2>
      </div>
      <p class="text-sm text-moss-300">Resolvemos dudas comunes para avanzar rapido.</p>
    </div>
    <div class="flex flex-col gap-3">
      <div
        v-for="(item, index) in faqItems"
        :key="item.question"
        class="rounded-2xl border border-white/20 bg-moss-900/60 p-4"
      >
        <button
          class="flex w-full items-center justify-between text-left text-sm"
          @click="toggleFaq(index)"
        >
          <span>{{ item.question }}</span>
          <span class="text-lg">{{ openFaqIndex === index ? '-' : '+' }}</span>
        </button>
        <p v-if="openFaqIndex === index" class="mt-3 text-sm text-moss-300">
          {{ item.answer }}
        </p>
      </div>
    </div>
  </section>
</template>
