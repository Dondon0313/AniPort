import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import BangumiList from '@/pages/BangumiList.vue'
import BangumiDetail from '@/pages/BangumiDetail.vue'
import Favorites from '@/pages/Favorites.vue'
import WatchPage from '@/pages/Watch.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/bangumi', component: BangumiList },
  { path: '/bangumi/:id', component: BangumiDetail },
  { path: '/favorites', component: Favorites },
//   { path: '/watch', component: WatchPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
