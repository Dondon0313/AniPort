<!-- src/pages/Schedule.vue -->
<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6">
      📅 番劇播出表
    </h1>
  
    <!-- 標籤頁 -->
    <div class="border-b mb-6">
      <div class="flex space-x-8 overflow-x-auto pb-1">
        <button 
          :class="[
            'pb-3 font-medium transition border-b-2',
            activeTab === 'weekly' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          ]"
          @click="activeTab = 'weekly'"
        >
          每週播出
        </button>
        <button 
          :class="[
            'pb-3 font-medium transition border-b-2',
            activeTab === 'today' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          ]"
          @click="activeTab = 'today'"
        >
          今日播出
        </button>
        <button 
          :class="[
            'pb-3 font-medium transition border-b-2',
            activeTab === 'upcoming' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          ]"
          @click="activeTab = 'upcoming'"
        >
          即將播出
        </button>
      </div>
    </div>
  
    <!-- 載入中 -->
    <div
      v-if="loading"
      class="text-center py-10"
    >
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      <p class="mt-2 text-stone-500">
        載入中...
      </p>
    </div>
  
    <!-- 每週播出 -->
    <div
      v-else-if="activeTab === 'weekly'"
      class="space-y-8"
    >
      <div
        v-for="(weekday, index) in ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']"
        :key="index"
      >
        <h2 class="text-lg font-semibold mb-4 flex items-center">
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block w-20 text-center">{{ weekday }}</span>
          <span class="ml-2 text-stone-400 text-sm">{{ getWeekdayBangumis(weekday).length }} 部番劇</span>
        </h2>
          
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <RouterLink
            v-for="anime in getWeekdayBangumis(weekday)"
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
          v-if="getWeekdayBangumis(weekday).length === 0"
          class="bg-white rounded-lg p-8 text-center text-stone-500"
        >
          該日期暫無番劇播出
        </div>
      </div>
    </div>
  
    <!-- 今日播出 -->
    <div v-else-if="activeTab === 'today'">
      <h2 class="text-lg font-semibold mb-4 flex items-center">
        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block">今日播出</span>
        <span class="ml-2 text-stone-400 text-sm">{{ todayBangumis.length }} 部番劇</span>
      </h2>
        
      <div
        v-if="todayBangumis.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <RouterLink
          v-for="anime in todayBangumis"
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
        class="bg-white rounded-lg p-8 text-center text-stone-500"
      >
        今日暫無番劇播出
      </div>
    </div>
  
    <!-- 即將播出 -->
    <div v-else-if="activeTab === 'upcoming'">
      <h2 class="text-lg font-semibold mb-4 flex items-center">
        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block">即將播出</span>
        <span class="ml-2 text-stone-400 text-sm">未來 30 天內</span>
      </h2>
        
      <div
        v-if="upcomingBangumis.length"
        class="grid grid-cols-1 gap-4"
      >
        <div
          v-for="anime in upcomingBangumis"
          :key="anime.id"
          class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-4"
        >
          <div class="flex items-center">
            <RouterLink
              :to="`/bangumi/${anime.id}`"
              class="flex-shrink-0"
            >
              <img 
                :src="anime.image" 
                :alt="anime.title"
                class="w-20 h-20 object-cover rounded-md"
              >
            </RouterLink>
            <div class="ml-4 flex-1">
              <RouterLink
                :to="`/bangumi/${anime.id}`"
                class="font-semibold hover:text-blue-600 transition"
              >
                {{ anime.title }}
              </RouterLink>
              <div class="text-sm text-stone-500 mt-1">
                {{ anime.studio }}
              </div>
              <div class="flex items-center text-sm mt-2">
                <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
                  {{ formatDate(anime.airDate) }} 開播
                </span>
                <span class="mx-2">•</span>
                <span class="text-amber-500 flex items-center text-xs">
                  <span>★</span>
                  <span class="ml-1">{{ anime.rating }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      <div
        v-else
        class="bg-white rounded-lg p-8 text-center text-stone-500"
      >
        最近暫無新番即將播出
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref,  onMounted } from 'vue'
  import axios from 'axios'
  import { Bangumi } from '@/types/anime'
  
  const activeTab = ref('weekly')
  const loading = ref(true)
  const weeklySchedule = ref<Record<string, Bangumi[]>>({})
  const todayBangumis = ref<Bangumi[]>([])
  const upcomingBangumis = ref<Bangumi[]>([])
  
  onMounted(async () => {
    loading.value = true
    try {
      await Promise.all([
        fetchWeeklySchedule(),
        fetchTodaySchedule(),
        fetchUpcomingBangumis(),
      ])
    } catch (error) {
      console.error('Failed to fetch schedule data:', error)
    } finally {
      loading.value = false
    }
  })
  
  const fetchWeeklySchedule = async () => {
    const response = await axios.get('/api/Schedule')
    weeklySchedule.value = response.data
  }
  
  const fetchTodaySchedule = async () => {
    const response = await axios.get('/api/Schedule/Today')
    todayBangumis.value = response.data
  }
  
  const fetchUpcomingBangumis = async () => {
    const response = await axios.get('/api/Schedule/Upcoming')
    upcomingBangumis.value = response.data
  }
  
  const getWeekdayBangumis = (weekday: string) => {
    return weeklySchedule.value[weekday] || []
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