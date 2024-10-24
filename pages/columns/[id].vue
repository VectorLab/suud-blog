<template>
  <div class="container-fluid bg-dark text-light">
    <div class="article-header">
      <div class="d-flex justify-content-between align-items-center">
        <h1 class="display-4">{{ article?.title }}</h1>
        <div v-if="isLoggedIn">
          <button @click="editArticle" class="btn btn-outline-light me-2">
            <i class="bi bi-pencil"></i> 编辑文章
          </button>
          <button @click="deleteArticle" class="btn btn-outline-danger">
            <i class="bi bi-trash"></i> 删除文章
          </button>
        </div>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-lg-8">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger" role="alert">
          加载文章时出错: {{ error }}
        </div>
        <div v-else class="article-container">
          <div class="article-content mb-4" v-html="renderedContent"></div>
          <div v-if="alert" :class="['alert', `alert-${alert.type}`, 'alert-dismissible', 'fade', 'show']" role="alert">
            {{ alert.message }}
            <button type="button" class="btn-close" @click="closeAlert" aria-label="Close"></button>
          </div>
          <h2 class="h3 mb-3">评论</h2>
          <div v-if="commentsLoading" class="text-center">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">加载评论中...</span>
            </div>
          </div>
          <div v-else-if="commentsError" class="alert alert-warning" role="alert">
            加载评论时出错: {{ commentsError }}
          </div>
          <div v-else>
            <div v-for="comment in comments" :key="comment.id" class="card comment-card mb-3 bg-secondary text-light">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">{{ comment.author }}</h5>
                  <small class="text-light">{{ formatDate(comment.created_at) }}</small>
                </div>
                <p class="card-text">{{ comment.content }}</p>
                <button v-if="isLoggedIn" @click="deleteComment(comment.id)" class="btn btn-sm btn-outline-danger btn-delete">
                  <i class="bi bi-trash"></i> 删除
                </button>
              </div>
            </div>
          </div>
          <form @submit.prevent="addComment" class="mt-4">
            <h3 class="h4 mb-3">添加评论</h3>
            <div class="mb-3">
              <label for="author" class="form-label">联合社区ID</label>
              <input v-model="newComment.author" type="text" class="form-control bg-secondary text-light" id="author" required>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">评论内容</label>
              <textarea v-model="newComment.content" class="form-control bg-secondary text-light" id="content" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-chat-left-text"></i> 提交评论
            </button>
          </form>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="sidebar">
          <div class="card mb-4 bg-secondary text-light">
            <div class="card-body">
              <h5 class="card-title">目录</h5>
              <nav id="toc" class="toc-nav">
                <ul class="nav flex-column">
                  <li v-for="heading in tableOfContents" :key="heading.id" class="nav-item">
                    <a :href="`#${heading.id}`" class="nav-link text-light">{{ heading.text }}</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div class="card mb-4 bg-secondary text-light">
            <div class="card-body">
              <h5 class="card-title">文章信息</h5>
              <p class="card-text">发布日期: {{ formatDate(article?.created_at) }}</p>
              <p class="card-text">阅读时间: {{ readingTime }} 分钟</p>
              <p class="card-text">字数: {{ wordCount }} 字</p>
            </div>
          </div>
          <div class="card mb-4 bg-secondary text-light">
            <div class="card-body">
              <h5 class="card-title">最近文章</h5>
              <ul class="list-group list-group-flush">
                <li v-for="recentArticle in recentArticles" :key="recentArticle.id" class="list-group-item bg-secondary text-light">
                  <a :href="`/article/${recentArticle.id}`" class="text-light">{{ recentArticle.title }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from "marked";

const { isLoggedIn } = useAuth();

const route = useRoute();
const article = ref(null);
const loading = ref(true);
const error = ref(null);
const comments = ref([]);
const commentsLoading = ref(true);
const commentsError = ref(null);
const newComment = ref({ author: "", content: "" });
const alert = ref(null);
const recentArticles = ref([]);
const tableOfContents = ref([]);

// 使用 useAsyncData 来获取设置
const { data: settings } = await useAsyncData('settings', () => $fetch('/api/settings'));

// 计算属性：网站名称
const siteName = computed(() => {
  return settings.value?.find(setting => setting.key === "site_name")?.value || "Wayne Wang";
});

// 计算属性：网站描述
const siteDescription = computed(() => {
  return settings.value?.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang";
});

// 使用 watchEffect 来更新 SEO 元数据
watchEffect(() => {
  useSeoMeta({
    title: article.value ? `${article.value.title} - ${siteName.value}` : `Columns - ${siteName.value}`,
    ogTitle: article.value ? `${article.value.title} - ${siteName.value}` : `Columns - ${siteName.value}`,
    description: siteDescription.value,
    ogDescription: siteDescription.value
  });
});

const readingTime = computed(() => {
  const words = article.value?.content.split(/\s+/).length || 0;
  return Math.ceil(words / 200);
});

const wordCount = computed(() => {
  return article.value?.content.split(/\s+/).length || 0;
});

const renderedContent = computed(() => {
  return article.value ? marked(article.value.content) : "";
});

onMounted(async () => {
  const articleId = route.params.id;
  await Promise.all([
    fetchArticle(articleId),
    fetchComments(articleId),
    fetchAllArticles()
  ]);
  generateTableOfContents();
});

const fetchArticle = async (articleId) => {
  try {
    const response = await fetch(`/api/articles?id=${articleId}`);
    if (!response.ok) {
      throw new Error("获取文章详情失败");
    }
    article.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const fetchComments = async (articleId) => {
  try {
    const response = await fetch(`/api/comments?articleId=${articleId}`);
    if (!response.ok) {
      throw new Error("获取评论失败");
    }
    comments.value = await response.json();
  } catch (e) {
    commentsError.value = e.message;
  } finally {
    commentsLoading.value = false;
  }
};

const fetchAllArticles = async () => {
  try {
    const response = await fetch("/api/articles");
    if (!response.ok) {
      throw new Error("获取文章列表失败");
    }
    const allArticles = await response.json();
    recentArticles.value = allArticles.slice(0, 5);
  } catch (e) {
    console.error("获取文章列表时出错:", e);
  }
};

const generateTableOfContents = () => {
  const headings = document.querySelectorAll(".article-content h1, .article-content h2, .article-content h3");
  tableOfContents.value = Array.from(headings).map(heading => ({
    id: heading.id,
    text: heading.textContent,
    level: parseInt(heading.tagName.charAt(1))
  }));
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [datePart, timePart] = dateString.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  const date = new Date(year, month - 1, day, hour, minute);
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return date.toLocaleString("zh-CN", options);
};

const editArticle = () => {
  window.location.href = `/editor/${article.value.id}`;
};

const deleteArticle = async () => {
  try {
    const response = await fetch(`/api/articles?id=${article.value.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("删除文章失败");
    }
    showAlert("success", "文章已成功删除");
    window.location.href = "/columns";
  } catch (e) {
    showAlert("danger", `删除文章时出错: ${e.message}`);
  }
};

const addComment = async () => {
  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleId: article.value.id,
        author: newComment.value.author,
        content: newComment.value.content,
        created_at: new Date().toISOString().replace("T", " ").split(".")[0]
      }),
    });
    if (!response.ok) {
      throw new Error("添加评论失败");
    }
    showAlert("success", "评论已成功添加");
    newComment.value = { author: "", content: "" };
    await fetchComments(article.value.id);
  } catch (e) {
    showAlert("danger", `添加评论时出错: ${e.message}`);
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`/api/comments?commentId=${commentId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("删除评论失败");
    }
    showAlert("success", "评论已成功删除");
    await fetchComments(article.value.id);
  } catch (e) {
    showAlert("danger", `删除评论时出错: ${e.message}`);
  }
};

const showAlert = (type, message) => {
  alert.value = { type, message };
  setTimeout(() => {
    closeAlert();
  }, 5000);
};

const closeAlert = () => {
  alert.value = null;
};
</script>

<style scoped>
body {
  background-color: #1a1a1a;
}

.article-content {
  line-height: 1.8;
}

.btn-primary {
  background-color: #f26c4f;
  border-color: #f26c4f;
}

.btn-outline-light {
  border-color: #f26c4f;
  color: #f26c4f;
}

.btn-outline-light:hover {
  background-color: #f26c4f;
  border-color: #f26c4f;
  color: #fff;
}

.comment-card {
  transition: all 0.3s ease;
}

.comment-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-delete {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.btn-delete:hover {
  opacity: 1;
}

.bg-dark {
  background-color: #1a1a1a !important;
}

.bg-secondary {
  background-color: #2c2c2c !important;
}

.text-light {
  color: #f8f9fa !important;
}

.card {
  border-color: #444;
  margin-bottom: 1.5rem;
}

.form-control {
  border-color: #444;
}

.form-control:focus {
  border-color: #555;
  box-shadow: 0 0 0 0.2rem hsla(0, 0%, 100%, 0.25);
}

.sidebar {
  padding-right: 0;
}

.toc-nav .nav-link {
  font-size: 0.9rem;
  padding: 0.5rem 0;
}

.toc-nav .nav-link:hover {
  background-color: hsla(0, 0%, 100%, 0.1);
  border-radius: 4px;
}

.container-fluid {
  padding: 3rem 2rem;
}

.article-container,
.article-header,
.sidebar {
  padding: 0;
}

.row {
  margin-left: -1rem;
  margin-right: -1rem;
}

.col-lg-4,
.col-lg-8 {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (max-width: 991.98px) {
  .container-fluid {
    padding: 2rem 1rem;
  }

  .article-header,
  .article-header h1 {
    margin-bottom: 1rem;
  }
}
</style>