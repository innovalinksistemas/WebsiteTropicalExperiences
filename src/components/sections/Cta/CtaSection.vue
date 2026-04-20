<template>
  <section
    class="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-sun-400/20 to-sun-500/20 p-6"
  >
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-moss-300">Comienza ahora</p>
      <h2 class="font-display text-3xl">Activemos tu primera propuesta interactiva</h2>
      <p class="mt-2 text-sm text-moss-100">Comparte tu correo y te enviamos un primer mapa de viaje.</p>
    </div>
    <div class="flex flex-wrap gap-3">
      <input
        type="email"
        placeholder="tu correo"
        class="rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm text-white placeholder:text-moss-300"
      />
      <button
        class="rounded-full bg-gradient-to-r from-sun-400 to-sun-500 px-5 py-2 text-sm font-semibold text-stone-900 shadow-glow"
      >
        Enviar
      </button>
    </div>
  </section>
</template>
