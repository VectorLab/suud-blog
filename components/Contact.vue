<template>
  <section id="contact" class="block mt-5">
    <div class="container">
      <div class="title text-center">
        <h2 class="bubble-border">Get In Touch</h2>
      </div>
      <div class="row xs-text-center">
        <div v-for="(item, index) in contactItems" :key="index" class="col-6 col-md-3 mb-4">
          <i :class="`bi ${item.icon} display-4 mb-4`" :alt="item.title"></i>
          <h5>{{ item.title }}</h5>
          <div class="opacity-50">
            <figure v-for="line in item.lines" :key="line" class="mb-0">{{ line }}</figure>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data: settings } = await useFetch("/api/settings");

const contactItems = computed(() => [
  {
    icon: "bi-geo-alt-fill",
    title: "Address",
    lines: JSON.parse(settings.value.find(s => s.key === "contact_address")?.value || "[]"),
  },
  {
    icon: "bi-telephone-fill",
    title: "Phone",
    lines: JSON.parse(settings.value.find(s => s.key === "contact_phone")?.value || "[]"),
  },
  {
    icon: "bi-envelope-fill",
    title: "Email",
    lines: JSON.parse(settings.value.find(s => s.key === "contact_email")?.value || "[]"),
  },
  {
    icon: "bi-chat-dots-fill",
    title: "Chat",
    lines: JSON.parse(settings.value.find(s => s.key === "contact_chat")?.value || "[]"),
  },
]);
</script>

<style scoped>

</style>