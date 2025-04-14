<!-- src/pages/Friends.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6">
      👥 好友列表
    </h1>
  
    <!-- 好友請求表單 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">
        新增好友
      </h2>
      <div class="flex">
        <input
          v-model="searchUsername"
          type="text"
          placeholder="輸入用戶名搜索"
          class="flex-1 border rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        >
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
          :disabled="loading"
          @click="searchUser"
        >
          搜索
        </button>
      </div>
  
      <!-- 搜索結果 -->
      <div
        v-if="searchResults.length"
        class="mt-4"
      >
        <div
          v-for="user in searchResults"
          :key="user.id"
          class="border rounded-lg p-3 flex justify-between items-center"
        >
          <div>
            <span class="font-medium">{{ user.username }}</span>
          </div>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg"
            :disabled="loading"
            @click="sendFriendRequest(user.id)"
          >
            發送請求
          </button>
        </div>
      </div>
    </div>
  
    <!-- 好友請求 -->
    <div
      v-if="pendingRequests.length"
      class="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <h2 class="text-lg font-semibold mb-4">
        好友請求
      </h2>
      <div class="space-y-3">
        <div
          v-for="request in pendingRequests"
          :key="request.id"
          class="border rounded-lg p-3 flex justify-between items-center"
        >
          <div>
            <span class="font-medium">{{ request.username }}</span>
            <span class="ml-2 text-sm text-stone-500">{{ formatDate(request.createdAt) }}</span>
          </div>
          <div class="flex space-x-2">
            <button
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded-lg"
              :disabled="loading"
              @click="acceptRequest(request.id)"
            >
              接受
            </button>
            <button
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-lg"
              :disabled="loading"
              @click="rejectRequest(request.id)"
            >
              拒絕
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 好友列表 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">
        我的好友
      </h2>
        
      <div
        v-if="loading"
        class="text-center py-8"
      >
        <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        <p class="mt-2 text-stone-500">
          載入中...
        </p>
      </div>
        
      <div
        v-else-if="friends.length"
        class="space-y-3"
      >
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="border rounded-lg p-3 flex justify-between items-center"
        >
          <div>
            <span class="font-medium">{{ friend.username }}</span>
            <span class="ml-2 text-sm text-stone-500">{{ formatDate(friend.createdAt) }}</span>
          </div>
          <div class="flex space-x-2">
            <RouterLink
              :to="`/user/${friend.userId}`"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg"
            >
              查看主頁
            </RouterLink>
            <button
              class="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1 text-sm rounded-lg"
              :disabled="loading"
              @click="removeFriend(friend.id)"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
        
      <div
        v-else
        class="text-center py-8 text-stone-500"
      >
        暫無好友，搜索用戶並發送好友請求吧！
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  interface Friend {
    id: number;
    userId: number;
    username: string;
    status: string;
    createdAt: string;
  }
  
  interface User {
    id: number;
    username: string;
    email: string;
  }
  
  const friends = ref<Friend[]>([])
  const pendingRequests = ref<Friend[]>([])
  const searchUsername = ref('')
  const searchResults = ref<User[]>([])
  const loading = ref(false)
  
  onMounted(async () => {
    loading.value = true
    try {
      await Promise.all([
        fetchFriends(),
        fetchPendingRequests(),
      ])
    } catch (error) {
      console.error('Failed to fetch friends data:', error)
    } finally {
      loading.value = false
    }
  })
  
  const fetchFriends = async () => {
    const response = await axios.get('/api/Friendship')
    friends.value = response.data
  }
  
  const fetchPendingRequests = async () => {
    const response = await axios.get('/api/Friendship/Requests')
    pendingRequests.value = response.data
  }
  
  const searchUser = async () => {
    if (!searchUsername.value.trim()) return
    
    loading.value = true
    try {
      const response = await axios.get(`/api/User/search?username=${searchUsername.value}`)
      searchResults.value = response.data
    } catch (error) {
      console.error('Failed to search user:', error)
    } finally {
      loading.value = false
    }
  }
  
  const sendFriendRequest = async (userId: number) => {
    loading.value = true
    try {
      await axios.post('/api/Friendship', { addresseeId: userId })
      // 清空搜索結果
      searchResults.value = []
      searchUsername.value = ''
      alert('好友請求已發送')
    } catch (error) {
      console.error('Failed to send friend request:', error)
      alert('發送好友請求失敗')
    } finally {
      loading.value = false
    }
  }
  
  const acceptRequest = async (requestId: number) => {
    loading.value = true
    try {
      await axios.put(`/api/Friendship/${requestId}/accept`)
      await Promise.all([
        fetchFriends(),
        fetchPendingRequests(),
      ])
    } catch (error) {
      console.error('Failed to accept friend request:', error)
    } finally {
      loading.value = false
    }
  }
  
  const rejectRequest = async (requestId: number) => {
    loading.value = true
    try {
      await axios.put(`/api/Friendship/${requestId}/reject`)
      await fetchPendingRequests()
    } catch (error) {
      console.error('Failed to reject friend request:', error)
    } finally {
      loading.value = false
    }
  }
  
  const removeFriend = async (friendshipId: number) => {
    if (!confirm('確定要刪除此好友嗎？')) return
    
    loading.value = true
    try {
      await axios.delete(`/api/Friendship/${friendshipId}`)
      await fetchFriends()
    } catch (error) {
      console.error('Failed to remove friend:', error)
    } finally {
      loading.value = false
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