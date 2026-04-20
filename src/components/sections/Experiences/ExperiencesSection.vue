<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { categories, experiences } from '../../../data/home.js'

// Imagen de fallback mientras no haya imagen individual en la data
const FALLBACK_IMAGE = 'https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/a2bd7f983ad6549134c9479f40e44cc3.jpg'

gsap.registerPlugin(ScrollTrigger)

// ── Filtros ────────────────────────────────────────────────
// Perfiles de cliente para segmentar (high-ticket friendly)
const profiles = [
  { id: 'all',        label: 'Todos' },
  { id: 'familiar',   label: '👨‍👩‍👧 Familiar' },
  { id: 'aventurero', label: '🧗 Aventurero' },
  { id: 'premium',    label: '⭐ Premium' },
]

const activeCategory = ref(categories[0].id)
const activeProfile  = ref('all')

const filteredExperiences = computed(() =>
  experiences.filter((exp) => {
    const catOk  = exp.category === activeCategory.value
    const profOk = activeProfile.value === 'all' || exp.profile === activeProfile.value
    return catOk && profOk
  })
)

const formatUSD = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const diffColor = (level) => ({
  'Suave':    'text-emerald-400',
  'Moderado': 'text-sun-400',
  'Difícil':  'text-red-400',
}[level] || 'text-moss-300')

const profileLabel = (p) => ({
  familiar:   '👨‍👩‍👧 Familiar',
  aventurero: '🧗 Aventurero',
  premium:    '⭐ Premium',
}[p] ?? '')

const bookingWidgetUrl = 'https://widget.ticando.net/KTBmJaxmHMbcSCTLUBeXgDuvNbsoVXGfpHTyhRlodNRvPkHjmlGTnCPBdIpyeveVDxUkPG/trayecto/1/1'

// ── Drawer ─────────────────────────────────────────────────
const drawerOpen   = ref(false)
const selectedExp  = ref(null)
const activeImg    = ref(0)
const bookingWidgetOpen = ref(false)

const syncBodyScroll = () => {
  document.body.style.overflow = (drawerOpen.value || bookingWidgetOpen.value) ? 'hidden' : ''
}

const openDrawer = (exp) => {
  selectedExp.value = exp
  activeImg.value   = 0
  drawerOpen.value  = true
  syncBodyScroll()
  gsap.fromTo('.exp-drawer',
    { x: '100%' },
    { x: '0%', duration: 0.42, ease: 'power3.out' }
  )
}

const closeDrawer = () => {
  gsap.to('.exp-drawer', {
    x: '100%', duration: 0.32, ease: 'power3.in',
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
  if (bookingWidgetOpen.value) {
    closeBookingWidget()
    return
  }
  if (drawerOpen.value) closeDrawer()
}

// ── Scroll animations ──────────────────────────────────────
const sectionRef = ref(null)
const headerRef  = ref(null)
const filtersRef = ref(null)
const cardsRef   = ref([])
const setCardRef = (el) => { if (el) cardsRef.value.push(el) }

onMounted(() => {
  window.addEventListener('keydown', onKeydown)

  const ctx = gsap.context(() => {
    gsap.from(headerRef.value, {
      opacity: 0, y: 32, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: headerRef.value, start: 'top 88%', toggleActions: 'play none none none' },
    })
    gsap.from(filtersRef.value, {
      opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 0.08,
      scrollTrigger: { trigger: filtersRef.value, start: 'top 88%', toggleActions: 'play none none none' },
    })
    if (cardsRef.value.length) {
      gsap.from(cardsRef.value, {
        opacity: 0, y: 48, duration: 0.7, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: cardsRef.value[0], start: 'top 88%', toggleActions: 'play none none none' },
      })
    }
  }, sectionRef.value)

  sectionRef.value._gsapCtx = ctx
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  sectionRef.value?._gsapCtx?.revert()
  document.body.style.overflow = ''
})
</script>

<template>
  <section id="experiencias" ref="sectionRef" class="flex flex-col gap-8">

    <!-- ── HEADER + FILTROS ───────────────────────────────── -->
    <div ref="headerRef" class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-moss-300">Opciones vivas</p>
        <h2 class="font-display text-3xl text-white">
          Explora propuestas iniciales por estilo de viaje
        </h2>
      </div>
      <!-- Filtro categoría (tu lógica original) -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="[
            'rounded-full border px-4 py-2 text-xs transition-all duration-200',
            activeCategory === cat.id
              ? 'border-transparent bg-moss-700 text-white'
              : 'border-white/30 text-moss-100 hover:border-white/100',
          ]"
          @click="activeCategory = cat.id"
        >{{ cat.label }}</button>
      </div>
    </div>

    <!-- ── FILTRO PERFIL DE CLIENTE ───────────────────────── -->
    <div ref="filtersRef" class="flex flex-wrap items-center gap-2">
      <span class="mr-1 text-[10px] uppercase tracking-widest text-white/30">Perfil</span>
      <button
        v-for="prof in profiles"
        :key="prof.id"
        :class="[
          'rounded-full border px-3.5 py-1.5 text-xs transition-all duration-200',
          activeProfile === prof.id
            ? 'border-sun-400/60 bg-sun-400/15 text-sun-400'
            : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80',
        ]"
        @click="activeProfile = prof.id"
      >{{ prof.label }}</button>
    </div>

    <!-- ── GRID DE CARDS ──────────────────────────────────── -->
    <Transition name="fade-grid" mode="out-in">
      <div
        :key="activeCategory + activeProfile"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="exp in filteredExperiences"
          :key="exp.id"
          :ref="setCardRef"
          @click="openDrawer(exp)"
          class="js-card group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-moss-900/80 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sun-400/30 hover:shadow-xl"
        >
          <!-- Badge premium / popular -->
          <span
            v-if="exp.badge"
            class="absolute right-4 top-4 rounded-full bg-sun-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-moss-900"
          >{{ exp.badge }}</span>

          <!-- Imagen del tour (usa exp.image o fallback del CDN) -->
          <div class="overflow-hidden rounded-xl">
            <img
              :src="exp.image || FALLBACK_IMAGE"
              :alt="exp.title"
              class="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <!-- Título + perfil -->
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-semibold text-white leading-snug">{{ exp.title }}</h3>
            <span
              v-if="exp.profile"
              class="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50"
            >{{ profileLabel(exp.profile) }}</span>
          </div>

          <p class="text-sm text-moss-300 leading-relaxed">{{ exp.description }}</p>

          <!-- Meta pills -->
          <div class="flex flex-wrap gap-2">
            <span class="meta-pill">⏱ {{ exp.duration }}</span>
            <span :class="['meta-pill', diffColor(exp.level)]">{{ exp.level }}</span>
            <span class="meta-pill font-semibold text-sun-400">{{ formatUSD(exp.price) }}</span>
          </div>

          <!-- CTA row -->
          <div class="mt-auto flex items-center justify-between pt-1">
            <span class="text-xs text-white/30">Ver detalles →</span>
            <button
              type="button"
              @click.stop="openBookingWidget"
              class="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white transition-all duration-200 group-hover:border-sun-400 group-hover:bg-sun-400 group-hover:text-moss-900"
            >
              Reservar
            </button>
          </div>
        </article>

        <!-- Empty state -->
        <div v-if="filteredExperiences.length === 0"
          class="col-span-full py-14 text-center text-moss-300/50">
          <p class="mb-2 text-3xl">🌿</p>
          <p class="text-sm">No hay experiencias con esos filtros.</p>
        </div>
      </div>
    </Transition>
  </section>

  <!-- ══════════════════════════════════════════════════════
       DRAWER LATERAL
  ═══════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="fade-overlay">
      <div
        v-if="drawerOpen"
        class="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm"
        @click="closeDrawer"
      />
    </Transition>

    <!-- Panel -->
    <div
      v-if="drawerOpen && selectedExp"
      class="exp-drawer fixed bottom-0 right-0 top-0 z-[201] flex w-full flex-col overflow-y-auto bg-[#0c1a0f] shadow-2xl sm:w-[460px]"
    >
      <!-- Header sticky -->
      <div class="sticky top-0 z-10 flex items-center justify-between bg-[#0c1a0f]/95 px-5 py-4 backdrop-blur-md">
        <span class="text-[10px] uppercase tracking-[0.3em] text-sun-400">
          {{ selectedExp.category }}
        </span>
        <button
          @click="closeDrawer"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
          aria-label="Cerrar"
        >✕</button>
      </div>

      <!-- Galería -->
      <div v-if="selectedExp.images?.length" class="relative h-52 shrink-0 overflow-hidden sm:h-60">
        <img
          :src="selectedExp.images[activeImg]"
          :alt="selectedExp.title"
          class="h-full w-full object-cover transition-opacity duration-300"
        />
        <div v-if="selectedExp.images.length > 1"
          class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          <button
            v-for="(_, i) in selectedExp.images" :key="i"
            @click.stop="activeImg = i"
            :class="['h-1.5 rounded-full transition-all duration-200',
              i === activeImg ? 'w-6 bg-sun-400' : 'w-1.5 bg-white/35']"
          />
        </div>
      </div>

      <!-- Cuerpo -->
      <div class="flex flex-1 flex-col gap-5 px-5 py-5">

        <!-- Título + precio -->
        <div class="flex items-start justify-between gap-3">
          <h2 class="font-display text-2xl leading-tight text-white">{{ selectedExp.title }}</h2>
          <div class="shrink-0 text-right">
            <p class="text-xl font-bold text-sun-400">{{ formatUSD(selectedExp.price) }}</p>
            <p class="text-[10px] text-white/35">por persona</p>
          </div>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <span v-if="selectedExp.profile"
            class="rounded-full border border-sun-400/30 bg-sun-400/10 px-3 py-1 text-xs text-sun-400">
            {{ profileLabel(selectedExp.profile) }}
          </span>
          <span v-if="selectedExp.badge"
            class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60">
            {{ selectedExp.badge }}
          </span>
        </div>

        <!-- Descripción -->
        <p class="text-sm leading-relaxed text-moss-300">{{ selectedExp.description }}</p>

        <!-- Detalles en grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="detail-cell">
            <span class="detail-label">⏱ Duración</span>
            <span class="detail-value">{{ selectedExp.duration }}</span>
          </div>
          <div class="detail-cell">
            <span class="detail-label">📊 Nivel</span>
            <span :class="['detail-value', diffColor(selectedExp.level)]">{{ selectedExp.level }}</span>
          </div>
          <div v-if="selectedExp.minAge" class="detail-cell">
            <span class="detail-label">👤 Edades</span>
            <span class="detail-value">{{ selectedExp.minAge }}</span>
          </div>
          <div v-if="selectedExp.departure" class="detail-cell">
            <span class="detail-label">📍 Salida</span>
            <span class="detail-value text-xs">{{ selectedExp.departure }}</span>
          </div>
        </div>

        <!-- Qué incluye -->
        <div v-if="selectedExp.includes?.length">
          <p class="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/30">Incluye</p>
          <ul class="flex flex-col gap-1.5">
            <li v-for="item in selectedExp.includes" :key="item"
              class="flex items-center gap-2 text-sm text-moss-300">
              <span class="h-1 w-1 shrink-0 rounded-full bg-sun-400" />
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="flex-1" />

        <!-- CTA sticky -->
        <div class="sticky bottom-0 bg-[#0c1a0f] pb-6 pt-3">
          <button
            type="button"
            @click="openBookingWidget"
            class="w-full rounded-full bg-gradient-to-r from-sun-400 to-sun-500 py-3.5 text-sm font-bold tracking-wide text-moss-900 transition hover:brightness-110 active:scale-[0.98]"
          >
            Reservar — {{ formatUSD(selectedExp.price) }} por persona
          </button>
          <p class="mt-2 text-center text-[10px] text-white/25">
            Sin cargos ocultos · Confirmación inmediata
          </p>
        </div>

      </div>
    </div>

    <div
      v-if="bookingWidgetOpen"
      class="fixed inset-0 z-[220] bg-black/70 backdrop-blur-sm"
      @click="closeBookingWidget"
    />
    <div
      v-if="bookingWidgetOpen"
      class="fixed inset-0 z-[221] flex items-center justify-center p-4 sm:p-6"
    >
      <div class="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div class="min-w-0">
            <h3 class="font-display text-xl text-slate-900">Reservar experiencia</h3>
            <a
              :href="bookingWidgetUrl"
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
          :src="bookingWidgetUrl"
          title="Widget de reserva"
          class="h-full w-full flex-1"
          loading="lazy"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.meta-pill {
  @apply rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-moss-300;
}
.detail-cell {
  @apply flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3;
}
.detail-label {
  @apply text-[10px] uppercase tracking-widest text-white/30;
}
.detail-value {
  @apply text-sm font-medium text-white;
}

/* Grid transition al cambiar filtro */
.fade-grid-enter-active,
.fade-grid-leave-active { transition: opacity 0.18s, transform 0.18s; }
.fade-grid-enter-from,
.fade-grid-leave-to     { opacity: 0; transform: translateY(6px); }

/* Overlay */
.fade-overlay-enter-active,
.fade-overlay-leave-active { transition: opacity 0.28s; }
.fade-overlay-enter-from,
.fade-overlay-leave-to     { opacity: 0; }
</style>
