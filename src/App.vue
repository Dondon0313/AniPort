<template>
  <div class="min-h-screen bg-neutral-50 text-stone-800">
    <!-- 導覽列 -->
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

    <!-- 主要區塊 -->
    <main>
      <RouterView />
    </main>

    <!-- 頁腳 -->
    <footer class="bg-stone-100 py-6 text-center text-sm text-stone-500 mt-12">
      &copy; 2025 AnimeNow. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
// 空邏輯，主要用作頁面框架
</script>

<style scoped>
/* 可調整動畫主題色系或字體 */
</style>
