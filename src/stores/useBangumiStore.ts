import { defineStore } from 'pinia'

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
      },
      {
        id: 2,
        title: '我推的孩子 第二季',
        image: '/images/我推.jpg',
        airDate: '2025-04-06',
        weekDay: '星期日',
        description: '偶像與轉生的交錯命運，再次揭開娛樂圈的真相。',
      },
      {
        id: 3,
        title: '無職轉生 第二季',
        image: '/images/無職.jpg',
        airDate: '2025-04-07',
        weekDay: '星期一',
        description: '重生的魯迪烏斯展開全新冒險與成長，走出過去陰影。',
      },
      {
        id: 4,
        title: '吹響吧！上低音號 第三季',
        image: '/images/低音號.jpg',
        airDate: '2025-04-08',
        weekDay: '星期二',
        description: '久美子與北宇治高中吹奏部邁向全國大賽的最後挑戰。',
      },
    ],
    favorites: JSON.parse(localStorage.getItem('bangumi-favorites') || '[]') as number[],
  }),

  getters: {
    favoriteBangumis(state) {
      return state.bangumiList.filter(item => state.favorites.includes(item.id))
    },
  },

  actions: {
    toggleFavorite(id: number) {
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter(f => f !== id)
      } else {
        this.favorites.push(id)
      }
      localStorage.setItem('bangumi-favorites', JSON.stringify(this.favorites))
    },

    isFavorite(id: number) {
      return this.favorites.includes(id)
    },
  },
})


