import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Login from './views/Login.vue'
import Upload from './views/Upload.vue'
import Edit from './views/Edit.vue'
import Query from './views/Query.vue'
import Statistics from './views/Statistics.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/query' },
  { path: '/upload', component: Upload },
  { path: '/edit', component: Edit },
  { path: '/query', component: Query },
  { path: '/statistics', component: Statistics }
]

const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.path !== '/login' && !auth.token) return '/login'
})
export default router
