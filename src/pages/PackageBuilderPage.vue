<script setup>
import SiteHeader from '../components/layout/SiteHeader/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter/SiteFooter.vue'
import PackageBuilderSection from '../components/sections/PackageBuilder/PackageBuilderSection.vue'
</script>

<template>
  <div class="min-h-screen w-full">
    <div class="relative">
      <SiteHeader />
    </div>

    <main class="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-16 pt-10">
      <PackageBuilderSection />
    </main>

    <div class="mx-auto max-w-7xl px-6 pb-12">
      <SiteFooter />
    </div>
  </div>
</template>
