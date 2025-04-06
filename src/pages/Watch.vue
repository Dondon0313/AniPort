<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div v-if="currentEpisode" class="mb-8">
      <!-- 影片播放區域 -->
      <div class="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
        <div class="text-white text-center p-8">
          <div class="text-3xl mb-4">{{ currentBangumi?.title }} - 第{{ currentEpisode.number }}集</div>
          <div class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg inline-block cursor-pointer">
            點擊播放視頻
          </div>
        </div>
      </div>
      
      <!-- 影片資訊 -->
      <h1 class="text-2xl font-bold mb-2">{{ currentEpisode.title }}</h1>
      <div class="flex items-center text-stone-500 text-sm mb-4">
        <span>播出時間: {{ currentEpisode.airDate }}</span>
        <span class="mx-3">•</span>
        <span>觀看次數: {{ currentEpisode.views.toLocaleString() }}</span>
      </div>
      <p class="text-stone-700">{{ currentEpisode.description }}</p>
      
      <!-- 留言區 -->
      <div class="mt-8 border-t pt-6">
        <h2 class="text-xl font-bold mb-4">留言區 ({{ comments.length }})</h2>
        <div class="mb-6">
          <textarea 
            class="w-full rounded-lg border p-3 h-24 focus:ring-2 focus:ring-blue-400" 
            placeholder="請輸入您的留言..."
          ></textarea>
          <button class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
            發送留言
          </button>
        </div>
        
        <div class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="border-b last:border-b-0 pb-4">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0"></div>
              <div class="ml-3 flex-1">
                <div class="flex items-center">
                  <span class="font-medium">{{ comment.username }}</span>
                  <span class="ml-3 text-xs text-stone-500">{{ comment.date }}</span>
                </div>
                <p class="mt-1 text-stone-800">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 劇集列表 -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">劇集列表</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div 
          v-for="episode in episodes" 
          :key="episode.id"
          @click="currentEpisode = episode"
          :class="[
            'cursor-pointer border rounded-lg overflow-hidden transition hover:shadow-md',
            episode.id === currentEpisode?.id ? 'ring-2 ring-blue-500' : ''
          ]"
        >
          <div class="aspect-video bg-stone-100 relative">
            <span class="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
              {{ episode.duration }}
            </span>
          </div>
          <div class="p-2">
            <div class="text-sm font-medium truncate">第{{ episode.number }}集</div>
            <div class="text-xs text-stone-500">{{ episode.airDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBangumiStore } from '@/stores/useBangumiStore'

const route = useRoute()
const store = useBangumiStore()
const bangumiId = Number(route.query.id) || 1

const currentBangumi = computed(() => store.bangumiList.find(b => b.id === bangumiId))

// 假設的劇集數據
const episodes = ref([
  { 
    id: 1, 
    number: 1, 
    title: '重新開始的旅程',
    airDate: '2025-04-05',
    views: 15420,
    duration: '24:30',
    description: '主角踏上了尋找自我的旅程，在路上遇見了一位神秘的夥伴。'
  },
  { 
    id: 2, 
    number: 2, 
    title: '意想不到的相遇',
    airDate: '2025-04-12',
    views: 12830,
    duration: '24:15',
    description: '旅途中的第一個挑戰，以及與重要角色的初次相遇。'
  },
  { 
    id: 3, 
    number: 3, 
    title: '黑暗中的光明',
    airDate: '2025-04-19',
    views: 10240,
    duration: '24:45',
    description: '面對困境，主角找到了前進的方向，並發現了自己的潛在能力。'
  },
  { 
    id: 4, 
    number: 4, 
    title: '真相的碎片',
    airDate: '2025-04-26',
    views: 9340,
    duration: '24:30',
    description: '逐漸揭開的世界真相，以及主角過去的秘密。'
  },
])

const currentEpisode = ref(episodes.value[0])

// 假設的留言數據
const comments = ref([
  {
    id: 1,
    username: 'anime_lover',
    date: '2025-04-05 14:30',
    content: '這集真的太精彩了！劇情發展出乎我的意料，特別是主角面對困境時的表現真的很感人。'
  },
  {
    id: 2,
    username: 'sakura_fan',
    date: '2025-04-05 15:45',
    content: '音樂配得很到位，特別是高潮部分的背景配樂讓整個場景更有感染力。期待下一集！'
  },
  {
    id: 3,
    username: 'otaku_master',
    date: '2025-04-05 18:12',
    content: '畫面質量比上一季提升了不少，特效也做得很用心。製作組真的很努力！'
  }
])
</script>