<template>
    <RouterLink
      :to="`/bangumi/${anime.id}`"
      class="group bg-white rounded-lg overflow-hidden shadow hover-scale"
    >
      <div class="relative aspect-[3/4]">
        <img
          :src="anime.image"
          :alt="anime.title"
          class="w-full h-full object-cover"
        >
        <div class="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-br">
          {{ anime.weekDay }}
        </div>
        
        <div v-if="showStatus" class="absolute top-0 right-0 px-2 py-1 text-xs rounded-bl"
             :class="{
               'bg-blue-500 text-white': anime.status === 'ongoing',
               'bg-amber-500 text-white': anime.status === 'upcoming',
               'bg-stone-500 text-white': anime.status === 'completed'
             }">
          {{ anime.status === 'ongoing' ? '連載中' : 
             anime.status === 'upcoming' ? '即將播出' : '已完結' }}
        </div>
        
        <!-- 收藏按鈕 -->
        <button
          v-if="showFavorite"
          class="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-rose-100 transition z-10"
          @click.prevent.stop="toggleFavorite"
        >
          <span :class="isFavorite ? 'text-rose-500' : 'text-stone-300'">
            {{ isFavorite ? '❤️' : '🤍' }}
          </span>
        </button>
      </div>
      <div class="p-3">
        <h3 class="text-lg font-semibold mb-1 truncate group-hover:text-blue-600 transition">
          {{ anime.title }}
        </h3>
        
        <div v-if="showDate" class="text-xs text-stone-500 mb-2">
          <span>{{ anime.airDate }}</span>
        </div>
        
        <div class="flex items-center text-xs">
          <span class="text-amber-500 flex items-center">
            <span>★</span>
            <span class="ml-1">{{ anime.rating }}</span>
          </span>
          <span v-if="showGenres" class="mx-2 text-stone-300">|</span>
          <span v-if="showGenres" class="text-stone-500 truncate">{{ anime.genres.join(', ') }}</span>
        </div>
      </div>
    </RouterLink>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import { Bangumi } from '@/types/anime';
  
  const props = defineProps<{
    anime: Bangumi;
    isFavorite: boolean;
    showFavorite?: boolean;
    showStatus?: boolean;
    showGenres?: boolean;
    showDate?: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: 'toggleFavorite', id: number): void
  }>();
  
  const toggleFavorite = () => {
    emit('toggleFavorite', props.anime.id);
  };
  </script>
  
  <!-- src/components/ui/EpisodeCard.vue -->
  <template>
    <RouterLink 
      :to="`/watch?id=${episode.bangumiId}&episode=${episode.id}`"
      class="bg-white rounded-lg shadow overflow-hidden hover-scale"
    >
      <div class="relative">
        <div class="aspect-video bg-stone-200 overflow-hidden">
          <img 
            v-if="episode.thumbnail"
            :src="episode.thumbnail" 
            :alt="episode.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
          {{ episode.duration }}
        </div>
        
        <div v-if="showProgress && progress > 0" class="absolute bottom-0 left-0 right-0 h-1 bg-stone-200">
          <div class="h-full bg-blue-500" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
      <div class="p-3">
        <div v-if="showBangumiTitle" class="font-medium line-clamp-1">{{ bangumiTitle }}</div>
        <div class="text-sm text-stone-700 mt-1">第{{ episode.number }}集：{{ episode.title }}</div>
        <div class="text-xs text-stone-500 mt-1 flex justify-between">
          <span>{{ episode.airDate }}</span>
          <span v-if="showViews">{{ episode.views.toLocaleString() }} 次觀看</span>
        </div>
      </div>
    </RouterLink>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import { Episode } from '@/types/anime';
  
  const props = defineProps<{
    episode: Episode;
    bangumiTitle?: string;
    progress?: number;
    showBangumiTitle?: boolean;
    showViews?: boolean;
    showProgress?: boolean;
  }>();
  </script>
  
  <!-- src/components/ui/CommentItem.vue -->
  <template>
    <div class="border-b last:border-b-0 pb-4 mb-4 last:mb-0">
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0 overflow-hidden">
          <img v-if="comment.avatar" :src="comment.avatar" :alt="comment.username" class="w-full h-full object-cover">
        </div>
        <div class="ml-3 flex-1">
          <div class="flex items-center flex-wrap">
            <span class="font-medium">{{ comment.username }}</span>
            <span class="ml-3 text-xs text-stone-500">{{ formatDate(comment.date) }}</span>
            <span v-if="comment.rating" class="ml-3 text-amber-500">
              <span v-for="i in 5" :key="i" class="inline-block">
                {{ i <= comment.rating ? '★' : '☆' }}
              </span>
            </span>
          </div>
          <p class="mt-1 text-stone-800">{{ comment.content }}</p>
          
          <!-- 互動按鈕 -->
          <div class="flex items-center mt-2 text-xs text-stone-500">
            <button class="flex items-center hover:text-stone-700">
              <span>👍</span>
              <span class="ml-1">喜歡</span>
            </button>
            <button class="ml-4 flex items-center hover:text-stone-700">
              <span>💬</span>
              <span class="ml-1">回覆</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import { Comment } from '@/types/anime';
  
  const props = defineProps<{
    comment: Comment;
  }>();
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  </script>
  
  <!-- src/components/layout/AppHeader.vue -->
  <template>
    <header class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div class="flex justify-between items-center">
          <!-- Logo 和主導航 -->
          <div class="flex items-center">
            <RouterLink
              to="/"
              class="text-2xl font-bold hover:text-blue-600 flex items-center"
            >
              <span class="text-blue-600 mr-1">📺</span>
              AnimeNow
            </RouterLink>
            
            <nav class="hidden md:flex ml-8 space-x-6 text-sm font-medium">
              <RouterLink
                v-for="item in mainNavItems"
                :key="item.path"
                :to="item.path"
                class="hover:text-blue-600 py-1"
                active-class="text-blue-600 border-b-2 border-blue-600"
              >
                {{ item.name }}
              </RouterLink>
            </nav>
          </div>
          
          <!-- 搜索和用戶區域 -->
          <div class="flex items-center">
            <!-- 搜索框 -->
            <div class="relative mr-4 hidden sm:block">
              <input
                type="text"
                placeholder="搜索番劇..."
                class="py-1 pl-8 pr-2 rounded-full border text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-48"
              >
              <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-stone-400">
                🔍
              </span>
            </div>
            
            <!-- 用戶菜單 -->
            <div class="flex items-center space-x-3">
              <RouterLink to="/favorites" class="text-stone-700 hover:text-blue-600">
                <span class="text-lg">❤️</span>
              </RouterLink>
              
              <button class="text-stone-700 hover:text-blue-600 md:hidden" @click="isMenuOpen = !isMenuOpen">
                <span class="text-xl">{{ isMenuOpen ? '✕' : '☰' }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 移動端下拉選單 -->
        <div v-if="isMenuOpen" class="md:hidden pt-2 pb-2 border-t mt-2">
          <nav class="flex flex-col space-y-2">
            <RouterLink
              v-for="item in mainNavItems"
              :key="item.path"
              :to="item.path"
              class="hover:text-blue-600 py-2 px-1"
              active-class="text-blue-600 bg-blue-50 rounded"
            >
              {{ item.name }}
            </RouterLink>
            
            <!-- 移動端搜索框 -->
            <div class="py-2">
              <input
                type="text"
                placeholder="搜索番劇..."
                class="py-2 px-3 rounded-lg border w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
            </div>
          </nav>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const isMenuOpen = ref(false);
  
  const mainNavItems = [
    { name: '首頁', path: '/' },
    { name: '番劇列表', path: '/bangumi' },
    { name: '觀看平台', path: '/watch' },
    { name: '收藏', path: '/favorites' },
  ];
  </script>
  
  <!-- src/components/layout/AppFooter.vue -->
  <template>
    <footer class="bg-stone-100 py-8 text-stone-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- 主要內容 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo 和簡介 -->
          <div class="md:col-span-1">
            <div class="text-xl font-bold mb-4 flex items-center">
              <span class="text-blue-600 mr-1">📺</span>
              AnimeNow
            </div>
            <p class="text-sm">
              AnimeNow 是您的動漫追蹤平台，提供最新、最全面的動漫資訊和觀賞體驗。
            </p>
          </div>
          
          <!-- 快速鏈接 -->
          <div>
            <h3 class="font-semibold mb-4">快速鏈接</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <RouterLink to="/" class="hover:text-blue-600">首頁</RouterLink>
              </li>
              <li>
                <RouterLink to="/bangumi" class="hover:text-blue-600">番劇列表</RouterLink>
              </li>
              <li>
                <RouterLink to="/watch" class="hover:text-blue-600">觀看平台</RouterLink>
              </li>
              <li>
                <RouterLink to="/favorites" class="hover:text-blue-600">我的收藏</RouterLink>
              </li>
            </ul>
          </div>
          
          <!-- 幫助與支持 -->
          <div>
            <h3 class="font-semibold mb-4">幫助與支持</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-blue-600">常見問題</a>
              </li>
              <li>
                <a href="#" class="hover:text-blue-600">使用條款</a>
              </li>
              <li>
                <a href="#" class="hover:text-blue-600">隱私政策</a>
              </li>
              <li>
                <a href="#" class="hover:text-blue-600">聯繫我們</a>
              </li>
            </ul>
          </div>
          
          <!-- 訂閱通知 -->
          <div>
            <h3 class="font-semibold mb-4">訂閱通知</h3>
            <p class="text-sm mb-3">獲取最新番劇更新和公告</p>
            <div class="flex">
              <input 
                type="email" 
                placeholder="您的電子郵件" 
                class="rounded-l-lg border-stone-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 flex-1"
              >
              <button class="bg-blue-600 text-white px-3 py-1 rounded-r-lg text-sm hover:bg-blue-700">
                訂閱
              </button>
            </div>
          </div>
        </div>
        
        <!-- 版權信息 -->
        <div class="border-t border-stone-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between">
          <div class="text-sm">
            &copy; 2025 AnimeNow. All rights reserved.
          </div>
          
          <!-- 社交媒體 -->
          <div class="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" class="text-stone-500 hover:text-blue-600">
              FB
            </a>
            <a href="#" class="text-stone-500 hover:text-blue-600">
              IG
            </a>
            <a href="#" class="text-stone-500 hover:text-blue-600">
              TW
            </a>
            <a href="#" class="text-stone-500 hover:text-blue-600">
              YT
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>