<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experiences } from '../../../data/home.js'

gsap.registerPlugin(ScrollTrigger)

const FALLBACK_IMAGE = 'https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/a2bd7f983ad6549134c9479f40e44cc3.jpg'

// ── Toma los primeros 12 tours del array
// El primero siempre es el destacado (card grande)
const allTours    = experiences.slice(0, 12)
const featured    = allTours[0]
const restTours   = allTours.slice(1)   // los 11 restantes

// ── Utilidades ─────────────────────────────────────────────
const formatUSD = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const diffColor = (level) => ({
  'Suave':    'text-emerald-400',
  'Moderado': 'text-sun-400',
  'Difícil':  'text-red-400',
}[level] ?? 'text-moss-300')

const profileLabel = (p) => ({
  familiar:   '👨‍👩‍👧 Family',
  aventurero: '🧗 Adventure',
  premium:    '⭐ Premium',
}[p] ?? '')

// ── Drawer ─────────────────────────────────────────────────
const selectedExp       = ref(null)
const drawerOpen        = ref(false)
const activeImg         = ref(0)
const bookingWidgetOpen = ref(false)
const bookingWidgetUrl  = 'https://widget.ticando.net/KTBmJaxmHMbcSCTLUBeXgDuvNbsoVXGfpHTyhRlodNRvPkHjmlGTnCPBdIpyeveVDxUkPG/trayecto/1/1'

const syncBodyScroll = () => {
  document.body.style.overflow =
    drawerOpen.value || bookingWidgetOpen.value ? 'hidden' : ''
}

const openDrawer = (exp) => {
  selectedExp.value = exp
  activeImg.value   = 0
  drawerOpen.value  = true
  syncBodyScroll()
  gsap.fromTo(
    '.exp-drawer',
    { x: '100%' },
    { x: '0%', duration: 0.42, ease: 'power3.out' },
  )
}

const closeDrawer = () => {
  gsap.to('.exp-drawer', {
    x: '100%',
    duration: 0.32,
    ease: 'power3.in',
    onComplete: () => {
      drawerOpen.value = false
      syncBodyScroll()
    },
  })
}

const openBookingWidget = () => {
  bookingWidgetOpen.value = true
  syncBodyScroll()
}

const closeBookingWidget = () => {
  bookingWidgetOpen.value = false
  syncBodyScroll()
}

const onKeydown = (e) => {
  if (e.key !== 'Escape') return
  if (bookingWidgetOpen.value) { closeBookingWidget(); return }
  if (drawerOpen.value) closeDrawer()
}

// ── Scroll animations ──────────────────────────────────────
const sectionRef  = ref(null)
const headerRef   = ref(null)
const featuredRef = ref(null)
const cardsRef    = ref([])
let gsapCtx       = null

const setCardRef = (el) => { if (el) cardsRef.value.push(el) }

onMounted(() => {
  window.addEventListener('keydown', onKeydown)

  gsapCtx = gsap.context(() => {
    // Header
    gsap.from(headerRef.value, {
      opacity: 0, y: 32, duration: 0.7, ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.value,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    // Card destacada
    gsap.from(featuredRef.value, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: featuredRef.value,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    // Cards resto — stagger
    if (cardsRef.value.length) {
      gsap.from(cardsRef.value, {
        opacity: 0, y: 48, duration: 0.7, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: {
          trigger: cardsRef.value[0],
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    }
  }, sectionRef.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  gsapCtx?.revert()
})
</script>

<template>
  <section
    id="experiences"
    ref="sectionRef"
    class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-24"
  >

    <!-- ── Header ─────────────────────────────────────────── -->
    <div ref="headerRef" class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-sun-400">Our collection</p>
        <h2 class="mt-2 font-display text-4xl text-white">
          Curated Experiences
        </h2>
      </div>
      <p class="max-w-sm text-sm text-moss-300">
        12 handpicked journeys across Costa Rica's most extraordinary landscapes.
      </p>
    </div>

    <!-- ── Layout editorial ───────────────────────────────── -->
    <div class="editorial-grid">

      <!-- ══ CARD DESTACADA (primer tour, ocupa 2 columnas y 2 filas) ══ -->
      <article
        ref="featuredRef"
        class="featured-card group relative cursor-pointer overflow-hidden rounded-[24px]"
        @click="openDrawer(featured)"
      >
        <!-- Imagen de fondo con zoom en hover -->
        <img
          :src="featured.image || FALLBACK_IMAGE"
          :alt="featured.title"
          class="featured-img absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <!-- Gradiente oscuro para legibilidad -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <!-- Badge -->
        <div
          v-if="featured.badge"
          class="absolute left-5 top-5 rounded-full bg-sun-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
        >
          {{ featured.badge }}
        </div>

        <!-- Contenido anclado abajo -->
        <div class="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
          <!-- Meta pills -->
          <div class="flex flex-wrap gap-2">
            <span class="meta-pill">⏱ {{ featured.duration }}</span>
            <span :class="['meta-pill', diffColor(featured.level)]">
              {{ featured.level }}
            </span>
            <span v-if="featured.profile" class="meta-pill">
              {{ profileLabel(featured.profile) }}
            </span>
          </div>

          <div class="flex items-end justify-between gap-4">
            <div>
              <h3 class="font-display text-3xl leading-tight text-white">
                {{ featured.title }}
              </h3>
              <p class="mt-1 line-clamp-2 text-sm text-white/70">
                {{ featured.description }}
              </p>
            </div>
            <!-- Precio + CTA -->
            <div class="flex shrink-0 flex-col items-end gap-2">
              <p class="text-2xl font-bold text-sun-400">{{ formatUSD(featured.price) }}</p>
              <button
                type="button"
                @click.stop="openBookingWidget"
                class="rounded-full bg-gradient-to-r from-sun-400 to-sun-500 px-5 py-2 text-xs font-bold uppercase tracking-widest text-ink transition hover:brightness-110 active:scale-[0.97]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </article>

      <!-- ══ CARDS RESTANTES (11 tours en grid de 3) ══ -->
      <article
        v-for="exp in restTours"
        :key="exp.id"
        :ref="setCardRef"
        class="tour-card group relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-white/10 transition-all duration-300 hover:-translate-y-1"
        @click="openDrawer(exp)"
      >
        <!-- Imagen -->
        <div class="relative h-44 overflow-hidden">
          <img
            :src="exp.image || FALLBACK_IMAGE"
            :alt="exp.title"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <!-- Badge -->
          <span
            v-if="exp.badge"
            class="absolute right-3 top-3 rounded-full bg-sun-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
          >
            {{ exp.badge }}
          </span>
        </div>

        <!-- Body -->
        <div class="flex flex-1 flex-col gap-3 p-5">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-display text-xl leading-tight text-white">{{ exp.title }}</h3>
            <span class="shrink-0 text-base font-bold text-sun-400">
              {{ formatUSD(exp.price) }}
            </span>
          </div>

          <p class="line-clamp-2 flex-1 text-sm leading-relaxed text-moss-300">
            {{ exp.description }}
          </p>

          <!-- Meta pills -->
          <div class="flex flex-wrap gap-1.5">
            <span class="meta-pill">⏱ {{ exp.duration }}</span>
            <span :class="['meta-pill', diffColor(exp.level)]">{{ exp.level }}</span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between border-t border-white/10 pt-3">
            <span class="text-xs text-white/30 transition group-hover:text-white/60">
              View details →
            </span>
            <button
              type="button"
              @click.stop="openBookingWidget"
              class="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/70 transition group-hover:border-sun-400 group-hover:bg-sun-400 group-hover:text-ink"
            >
              Book
            </button>
          </div>
        </div>

        <!-- Glow borde superior en hover — crema de marca -->
        <div class="card-border-glow" aria-hidden="true" />
      </article>

    </div>
  </section>

  <!-- ══════════════════════════════════════════════════════
       DRAWER LATERAL
  ═══════════════════════════════════════════════════════ -->
  <Teleport to="body">

    <!-- Overlay drawer -->
    <Transition name="fade-overlay">
      <div
        v-if="drawerOpen"
        class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        @click="closeDrawer"
      />
    </Transition>

    <!-- Panel drawer -->
    <div
      v-if="drawerOpen && selectedExp"
      class="exp-drawer fixed bottom-0 right-0 top-0 z-[201] flex w-full flex-col overflow-y-auto bg-moss-900 shadow-2xl sm:w-[460px]"
    >
      <!-- Header sticky -->
      <div class="sticky top-0 z-10 flex items-center justify-between bg-moss-900/95 px-5 py-4 backdrop-blur-md">
        <span class="text-[10px] uppercase tracking-[0.3em] text-sun-400">
          {{ selectedExp.category ?? 'Experience' }}
        </span>
        <button
          @click="closeDrawer"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
          aria-label="Close"
        >✕</button>
      </div>

      <!-- Galería -->
      <div
        v-if="selectedExp.images?.length"
        class="relative h-52 shrink-0 overflow-hidden sm:h-60"
      >
        <img
          :src="selectedExp.images[activeImg]"
          :alt="selectedExp.title"
          class="h-full w-full object-cover transition-opacity duration-300"
        />
        <div
          v-if="selectedExp.images.length > 1"
          class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
        >
          <button
            v-for="(_, i) in selectedExp.images"
            :key="i"
            @click.stop="activeImg = i"
            :class="[
              'h-1.5 rounded-full transition-all duration-200',
              i === activeImg ? 'w-6 bg-sun-400' : 'w-1.5 bg-white/35',
            ]"
          />
        </div>
      </div>

      <!-- Cuerpo -->
      <div class="flex flex-1 flex-col gap-5 px-5 py-5">

        <!-- Título + precio -->
        <div class="flex items-start justify-between gap-3">
          <h2 class="font-display text-2xl leading-tight text-white">
            {{ selectedExp.title }}
          </h2>
          <div class="shrink-0 text-right">
            <p class="text-xl font-bold text-sun-400">{{ formatUSD(selectedExp.price) }}</p>
            <p class="text-[10px] text-white/35">per person</p>
          </div>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <span
            v-if="selectedExp.profile"
            class="rounded-full border border-sun-400/30 bg-sun-400/10 px-3 py-1 text-xs text-sun-400"
          >
            {{ profileLabel(selectedExp.profile) }}
          </span>
          <span
            v-if="selectedExp.badge"
            class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60"
          >
            {{ selectedExp.badge }}
          </span>
        </div>

        <!-- Descripción -->
        <p class="text-sm leading-relaxed text-moss-300">{{ selectedExp.description }}</p>

        <!-- Detalles en grid 2x2 -->
        <div class="grid grid-cols-2 gap-3">
          <div class="detail-cell">
            <span class="detail-label">⏱ Duration</span>
            <span class="detail-value">{{ selectedExp.duration }}</span>
          </div>
          <div class="detail-cell">
            <span class="detail-label">📊 Level</span>
            <span :class="['detail-value', diffColor(selectedExp.level)]">
              {{ selectedExp.level }}
            </span>
          </div>
          <div v-if="selectedExp.minAge" class="detail-cell">
            <span class="detail-label">👤 Ages</span>
            <span class="detail-value">{{ selectedExp.minAge }}</span>
          </div>
          <div v-if="selectedExp.departure" class="detail-cell">
            <span class="detail-label">📍 Departure</span>
            <span class="detail-value text-xs">{{ selectedExp.departure }}</span>
          </div>
        </div>

        <!-- Qué incluye -->
        <div v-if="selectedExp.includes?.length">
          <p class="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
            What's included
          </p>
          <ul class="flex flex-col gap-1.5">
            <li
              v-for="item in selectedExp.includes"
              :key="item"
              class="flex items-center gap-2 text-sm text-moss-300"
            >
              <span class="h-1 w-1 shrink-0 rounded-full bg-sun-400" />
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="flex-1" />

        <!-- CTA sticky -->
        <div class="sticky bottom-0 bg-moss-900 pb-6 pt-3">
          <button
            type="button"
            @click="openBookingWidget"
            class="w-full rounded-full bg-gradient-to-r from-sun-400 to-sun-500 py-3.5 text-sm font-bold tracking-wide text-ink transition hover:brightness-110 active:scale-[0.98]"
          >
            Book Now — {{ formatUSD(selectedExp.price) }} per person
          </button>
          <p class="mt-2 text-center text-[10px] text-white/25">
            No hidden fees · Instant confirmation
          </p>
        </div>

      </div>
    </div>

    <!-- ── Booking Widget Modal ──────────────────────────── -->
    <Transition name="fade-overlay">
      <div
        v-if="bookingWidgetOpen"
        class="fixed inset-0 z-[220] bg-black/70 backdrop-blur-sm"
        @click="closeBookingWidget"
      />
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="bookingWidgetOpen"
        class="fixed inset-0 z-[221] flex items-center justify-center p-4 sm:p-6"
      >
        <div class="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-moss-900 shadow-2xl ring-1 ring-white/10">
          <div class="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
            <div class="min-w-0">
              <h3 class="font-display text-xl text-white">Book your experience</h3>
              <a
                :href="bookingWidgetUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-moss-300/60 underline underline-offset-2 transition hover:text-moss-300"
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
          <iframe
            :src="bookingWidgetUrl"
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
/* ── Editorial grid ──────────────────────────────────────── */
/*
  Layout:
  - Desktop: 3 columnas
    · Card destacada: col 1-2, row 1-2 (ocupa el doble de espacio)
    · Cards 2 y 3: col 3, rows 1 y 2
    · Cards 4-12: grid normal de 3 columnas
  - Mobile: 1 columna, destacada primero
*/
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* Featured ocupa 2 cols y 2 rows */
.featured-card {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  min-height: 480px;
}

@media (max-width: 767px) {
  .editorial-grid {
    grid-template-columns: 1fr;
  }
  .featured-card {
    grid-column: 1 / 2;
    grid-row: auto;
    min-height: 320px;
  }
}

/* ── Featured card ───────────────────────────────────────── */
.featured-card {
  position: relative;
  background: #0c1a0f;
}

.featured-img {
  will-change: transform;
}

/* ── Tour card (resto) ───────────────────────────────────── */
.tour-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.tour-card:hover {
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(232, 194, 139, 0.2);
  border-color: rgba(232, 194, 139, 0.2);
}

/* Glow borde superior crema en hover */
.card-border-glow {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(232, 194, 139, 0.65),
    transparent
  );
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.tour-card:hover .card-border-glow {
  opacity: 1;
}

/* ── Meta pill ───────────────────────────────────────────── */
/* bg-white/8 no es valor estándar de Tailwind — se define como CSS puro */
.meta-pill {
  @apply rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-moss-300;
  background: rgba(255, 255, 255, 0.08);
}

/* ── Drawer detail cells ─────────────────────────────────── */
.detail-cell {
  @apply flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3;
}
.detail-label {
  @apply text-[10px] uppercase tracking-widest text-white/30;
}
.detail-value {
  @apply text-sm font-medium text-white;
}

/* ── Transitions ─────────────────────────────────────────── */
.fade-overlay-enter-active,
.fade-overlay-leave-active { transition: opacity 0.28s ease; }
.fade-overlay-enter-from,
.fade-overlay-leave-to     { opacity: 0; }

.slide-up-enter-active,
.slide-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from,
.slide-up-leave-to     { opacity: 0; transform: translateY(16px); }
</style>