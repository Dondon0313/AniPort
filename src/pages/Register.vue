<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
    <h1 class="text-2xl font-bold mb-6">
      註冊
    </h1>
      
    <div
      v-if="authStore.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ authStore.error }}
    </div>
      
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          用戶名
        </label>
        <input
          id="username"
          v-model="form.username"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="用戶名"
          required
        >
      </div>
        
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="email"
        >
          電子郵件
        </label>
        <input
          id="email"
          v-model="form.email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          placeholder="name@example.com"
          required
        >
      </div>
        
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          密碼
        </label>
        <input
          id="password"
          v-model="form.password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="至少6個字符"
          minlength="6"
          required
        >
      </div>
        
      <div class="flex items-center justify-between">
        <button
          :class="['bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                   { 'opacity-50 cursor-not-allowed': authStore.isLoading }]"
          type="submit"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? '註冊中...' : '註冊' }}
        </button>
          
        <RouterLink
          to="/login"
          class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          已有帳號？登入
        </RouterLink>
      </div>
    </form>
  </div>
</template>
  
  <script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/useAuthStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const form = reactive({
    username: '',
    email: '',
    password: '',
  })
  
  const handleSubmit = async () => {
    try {
      await authStore.register(form)
      router.push('/')
    } catch (error) {
      // Error is handled in the store
    }
  }
  </script>