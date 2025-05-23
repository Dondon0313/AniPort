import { defineStore } from 'pinia'
import { Bangumi, Episode, Comment } from '@/types/anime'
import axios from 'axios' 

// 後端 API 
const API_URL = 'https://localhost:5000'

export const useBangumiStore = defineStore('bangumi', {
  state: () => ({
    bangumiList: [
      {
        id: 1,
        title: '葬送的芙莉蓮',
        image: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
        airDate: '2025-04-05',
        weekDay: '星期六',
        description: '魔王被打倒後，精靈魔法使芙莉蓮踏上尋找人類情感的旅途。',
        totalEpisodes: 12,
        genres: ['奇幻', '冒險', '治癒'],
        rating: 9.2,
        studio: '範例工作室',
        status: 'ongoing',
      },
      {
        id: 2,
        title: '我推的孩子 第二季',
        image: '/images/我推.jpg',
        airDate: '2025-04-06',
        weekDay: '星期日',
        description: '偶像與轉生的交錯命運，再次揭開娛樂圈的真相。',
        totalEpisodes: 13,
        genres: ['懸疑', '音樂', '偶像'],
        rating: 9.0,
        studio: 'B站動畫',
        status: 'ongoing',
      },
      {
        id: 3,
        title: '無職轉生 第二季',
        image: '/images/無職.jpg',
        airDate: '2025-04-07',
        weekDay: '星期一',
        description: '重生的魯迪烏斯展開全新冒險與成長，走出過去陰影。',
        totalEpisodes: 12,
        genres: ['奇幻', '冒險', '異世界'],
        rating: 8.9,
        studio: 'MAPPA',
        status: 'ongoing',
      },
      {
        id: 4,
        title: '吹響吧！上低音號 第三季',
        image: '/images/低音號.jpg',
        airDate: '2025-04-08',
        weekDay: '星期二',
        description: '久美子與北宇治高中吹奏部邁向全國大賽的最後挑戰。',
        totalEpisodes: 13,
        genres: ['音樂', '校園', '青春'],
        rating: 8.7,
        studio: '京都動畫',
        status: 'ongoing',
      },
    ] as Bangumi[],
    
    episodes: [
      { 
        id: 101, 
        bangumiId: 1,
        number: 1, 
        title: '精靈的旅程',
        airDate: '2025-04-05',
        views: 15420,
        duration: '24:30',
        description: '魔王被打倒後，精靈魔法使芙莉蓮踏上尋找人類情感的旅途。',
        thumbnail: '/images/episodes/frieren_ep1.jpg',
      },
      { 
        id: 102, 
        bangumiId: 1,
        number: 2, 
        title: '回憶的重量',
        airDate: '2025-04-12',
        views: 12830,
        duration: '24:15',
        description: '芙莉蓮回憶起與昔日夥伴的冒險，決定尋找新的同伴。',
        thumbnail: '/images/episodes/frieren_ep2.jpg',
      },
      { 
        id: 103, 
        bangumiId: 1,
        number: 3, 
        title: '魔法的真諦',
        airDate: '2025-04-19',
        views: 10240,
        duration: '24:45',
        description: '芙莉蓮收了新弟子，開始教導她了解魔法的本質。',
        thumbnail: '/images/episodes/frieren_ep3.jpg',
      },
      { 
        id: 201, 
        bangumiId: 2,
        number: 1, 
        title: '偶像的真實',
        airDate: '2025-04-06',
        views: 18720,
        duration: '23:40',
        description: '偶像組合 B 小隊面臨解散危機，愛開始懷疑自己的選擇。',
        thumbnail: '/images/episodes/oshi_ep1.jpg',
      },
      { 
        id: 202, 
        bangumiId: 2,
        number: 2, 
        title: '命運的交錯',
        airDate: '2025-04-13',
        views: 16540,
        duration: '23:50',
        description: '新角色的加入打亂了原有的平衡，背後似乎隱藏著不為人知的秘密。',
        thumbnail: '/images/episodes/oshi_ep2.jpg',
      },
    ] as Episode[],
    
    comments: [
      {
        id: 1001,
        targetId: 1,
        targetType: 'bangumi',
        userId: 'user123',
        username: 'anime_lover',
        avatar: '/images/avatars/user1.jpg',
        content: '這部作品的劇情和角色設定非常出色，每集都能給人驚喜。強烈推薦！',
        date: '2025-04-01',
        rating: 5,
      },
      {
        id: 1002,
        targetId: 1,
        targetType: 'bangumi',
        userId: 'user456',
        username: 'sakura_fan',
        avatar: '/images/avatars/user2.jpg',
        content: '畫風很不錯，但是節奏有點慢。總體來說值得一看！',
        date: '2025-03-28',
        rating: 4,
      },
      {
        id: 1003,
        targetId: 101,
        targetType: 'episode',
        userId: 'user789',
        username: 'otaku_master',
        avatar: '/images/avatars/user3.jpg',
        content: '第一集就奠定了很好的基調，作畫和音樂都很棒！',
        date: '2025-04-05',
        rating: 5,
      },
    ] as Comment[],

    // 收藏列表 (存儲收藏的番劇ID)
    favorites: JSON.parse(localStorage.getItem('bangumi-favorites') || '[]') as number[],

    // 觀看歷史 (記錄用戶觀看記錄)
    history: JSON.parse(localStorage.getItem('bangumi-history') || '[]') as {
      episodeId: number,
      bangumiId: number,
      timestamp: string,
      progress: number 
    }[],

    // 搜索和過濾狀態
    filters: {
      search: '',
      genres: [] as string[],
      weekDay: '全部',
      status: 'all', // 'all', 'upcoming', 'ongoing', 'completed'
      sort: 'newest', // 'newest', 'rating', 'popularity'
    },
    
    
    isLoading: false,
    error: null as Error | null,
  }),

  getters: {
    // 取得某個番劇的所有劇集
    getEpisodesByBangumiId: (state) => (bangumiId: number) => {
      return state.episodes.filter(ep => ep.bangumiId === bangumiId)
        .sort((a, b) => a.number - b.number)
    },

    // 取得某個番劇或劇集的所有評論
    getCommentsByTarget: (state) => (targetId: number, targetType: 'bangumi' | 'episode') => {
      return state.comments.filter(comment => 
        comment.targetId === targetId && comment.targetType === targetType,
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },

    // 取得收藏的番劇列表
    favoriteBangumis: (state) => {
      return state.bangumiList.filter(item => state.favorites.includes(item.id))
    },

    // 根據各種過濾條件篩選番劇
    filteredBangumiList: (state) => {
      return state.bangumiList.filter(bangumi => {
        // 搜索關鍵字過濾
        const matchesSearch = bangumi.title.toLowerCase().includes(state.filters.search.toLowerCase())
        
        // 類型過濾
        const matchesGenre = state.filters.genres.length === 0 || 
          state.filters.genres.some(g => bangumi.genres.includes(g))
        
        // 播出日過濾
        const matchesWeekDay = state.filters.weekDay === '全部' || 
          bangumi.weekDay === state.filters.weekDay
        
        // 狀態過濾
        const matchesStatus = state.filters.status === 'all' || 
          bangumi.status === state.filters.status
        
        return matchesSearch && matchesGenre && matchesWeekDay && matchesStatus
      }).sort((a, b) => {
        
        switch (state.filters.sort) {
          case 'newest':
            return new Date(b.airDate).getTime() - new Date(a.airDate).getTime()
          case 'rating':
            return b.rating - a.rating
          case 'popularity':
            // 假設popularity是基於收藏人數
            const aPopularity = state.favorites.filter(id => id === a.id).length
            const bPopularity = state.favorites.filter(id => id === b.id).length
            return bPopularity - aPopularity
          default:
            return 0
        }
      })
    },

    // 獲取最近更新的劇集
    recentEpisodes: (state) => {
      return [...state.episodes]
        .sort((a, b) => new Date(b.airDate).getTime() - new Date(a.airDate).getTime())
        .slice(0, 10)
    },

    // 獲取用戶最近觀看的番劇
    recentlyWatched: (state) => {
      // 對歷史記錄按時間排序，然後取出不重複的番劇ID
      const recentBangumiIds = [...new Set(
        state.history
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map(h => h.bangumiId),
      )].slice(0, 5)

      // 返回這些番劇的完整信息
      return recentBangumiIds.map(id => state.bangumiList.find(b => b.id === id))
        .filter(b => b !== undefined) as Bangumi[]
    },
  },

  actions: {
    // 初始化應用時載入數據
    async initializeApp() {
      this.isLoading = true
      try {
        await this.fetchAllBangumis()
        // 獲取登入用戶的收藏
        if (localStorage.getItem('user')) {
          await this.fetchUserFavorites()
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        this.isLoading = false
      }
    },
  
    // 收藏/取消收藏
    async toggleFavorite(id: number) {
      // 檢查用戶是否登入
      if (!localStorage.getItem('user')) {
        // 未登入時使用本地儲存
        if (this.favorites.includes(id)) {
          this.favorites = this.favorites.filter(f => f !== id)
        } else {
          this.favorites.push(id)
        }
        localStorage.setItem('bangumi-favorites', JSON.stringify(this.favorites))
        return
      }
  
      try {
        if (this.favorites.includes(id)) {
          // 從收藏中移除
          await axios.delete(`${API_URL}/api/Favorite/${id}`)
          this.favorites = this.favorites.filter(f => f !== id)
        } else {
          // 添加到收藏
          await axios.post(`${API_URL}/api/Favorite/${id}`)
          this.favorites.push(id)
        }
        localStorage.setItem('bangumi-favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    },
  
    // 檢查是否已收藏
    isFavorite(id: number) {
      return this.favorites.includes(id)
    },
  
    // 記錄觀看歷史
    async addToHistory(episodeId: number, bangumiId: number, progress: number) {
      // 先移除舊的相同記錄
      this.history = this.history.filter(h => h.episodeId !== episodeId)
      
      // 添加新記錄
      const newRecord = {
        episodeId,
        bangumiId,
        timestamp: new Date().toISOString(),
        progress,
      }
      
      this.history.push(newRecord)
      
      // 只保留最近的50條記錄
      if (this.history.length > 50) {
        this.history = this.history.slice(-50)
      }
      
      localStorage.setItem('bangumi-history', JSON.stringify(this.history))
  
      // 如果用戶已登入，同步到後端
      if (localStorage.getItem('user')) {
        try {
          await axios.post(`${API_URL}/api/WatchHistory`, {
            episodeId,
            progress,
          })
          
          // 同時增加觀看次數
          if (progress === 10) { // 只在開始觀看時增加一次
            await this.incrementEpisodeViews(episodeId)
          }
        } catch (error) {
          console.error('Failed to save watch history to server:', error)
        }
      }
    },
  
    // 獲取觀看進度
    async getWatchProgress(episodeId: number) {
      // 先查詢本地記錄
      const localRecord = this.history.find(h => h.episodeId === episodeId)
      const localProgress = localRecord ? localRecord.progress : 0
      
      // 如果用戶已登入，嘗試從伺服器獲取進度
      if (localStorage.getItem('user')) {
        try {
          const response = await axios.get(`${API_URL}/api/WatchHistory?episodeId=${episodeId}`)
          if (response.data && response.data.length > 0) {
            const serverProgress = response.data[0].progress
            
            // 使用更大的進度值
            return Math.max(localProgress, serverProgress)
          }
        } catch (error) {
          console.error('Failed to fetch watch progress from server:', error)
        }
      }
      
      return localProgress
    },
  
    // 更新過濾條件
    updateFilters(filters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...filters }
    },
  
    // 重置過濾條件
    resetFilters() {
      this.filters = {
        search: '',
        genres: [],
        weekDay: '全部',
        status: 'all',
        sort: 'newest',
      }
    },
  
    // 添加評論
    async addComment(comment: Omit<Comment, 'id'>) {
      // 如果用戶已登入，發送評論到後端
      if (localStorage.getItem('user')) {
        try {
          const response = await axios.post(`${API_URL}/api/Comment`, {
            targetId: comment.targetId,
            targetType: comment.targetType,
            content: comment.content,
          })
          
          // 使用伺服器返回的評論數據更新本地
          this.comments.push(response.data)
          return response.data
        } catch (error) {
          console.error('Failed to add comment:', error)
          throw error
        }
      } else {
        // 未登入，只在本地添加（實際應用中可能需要提示用戶登入）
        const newId = Math.max(0, ...this.comments.map(c => c.id)) + 1
        const newComment = {
          ...comment,
          id: newId,
        }
        this.comments.push(newComment)
        return newComment
      }
    },
    
    // 從 API 獲取所有番劇
    async fetchAllBangumis() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/Bangumi`)
        
        // 替換本地數據
        this.bangumiList = response.data
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error as Error
        this.isLoading = false
        console.error('Error fetching bangumis:', error)
        // 如果 API 請求失敗，使用本地數據作為後備
        console.log('Using local data as fallback')
      }
    },
    
    // 從 API 獲取特定番劇
    async fetchBangumiById(id: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/Bangumi/${id}`)
        
        // 更新或添加到番劇列表
        const index = this.bangumiList.findIndex(b => b.id === id)
        if (index !== -1) {
          this.bangumiList[index] = response.data
        } else {
          this.bangumiList.push(response.data)
        }
        
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error as Error
        this.isLoading = false
        console.error('Error fetching bangumi details:', error)
      }
    },
    
    // 從 API 獲取特定番劇的劇集
    async fetchEpisodesByBangumiId(bangumiId: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/Episode/Bangumi/${bangumiId}`)
        
        // 更新劇集列表
        const newEpisodes = response.data
        
        // 移除當前番劇的所有劇集
        this.episodes = this.episodes.filter(e => e.bangumiId !== bangumiId)
        
        // 添加從 API 獲取的新劇集
        this.episodes = [...this.episodes, ...newEpisodes]
        
        this.isLoading = false
        return newEpisodes
      } catch (error) {
        this.error = error as Error
        this.isLoading = false
        console.error('Error fetching episodes:', error)
      }
    },
    
    // 根據狀態獲取番劇
    async fetchBangumisByStatus(status: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/Bangumi/Status/${status}`)
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error as Error
        this.isLoading = false
        console.error('Error fetching bangumis by status:', error)
      }
    },
    
    // 根據播出日獲取番劇
    async fetchBangumisByWeekDay(weekDay: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/Bangumi/WeekDay/${encodeURIComponent(weekDay)}`)
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error as Error
        this.isLoading = false
        console.error('Error fetching bangumis by weekday:', error)
      }
    },
    
    // 增加劇集觀看次數
    async incrementEpisodeViews(episodeId: number) {
      try {
        await axios.post(`${API_URL}/api/Episode/${episodeId}/IncrementViews`)
        
        // 更新本地數據
        const episode = this.episodes.find(e => e.id === episodeId)
        if (episode) {
          episode.views++
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
      }
    },
  
    // 獲取用戶的收藏
    async fetchUserFavorites() {
      if (!localStorage.getItem('user')) return
      
      try {
        const response = await axios.get(`${API_URL}/api/Favorite`)
        // 更新收藏列表
        this.favorites = response.data.map((item: any) => item.id)
        localStorage.setItem('bangumi-favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Failed to fetch user favorites:', error)
      }
    },
  
    // 獲取用戶的觀看歷史
    async fetchUserWatchHistory() {
      if (!localStorage.getItem('user')) return
      
      try {
        const response = await axios.get(`${API_URL}/api/WatchHistory`)
        // 將從伺服器獲取的歷史記錄合併到本地
        const serverHistory = response.data.map((item: any) => ({
          episodeId: item.episodeId,
          bangumiId: item.bangumiId,
          timestamp: new Date(item.lastWatched).toISOString(),
          progress: item.progress,
        }))
        
        // 合併歷史記錄，優先使用伺服器版本
        const existingEpisodeIds = serverHistory.map((h: any) => h.episodeId)
        const filteredLocalHistory = this.history.filter(h => !existingEpisodeIds.includes(h.episodeId))
        
        this.history = [...serverHistory, ...filteredLocalHistory]
        
        // 保存到本地
        localStorage.setItem('bangumi-history', JSON.stringify(this.history))
      } catch (error) {
        console.error('Failed to fetch user watch history:', error)
      }
    },
  
    // 搜索番劇
    async searchBangumis(query: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/Bangumi/Search?query=${encodeURIComponent(query)}`)
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error as Error
        this.isLoading = false
        console.error('Error searching bangumis:', error)
        // 使用本地過濾作為後備
        return this.bangumiList.filter(b => 
          b.title.toLowerCase().includes(query.toLowerCase()) || 
          b.description.toLowerCase().includes(query.toLowerCase()),
        )
      }
    },
  },
})