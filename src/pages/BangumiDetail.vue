<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useBangumiStore } from '@/stores/useBangumiStore'
import { computed } from 'vue'

const route = useRoute()
const store = useBangumiStore()
const bangumiId = Number(route.params.id)

// 用 computed 找出對應的番劇
const bangumi = computed(() => store.bangumiList.find(b => b.id === bangumiId))
</script>

<template>
  <div
    v-if="bangumi"
    class="max-w-3xl mx-auto px-4 py-10"
  >
    <h1 class="text-3xl font-bold mb-6">
      {{ bangumi.title }}
    </h1>
    <img
      :src="bangumi.image"
      :alt="bangumi.title"
      class="w-full h-64 object-cover rounded mb-4"
    >
    <p class="text-stone-600 mb-2">
      播出日期：{{ bangumi.airDate }}
    </p>
    <p class="text-stone-700 leading-relaxed mt-4">
      {{ bangumi.description }}
    </p>
  </div>

  <div
    v-else
    class="text-center py-10 text-stone-400 text-sm"
  >
    無此番劇資訊
  </div>
</template>
