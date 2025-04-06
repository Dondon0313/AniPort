<!-- src/pages/BangumiList.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">番劇列表</h1>
      
      <!-- 布局切換 -->
      <div class="flex bg-white rounded-lg border p-1">
        <button 
          @click="layout = 'grid'"
          :class="[
            'px-3 py-1 rounded-md flex items-center transition',
            layout === 'grid' ? 'bg-stone-100 text-stone-800' : 'text-stone-500 hover:text-stone-700'
          ]"
        >
          <span class="mr-1">◫</span>
          <span class="hidden sm:inline">網格</span>
        </button>
        <button 
          @click="layout = 'list'"
          :class="[
            'px-3 py-1 rounded-md flex items-center transition',
            layout === 'list' ? 'bg-stone-100 text-stone-800' : 'text-stone-500 hover:text-stone-700'
          ]"
        >
          <span class="mr-1">☰</span>
          <span class="hidden sm:inline">列表</span>
        </button>
      </div>
    </div>
    
    <!-- 引入高級篩選組件 -->
    <AdvancedFilter />

    <!-- 結果計數和排序 -->
    <div class="flex flex-wrap justify-between items-center mb-6">
      <div class="text-stone-600">
        找到 <span class="font-medium">{{ filteredList.length }}</span> 個結果
      </div>
    </div>
    
    <!-- 網格布局 -->
    <div v-if="layout === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <RouterLink
        v-for="item in filteredList"
        :key="item.id"
        :to="`/bangumi/${item.id}`"
        class="group bg-white rounded-lg overflow-hidden shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="relative aspect-[3/4]">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
          >
          <div class="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-br">
            {{ item.weekDay }}
          </div>
          
          <!-- 收藏按鈕 -->
          <button
            class="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-rose-100 transition z-10"
            @click.prevent.stop="toggleFavorite(item.id)"
          >
            <span :class="isFavorite(item.id) ? 'text-rose-500' : 'text-stone-300'">
              {{ isFavorite(item.id) ? '❤️' : '🤍' }}
            </span>
          </button>
        </div>
        <div class="p-3">
          <h3 class="text-lg font-semibold mb-1 truncate group-hover:text-blue-600 transition">
            {{ item.title }}
          </h3>
          
          <div class="text-xs text-stone-500 mb-2">
            <span>{{ item.airDate }}</span>
            <span class="mx-1">•</span>
            <span>
              {{ item.status === 'ongoing' ? '連載中' : 
                 item.status === 'upcoming' ? '即將播出' : '已完結' }}
            </span>
          </div>
          
          <div class="flex items-center text-xs">
            <span class="text-amber-500 flex items-center">
              <span>★</span>
              <span class="ml-1">{{ item.rating }}</span>
            </span>
            <span class="mx-2 text-stone-300">|</span>
            <span class="text-stone-500 truncate">{{ item.genres.join(', ') }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
    
    <!-- 列表布局 -->
    <div v-else-if="layout === 'list'" class="space-y-4">
      <RouterLink
        v-for="item in filteredList"
        :key="item.id"
        :to="`/bangumi/${item.id}`"
        class="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition"
      >
        <div class="flex items-stretch p-2">
          <div class="w-24 sm:w-36">
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover rounded"
            >
          </div>
          <div class="flex-1 ml-4 py-2 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold hover:text-blue-600">{{ item.title }}</h3>
                
                <!-- 收藏按鈕 -->
                <button
                  class="bg-white rounded-full p-1 hover:bg-rose-100 transition"
                  @click.prevent.stop="toggleFavorite(item.id)"
                >
                  <span :class="isFavorite(item.id) ? 'text-rose-500' : 'text-stone-300'">
                    {{ isFavorite(item.id) ? '❤️' : '🤍' }}
                  </span>
                </button>
              </div>
              
              <div class="flex flex-wrap text-xs text-stone-500 mt-1 mb-2">
                <span class="mr-3">{{ item.weekDay }}</span>
                <span class="mr-3">{{ item.airDate }}</span>
                <span class="mr-3">{{ item.totalEpisodes }}集</span>
                <span class="mr-3">
                  {{ item.status === 'ongoing' ? '連載中' : 
                     item.status === 'upcoming' ? '即將播出' : '已完結' }}
                </span>
                <span class="mr-3">{{ item.studio }}</span>
              </div>
              
              <p class="text-stone-600 text-sm line-clamp-2">{{ item.description }}</p>
            </div>
            
            <div class="flex items-center mt-2">
              <div class="flex items-center text-amber-500 text-xs">
                <span>★</span>
                <span class="ml-1">{{ item.rating }}</span>
              </div>
              <div class="mx-2 text-stone-300">|</div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="genre in item.genres" 
                  :key="genre"
                  class="text-xs px-2 py-0.5 bg-stone-100 rounded-full text-stone-600"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
    
    <!-- 無結果提示 -->
    <div v-if="filteredList.length === 0" class="text-center py-16">
      <div class="text-stone-400 text-4xl mb-3">🔍</div>
      <h3 class="text-xl font-medium mb-2">未找到符合條件的番劇</h3>
      <p class="text-stone-500">嘗試調整您的篩選條件</p>
      <button 
        class="mt-4 text-blue-600 hover:text-blue-800"
        @click="resetFilters"
      >
        重置篩選條件
      </button>
    </div>
    
    <!-- 頁碼導航 (如果結果數量很多) -->
    <div v-if="filteredList.length > itemsPerPage" class="mt-8 flex justify-center">
      <div class="flex">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          :class="[
            'px-3 py-1 border rounded-l',
            currentPage === 1 
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
              : 'bg-white hover:bg-stone-50'
          ]"
        >
          上一頁
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border-t border-b',
            currentPage === page 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white hover:bg-stone-50'
          ]"
        >
          {{ page }}
        </button>
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          :class="[
            'px-3 py-1 border rounded-r',
            currentPage === totalPages 
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
              : 'bg-white hover:bg-stone-50'
          ]"
        >
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBangumiStore } from '@/stores/useBangumiStore';
import AdvancedFilter from '@/components/AdvancedFilter.vue';

const store = useBangumiStore();

// 顯示設置
const layout = ref('grid'); // 'grid' 或 'list'
const currentPage = ref(1);
const itemsPerPage = 20;

// 從 store 獲取篩選後的番劇列表
const allFilteredList = computed(() => store.filteredBangumiList);

// 分頁處理
const filteredList = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return allFilteredList.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => 
  Math.ceil(allFilteredList.value.length / itemsPerPage)
);

// 收藏功能
const toggleFavorite = (id: number) => {
  store.toggleFavorite(id);
};

const isFavorite = (id: number) => {
  return store.isFavorite(id);
};

// 重置篩選條件
const resetFilters = () => {
  store.resetFilters();
  currentPage.value = 1;
};
</script>