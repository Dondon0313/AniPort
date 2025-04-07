<template>
  <div>
    <!-- 主橫幅輪播 -->
    <div class="relative overflow-hidden mb-8">
      <!-- 輪播指示器 -->
      <div class="absolute bottom-3 left-0 right-0 z-10 flex justify-center space-x-2">
        <button 
          v-for="(_, index) in featuredAnime" 
          :key="index"
          :class="[
            'w-2 h-2 rounded-full transition',
            currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-40'
          ]"
          @click="currentSlide = index"
        />
      </div>
      
      <!-- 左右按鈕 -->
      <button 
        class="absolute top-1/2 left-4 z-10 text-white text-2xl bg-black bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center transform -translate-y-1/2 hover:bg-opacity-50"
        @click="prevSlide"
      >
        ◀
      </button>
      <button 
        class="absolute top-1/2 right-4 z-10 text-white text-2xl bg-black bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center transform -translate-y-1/2 hover:bg-opacity-50"
        @click="nextSlide"
      >
        ▶
      </button>
      
      <!-- 輪播容器 -->
      <div 
        class="flex transition-transform duration-500 ease-in-out h-96 sm:h-80 md:h-96 lg:h-[28rem]"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="anime in featuredAnime" 
          :key="anime.id"
          class="relative w-full flex-shrink-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${anime.image})` }"
        >
          <!-- 漸變覆蓋 -->
          <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
          
          <!-- 內容 -->
          <div class="absolute bottom-0 left-0 w-full p-6 text-white">
            <div class="max-w-4xl mx-auto">
              <h2 class="text-3xl sm:text-4xl font-bold mb-2">
                {{ anime.title }}
              </h2>
              <p class="text-sm sm:text-base mb-4 line-clamp-2">
                {{ anime.description }}
              </p>
              <div class="flex items-center space-x-3 mb-4">
                <div class="bg-blue-500 px-2 py-1 rounded text-xs">
                  {{ anime.status === 'ongoing' ? '連載中' : anime.status === 'upcoming' ? '即將播出' : '已完結' }}
                </div>
                <div class="text-amber-400 flex items-center text-sm">
                  ⭐ {{ anime.rating }}
                </div>
                <div class="text-sm">
                  {{ anime.genres.join(' / ') }}
                </div>
              </div>
              <div class="flex space-x-2">
                <RouterLink 
                  :to="`/bangumi/${anime.id}`" 
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                >
                  查看詳情
                </RouterLink>
                <RouterLink 
                  :to="`/watch?id=${anime.id}`"
                  class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition text-sm"
                >
                  立即觀看
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 內容區塊 -->
    <div class="container mx-auto px-4">
      <!-- 最近更新 -->
      <section class="mb-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">
            最近更新
          </h2>
          <RouterLink
            to="/bangumi"
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            查看全部 →
          </RouterLink>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="episode in recentEpisodes" 
            :key="episode.id"
            class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
          >
            <RouterLink :to="`/watch?id=${episode.bangumiId}&episode=${episode.id}`">
              <div class="relative">
                <div class="aspect-video bg-stone-200" />
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {{ episode.duration }}
                </div>
              </div>
              <div class="p-3">
                <div class="font-medium line-clamp-1">
                  {{ getBangumiTitle(episode.bangumiId) }}
                </div>
                <div class="text-sm text-stone-500 mt-1">
                  第{{ episode.number }}集：{{ episode.title }}
                </div>
                <div class="text-xs text-stone-400 mt-1">
                  {{ episode.airDate }}
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>
      
      <!-- 本季新番推薦 -->
      <section class="mb-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">
            本季新番
          </h2>
          <RouterLink
            to="/bangumi"
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            查看全部 →
          </RouterLink>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <RouterLink
            v-for="anime in seasonalAnime" 
            :key="anime.id"
            :to="`/bangumi/${anime.id}`"
            class="group"
          >
            <div class="bg-white rounded-lg shadow overflow-hidden transition group-hover:shadow-md">
              <div class="aspect-[3/4] relative">
                <img 
                  :src="anime.image" 
                  :alt="anime.title"
                  class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition" />
              </div>
              <div class="p-3">
                <div class="font-medium line-clamp-1 group-hover:text-blue-600 transition">
                  {{ anime.title }}
                </div>
                <div class="flex items-center text-xs text-stone-500 mt-1">
                  <span class="text-amber-500">★</span>
                  <span class="ml-1">{{ anime.rating }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ anime.weekDay }}</span>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </section>
      
      <!-- 熱門排行榜 -->
      <section class="mb-10">
        <h2 class="text-2xl font-bold mb-4">
          人氣排行榜
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 左側：熱門番劇 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">
              熱門番劇 TOP 5
            </h3>
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div 
                v-for="(anime, index) in popularAnime" 
                :key="anime.id"
                class="flex items-center p-3 hover:bg-stone-50 transition border-b last:border-b-0"
              >
                <div class="font-bold text-xl text-stone-400 w-8">
                  {{ index + 1 }}
                </div>
                <img 
                  :src="anime.image" 
                  :alt="anime.title" 
                  class="w-12 h-12 object-cover rounded"
                >
                <div class="ml-3 flex-1 truncate">
                  <RouterLink 
                    :to="`/bangumi/${anime.id}`"
                    class="font-medium hover:text-blue-600 transition"
                  >
                    {{ anime.title }}
                  </RouterLink>
                  <div class="text-xs text-stone-500 flex items-center mt-1">
                    <span class="text-amber-500">★</span>
                    <span class="ml-1">{{ anime.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右側：熱門劇集 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">
              熱門劇集 TOP 5
            </h3>
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <RouterLink 
                v-for="(episode, index) in popularEpisodes" 
                :key="episode.id"
                :to="`/watch?id=${episode.bangumiId}&episode=${episode.id}`"
                class="flex items-center p-3 hover:bg-stone-50 transition border-b last:border-b-0"
              >
                <div class="font-bold text-xl text-stone-400 w-8">
                  {{ index + 1 }}
                </div>
                <div class="w-16 aspect-video bg-stone-200 rounded flex-shrink-0" />
                <div class="ml-3 flex-1">
                  <div class="font-medium line-clamp-1">
                    {{ getBangumiTitle(episode.bangumiId) }}
                  </div>
                  <div class="text-xs text-stone-500 mt-1">
                    第{{ episode.number }}集 • {{ episode.views.toLocaleString() }} 次觀看
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 繼續觀看 (登錄用戶) -->
      <section
        v-if="recentlyWatched.length"
        class="mb-10"
      >
        <h2 class="text-2xl font-bold mb-4">
          繼續觀看
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="anime in recentlyWatched" 
            :key="anime.id"
            class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
          >
            <RouterLink :to="`/watch?id=${anime.id}`">
              <div class="relative">
                <img 
                  :src="anime.image" 
                  :alt="anime.title"
                  class="w-full aspect-video object-cover"
                >
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-stone-200">
                  <div
                    class="h-full bg-blue-500"
                    style="width: 45%"
                  />
                </div>
              </div>
              <div class="p-3">
                <div class="font-medium line-clamp-1">
                  {{ anime.title }}
                </div>
                <div class="text-xs text-stone-500 mt-1">
                  繼續觀看
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>
      
      <!-- 通知訂閱 -->
      <section class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-10 text-white">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl font-bold mb-3">
            獲取最新番劇更新通知
          </h2>
          <p class="mb-6 opacity-90">
            訂閱我們的通知，第一時間獲取新番更新和熱門推薦
          </p>
          <div class="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="輸入您的郵箱..." 
              class="flex-1 py-2 px-4 rounded-l-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-white"
            >
            <button class="bg-white text-blue-600 font-medium py-2 px-4 rounded-r-lg hover:bg-stone-100 transition">
              訂閱
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBangumiStore } from '@/stores/useBangumiStore'

const store = useBangumiStore()

// 輪播控制
const currentSlide = ref(0)
const slideInterval = ref<number | null>(null)
const autoplayEnabled = ref(true)

// 自動輪播
const startAutoplay = () => {
  if (autoplayEnabled.value) {
    slideInterval.value = window.setInterval(() => {
      nextSlide()
    }, 5000)
  }
}

const stopAutoplay = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % featuredAnime.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + featuredAnime.value.length) % featuredAnime.value.length
}


onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})

// 特色番劇（輪播用）
const featuredAnime = computed(() => {
  return store.bangumiList.slice(0, 4)
})

// 本季新番
const seasonalAnime = computed(() => {
  return store.bangumiList.filter(anime => 
    anime.status === 'ongoing' || anime.status === 'upcoming',
  ).slice(0, 10)
})

// 獲取最近更新的劇集
const recentEpisodes = computed(() => {
  return store.recentEpisodes
})

// 熱門番劇（按評分排序）
const popularAnime = computed(() => {
  return [...store.bangumiList]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
})

// 熱門劇集（按觀看次數排序）
const popularEpisodes = computed(() => {
  return [...store.episodes]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})

// 最近觀看（登錄用戶）
const recentlyWatched = computed(() => {
  return store.recentlyWatched
})

// 從 bangumiId 獲取番劇標題
const getBangumiTitle = (bangumiId: number) => {
  const bangumi = store.bangumiList.find(b => b.id === bangumiId)
  return bangumi ? bangumi.title : '未知番劇'
}
</script>