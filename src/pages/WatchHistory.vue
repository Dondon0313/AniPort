<!-- src/pages/WatchHistory.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6">
      📺 觀看歷史
    </h1>
  
    <div class="mb-6 flex justify-between items-center">
      <div>
        <span
          v-if="history.length"
          class="text-stone-500"
        >
          共 {{ history.length }} 條記錄
        </span>
      </div>
      <button 
        v-if="history.length"
        class="text-red-600 hover:text-red-800 text-sm"
        @click="clearAllHistory"
      >
        清空歷史記錄
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
      v-else-if="history.length"
      class="space-y-4"
    >
      <div
        v-for="item in history"
        :key="item.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition"
      >
        <RouterLink
          :to="`/watch?id=${item.bangumiId}&episode=${item.episodeId}`"
          class="block p-4"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-stone-200 rounded-md flex items-center justify-center">
                <span class="text-stone-400 text-xl">{{ item.episodeNumber }}</span>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="font-semibold text-lg">
                {{ item.bangumiTitle }}
              </h3>
              <p class="text-stone-500">
                第{{ item.episodeNumber }}集: {{ item.episodeTitle }}
              </p>
              <div class="mt-2 flex items-center text-xs text-stone-400">
                <span>上次觀看: {{ formatDate(item.lastWatched) }}</span>
                <span class="mx-2">|</span>
                <span>進度: {{ item.progress }}%</span>
              </div>
            </div>
            <div class="hidden sm:block">
              <div class="w-32 bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  class="bg-blue-600 h-full"
                  :style="{ width: `${item.progress}%` }"
                />
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  
    <div
      v-else
      class="text-center py-16"
    >
      <div class="text-stone-400 text-4xl mb-3">
        📺
      </div>
      <h3 class="text-xl font-medium mb-2">
        暫無觀看記錄
      </h3>
      <p class="text-stone-500">
        開始觀看番劇後，這裡會記錄您的觀看歷史
      </p>
      <RouterLink
        to="/bangumi"
        class="mt-4 inline-block text-blue-600 hover:text-blue-800"
      >
        瀏覽番劇
      </RouterLink>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  interface WatchHistoryItem {
    id: number;
    episodeId: number;
    bangumiId: number;
    episodeNumber: number;
    episodeTitle: string;
    bangumiTitle: string;
    progress: number;
    lastWatched: string;
  }
  
  const history = ref<WatchHistoryItem[]>([])
  const loading = ref(true)
  
  onMounted(async () => {
    try {
      await fetchHistory()
    } catch (error) {
      console.error('Failed to fetch watch history:', error)
    } finally {
      loading.value = false
    }
  })
  
  const fetchHistory = async () => {
    const response = await axios.get('/api/WatchHistory')
    history.value = response.data
  }
  
  const clearAllHistory = async () => {
    if (!confirm('確定要清空所有觀看記錄嗎？此操作無法撤銷。')) {
      return
    }
    
    try {
      loading.value = true
      await axios.delete('/api/WatchHistory/ClearAll')
      history.value = []
    } catch (error) {
      console.error('Failed to clear watch history:', error)
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
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  </script>