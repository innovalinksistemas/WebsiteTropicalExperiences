<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { luxuryCategories } from '../../../data/home.js'

gsap.registerPlugin(ScrollTrigger)

const sectionRef  = ref(null)
const headerRef   = ref(null)
const descRef     = ref(null)
const cardsRef    = ref([])
const luxuryBookingUrl = 'https://widget.ticando.net/KTBmJaxmHMbcSCTLUBeXgDuvNbsoVXGfpHTyhRlodNRvPkHjmlGTnCPBdIpyeveVDxUkPG/trayecto/1/1'
const widgetOpen = ref(false)

const setCardRef = (el) => { if (el) cardsRef.value.push(el) }
const openBookingWidget = () => {
  widgetOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closeBookingWidget = () => {
  widgetOpen.value = false
  document.body.style.overflow = ''
}
const onKeydown = (e) => {
  if (e.key === 'Escape' && widgetOpen.value) closeBookingWidget()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)

  const ctx = gsap.context(() => {

    // ── Eyebrow + título ──────────────────────────────────────
    gsap.from(headerRef.value, {
      opacity: 0,
      y: 36,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.value,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    // ── Descripción lateral ───────────────────────────────────
    gsap.from(descRef.value, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: descRef.value,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    // ── Cards con stagger ─────────────────────────────────────
    gsap.from(cardsRef.value, {
      opacity: 0,
      y: 50,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: {
        trigger: cardsRef.value[0],
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

  }, sectionRef.value)

  // Guardamos el contexto para limpiarlo al desmontar
  sectionRef.value._gsapCtx = ctx
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  sectionRef.value?._gsapCtx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-10 pt-6"
  >
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-6">
      <div ref="headerRef">
        <p class="text-xs uppercase tracking-[0.4em] text-sun-400">Curated excellence</p>
        <h2 class="mt-2 font-display text-4xl text-white">Luxury Experiences</h2>
      </div>
      <p ref="descRef" class="max-w-md border-l-2 border-sun-400 pl-4 text-sm text-moss-100">
        Seleccionadas por nuestros especialistas para asegurar privacidad total y un confort sin
        comparacion.
      </p>
    </div>

    <!-- Cards -->
    <div class="grid gap-8 md:grid-cols-3">
      <article
        v-for="item in luxuryCategories"
        :key="item.id"
        :ref="setCardRef"
        class="flex flex-col gap-5 rounded-[28px] bg-white p-5 text-ink shadow-xl"
      >
        <div class="overflow-hidden rounded-[24px]">
          <img :src="item.image" :alt="item.title" class="h-56 w-full object-cover" />
        </div>
        <div class="flex items-baseline justify-between gap-4">
          <h3 class="font-display text-2xl text-slate-900">{{ item.title }}</h3>
          <span class="text-sm font-semibold text-sun-500">{{ item.price }}</span>
        </div>
        <p class="text-sm text-slate-500">{{ item.description }}</p>
        <button
          type="button"
          @click="openBookingWidget"
          class="mt-auto inline-flex w-fit items-center rounded-full bg-gradient-to-r from-sun-400 to-orange-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 shadow-lg transition hover:-translate-y-0.5"
        >
          Reservar
        </button>
      </article>
    </div>
  </section>

  <Teleport to="body">
    <div
      v-if="widgetOpen"
      class="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm"
      @click="closeBookingWidget"
    />
    <div
      v-if="widgetOpen"
      class="fixed inset-0 z-[211] flex items-center justify-center p-4 sm:p-6"
    >
      <div class="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div class="min-w-0">
            <h3 class="font-display text-xl text-slate-900">Reservar experiencia</h3>
            <a
              :href="luxuryBookingUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-700"
            >
              Abrir en nueva pestaña si no carga
            </a>
          </div>
          <button
            type="button"
            @click="closeBookingWidget"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-slate-500 hover:text-slate-900"
            aria-label="Cerrar widget de reserva"
          >
            ✕
          </button>
        </div>

        <iframe
          :src="luxuryBookingUrl"
          title="Widget de reserva"
          class="h-full w-full flex-1"
          loading="lazy"
        />
      </div>
    </div>
  </Teleport>
</template>
