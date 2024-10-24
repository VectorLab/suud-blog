<template>
  <div class="page-wrapper">
    <div class="article-list">
      <h1 class="title">专栏文章</h1>
      <div v-if="pending" class="loading">
        <div class="spinner"></div>
      </div>
      <div v-else-if="error" class="error">加载文章时出错: {{ error }}</div>
      <div v-else class="grid">
        <div v-for="article in articles" :key="article.id" class="card">
          <div class="content">
            <h2 class="card-title">{{ article.title }}</h2>
            <p class="excerpt">{{ article.content.substring(0, 100) }}...</p>
            <div class="meta">
              <span class="date">{{ formatDate(article.created_at) }}</span>
            </div>
            <NuxtLink :to="`/columns/${article.id}`" class="btn btn-outline-light">阅读更多</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: settings } = await useFetch("/api/settings")
const siteName = settings.value.find(setting => setting.key === "site_name")?.value || "Wayne Wang"

useSeoMeta({
  title: `Columns - ${siteName}`,
  ogTitle: `Columns - ${siteName}`,
  description: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang",
  ogDescription: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang"
})

const { data: articles, pending, error } = await useLazyFetch("/api/articles");

const formatDate = (dateString) => {
  if (!dateString) return "日期未知";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "无效日期";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #000;
  color: #e0e0e0;
}

.article-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  margin-bottom: 2rem;
  color: #fff;
  font-size: 2.5rem;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  overflow: hidden;
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.content {
  padding: 1.5rem;
}

.card-title {
  margin-bottom: 0.5rem;
  color: #fff;
  font-size: 1.25rem;
}

.excerpt {
  margin-bottom: 1rem;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #808080;
  font-size: 0.8rem;
}

.btn-outline-light {
  color: #f26c4f;
  border-color: #f26c4f;
}

.btn-outline-light:hover {
  color: #fff;
  background-color: #f26c4f;
  border-color: #f26c4f;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #3490dc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  margin-top: 2rem;
  color: #e3342f;
  font-size: 1.1rem;
  text-align: center;
}
</style>