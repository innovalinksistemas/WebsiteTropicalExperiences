<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const transportOptions = [
  {
    id: 'vip-transfer',
    title: 'Private VIP Transfer',
    category: 'transport',
    meta: 'SUV with bilingual driver',
    price: 150,
  },
  {
    id: 'domestic-flight',
    title: 'Domestic Flight',
    category: 'transport',
    meta: 'San Jose → Liberia',
    price: 220,
  },
  {
    id: 'coastal-drive',
    title: 'Scenic Coastal Drive',
    category: 'transport',
    meta: 'Stops at viewpoints',
    price: 180,
  },
]

const tourCategories = [
  {
    id: 'volcano',
    title: 'Volcano & Hot Springs',
    meta: 'Arenal highlights',
    price: 320,
  },
  {
    id: 'pacific',
    title: 'Pacific Ocean Charter',
    meta: 'Private yacht day',
    price: 480,
  },
  {
    id: 'cloudforest',
    title: 'Cloud Forest Immersion',
    meta: 'Monteverde trails',
    price: 260,
  },
]

const activityOptions = [
  {
    id: 'mistico-bridges',
    title: 'Mistico Hanging Bridges',
    category: 'activity',
    meta: '3 hours · Private guide',
    price: 120,
  },
  {
    id: 'waterfall-hike',
    title: 'La Fortuna Waterfall',
    category: 'activity',
    meta: 'Guided hike',
    price: 95,
  },
  {
    id: 'sunset-cruise',
    title: 'Sunset Catamaran',
    category: 'activity',
    meta: 'Drinks & tapas',
    price: 140,
  },
]

const lodgingOptions = [
  {
    id: 'boutique-villa',
    title: 'Boutique Villa Stay',
    category: 'lodging',
    meta: '2 nights · Breakfast included',
    price: 420,
  },
  {
    id: 'eco-lodge',
    title: 'Eco Lodge Experience',
    category: 'lodging',
    meta: '2 nights · Forest view',
    price: 360,
  },
]

const itineraryItems = ref([])
const bookingWidgetUrl = 'https://widget.ticando.net/KTBmJaxmHMbcSCTLUBeXgDuvNbsoVXGfpHTyhRlodNRvPkHjmlGTnCPBdIpyeveVDxUkPG/trayecto/1/1'
const bookingWidgetOpen = ref(false)

const addItem = (item) => {
  const exists = itineraryItems.value.find((entry) => entry.id === item.id)
  if (!exists) itineraryItems.value = [...itineraryItems.value, item]
}

const removeItem = (id) => {
  itineraryItems.value = itineraryItems.value.filter((entry) => entry.id !== id)
}

const formatUSD = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const total = computed(() =>
  itineraryItems.value.reduce((sum, item) => sum + item.price, 0)
)

const syncBodyScroll = () => {
  document.body.style.overflow = bookingWidgetOpen.value ? 'hidden' : ''
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
  if (e.key === 'Escape' && bookingWidgetOpen.value) closeBookingWidget()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-14">
    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-[28px] border border-white/10 bg-black/50 p-6 text-white">
        <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 class="font-display text-3xl">Interactive Tour Planner</h2>
            <p class="mt-2 text-sm text-moss-100">
              Build your itinerary by selecting transport, tours, activities, and lodging.
            </p>
          </div>
          <div class="text-right text-xs text-moss-300">
            <p class="uppercase tracking-[0.3em]">Planner</p>
            <p class="mt-1 text-white">Step by step</p>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-6">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-sun-400">1. Transporte</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                v-for="item in transportOptions"
                :key="item.id"
                :class="[
                  'rounded-2xl border px-3 py-4 text-left transition',
                  itineraryItems.some((entry) => entry.id === item.id)
                    ? 'border-sun-400 bg-moss-900/80 text-white'
                    : 'border-white/10 bg-white/5 text-moss-100',
                ]"
                @click="addItem(item)"
              >
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p class="mt-1 text-xs text-moss-300">{{ item.meta }}</p>
                <p class="mt-2 text-xs text-sun-400">{{ formatUSD(item.price) }}</p>
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-sun-400">2. Tours (3 categorias)</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                v-for="tour in tourCategories"
                :key="tour.id"
                :class="[
                  'rounded-2xl border px-3 py-4 text-left transition',
                  itineraryItems.some((entry) => entry.id === tour.id)
                    ? 'border-sun-400 bg-moss-900/80 text-white'
                    : 'border-white/10 bg-white/5 text-moss-100',
                ]"
                @click="addItem(tour)"
              >
                <p class="text-sm font-semibold">{{ tour.title }}</p>
                <p class="mt-1 text-xs text-moss-300">{{ tour.meta }}</p>
                <p class="mt-2 text-xs text-sun-400">{{ formatUSD(tour.price) }}</p>
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-sun-400">3. Actividades</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                v-for="item in activityOptions"
                :key="item.id"
                :class="[
                  'rounded-2xl border px-3 py-4 text-left transition',
                  itineraryItems.some((entry) => entry.id === item.id)
                    ? 'border-sun-400 bg-moss-900/80 text-white'
                    : 'border-white/10 bg-white/5 text-moss-100',
                ]"
                @click="addItem(item)"
              >
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p class="mt-1 text-xs text-moss-300">{{ item.meta }}</p>
                <p class="mt-2 text-xs text-sun-400">{{ formatUSD(item.price) }}</p>
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-sun-400">4. Hospedaje</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                v-for="item in lodgingOptions"
                :key="item.id"
                :class="[
                  'rounded-2xl border px-3 py-4 text-left transition',
                  itineraryItems.some((entry) => entry.id === item.id)
                    ? 'border-sun-400 bg-moss-900/80 text-white'
                    : 'border-white/10 bg-white/5 text-moss-100',
                ]"
                @click="addItem(item)"
              >
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p class="mt-1 text-xs text-moss-300">{{ item.meta }}</p>
                <p class="mt-2 text-xs text-sun-400">{{ formatUSD(item.price) }}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside class="rounded-[28px] border border-white/10 bg-black/60 p-6 text-white">
        <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-moss-300">Your itinerary</p>
            <p class="mt-1 text-sm text-moss-100">Editable selections</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-moss-300">Total Est.</p>
            <p class="text-xl font-semibold text-sun-400">{{ formatUSD(total) }}</p>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-4">
          <div
            v-for="item in itineraryItems"
            :key="item.id"
            class="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
          >
            <div>
              <p class="text-sm font-semibold">{{ item.title }}</p>
              <p class="text-xs text-moss-300">{{ item.meta }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-sun-400">{{ formatUSD(item.price) }}</span>
              <button
                class="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
                @click="removeItem(item.id)"
              >
                Remove
              </button>
            </div>
          </div>

          <div
            v-if="itineraryItems.length === 0"
            class="rounded-2xl border border-dashed border-white/20 py-10 text-center text-xs text-moss-300"
          >
            Add items to build your itinerary.
          </div>
        </div>

        <div class="mt-6 flex items-center gap-2 text-xs text-moss-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Prices shown are estimates and include service fees.
        </div>

        <button
          type="button"
          @click="openBookingWidget"
          class="mt-6 w-full rounded-full bg-gradient-to-r from-sun-400 to-orange-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 shadow-glow"
        >
          Finalize & Book
        </button>
      </aside>
    </div>
  </section>

  <Teleport to="body">
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
            <h3 class="font-display text-xl text-slate-900">Finalize your booking</h3>
            <a
              :href="bookingWidgetUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-700"
            >
              Open in a new tab if it does not load
            </a>
          </div>
          <button
            type="button"
            @click="closeBookingWidget"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-slate-500 hover:text-slate-900"
            aria-label="Close booking widget"
          >
            ✕
          </button>
        </div>
        <iframe
          :src="bookingWidgetUrl"
          title="Booking widget"
          class="h-full w-full flex-1"
          loading="lazy"
        />
      </div>
    </div>
  </Teleport>
</template>
