<template>
  <div v-if="isLoggedIn" class="editor bg-dark text-light">
    <div v-if="alert" :class="['alert', `alert-${alert.type}`]" role="alert">{{ alert.message }}</div>
    <div class="editor-header">
      <input v-model="title" class="editor-title form-control bg-secondary text-light" placeholder="输入文章标题">
    </div>
    <div class="editor-body">
      <div class="editor-main">
        <h5 class="editor-section-title">编辑器</h5>
        <div class="editor-toolbar">
          <button @click="insertMarkdown('**')" class="btn btn-sm btn-outline-light" title="加粗">
            <i class="bi bi-type-bold"></i>
          </button>
          <button @click="insertMarkdown('*')" class="btn btn-sm btn-outline-light" title="斜体">
            <i class="bi bi-type-italic"></i>
          </button>
          <button @click="insertMarkdown('# ')" class="btn btn-sm btn-outline-light" title="标题">
            <i class="bi bi-type-h1"></i>
          </button>
          <button @click="insertMarkdown('- ')" class="btn btn-sm btn-outline-light" title="列表">
            <i class="bi bi-list-task"></i>
          </button>
        </div>
        <textarea v-model="markdownContent" class="editor-textarea" placeholder="输入Markdown内容..."></textarea>
      </div>
      <div class="editor-preview">
        <h5 class="editor-section-title">预览</h5>
        <div class="preview-content" v-html="renderedContent"></div>
      </div>
    </div>
    <div class="editor-footer">
      <div class="btn-group">
        <input type="datetime-local" v-model="utcCreatedAt" class="btn btn-outline-secondary">
        <button @click="updateArticle" class="btn btn-primary">更新文章</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from "marked";

const { data: settings } = await useFetch("/api/settings")
const siteName = settings.value.find(setting => setting.key === "site_name")?.value || "Wayne Wang"

useSeoMeta({
  title: `Editor - ${siteName}`,
  ogTitle: `Editor - ${siteName}`,
  description: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang",
  ogDescription: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang"
})

const { isLoggedIn } = useAuth();
const route = useRoute();
const markdownContent = ref("");
const title = ref("");
const utcCreatedAt = ref("");
const alert = ref(null);

onMounted(async () => {
  const articleId = route.params.id;
  if (articleId) {
    try {
      const response = await fetch(`/api/articles?id=${articleId}`);
      if (!response.ok) throw new Error("获取文章失败");
      const article = await response.json();
      title.value = article.title;
      markdownContent.value = article.content;
      utcCreatedAt.value = article.created_at.slice(0, 16);
    } catch (error) {
      console.error("加载文章时出错:", error);
      showAlert("danger", `加载文章时出错: ${error.message}`);
    }
  }
});

const renderedContent = computed(() => marked(markdownContent.value));

const insertMarkdown = (syntax) => {
  const textarea = document.querySelector("textarea");
  const { selectionStart, selectionEnd } = textarea;
  const text = markdownContent.value;
  const before = text.substring(0, selectionStart);
  const selected = text.substring(selectionStart, selectionEnd);
  const after = text.substring(selectionEnd);
  markdownContent.value = `${before}${syntax}${selected}${syntax}${after}`;
  textarea.focus();
  textarea.setSelectionRange(selectionStart + syntax.length, selectionEnd + syntax.length);
};

const showAlert = (type, message) => {
  alert.value = { type, message };
  setTimeout(() => {
    alert.value = null;
  }, 5000);
};

const updateArticle = async () => {
  if (!title.value || !markdownContent.value || !utcCreatedAt.value) {
    showAlert("warning", "请确保标题、内容和创建时间（UTC）都已填写");
    return;
  }

  try {
    const response = await fetch(`/api/articles?id=${route.params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: route.params.id,
        title: title.value,
        content: markdownContent.value,
        created_at: `${utcCreatedAt.value}:00.000Z`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "更新失败");
    }

    showAlert("success", "文章更新成功！");
    window.location.href = "/columns";
  } catch (error) {
    console.error("更新文章时出错:", error);
    showAlert("danger", `更新文章时出错：${error.message}`);
  }
};
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  background-color: #1e1e1e;
}

.editor-header {
  margin-bottom: 20px;
}

.editor-title {
  width: 100%;
  padding: 10px;
  background-color: #3a3a3a;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1.5em;
}

.editor-title::placeholder {
  color: #aaaaaa;
}

.editor-body {
  display: flex;
  flex-grow: 1;
  gap: 20px;
  overflow: hidden;
}

.editor-main,
.editor-preview {
  display: flex;
  flex-direction: column;
  width: 50%;
  overflow: hidden;
  border: 1px solid #3a3a3a;
  border-radius: 5px;
}

.editor-section-title {
  margin: 0;
  padding: 10px;
  background-color: #3a3a3a;
  color: #ffffff;
  font-size: 1em;
  font-weight: normal;
}

.editor-toolbar {
  display: flex;
  gap: 5px;
  padding: 10px;
  background-color: #252525;
  border-bottom: 1px solid #3a3a3a;
}

.editor-toolbar .btn {
  padding: 5px 10px;
  border-color: #4a4a4a;
  font-size: 0.9em;
}

.editor-textarea,
.preview-content {
  flex-grow: 1;
  padding: 10px;
  background-color: #252525;
  border: none;
  color: #ffffff;
  overflow-y: auto;
  resize: none;
}

.editor-textarea::placeholder {
  color: #aaaaaa;
}

.editor-footer {
  margin-top: 20px;
  text-align: right;
}

.btn-group {
  display: inline-flex;
}

.btn-group input[type="datetime-local"] {
  background-color: #3a3a3a;
  border-color: #4a4a4a;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  color: #ffffff;
}

.btn-group input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.btn-group .btn-primary {
  background-color: #f26c4f;
  border-color: #f26c4f;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.alert {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .editor-body {
    flex-direction: column;
  }

  .editor-main,
  .editor-preview {
    width: 100%;
    height: 50%;
  }

  .editor-main {
    margin-bottom: 10px;
  }
}
</style>