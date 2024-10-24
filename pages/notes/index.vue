<template>
  <div class="page-wrapper">
    <div class="notes-list">
      <h1 class="title">财经日志</h1>
      <div v-if="pending" class="loading">
        <div class="spinner"></div>
      </div>
      <div v-else-if="error" class="error">加载笔记时出错: {{ error }}</div>
      <div v-else class="grid">
        <div v-for="note in notes" :key="note.id" class="card">
          <div class="content">
            <h2 class="card-title">{{ note.symbol }}</h2>
            <p class="type">类型: {{ note.type }}</p>
            <p class="details">价格: {{ note.price }} | 数量: {{ note.quantity }}</p>
            <div class="meta">
              <span class="date">{{ formatDate(note.datetime) }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <NuxtLink :to="`/notes/${note.id}`" class="btn btn-outline-light">阅读更多</NuxtLink>
              <button v-if="isLoggedIn" @click="() => deleteNote(note.id)" class="btn btn-outline-danger">
                <i class="bi bi-trash"></i> 删除
              </button>
            </div>
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
  title: `Notes - ${siteName}`,
  ogTitle: `Notes - ${siteName}`,
  description: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang",
  ogDescription: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang"
})

const { data: notes, pending, error, refresh } = await useLazyFetch("/api/notes");
const { isLoggedIn } = useAuth();

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

const deleteNote = async (noteId) => {
  if (typeof noteId !== "string" && typeof noteId !== "number") {
    console.error("无效的笔记 ID:", noteId);
    return;
  }

  try {
    const response = await $fetch(`/api/notes?id=${noteId}`, { 
      method: "DELETE"
    });
    if (response && response.statusCode === 200) {
      await refresh();
    } else {
      throw new Error("删除失败");
    }
  } catch (error) {
    console.error("删除笔记时出错:", error);
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #000;
  color: #e0e0e0;
}

.notes-list {
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

.type,
.details {
  margin-bottom: 0.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.meta {
  margin-bottom: 1rem;
  color: #808080;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline-light {
  color: #f26c4f;
  border-color: #f26c4f;
}

.btn-outline-light:hover {
  color: #fff;
  background-color: #f26c4f;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
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