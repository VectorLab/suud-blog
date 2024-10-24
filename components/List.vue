<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Columns</div>
          <div class="card-body">
            <div v-if="articlesPending">Loading columns...</div>
            <div v-else-if="articlesError">{{ articlesError }}</div>
            <ul v-else class="list-group list-group-flush article-list">
              <li v-for="article in sortedArticles" :key="article.id" class="list-group-item">
                <NuxtLink :to="`/columns/${article.id}`">{{ article.title }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Notes</div>
          <div class="card-body">
            <div v-if="notesPending">Loading notes...</div>
            <div v-else-if="notesError">{{ notesError }}</div>
            <ul v-else class="list-group list-group-flush note-list">
              <li v-for="note in sortedNotes" :key="note.id" class="list-group-item">
                <NuxtLink :to="`/notes/${note.id}`">{{ getNoteTitle(note) }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: articles, pending: articlesPending, error: articlesError } = await useFetch("/api/articles");
const { data: notes, pending: notesPending, error: notesError } = await useFetch("/api/notes");

const sortedArticles = computed(() => {
  if (!articles.value) return [];
  return [...articles.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const sortedNotes = computed(() => {
  if (!notes.value) return [];
  return [...notes.value].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
});

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const getNoteTitle = (note) => {
  return `${note.symbol} - ${note.type} - ${formatDate(note.datetime)}`;
};
</script>

<style scoped>
.card {
  background-color: #1e1e1e;
  border: 1px solid #333;
}

.card-header {
  background-color: #282828;
  color: #e0e0e0;
  font-weight: bold;
}

.card-body {
  background-color: #1e1e1e;
}

.list-group-item {
  background-color: #1e1e1e;
  border-color: #333;
  color: #e0e0e0;
  transition: background-color 0.2s;
}

.list-group-item a {
  color: #e0e0e0;
  text-decoration: none;
}

.list-group-item:hover {
  background-color: #282828;
}

.article-list,
.note-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>