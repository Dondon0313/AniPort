<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- 主要內容區 -->
    <main class="flex-1">
      <!-- 頁面切換過渡效果 -->
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    
    <!-- 返回頂部按鈕 -->
    <button
      v-show="showBackToTop"
      class="fixed bottom-8 right-8 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-20"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

// 返回頂部功能
const showBackToTop = ref(false)

const checkScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 監聽滾動事件
onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style>

</style>
