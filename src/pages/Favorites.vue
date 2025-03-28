<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6">
      ❤️ 我的收藏
    </h1>

    <div
      v-if="favorites.length"
      class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    >
      <RouterLink
        v-for="anime in favorites"
        :key="anime.id"
        :to="`/bangumi/${anime.id}`"
        class="relative block bg-white rounded-lg overflow-hidden shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-stone-50"
      >
        <img
          :src="anime.image"
          :alt="anime.title"
          class="w-full h-48 object-cover"
        >
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-1 truncate">
            {{ anime.title }}
          </h2>
          <p class="text-sm text-stone-500">
            📅 {{ anime.airDate }}
          </p>
        </div>
      </RouterLink>
    </div>

    <p
      v-else
      class="text-stone-500 text-center mt-10"
    >
      你目前沒有收藏任何動畫喔！
    </p>
  </div>
</template>

<script setup lang="ts">
import { useBangumiStore } from '@/stores/useBangumiStore'

const store = useBangumiStore()
const favorites = store.favoriteBangumis
</script>
