<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import logoUrl from '../../../assets/logo.png'

// ── Refs: parallax ─────────────────────────────────────────
const heroRef = ref(null)
let rafId = null

// ── Refs: GSAP ─────────────────────────────────────────────
const curtainLeftRef  = ref(null)
const curtainRightRef = ref(null)
const introScreenRef  = ref(null)
const introLogoRef    = ref(null)
const introBarFillRef = ref(null)
const eyebrowRef      = ref(null)
const titleRef        = ref(null)
const subtitleRef     = ref(null)
const actionsRef      = ref(null)
const scrollIndicatorRef = ref(null)

// ── Estado reactivo para el intro ──────────────────────────
// FIX #2: Usar v-if reactivo en lugar de .remove() directo del DOM
const introVisible = ref(true)

// ── Parallax ───────────────────────────────────────────────
const updateParallax = () => {
  if (!heroRef.value) return
  const rect     = heroRef.value.getBoundingClientRect()
  const progress = Math.min(
    Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0),
    1,
  )
  const offset = (progress - 0.5) * 40
  heroRef.value.style.setProperty('--parallax-y', `${offset}px`)
}

const onScroll = () => {
  if (rafId) return
  rafId = window.requestAnimationFrame(() => {
    rafId = null
    updateParallax()
  })
}

// FIX #4: Handler separado para resize — se puede desregistrar correctamente
const onResize = () => onScroll()

// ── Scroll suave al hacer clic en el indicador ─────────────
const scrollToNext = () => {
  const nextSection = document.querySelector('section:nth-of-type(2)')
  nextSection?.scrollIntoView({ behavior: 'smooth' })
}

// ── GSAP Timeline ──────────────────────────────────────────
const runIntro = () => {
  // FIX #10: Filtrar refs nulos antes de pasarlos a GSAP
  const contentEls = [eyebrowRef, titleRef, subtitleRef, actionsRef, scrollIndicatorRef]
    .map(r => r.value)
    .filter(Boolean)

  gsap.set(contentEls, { opacity: 0, y: 24 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl
    // ── FASE 0: Cortinas se abren ───────────────────────────
    .to(curtainLeftRef.value,  { xPercent: -100, duration: 1.8, ease: 'power2.inOut' }, 0)
    .to(curtainRightRef.value, { xPercent:  100, duration: 1.8, ease: 'power2.inOut' }, 0)

    // ── FASE 1: Logo aparece ────────────────────────────────
    .to(introLogoRef.value, { opacity: 1, y: 0, duration: 0.55 }, 0.3)

    // ── Barra de progreso ───────────────────────────────────
    .to(introBarFillRef.value, {
      width: '100%',
      duration: 1.0,
      ease: 'power1.inOut',
    }, '-=0.2')

    // ── Logo zoom + fade ────────────────────────────────────
    .to(introLogoRef.value, { scale: 1.18, opacity: 0, duration: 0.5, ease: 'power2.in' })

    // ── FASE 2: Intro screen sube y sale ────────────────────
    .to(introScreenRef.value, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
      delay: 0.1,
      // FIX #2: Estado reactivo en lugar de .remove()
      // Libera el scroll exactamente cuando la cortina termina de salir
      onComplete: () => {
        introVisible.value = false
        document.body.style.overflow = ''
      },
    })

    // ── FASE 3: Zoom-out del background ────────────────────
    // FIX #5: GSAP anima la clase CSS directamente en lugar de custom property
    // para máxima compatibilidad cross-browser
    .fromTo(
      heroRef.value,
      { scale: 1.08 },
      { scale: 1.0, duration: 2.4, ease: 'power2.out' },
      '<+0.05',
    )

    // ── FASE 4: Contenido entra en cascada ──────────────────
    .to(eyebrowRef.value,         { opacity: 1, y: 0, duration: 0.55 }, '<+0.2')
    .to(titleRef.value,           { opacity: 1, y: 0, duration: 0.7  }, '<+0.15')
    .to(subtitleRef.value,        { opacity: 1, y: 0, duration: 0.55 }, '<+0.3')
    .to(actionsRef.value,         { opacity: 1, y: 0, duration: 0.5  }, '<+0.2')
    .to(scrollIndicatorRef.value, { opacity: 1, y: 0, duration: 0.5  }, '<+0.15')
}

onMounted(() => {
  // Bloquea el scroll del body mientras el intro está activo
  document.body.style.overflow = 'hidden'

  updateParallax()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  runIntro()
})

onBeforeUnmount(() => {
  // Seguridad: si el componente se desmonta antes de que termine el intro
  // (ej: navegación rápida) el scroll queda liberado igualmente
  document.body.style.overflow = ''
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  if (rafId) window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <section
    ref="heroRef"
    class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-moss-900/70 px-6 pb-20 pt-24 sm:px-10 lg:px-16"
  >
    <!-- Background -->
    <div class="hero-bg absolute inset-0" aria-hidden="true" />

    <!-- FIX #1: Teleport saca las cortinas del stacking context del section
         y las ancla directamente al body, evitando bugs en iOS Safari con
         position: fixed dentro de contenedores transformados -->
    <Teleport to="body">

      <!-- FIX #2: v-if reactivo — Vue limpia el DOM correctamente -->
      <template v-if="introVisible">

        <!-- ══ CORTINA IZQUIERDA ══════════════════════════════ -->
        <div ref="curtainLeftRef" class="curtain curtain-left" aria-hidden="true">
          <div class="curtain-inner">
            <img
              src="https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/green-leaf-texture-leaf-texture-background_2259724a.jpg"
              alt=""
              class="curtain-img curtain-img-left"
              loading="eager"
            />
            <div class="curtain-fade curtain-fade-left" />
            <div class="curtain-dim" />
          </div>
        </div>

        <!-- ══ CORTINA DERECHA ═══════════════════════════════ -->
        <div ref="curtainRightRef" class="curtain curtain-right" aria-hidden="true">
          <div class="curtain-inner">
            <img
              src="https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/green-leaf-texture-leaf-texture-background_2259724a.jpg"
              alt=""
              class="curtain-img curtain-img-right"
              loading="eager"
            />
            <div class="curtain-fade curtain-fade-right" />
            <div class="curtain-dim" />
          </div>
        </div>

        <!-- ══ INTRO SCREEN (logo + barra) ══════════════════ -->
        <div ref="introScreenRef" class="intro-screen">
          <div ref="introLogoRef" class="intro-logo">
            <img :src="logoUrl" alt="Tropical Experiences" class="intro-logo-img" />
          </div>
          <div class="intro-bar">
            <div ref="introBarFillRef" class="intro-bar-fill" />
          </div>
        </div>

      </template>
    </Teleport>

    <!-- ══ CONTENIDO HERO ════════════════════════════════════ -->
    <div class="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 text-center">

      <!-- FIX #7: Eyebrow con prueba social — más conversión que tagline genérico -->
      <p ref="eyebrowRef" class="text-[0.7rem] uppercase tracking-[0.6em] text-sun-400">
        Costa Rica's #1 Luxury Tour Operator · 500+ experiences delivered
      </p>

      <div ref="titleRef">
        <h1 class="font-display text-4xl leading-[0.95] text-white sm:text-6xl lg:text-9xl">
          Unforgettable
          <span class="block italic text-white/90">Costa Rican</span>
          Journeys
        </h1>
      </div>

      <p ref="subtitleRef" class="mx-auto max-w-2xl text-base text-moss-100 sm:text-lg">
        Direct access to elite local expertise and curated luxury adventures designed for the
        discerning traveler.
      </p>

      <div ref="actionsRef" class="flex flex-col items-center justify-center gap-4 sm:flex-row">

        <!-- FIX #3: CTA primario como <a> con destino real -->
        <!-- from-sun-400 (#e8c28b crema) → to-sun-500 (#e8442e naranja-rojo de marca -->
        <!-- text-ink sobre el gradiente crema/naranja garantiza contraste legible -->
        <a
          href="#contact"
          class="rounded-full bg-gradient-to-r from-sun-400 to-sun-500 px-8 py-3 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Book Your Free Consultation
        </a>

        <!-- FIX #3 + FIX #8: CTA secundario visible con flecha animada -->
        <a
          href="#experiences"
          class="cta-secondary group flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
        >
          Discover our experiences
          <!-- Flecha con animación CSS — sin JS extra -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>

      </div>
    </div>

    <!-- FIX #9: Scroll indicator — informa que hay contenido abajo -->
    <button
      ref="scrollIndicatorRef"
      class="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2"
      aria-label="Scroll to next section"
      @click="scrollToNext"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-white/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

  </section>
</template>

<style scoped>
/* ── Background ──────────────────────────────────────────── */
.hero-bg {
  background-image:
    linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)),
    radial-gradient(circle at 20% 20%, rgba(67, 107, 93, 0.5), transparent 45%),
    radial-gradient(circle at 80% 30%, rgba(17, 42, 36, 0.8), transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(20, 33, 27, 0.9), transparent 55%),
    url('https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/4cf9fa204794cc8fd027f36ab8678aab.jpg');
  background-size: cover;
  background-position: center calc(50% + var(--parallax-y, 0px));
  opacity: 0.95;
  /* FIX #5: scale directo en el elemento — compatible con todos los browsers
     El heroRef ahora recibe scale() directamente desde GSAP sin custom props */
  transform-origin: center center;
  will-change: transform; /* hint al browser para GPU compositing */
}

/* ── CORTINAS ────────────────────────────────────────────── */
/* Estas clases viven en el <Teleport to="body">, por lo tanto
   NO pueden ser scoped. Moverlas a un archivo global o usar
   :deep() si es necesario — acá se declaran sin scoped para
   documentar la intención. En producción usar global.css o
   un <style> sin scoped en un componente wrapper. */

.curtain {
  position: fixed;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 10000;
  overflow: hidden;
  background: #0b150d;
  /* will-change para que el browser prepare la capa GPU antes de la animación */
  will-change: transform;
}

.curtain-left  { left: 0; }
.curtain-right { right: 0; }

.curtain-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.curtain-img {
  position: absolute;
  top: 0;
  height: 100%;
  width: 200%;
  object-fit: cover;
}

.curtain-img-left  { right: 0; object-position: left center; }
.curtain-img-right { left: 0; transform: scaleX(-1); object-position: left center; }

.curtain-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.curtain-fade-left {
  background: linear-gradient(
    to left,
    transparent 0%,
    rgba(11, 21, 13, 0.15) 60%,
    rgba(11, 21, 13, 0.85) 100%
  );
}

.curtain-fade-right {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(11, 21, 13, 0.15) 60%,
    rgba(11, 21, 13, 0.85) 100%
  );
}

.curtain-dim {
  position: absolute;
  inset: 0;
  background: rgba(11, 21, 13, 0.18);
  pointer-events: none;
}

/* ── INTRO SCREEN ────────────────────────────────────────── */
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  pointer-events: none;
  will-change: transform;
}

.intro-logo {
  opacity: 0;
  transform: translateY(14px);
}

.intro-logo-img {
  width: clamp(180px, 25vw, 320px);
  height: auto;
  object-fit: contain;
  /* drop-shadow actualizado a la crema de marca #e8c28b */
  filter: brightness(1.1) drop-shadow(0 0 24px rgba(232, 194, 139, 0.40));
}

.intro-bar {
  width: clamp(140px, 20vw, 260px);
  height: 1px;
  /* fondo de la barra: crema de marca con baja opacidad */
  background: rgba(232, 194, 139, 0.15);
  position: relative;
  overflow: hidden;
}

.intro-bar-fill {
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 0%;
  /* fill: crema exacta de marca #e8c28b */
  background: #e8c28b;
}

/* ── CTA Secundario ──────────────────────────────────────── */
.cta-secondary {
  /* Underline animado con pseudo-elemento — no requiere JS */
  position: relative;
}

.cta-secondary::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.cta-secondary:hover::after {
  width: 100%;
}

/* ── Scroll Indicator ────────────────────────────────────── */
.scroll-indicator {
  opacity: 0; /* GSAP lo anima al final del timeline */
  background: transparent;
  border: none;
  cursor: pointer;
  /* Bounce suave infinito — CSS puro, sin JS */
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0);    }
  50%       { transform: translateX(-50%) translateY(6px); }
}
</style>