<template>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <RouterLink
          to="/"
          class="text-2xl font-bold hover:text-blue-600"
        >
          AnimeNow
        </RouterLink>
        <nav class="space-x-6 text-sm font-medium">
          <RouterLink
            to="/"
            class="hover:text-blue-600"
          >
            首頁
          </RouterLink>
          <RouterLink
            to="/bangumi"
            class="hover:text-blue-600"
          >
            番劇列表
          </RouterLink>
          <RouterLink
            to="/favorites"
            class="hover:text-blue-600"
          >
            我的收藏
          </RouterLink>
          <RouterLink
            to="/watch"
            class="hover:text-blue-600"
          >
            觀看平台
          </RouterLink>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  // 基本頭部組件
  </script>