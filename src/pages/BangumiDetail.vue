<template>
  <div
    v-if="bangumi"
    class="max-w-6xl mx-auto px-4 py-10"
  >
    <!-- 顯示收藏按鈕的番劇橫幅 -->
    <div class="relative mb-8">
      <div class="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl" />
      <div class="absolute inset-0 flex items-center px-8">
        <div class="flex items-center">
          <img
            :src="bangumi.image"
            :alt="bangumi.title"
            class="w-36 h-36 object-cover rounded-lg border-4 border-white shadow-lg"
          >
          <div class="ml-6">
            <h1 class="text-4xl font-bold text-white mb-2">
              {{ bangumi.title }}
            </h1>
            <div class="flex items-center space-x-3 text-white">
              <span>{{ bangumi.airDate }}</span>
              <span>|</span>
              <span>{{ bangumi.weekDay }}</span>
            </div>
            <div class="flex space-x-3 mt-4">
              <button 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                @click="watchEpisode(1)"
              >
                開始觀看
              </button>
              <button 
                :class="[
                  'px-4 py-2 rounded-lg flex items-center transition',
                  isFavorite 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-white text-stone-800 hover:bg-stone-100'
                ]"
                @click="toggleFavorite"
              >
                <span>{{ isFavorite ? '已收藏' : '加入收藏' }}</span>
                <span class="ml-2">{{ isFavorite ? '❤️' : '🤍' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 標籤頁選單 -->
    <div class="border-b mb-6">
      <div class="flex space-x-8">
        <button 
          :class="[
            'pb-3 font-medium transition border-b-2',
            activeTab === 'information' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          ]"
          @click="activeTab = 'information'"
        >
          作品介紹
        </button>
        <button 
          :class="[
            'pb-3 font-medium transition border-b-2',
            activeTab === 'episodes' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          ]"
          @click="activeTab = 'episodes'"
        >
          劇集列表
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
          評論討論
        </button>
      </div>
    </div>

    <!-- 內容區域 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 主要內容 -->
      <div class="md:col-span-2">
        <!-- 作品介紹區塊 -->
        <div
          v-if="activeTab === 'information'"
          class="space-y-6"
        >
          <div>
            <h2 class="text-xl font-bold mb-3">
              故事介紹
            </h2>
            <p class="text-stone-700 leading-relaxed">
              {{ bangumi.description }}
            </p>
          </div>
          
          <div>
            <h2 class="text-xl font-bold mb-3">
              製作人員
            </h2>
            <div class="grid grid-cols-2 gap-y-2">
              <div class="text-stone-600">
                原作
              </div>
              <div>範例工作室</div>
              <div class="text-stone-600">
                導演
              </div>
              <div>島田一郎</div>
              <div class="text-stone-600">
                腳本
              </div>
              <div>田中美穗</div>
              <div class="text-stone-600">
                人物設定
              </div>
              <div>佐藤健太</div>
              <div class="text-stone-600">
                音樂
              </div>
              <div>山本直樹</div>
            </div>
          </div>
          
          <div>
            <h2 class="text-xl font-bold mb-3">
              聲優陣容
            </h2>
            <div class="grid grid-cols-2 gap-y-2">
              <div class="text-stone-600">
                主角
              </div>
              <div>花澤香菜</div>
              <div class="text-stone-600">
                女主角
              </div>
              <div>早見沙織</div>
              <div class="text-stone-600">
                配角 A
              </div>
              <div>內山昂輝</div>
              <div class="text-stone-600">
                配角 B
              </div>
              <div>小野賢章</div>
            </div>
          </div>
        </div>
        
        <!-- 劇集列表區塊 -->
        <div v-if="activeTab === 'episodes'">
          <h2 class="text-xl font-bold mb-4">
            全部劇集
          </h2>
          <div class="space-y-3">
            <div 
              v-for="episode in episodes" 
              :key="episode.id"
              class="flex items-center border rounded-lg p-3 hover:bg-stone-50 transition cursor-pointer"
              @click="watchEpisode(episode.id)"
            >
              <div class="w-16 aspect-video bg-stone-200 rounded flex items-center justify-center text-stone-400">
                {{ episode.number }}
              </div>
              <div class="ml-3 flex-1">
                <div class="font-medium">
                  第{{ episode.number }}集：{{ episode.title }}
                </div>
                <div class="text-sm text-stone-500 flex items-center mt-1">
                  <span>{{ episode.airDate }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ episode.duration }}</span>
                </div>
              </div>
              <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm">
                觀看
              </button>
            </div>
          </div>
        </div>
        
        <!-- 評論討論區塊 -->
        <div v-if="activeTab === 'comments'">
          <h2 class="text-xl font-bold mb-4">
            用戶評論
          </h2>
          
          <div class="mb-6">
            <textarea 
              v-model="commentContent"
              class="w-full rounded-lg border p-3 h-24 focus:ring-2 focus:ring-blue-400" 
              placeholder="分享你對這部作品的看法..."
            />
            <div class="flex justify-between items-center mt-2">
              <div class="text-stone-500 text-sm">
                評分：
                <div class="inline-flex">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="cursor-pointer"
                    :class="i <= rating ? 'text-amber-500' : 'text-stone-300'"
                    @click="rating = i"
                  >★</span>
                </div>
              </div>
              <button 
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                :disabled="!commentContent.trim() || submitting"
                @click="submitComment"
              >
                {{ submitting ? '發送中...' : '發送評論' }}
              </button>
            </div>
          </div>
          
          <div
            v-if="loading"
            class="text-center py-6"
          >
            <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            <p class="mt-2 text-stone-500">
              載入評論中...
            </p>
          </div>
          
          <div
            v-else-if="comments.length === 0"
            class="text-center py-8 text-stone-500"
          >
            暫無評論，成為第一個評論的人吧！
          </div>
          
          <div
            v-else
            class="space-y-4"
          >
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="border-b last:border-b-0 pb-4"
            >
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0 flex items-center justify-center text-stone-400">
                  👤
                </div>
                <div class="ml-3 flex-1">
                  <div class="flex items-center">
                    <span class="font-medium">{{ comment.username }}</span>
                    <span class="ml-3 text-xs text-stone-500">{{ formatDate(comment.created) }}</span>
                    <span
                      v-if="comment.rating"
                      class="ml-3 text-amber-500"
                    >
                      <span
                        v-for="i in 5"
                        :key="i"
                      >{{ i <= comment.rating ? '★' : '☆' }}</span>
                    </span>
                  </div>
                  <p class="mt-1 text-stone-800">
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 側邊欄 -->
      <div class="space-y-6">
        <!-- 製作信息卡片 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border">
          <h3 class="font-medium mb-3">
            作品信息
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-stone-500">類型</span>
              <span>{{ bangumi.genres.join('、') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">首播</span>
              <span>{{ bangumi.airDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">播出日</span>
              <span>{{ bangumi.weekDay }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">集數</span>
              <span>{{ bangumi.totalEpisodes }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">評分</span>
              <span class="text-amber-500">
                <span
                  v-for="i in 5"
                  :key="i"
                >{{ i <= Math.round(bangumi.rating / 2) ? '★' : '☆' }}</span>
                {{ bangumi.rating }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 相關推薦 -->
        <div>
          <h3 class="font-medium mb-3">
            相關推薦
          </h3>
          <div class="space-y-3">
            <RouterLink
              v-for="item in recommendations" 
              :key="item.id"
              :to="`/bangumi/${item.id}`"
              class="flex items-center p-2 rounded-lg hover:bg-stone-50 transition"
            >
              <img 
                :src="item.image" 
                :alt="item.title"
                class="w-16 h-16 object-cover rounded"
              >
              <div class="ml-3">
                <div class="font-medium line-clamp-1">
                  {{ item.title }}
                </div>
                <div class="text-xs text-stone-500 mt-1">
                  {{ item.airDate }}
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="text-center py-10 text-stone-400 text-sm"
  >
    無此番劇資訊
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useBangumiStore } from '@/stores/useBangumiStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const store = useBangumiStore()
const authStore = useAuthStore()
const bangumiId = Number(route.params.id)

const bangumi = computed(() => store.bangumiList.find(b => b.id === bangumiId))

// 標籤頁控制
const activeTab = ref('information')

// 假設的劇集列表
const episodes = ref([
  { id: 1, number: 1, title: '第一集', airDate: '2025-04-05', duration: '24:30' },
  { id: 2, number: 2, title: '第二集', airDate: '2025-04-12', duration: '24:15' },
  { id: 3, number: 3, title: '第三集', airDate: '2025-04-19', duration: '24:45' },
  { id: 4, number: 4, title: '第四集', airDate: '2025-04-26', duration: '24:30' },
])

// 相關推薦
const recommendations = computed(() => 
  store.bangumiList.filter(item => item.id !== bangumiId).slice(0, 3),
)

// 收藏控制
const toggleFavorite = () => {
  if (bangumi.value) {
    store.toggleFavorite(bangumi.value.id)
  }
}

const isFavorite = computed(() => {
  if (bangumi.value) {
    return store.isFavorite(bangumi.value.id)
  }
  return false
})

// 開始觀看
const watchEpisode = (episodeId: number) => {
  router.push({
    path: '/watch',
    query: { id: bangumiId, episode: episodeId },
  })
}

// 評論相關功能
const commentContent = ref('')
const rating = ref(5)
const submitting = ref(false)
const comments = ref([])
const loading = ref(false)

// 提交評論
const submitComment = async () => {
  if (!authStore.isLoggedIn) {
    alert('請先登入')
    router.push('/login')
    return
  }

  if (!commentContent.value.trim()) {
    return
  }
  
  submitting.value = true
  try {
    await axios.post('/api/Comment', {
      targetId: bangumiId,
      targetType: 'bangumi',
      content: commentContent.value,
    })
    
    // 評論成功，刷新評論列表
    commentContent.value = ''
    rating.value = 5
    fetchComments()
    
  } catch (error) {
    console.error('Failed to submit comment:', error)
    alert('評論發送失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}

// 獲取評論
const fetchComments = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/Comment/Bangumi/${bangumiId}`)
    comments.value = response.data
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
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

onMounted(async () => {
  // 嘗試從 API 獲取劇集列表
  try {
    const episodesData = await store.fetchEpisodesByBangumiId(bangumiId)
    if (episodesData && episodesData.length > 0) {
      episodes.value = episodesData
    }
  } catch (error) {
    console.error('Failed to fetch episodes:', error)
  }
  
  // 載入評論
  fetchComments()
})
</script>