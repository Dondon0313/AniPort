🔹 1. 動畫網站初始架構
導覽列（首頁、番劇列表、觀看平台）

主頁框架（含 <RouterView> 切換頁面）

使用 Vue Router 管理路由（router/index.ts）

🔹 2. 番劇列表頁（BangumiList.vue）
動畫卡片顯示（含圖片、標題、播出日）

卡片點擊可跳轉至詳細頁

篩選功能：搜尋（模糊比對）、星期篩選按鈕

💡 UI 強化：hover 動畫、卡片陰影、文字截斷

🔹 3. 番劇詳細頁（BangumiDetail.vue）
顯示單一番劇圖片、標題、播出日與簡介

使用 useRoute 解析 URL 傳入的 id

整合 Store 資料，動態抓取該番劇內容

🔹 4. Pinia 狀態管理（useBangumiStore.ts）
管理 bangumiList 番劇資料

新增 favorites 收藏列表（同步 localStorage）

加入 toggleFavorite() / isFavorite() 收藏控制方法

🔹 5. 我的收藏頁面（FavoriteList.vue）
顯示使用者收藏的動畫卡片

若未收藏則提示「目前沒有收藏動畫」

卡片可點擊進入動畫詳細頁
