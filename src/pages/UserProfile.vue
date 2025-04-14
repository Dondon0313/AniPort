<!-- src/pages/UserProfile.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div
      v-if="loading"
      class="text-center py-10"
    >
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      <p class="mt-2 text-stone-500">
        載入中...
      </p>
    </div>
  
    <div
      v-else-if="user"
      class="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <!-- 用戶資料頭部 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-32" />
      <div class="px-6 pb-6 relative">
        <div class="flex justify-between items-start">
          <div class="flex items-end -mt-12">
            <div class="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl text-stone-400">
              👤
            </div>
            <div class="ml-4 mt-2">
              <h1 class="text-2xl font-bold">
                {{ user.username }}
              </h1>
              <p class="text-stone-500 text-sm">
                用戶自 {{ formatDate(user.created) }} 加入
              </p>
            </div>
          </div>
            
          <div
            v-if="!isCurrentUser"
            class="pt-4"
          >
            <button
              v-if="friendStatus === 'none'"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              :disabled="actionLoading"
              @click="sendFriendRequest"
            >
              加為好友
            </button>
            <button
              v-else-if="friendStatus === 'pending'"
              class="bg-stone-100 text-stone-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed"
              disabled
            >
              請求已發送
            </button>
            <button
              v-else-if="friendStatus === 'accepted'"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              disabled
            >
              已是好友
            </button>
          </div>
        </div>
          
        <!-- 標籤頁 -->
        <div class="mt-8 border-b">
          <div class="flex space-x-6">
            <button 
              :class="[
                'pb-3 font-medium transition border-b-2',
                activeTab === 'favorites' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              ]"
              @click="activeTab = 'favorites'"
            >
              收藏的番劇
            </button>
            <button 
              :class="[
                'pb-3 font-medium transition border-b-2',
                activeTab === 'comments' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              ]"
              @click="activeTab = 'comments'"
            >
              評論
            </button>
          </div>
        </div>
          
        <!-- 收藏的番劇 -->
        <div
          v-if="activeTab === 'favorites'"
          class="mt-6"
        >
          <div
            v-if="userFavorites.length"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            <RouterLink
              v-for="anime in userFavorites"
              :key="anime.id"
              :to="`/bangumi/${anime.id}`"
              class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div class="aspect-[3/4] relative">
                <img 
                  :src="anime.image" 
                  :alt="anime.title"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="p-2">
                <h3 class="font-medium text-sm line-clamp-1 group-hover:text-blue-600 transition">
                  {{ anime.title }}
                </h3>
                <div class="flex items-center text-xs text-stone-500 mt-1">
                  <span class="text-amber-500">★</span>
                  <span class="ml-1">{{ anime.rating }}</span>
                </div>
              </div>
            </RouterLink>
          </div>
            
          <div
            v-else
            class="text-center py-8 text-stone-500"
          >
            該用戶還沒有收藏番劇
          </div>
        </div>
          
        <!-- 評論 -->
        <div
          v-if="activeTab === 'comments'"
          class="mt-6"
        >
          <div
            v-if="userComments.length"
            class="space-y-4"
          >
            <div
              v-for="comment in userComments"
              :key="comment.id"
              class="border rounded-lg p-4"
            >
              <RouterLink
                :to="`/bangumi/${comment.targetId}`"
                class="font-medium hover:text-blue-600"
              >
                {{ comment.targetTitle }}
              </RouterLink>
              <p class="mt-2 text-stone-700">
                {{ comment.content }}
              </p>
              <div class="mt-2 text-xs text-stone-500">
                {{ formatDate(comment.created) }}
              </div>
            </div>
          </div>
            
          <div
            v-else
            class="text-center py-8 text-stone-500"
          >
            該用戶還沒有發表評論
          </div>
        </div>
      </div>
    </div>
  
    <div
      v-else
      class="text-center py-16 bg-white rounded-lg shadow-sm"
    >
      <div class="text-stone-400 text-4xl mb-3">
        👤
      </div>
      <h3 class="text-xl font-medium mb-2">
        找不到此用戶
      </h3>
      <p class="text-stone-500">
        該用戶可能不存在或已被刪除
      </p>
      <RouterLink
        to="/"
        class="mt-4 inline-block text-blue-600 hover:text-blue-800"
      >
        返回首頁
      </RouterLink>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/useAuthStore'
  import axios from 'axios'
  import { Bangumi } from '@/types/anime'
  
  interface User {
    id: number;
    username: string;
    email: string;
    created: string;
  }
  
  interface UserComment {
    id: number;
    targetId: number;
    targetTitle: string;
    content: string;
    created: string;
  }
  
  const route = useRoute()
  const authStore = useAuthStore()
  const userId = Number(route.params.id)
  
  const user = ref<User | null>(null)
  const userFavorites = ref<Bangumi[]>([])
  const userComments = ref<UserComment[]>([])
  const loading = ref(true)
  const actionLoading = ref(false)
  const activeTab = ref('favorites')
  const friendStatus = ref<'none' | 'pending' | 'accepted'>('none')
  
  const isCurrentUser = computed(() => {
    return authStore.currentUser?.id === userId
  })
  
  onMounted(async () => {
    loading.value = true
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchUserFavorites(),
        fetchUserComments(),
        checkFriendshipStatus(),
      ])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      loading.value = false
    }
  })
  
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/User/${userId}`)
      user.value = response.data
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }
  
  const fetchUserFavorites = async () => {
    try {
      const response = await axios.get(`/api/User/${userId}/favorites`)
      userFavorites.value = response.data
    } catch (error) {
      console.error('Failed to fetch user favorites:', error)
    }
  }
  
  const fetchUserComments = async () => {
    try {
      const response = await axios.get(`/api/User/${userId}/comments`)
      userComments.value = response.data
    } catch (error) {
      console.error('Failed to fetch user comments:', error)
    }
  }
  
  const checkFriendshipStatus = async () => {
    if (!authStore.isLoggedIn || isCurrentUser.value) return
    
    try {
      const response = await axios.get(`/api/Friendship/status/${userId}`)
      friendStatus.value = response.data.status
    } catch (error) {
      console.error('Failed to check friendship status:', error)
    }
  }
  
  const sendFriendRequest = async () => {
    if (!authStore.isLoggedIn) return
    
    actionLoading.value = true
    try {
      await axios.post('/api/Friendship', { addresseeId: userId })
      friendStatus.value = 'pending'
    } catch (error) {
      console.error('Failed to send friend request:', error)
      alert('發送好友請求失敗')
    } finally {
      actionLoading.value = false
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  </script>