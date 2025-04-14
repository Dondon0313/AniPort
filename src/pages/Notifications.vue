<!-- src/pages/Notifications.vue  -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">
        🔔 我的通知
      </h1>
        
      <button
        v-if="notifications.length"
        class="text-blue-600 hover:text-blue-800 text-sm"
        :disabled="loading"
        @click="markAllAsRead"
      >
        全部標記為已讀
      </button>
    </div>
  
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
      v-else-if="notifications.length"
      class="space-y-3"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'border rounded-lg p-4 transition',
          notification.isRead ? 'bg-white' : 'bg-blue-50'
        ]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-1">
            <span class="text-xl">
              {{ getNotificationIcon(notification.type) }}
            </span>
          </div>
          <div class="ml-3 flex-1">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium">
                  {{ getNotificationTitle(notification.type) }}
                </div>
                <p class="text-stone-600 mt-1">
                  {{ notification.message }}
                </p>
              </div>
              <div class="text-xs text-stone-500">
                {{ formatDate(notification.createdAt) }}
              </div>
            </div>
              
            <div class="mt-3 flex justify-between items-center">
              <div>
                <button
                  v-if="notification.relatedId && getActionLink(notification)"
                  class="text-sm text-blue-600 hover:text-blue-800"
                  @click="navigateTo(getActionLink(notification))"
                >
                  {{ getActionText(notification.type) }}
                </button>
              </div>
                
              <button
                v-if="!notification.isRead"
                class="text-xs text-stone-500 hover:text-stone-700"
                @click="markAsRead(notification.id)"
              >
                標記為已讀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div
      v-else
      class="text-center py-16 bg-white rounded-lg shadow-sm"
    >
      <div class="text-stone-400 text-4xl mb-3">
        🔔
      </div>
      <h3 class="text-xl font-medium mb-2">
        暫無通知
      </h3>
      <p class="text-stone-500">
        當您收到系統通知或好友動態時，將會顯示在這裡
      </p>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  interface Notification {
    id: number;
    type: string;
    message: string;
    relatedId: number | null;
    isRead: boolean;
    createdAt: string;
  }
  
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const router = useRouter()
  
  onMounted(async () => {
    loading.value = true
    try {
      await fetchNotifications()
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      loading.value = false
    }
  })
  
  const fetchNotifications = async () => {
    const response = await axios.get('/api/Notification')
    notifications.value = response.data
  }
  
  const markAsRead = async (id: number) => {
    try {
      await axios.put(`/api/Notification/${id}/read`)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.isRead = true
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
  
  const markAllAsRead = async () => {
    loading.value = true
    try {
      await axios.put('/api/Notification/read-all')
      notifications.value.forEach(notification => {
        notification.isRead = true
      })
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    } finally {
      loading.value = false
    }
  }
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return '👥'
      case 'episode_update':
        return '📺'
      case 'comment_reply':
        return '💬'
      case 'system':
        return '🔔'
      default:
        return '📩'
    }
  }
  
  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'friend_request':
        return '好友請求'
      case 'episode_update':
        return '番劇更新'
      case 'comment_reply':
        return '評論回覆'
      case 'system':
        return '系統通知'
      default:
        return '通知'
    }
  }
  
  const getActionText = (type: string) => {
    switch (type) {
      case 'friend_request':
        return '查看請求'
      case 'episode_update':
        return '立即觀看'
      case 'comment_reply':
        return '查看評論'
      default:
        return '查看詳情'
    }
  }
  
  const getActionLink = (notification: Notification) => {
    if (!notification.relatedId) return null
    
    switch (notification.type) {
      case 'friend_request':
        return '/friends'
      case 'episode_update':
        return `/watch?id=${notification.relatedId}`
      case 'comment_reply':
        // 假設這是番劇評論
        return `/bangumi/${notification.relatedId}`
      default:
        return null
    }
  }
  
  const navigateTo = (path: string | null) => {
    if (path) {
      router.push(path)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  </script>