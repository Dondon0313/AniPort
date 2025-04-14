<template>
  <header class="bg-white shadow sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo 和主導航 -->
        <div class="flex items-center">
          <RouterLink
            to="/"
            class="text-2xl font-bold hover:text-blue-600 flex items-center"
          >
            <span class="text-blue-600 mr-1">📺</span>
            AnimeNow
          </RouterLink>
          
          <nav class="hidden md:flex ml-8 space-x-6 text-sm font-medium">
            <RouterLink
              to="/"
              class="hover:text-blue-600 py-1"
            >
              首頁
            </RouterLink>
            <RouterLink
              to="/bangumi"
              class="hover:text-blue-600 py-1"
            >
              番劇列表
            </RouterLink>
            <RouterLink
              to="/schedule"
              class="hover:text-blue-600 py-1"
            >
              番劇日曆
            </RouterLink>
            <RouterLink
              to="/watch"
              class="hover:text-blue-600 py-1"
            >
              觀看平台
            </RouterLink>
          </nav>
        </div>
        
        <!-- 搜索和用戶區域 -->
        <div class="flex items-center">
          <!-- 搜索框 -->
          <div class="relative mr-4 hidden sm:block">
            <input
              type="text"
              placeholder="搜索番劇..."
              class="py-1 pl-8 pr-2 rounded-full border text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-48"
            >
            <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-stone-400">
              🔍
            </span>
          </div>
          
          <!-- 用戶菜單 -->
          <div class="flex items-center space-x-3">
            <!-- 通知圖標 -->
            <RouterLink 
              v-if="authStore.isLoggedIn" 
              to="/notifications" 
              class="text-stone-700 hover:text-blue-600 relative"
            >
              <span class="text-lg">🔔</span>
              <span 
                v-if="unreadNotificationsCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >
                {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
              </span>
            </RouterLink>
  
            <!-- 收藏圖標 -->
            <RouterLink 
              v-if="authStore.isLoggedIn" 
              to="/favorites" 
              class="text-stone-700 hover:text-blue-600"
            >
              <span class="text-lg">❤️</span>
            </RouterLink>
            
            <template v-if="authStore.isLoggedIn">
              <div
                ref="menuRef"
                class="relative"
              >
                <button 
                  class="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100" 
                  @click="toggleMenu"
                >
                  <span class="font-medium">{{ authStore.currentUser?.username }}</span>
                  <span class="text-xs ml-1">▼</span>
                </button>
                
                <div 
                  v-if="showMenu" 
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border"
                >
                  <RouterLink
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showMenu = false"
                  >
                    個人資料
                  </RouterLink>
                  <RouterLink
                    to="/favorites"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showMenu = false"
                  >
                    我的收藏
                  </RouterLink>
                  <RouterLink
                    to="/history"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showMenu = false"
                  >
                    觀看歷史
                  </RouterLink>
                  <RouterLink
                    to="/friends"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showMenu = false"
                  >
                    我的好友
                  </RouterLink>
                  <RouterLink
                    to="/notifications"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showMenu = false"
                  >
                    我的通知
                  </RouterLink>
                  <button
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    @click="logout"
                  >
                    登出
                  </button>
                </div>
              </div>
            </template>
            
            <template v-else>
              <RouterLink
                to="/login"
                class="text-stone-700 hover:text-blue-600 px-3 py-1"
              >
                登入
              </RouterLink>
              <RouterLink
                to="/register"
                class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded"
              >
                註冊
              </RouterLink>
            </template>
            
            <button 
              class="text-stone-700 hover:text-blue-600 md:hidden ml-2" 
              @click="isMenuOpen = !isMenuOpen"
            >
              <span class="text-xl">{{ isMenuOpen ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 移動端下拉選單 -->
      <div
        v-if="isMenuOpen"
        class="md:hidden pt-2 pb-2 border-t mt-2"
      >
        <nav class="flex flex-col space-y-2">
          <RouterLink
            to="/"
            class="hover:text-blue-600 py-2 px-1"
            active-class="text-blue-600 bg-blue-50 rounded"
          >
            首頁
          </RouterLink>
          <RouterLink
            to="/bangumi"
            class="hover:text-blue-600 py-2 px-1"
            active-class="text-blue-600 bg-blue-50 rounded"
          >
            番劇列表
          </RouterLink>
          <RouterLink
            to="/schedule"
            class="hover:text-blue-600 py-2 px-1"
            active-class="text-blue-600 bg-blue-50 rounded"
          >
            番劇日曆
          </RouterLink>
          <RouterLink
            to="/watch"
            class="hover:text-blue-600 py-2 px-1"
            active-class="text-blue-600 bg-blue-50 rounded"
          >
            觀看平台
          </RouterLink>
          <RouterLink
            to="/favorites"
            class="hover:text-blue-600 py-2 px-1"
            active-class="text-blue-600 bg-blue-50 rounded"
          >
            收藏
          </RouterLink>
    
          <!-- 移動端登出按鈕 -->
          <button 
            v-if="authStore.isLoggedIn"
            class="text-left text-red-600 hover:text-red-800 py-2 px-1"
            @click="logout"
          >
            登出
          </button>
    
          <!-- 移動端搜索框 -->
          <div class="py-2">
            <input
              type="text"
              placeholder="搜索番劇..."
              class="py-2 px-3 rounded-lg border w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const showMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
const unreadNotificationsCount = ref(0)
const notificationCheckInterval = ref<number | null>(null)


const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const logout = () => {
  console.log('Logging out')
  authStore.logout()
  localStorage.removeItem('user') // 再次確保清除
  showMenu.value = false
  isMenuOpen.value = false
  router.push('/')
  setTimeout(() => {
    window.location.reload() // 確保頁面重新載入
  }, 100)
}

// 點擊外部關閉菜單
const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 在組件掛載時檢查登入狀態
  console.log('Header mounted, login status:', authStore.isLoggedIn)
  if (authStore.currentUser) {
    console.log('Current user:', authStore.currentUser.username)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 檢查未讀通知數量
const checkUnreadNotifications = async () => {
  if (!authStore.isLoggedIn) return
  
  try {
    const response = await axios.get('/api/Notification?unreadOnly=true')
    unreadNotificationsCount.value = response.data.length
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 在組件掛載時檢查登入狀態
  console.log('Header mounted, login status:', authStore.isLoggedIn)
  if (authStore.currentUser) {
    console.log('Current user:', authStore.currentUser.username)
    
    // 檢查未讀通知
    checkUnreadNotifications()
    
    // 設置定期檢查通知的間隔
    notificationCheckInterval.value = window.setInterval(checkUnreadNotifications, 60000) // 每分鐘檢查一次
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  
  // 清除通知檢查間隔
  if (notificationCheckInterval.value) {
    clearInterval(notificationCheckInterval.value)
  }
})
</script>