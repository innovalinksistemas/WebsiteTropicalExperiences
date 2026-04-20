<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import SiteHeader from '../components/layout/SiteHeader/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter/SiteFooter.vue'
import HeroSection from '../components/sections/Hero/HeroSection.vue'
import LuxuryCategoriesSection from '../components/sections/LuxuryCategories/LuxuryCategoriesSection.vue'
import ExperiencesSection from '../components/sections/Experiences/ExperiencesSection.vue'
import PackageBuilderSection from '../components/sections/PackageBuilder/PackageBuilderSection.vue'
import ProcessSection from '../components/sections/Process/ProcessSection.vue'
import CtaSection from '../components/sections/Cta/CtaSection.vue'
import FaqSection from '../components/sections/Faq/FaqSection.vue'

const pageRef = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.js-hero', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' })
    gsap.from('.js-panel', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2,
    })
    gsap.from('.js-card', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.3,
    })
  }, pageRef.value)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div ref="pageRef" class="min-h-screen w-full">
    <div class="relative min-h-screen">
      <HeroSection />
      <SiteHeader class="absolute inset-x-0 top-0 z-20" />
    </div>

    <main class="mx-auto flex max-w-6xl flex-col gap-16 px-0 pb-14 pt-16">
      <LuxuryCategoriesSection />
      <!-- <PackageBuilderSection /> -->
      <ExperiencesSection />
      <ProcessSection />
      <CtaSection />
      <FaqSection />
    </main>

    <div class="mx-auto max-w-6xl px-6 pb-14">
      <SiteFooter />
    </div>
  </div>
</template>
