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
const widgetOpen  = ref(false)
// Guarda el contexto GSAP para limpieza correcta
let gsapCtx = null

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

  // FIX: guardar ctx en variable del closure, no en el DOM ref
  gsapCtx = gsap.context(() => {

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
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  // FIX: limpiar desde la variable, no desde el DOM ref
  gsapCtx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-24"
  >
    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="flex flex-wrap items-start justify-between gap-6">
      <div ref="headerRef">
        <p class="text-xs uppercase tracking-[0.4em] text-sun-400">Curated excellence</p>
        <h2 class="mt-2 font-display text-4xl text-white">Luxury Experiences</h2>
      </div>
      <p ref="descRef" class="max-w-md border-l-2 border-sun-400 pl-4 text-sm text-moss-100">
        Handpicked by our specialists to ensure absolute privacy
        and unmatched comfort at every step.
      </p>
    </div>

    <!-- ── Cards ──────────────────────────────────────────────── -->
    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="item in luxuryCategories"
        :key="item.id"
        :ref="setCardRef"
        class="luxury-card group relative flex flex-col overflow-hidden rounded-[24px]"
      >
        <!-- Imagen con zoom en hover -->
        <div class="relative h-64 overflow-hidden">
          <img
            :src="item.image"
            :alt="item.title"
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <!-- Gradiente sobre imagen para leer el badge -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <!-- Badge de precio flotante sobre imagen -->
          <div class="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm">
            <span class="text-xs font-semibold tracking-wide text-sun-400">
              From {{ item.price }}
            </span>
          </div>
        </div>

        <!-- Contenido de la card -->
        <div class="card-body flex flex-1 flex-col gap-4 p-6">
          <h3 class="font-display text-2xl leading-tight text-white">{{ item.title }}</h3>
          <p class="flex-1 text-sm leading-relaxed text-moss-100/80">{{ item.description }}</p>

          <!-- Footer: separador + CTA -->
          <div class="border-t border-white/10 pt-4">
            <button
              type="button"
              @click="openBookingWidget"
              class="card-cta group/btn inline-flex items-center gap-2 text-sm font-semibold text-sun-400 transition-all hover:gap-3"
            >
              Book this experience
              <!-- Flecha animada en hover -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Borde dorado sutil que aparece en hover -->
        <div class="card-border-glow" aria-hidden="true" />
      </article>
    </div>
  </section>

  <!-- ── Booking Widget Modal ───────────────────────────────── -->
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="widgetOpen"
        class="fixed inset-0 z-[210] bg-black/70 backdrop-blur-sm"
        @click="closeBookingWidget"
      />
    </Transition>

    <!-- Modal -->
    <Transition name="slide-up">
      <div
        v-if="widgetOpen"
        class="fixed inset-0 z-[211] flex items-center justify-center p-4 sm:p-6"
      >
        <div class="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-moss-900 shadow-2xl ring-1 ring-white/10">

          <!-- Modal header -->
          <div class="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
            <div class="min-w-0">
              <h3 class="font-display text-xl text-white">Book your experience</h3>
              <a
                :href="luxuryBookingUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-moss-100/60 underline decoration-moss-100/30 underline-offset-2 transition hover:text-moss-100"
              >
                Open in new tab if it doesn't load
              </a>
            </div>
            <button
              type="button"
              @click="closeBookingWidget"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:border-white/50 hover:text-white"
              aria-label="Close booking widget"
            >
              ✕
            </button>
          </div>

          <!-- iFrame -->
          <iframe
            :src="luxuryBookingUrl"
            title="Booking widget"
            class="h-full w-full flex-1 bg-white"
            loading="lazy"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Card base: glassmorphism oscuro ─────────────────────── */
.luxury-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  /* Elevación sutil en hover con sombra dorada */
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

.luxury-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    /* glow actualizado a crema de marca #e8c28b */
    0 0 0 1px rgba(232, 194, 139, 0.25);
  border-color: rgba(232, 194, 139, 0.25);
}

/* ── Glow border en hover — pseudo-elemento ──────────────── */
/* Destello crema de marca en la parte superior de la card */
.card-border-glow {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    /* crema de marca #e8c28b */
    rgba(232, 194, 139, 0.7),
    transparent
  );
  opacity: 0;
  transition: opacity 0.35s ease;
}

.luxury-card:hover .card-border-glow {
  opacity: 1;
}

/* ── Modal transitions ───────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>