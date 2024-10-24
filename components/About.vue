<template>
  <section id="about" class="block mt-5">
    <div class="container">
      <div class="title text-center">
        <h2>About Me</h2>
      </div>
      <div class="row align__vertical">
        <div class="col-md-6">
          <img :src="aboutImage" alt="" class="mw-100 mb-5">
        </div>
        <div class="col-md-6">
          <h4>Hello There</h4>
          <p>{{ aboutDescription }}</p>
          <dl class="symbol">
            <template v-for="(item, index) in tradingRecords" :key="index">
              <dt>{{ item.title }}</dt>
              <dd>{{ item.value }}</dd>
            </template>
          </dl>
          <hr class="hr-light mb-5">
          <div class="container">
            <div class="row text-center">
              <div class="col">
                <a href="/notes" class="btn btn-outline-light btn-border-light">
                  <i class="bi bi-card-checklist"></i> 查看交易记录
                </a>
              </div>
              <div class="col">
                <a href="/columns" class="btn btn-outline-light btn-border-light">
                  <i class="bi bi-card-heading"></i> 查看品种分析
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data: settings } = await useFetch("/api/settings");

const aboutImage = computed(() => 
  settings.value.find(s => s.key === "about_image")?.value || "/gold.png"
);

const aboutDescription = computed(() => 
  settings.value.find(s => s.key === "about_description")?.value || ""
);

const tradingRecords = computed(() => {
  const records = JSON.parse(settings.value.find(s => s.key === "trading_record")?.value || "[]");
  const titles = ["股票投资", "期货期权", "差价合约", "大宗商品"];
  return titles.map((title, index) => ({
    title,
    value: records[index] || ""
  }));
});
</script>

<style scoped>
.symbol {
  column-count: 2;
}

.hr-light {
  border-color: hsla(0, 0%, 100%, 0.5);
}
</style>