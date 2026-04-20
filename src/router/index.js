import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import PackageBuilderPage from '../pages/PackageBuilderPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/package-builder', name: 'package-builder', component: PackageBuilderPage },
  ],
})

export default router
