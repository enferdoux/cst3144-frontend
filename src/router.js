import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Lessons from './views/Lessons.vue'
import Cart from './views/Cart.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/lessons', component: Lessons },
  { path: '/cart', component: Cart }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router