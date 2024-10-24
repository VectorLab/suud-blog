<template>
  <div class="background pt-4 pb-5" data-bs-theme="dark">
    <div class="container">
      <h1 class="mb-4 text-white">交易日志</h1>
      <div v-if="trade">
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="mb-0">技术分析</h5>
          </div>
          <div class="card-body text-center">
            <img v-if="trade.chartImage" :src="trade.chartImage" class="img-fluid mx-auto d-block" alt="技术分析图表">
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-header bg-primary">
            <h5 class="mb-0">{{ trade.symbol }} - {{ trade.type }}</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>时间:</strong> {{ formatDateTime(trade.datetime) }}</p>
                <p><strong>价格:</strong> ${{ trade.price.toFixed(2) }}</p>
                <p><strong>数量:</strong> {{ trade.quantity }}</p>
                <p><strong>总值:</strong> ${{ (trade.price * trade.quantity).toFixed(2) }}</p>
                <p><strong>交易策略:</strong> {{ trade.strategy }}</p>
                <p><strong>市场情绪:</strong> {{ trade.marketSentiment }}</p>
                <p><strong>风险管理:</strong> {{ trade.riskManagement }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>备注:</strong></p>
                <p>{{ trade.notes }}</p>
                <p><strong>复盘:</strong></p>
                <p>{{ trade.reflection }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger mt-4">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
const { data: settings } = await useFetch("/api/settings")
const siteName = settings.value.find(setting => setting.key === "site_name")?.value || "Wayne Wang"

const route = useRoute();
const trade = ref(null);
const error = ref(null);

useSeoMeta({
  title: trade.value ? `${trade.value.symbol} - ${siteName}` : `交易日志 - ${siteName}`,
  ogTitle: trade.value ? `${trade.value.symbol} - ${siteName}` : `交易日志 - ${siteName}`,
  description: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang",
  ogDescription: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang"
});

onMounted(async () => {
  await fetchTradeData();
});

const fetchTradeData = async () => {
  const id = route.params.id;
  if (!id) {
    error.value = "No trade ID provided";
    return;
  }

  try {
    const response = await fetch(`/api/notes?id=${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch trade data");
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      trade.value = data[0];
    } else if (typeof data === "object" && data !== null) {
      trade.value = data;
    } else {
      throw new Error("Trade not found");
    }
  } catch (err) {
    console.error("Error fetching trade data:", err);
    error.value = err.message;
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.background {
  min-height: 100vh;
  background-color: #222529;
}

.card {
  margin: 20px 0;
  border-radius: 15px;
  background-color: rgba(42, 42, 64, 0.8);
  color: #ffffff;
}

.card-header {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.img-fluid {
  border-radius: 10px;
}
</style>