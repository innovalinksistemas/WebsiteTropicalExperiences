<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import logoUrl from '../../../assets/logo.png'

// ── Refs existentes ────────────────────────────────────────
const heroRef = ref(null)
let rafId

// ── Refs para GSAP ─────────────────────────────────────────
const curtainLeftRef  = ref(null)
const curtainRightRef = ref(null)
const introScreenRef  = ref(null)
const introLogoRef    = ref(null)
const introBarFillRef = ref(null)
const eyebrowRef      = ref(null)
const titleRef        = ref(null)
const subtitleRef     = ref(null)
const actionsRef      = ref(null)

// ── Parallax existente (sin cambios) ──────────────────────
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

// ── GSAP Timeline ──────────────────────────────────────────
const runIntro = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Contenido hero oculto hasta el final
  gsap.set([eyebrowRef.value, titleRef.value, subtitleRef.value, actionsRef.value], {
    opacity: 0,
    y: 24,
  })

  tl
    // ── FASE 0: Cortinas de selva se abren (split) ──────────
    // Duración total ~1.8s, un poco más pausada
    .to(curtainLeftRef.value, {
      xPercent: -100,
      duration: 1.8,
      ease: 'power2.inOut',
    }, 0)
    .to(curtainRightRef.value, {
      xPercent: 100,
      duration: 1.8,
      ease: 'power2.inOut',
    }, 0)

    // ── FASE 1: Logo aparece ─────────────────────────────────
    .to(introLogoRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.55,
    }, 0.3) // empieza mientras las cortinas aún se abren

    // ── Barra de progreso ────────────────────────────────────
    .to(introBarFillRef.value, {
      width: '100%',
      duration: 1.0,
      ease: 'power1.inOut',
    }, '-=0.2')

    // ── Logo zoom + fade al terminar la barra ────────────────
    .to(introLogoRef.value, {
      scale: 1.18,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    })

    // ── FASE 2: Intro screen sube y sale ─────────────────────
    .to(introScreenRef.value, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
      delay: 0.1,
      onComplete: () => {
        introScreenRef.value?.remove()
        curtainLeftRef.value?.remove()
        curtainRightRef.value?.remove()
      },
    })

    // ── FASE 3: Zoom-out del background ──────────────────────
    .fromTo(heroRef.value,
      { '--bg-scale': 1.08 },
      { '--bg-scale': 1.0, duration: 2.4, ease: 'power2.out' },
      '<+0.05',
    )

    // ── FASE 4: Contenido entra ───────────────────────────────
    .to(eyebrowRef.value,  { opacity: 1, y: 0, duration: 0.55 }, '<+0.2')
    .to(titleRef.value,    { opacity: 1, y: 0, duration: 0.7  }, '<+0.15')
    .to(subtitleRef.value, { opacity: 1, y: 0, duration: 0.55 }, '<+0.3')
    .to(actionsRef.value,  { opacity: 1, y: 0, duration: 0.5  }, '<+0.2')
}

onMounted(() => {
  updateParallax()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  runIntro()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId) window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <section
    ref="heroRef"
    class="relative min-h-screen w-full overflow-hidden bg-moss-900/70 px-6 pb-20 pt-28 sm:px-10 lg:px-16"
  >
    <!-- Background original -->
    <div class="hero-bg absolute inset-0" aria-hidden="true" />

    <!-- ══ CORTINA IZQUIERDA ══════════════════════════════════ -->
    <!-- Plantas reales desde el borde izquierdo — imagen espejada horizontalmente -->
    <div ref="curtainLeftRef" class="curtain curtain-left" aria-hidden="true">
      <div class="curtain-inner curtain-inner-left">
        <!-- Imagen de plantas — ancho doble para mostrar solo la mitad con plantas -->
        <img
          src="https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/green-leaf-texture-leaf-texture-background_2259724a.jpg"
          alt=""
          class="curtain-img curtain-img-left"
        />
        <!-- Gradiente que funde el borde derecho del panel hacia transparente -->
        <div class="curtain-fade curtain-fade-left" />
        <!-- Oscurecimiento sutil para cohesión con el fondo -->
        <div class="curtain-dim" />
      </div>
    </div>

    <!-- ══ CORTINA DERECHA ═════════════════════════════════════ -->
    <!-- Imagen espejada horizontalmente — plantas desde el borde derecho -->
    <div ref="curtainRightRef" class="curtain curtain-right" aria-hidden="true">
      <div class="curtain-inner curtain-inner-right">
        <img
          src="https://cdn.arenalcloud.com/arenal-a65b6eb9-29d7-4dec-9784-b1b37ff7dfce-tropical/green-leaf-texture-leaf-texture-background_2259724a.jpg"
          alt=""
          class="curtain-img curtain-img-right"
        />
        <div class="curtain-fade curtain-fade-right" />
        <div class="curtain-dim" />
      </div>
    </div>

    <!-- ══ INTRO SCREEN (logo + barra) ══════════════════════════ -->
    <div ref="introScreenRef" class="intro-screen">
      <div ref="introLogoRef" class="intro-logo">
        <img :src="logoUrl" alt="Tropical Experiences" class="intro-logo-img" />
      </div>
      <div class="intro-bar">
        <div ref="introBarFillRef" class="intro-bar-fill" />
      </div>
    </div>

    <!-- ══ CONTENIDO HERO ════════════════════════════════════ -->
    <div class="relative z-10 mx-auto flex max-w-4xl flex-col gap-8 text-center">
      <p ref="eyebrowRef" class="text-[0.7rem] uppercase tracking-[0.6em] text-sun-400">
        The pinnacle of travel
      </p>
      <div ref="titleRef" class="js-hero">
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
        <button
          class="rounded-full bg-gradient-to-r from-sun-400 to-sun-500 px-8 py-3 text-sm font-semibold text-stone-900 shadow-glow transition hover:-translate-y-0.5"
        >
          Book Your Expert Consultation
        </button>
        <button class="text-sm font-medium text-white/80 transition hover:text-white">
          Discover our experiences
        </button>
      </div>
    </div>
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
  transform: scale(var(--bg-scale, 1));
  transform-origin: center center;
}

/* ── CORTINAS ────────────────────────────────────────────── */
.curtain {
  position: fixed;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 10000;
  overflow: hidden;
  background: #0b150d; /* fondo por si la imagen tarda en cargar */
}

.curtain-left  { left: 0; }
.curtain-right { right: 0; }

/* Contenedor interno que ocupa todo el panel */
.curtain-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* ── Imagen izquierda: plants pegadas al borde derecho del panel ── */
/* La imagen original tiene plantas a la izquierda y blanco a la derecha.
   En el panel izquierdo queremos que las plantas estén al borde DERECHO (centro de pantalla).
   Escalamos al 200% de ancho y alineamos a la derecha. */
.curtain-img {
  position: absolute;
  top: 0;
  height: 100%;
  width: 200%;       /* doble ancho — mostramos solo la mitad con plantas */
  object-fit: cover;
  object-position: left center;
}

.curtain-img-left {
  right: 0;          /* plantas al borde derecho del panel izquierdo */
  object-position: left center;
}

.curtain-img-right {
  left: 0;
  transform: scaleX(-1); /* espejo horizontal — plantas al borde izquierdo del panel derecho */
  object-position: left center;
}

/* Gradiente que funde el borde interior de cada panel (hacia el centro de pantalla) */
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

/* Oscurecimiento general para cohesión con el resto de la página */
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
  z-index: 9999; /* debajo de las cortinas */
  background: transparent; /* las cortinas ya cubren todo */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  pointer-events: none;
}

.intro-logo {
  opacity: 0;
  transform: translateY(14px);
}

.intro-logo-img {
  width: clamp(180px, 25vw, 320px);
  height: auto;
  object-fit: contain;
  filter: brightness(1.1) drop-shadow(0 0 24px rgba(232, 201, 122, 0.35));
}

.intro-bar {
  width: clamp(140px, 20vw, 260px);
  height: 1px;
  background: rgba(232, 201, 122, 0.15);
  position: relative;
  overflow: hidden;
}

.intro-bar-fill {
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 0%;
  background: #e8c97a;
}
</style>
