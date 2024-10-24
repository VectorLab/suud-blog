<template>
  <footer id="footer" class="mt-5">
    <div class="text-dark bg-white">
      <div class="container py-3 position-relative">
        <span>Copyright &copy; {{ username }}</span>
        <br />
        <small>Powered by <a href="https://poshim.com/" target="_blank">POSHIM LLC</a></small>
        <a href="#" class="back-up bg-dark position-absolute end-0 top-0 scroll">
          <i class="bi bi-arrow-up-circle"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { data: settings } = await useFetch("/api/settings")

const username = computed(() => 
  settings.value.find(s => s.key === "username")?.value || "Wayne Wang"
)
</script>

<style scoped>
.back-up {
  transform: translateY(-50%);
  border-radius: 50%;
  display: inline-block;
  height: 3rem;
  flex: 0 0 3rem;
  overflow: hidden;
  text-align: center;
  line-height: 3rem;
  width: 3rem
}
</style>