<template>
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <!-- 搜索框 -->
      <div class="mb-4">
        <div class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
          <span class="text-stone-400 px-3">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索番劇名稱..."
            class="w-full py-2 px-1 focus:outline-none"
            @input="applyFilters"
          >
        </div>
      </div>
      
      <!-- 展開/收起篩選區按鈕 -->
      <button 
        class="w-full flex justify-between items-center py-1 text-stone-700"
        @click="showFilters = !showFilters"
      >
        <span class="font-medium">高級篩選</span>
        <span>{{ showFilters ? '▲' : '▼' }}</span>
      </button>
      
      <!-- 篩選控制區 -->
      <div v-if="showFilters" class="mt-3 space-y-4">
        <!-- 類型標籤 -->
        <div>
          <div class="text-sm text-stone-600 mb-2">類型</div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="genre in availableGenres" 
              :key="genre"
              :class="[
                'px-2 py-1 text-xs rounded-full transition',
                selectedGenres.includes(genre)
                  ? 'bg-blue-500 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              ]"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
            </button>
          </div>
        </div>
        
        <!-- 播出日篩選 -->
        <div>
          <div class="text-sm text-stone-600 mb-2">播出日</div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="day in ['全部', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']"
              :key="day"
              :class="[
                'px-2 py-1 text-xs rounded-full transition',
                selectedWeekDay === day
                  ? 'bg-blue-500 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              ]"
              @click="selectedWeekDay = day; applyFilters()"
            >
              {{ day }}
            </button>
          </div>
        </div>
        
        <!-- 狀態篩選 -->
        <div>
          <div class="text-sm text-stone-600 mb-2">播出狀態</div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="status in [
                { value: 'all', label: '全部' },
                { value: 'upcoming', label: '即將播出' },
                { value: 'ongoing', label: '連載中' },
                { value: 'completed', label: '已完結' }
              ]"
              :key="status.value"
              :class="[
                'px-2 py-1 text-xs rounded-full transition',
                selectedStatus === status.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              ]"
              @click="selectedStatus = status.value; applyFilters()"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
        
        <!-- 排序方式 -->
        <div>
          <div class="text-sm text-stone-600 mb-2">排序方式</div>
          <select 
            v-model="sortBy"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            @change="applyFilters"
          >
            <option value="newest">最新上架</option>
            <option value="rating">評分最高</option>
            <option value="popularity">人氣最高</option>
          </select>
        </div>
        
        <!-- 重置按鈕 -->
        <div class="flex justify-end">
          <button 
            class="text-sm text-blue-600 hover:text-blue-800"
            @click="resetFilters"
          >
            重置篩選條件
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useBangumiStore } from '@/stores/useBangumiStore';
  
  const store = useBangumiStore();
  
  // 控制篩選區域的顯示/隱藏
  const showFilters = ref(false);
  
  // 篩選狀態
  const searchQuery = ref('');
  const selectedGenres = ref<string[]>([]);
  const selectedWeekDay = ref('全部');
  const selectedStatus = ref('all');
  const sortBy = ref('newest');
  
  // 從番劇列表中提取所有可用的類型標籤
  const availableGenres = ref<string[]>([]);
  
  // 初始化
  onMounted(() => {
    // 獲取所有番劇的所有類型標籤，並去重
    const genreSet = new Set<string>();
    store.bangumiList.forEach(bangumi => {
      bangumi.genres.forEach(genre => genreSet.add(genre));
    });
    availableGenres.value = Array.from(genreSet);
  
    // 從 URL 參數或 localStorage 讀取現有篩選條件
    const savedFilters = JSON.parse(localStorage.getItem('bangumi-filters') || '{}');
    if (savedFilters.search) searchQuery.value = savedFilters.search;
    if (savedFilters.genres) selectedGenres.value = savedFilters.genres;
    if (savedFilters.weekDay) selectedWeekDay.value = savedFilters.weekDay;
    if (savedFilters.status) selectedStatus.value = savedFilters.status;
    if (savedFilters.sort) sortBy.value = savedFilters.sort;
  
    // 初始應用篩選條件
    applyFilters();
  });
  
  // 切換類型篩選
  const toggleGenre = (genre: string) => {
    if (selectedGenres.value.includes(genre)) {
      selectedGenres.value = selectedGenres.value.filter(g => g !== genre);
    } else {
      selectedGenres.value.push(genre);
    }
    applyFilters();
  };
  
  // 應用篩選條件
  const applyFilters = () => {
    store.updateFilters({
      search: searchQuery.value,
      genres: selectedGenres.value,
      weekDay: selectedWeekDay.value,
      status: selectedStatus.value,
      sort: sortBy.value
    });
    
    // 保存篩選條件到 localStorage
    localStorage.setItem('bangumi-filters', JSON.stringify({
      search: searchQuery.value,
      genres: selectedGenres.value,
      weekDay: selectedWeekDay.value,
      status: selectedStatus.value,
      sort: sortBy.value
    }));
  };
  
  // 重置篩選條件
  const resetFilters = () => {
    searchQuery.value = '';
    selectedGenres.value = [];
    selectedWeekDay.value = '全部';
    selectedStatus.value = 'all';
    sortBy.value = 'newest';
    
    store.resetFilters();
    localStorage.removeItem('bangumi-filters');
  };
  </script>