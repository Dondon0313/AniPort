// src/router/index.ts 
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/bangumi',
    component: () => import('@/pages/BangumiList.vue'),
  },
  {
    path: '/bangumi/:id',
    component: () => import('@/pages/BangumiDetail.vue'),
  },
  {
    path: '/favorites',
    component: () => import('@/pages/Favorites.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/watch',
    component: () => import('@/pages/Watch.vue'),
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    component: () => import('@/pages/Register.vue'),
    meta: { guestOnly: true },
  },
  // 新增路由
  {
    path: '/history',
    component: () => import('@/pages/WatchHistory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/friends',
    component: () => import('@/pages/Friends.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    component: () => import('@/pages/Notifications.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/schedule',
    component: () => import('@/pages/Schedule.vue'),
  },
  {
    path: '/user/:id',
    component: () => import('@/pages/UserProfile.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  // 如果需要登入但未登入，重定向到登入頁
  if (requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } 
  // 如果只允許訪客但已登入，重定向到首頁
  else if (guestOnly && authStore.isLoggedIn) {
    next('/')
  }
  else {
    next()
  }
})

export default router