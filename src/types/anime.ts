export interface Bangumi {
    id: number;
    title: string;
    image: string;
    airDate: string;
    weekDay: string;
    description: string;
    totalEpisodes: number;
    genres: string[];
    rating: number;
    studio: string;
    status: 'upcoming' | 'ongoing' | 'completed';
  }
  
  export interface Episode {
    id: number;
    bangumiId: number;
    number: number;
    title: string;
    airDate: string;
    duration: string;
    description: string;
    thumbnail: string;
    videoUrl?: string;
    views: number;
  }
  
  export interface Comment {
    id: number;
    targetId: number; // bangumiId or episodeId
    targetType: 'bangumi' | 'episode';
    userId: string;
    username: string;
    avatar: string;
    content: string;
    date: string;
    rating?: number; // 評分 (1-5)
  }