// src/stores/useAuthStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

interface User {
  id: number;
  username: string;
  email: string;
  token: string;
}

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
    error: null as string | null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    currentUser: (state) => state.user,
    token: (state) => state.user?.token,
  },
  
  actions: {
    async login(form: LoginForm) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/Auth/login`, form)
        this.user = response.data
        
        // 存儲用戶信息和令牌
        localStorage.setItem('user', JSON.stringify(this.user))
        
        // 設置 axios 全局授權頭
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.user.token}`
        
        return this.user
      } catch (error: any) {
        this.error = error.response?.data || '登入失敗'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async register(form: RegisterForm) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/Auth/register`, form)
        this.user = response.data
        
        // 存儲用戶信息和令牌
        localStorage.setItem('user', JSON.stringify(this.user))
        
        // 設置 axios 全局授權頭
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.user.token}`
        
        return this.user
      } catch (error: any) {
        this.error = error.response?.data || '註冊失敗'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    logout() {
      this.user = null
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
    
    // 從 localStorage 初始化用戶狀態
    initAuth() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser)
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.user.token}`
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
    },
  },
})