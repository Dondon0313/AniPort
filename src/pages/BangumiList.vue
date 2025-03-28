<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6">
      📺 春季番劇列表
    </h1>
  
    <!-- 篩選按鈕 -->
    <div class="flex flex-wrap gap-2 mb-6 text-lg">
      <button
        v-for="day in ['全部', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']"
        :key="day"
        :class="[
          'px-3 py-1 rounded-full border transition',
          selectedDay === day
            ? 'bg-blue-500 text-white'
            : 'bg-white text-stone-600 hover:bg-stone-100'
        ]"
        @click="selectedDay = day"
      >
        {{ day }}
      </button>
    </div>
  
    <!-- 卡片清單 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="item in filteredList"
        :key="item.id"
        :to="`/bangumi/${item.id}`"
        class="relative block bg-white rounded-lg overflow-hidden shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-stone-50"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="w-full h-48 object-cover"
        >
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-1 truncate">
            {{ item.title }}
          </h2>
          <p class="text-sm text-stone-500">
            📅 {{ item.airDate }}
          </p>
        </div>

        <!-- ❤️ 收藏按鈕 -->
        <button
          class="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-rose-100 transition"
          @click.prevent.stop="toggleFavorite(item.id)"
        >
          <span :class="isFavorite(item.id) ? 'text-rose-500' : 'text-stone-300'">
            {{ isFavorite(item.id) ? '❤️' : '🤍' }}
          </span>
        </button>
      </RouterLink>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useBangumiStore } from '@/stores/useBangumiStore'
  
  const bangumiStore = useBangumiStore()
  const bangumiList = bangumiStore.bangumiList
  const store = useBangumiStore()
  const searchKeyword = ref('')
  const selectedDay = ref('')
  
  const filteredList = computed(() => {
  return store.bangumiList.filter(item => {
    const matchesKeyword = item.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesDay = selectedDay.value === '全部' || item.weekDay === selectedDay.value
    return matchesKeyword && matchesDay
  })
})


// 收藏控制
const toggleFavorite = (id: number) => {
  store.toggleFavorite(id)
}
const isFavorite = (id: number) => store.isFavorite(id)
  </script>
  
  
  