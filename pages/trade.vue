<template>
  <div v-if="isLoggedIn" class="page-wrapper">
    <div class="card form">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">交易记录</h1>
        <div v-if="alertMessage" :class="['alert', alertType]" role="alert">{{ alertMessage }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="row mb-3">
            <div class="col-md-6 group">
              <label for="symbol" class="form-label">品种</label>
              <input type="text" class="form-control" id="symbol" v-model="form.symbol" required>
            </div>
            <div class="col-md-6 group">
              <label for="type" class="form-label">交易类型</label>
              <select class="form-select" id="type" v-model="form.type" required>
                <option value="" disabled>请选择交易类型</option>
                <option value="买入">买入</option>
                <option value="卖出">卖出</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4 group">
              <label for="datetime" class="form-label">交易时间</label>
              <input type="datetime-local" class="form-control" id="datetime" v-model="form.datetime" required>
            </div>
            <div class="col-md-4 group">
              <label for="price" class="form-label">价格</label>
              <input type="number" class="form-control" id="price" v-model.number="form.price" step="0.01" required>
            </div>
            <div class="col-md-4 group">
              <label for="quantity" class="form-label">数量</label>
              <input type="number" class="form-control" id="quantity" v-model.number="form.quantity" required>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 group">
              <label for="strategy" class="form-label">策略</label>
              <input type="text" class="form-control" id="strategy" v-model="form.strategy">
            </div>
            <div class="col-md-6 group">
              <label for="marketSentiment" class="form-label">市场情绪</label>
              <select class="form-select" id="marketSentiment" v-model="form.marketSentiment">
                <option value="" disabled>请选择市场情绪</option>
                <option value="看涨">看涨</option>
                <option value="看跌">看跌</option>
                <option value="中性">中性</option>
              </select>
            </div>
          </div>
          <div class="mb-3 group">
            <label for="riskManagement" class="form-label">风险管理</label>
            <input type="text" class="form-control" id="riskManagement" v-model="form.riskManagement">
          </div>
          <div class="mb-3 group">
            <label for="notes" class="form-label">备注</label>
            <textarea class="form-control" id="notes" v-model="form.notes" rows="3"></textarea>
          </div>
          <div class="mb-3 group">
            <label for="reflection" class="form-label">交易反思</label>
            <textarea class="form-control" id="reflection" v-model="form.reflection" rows="3"></textarea>
          </div>
          <div class="mb-3 group">
            <label for="chartImage" class="form-label">图表链接</label>
            <input type="url" class="form-control" id="chartImage" v-model="form.chartImage">
          </div>
          <button type="submit" class="btn btn-primary">提交</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: settings } = await useFetch("/api/settings")
const siteName = settings.value.find(setting => setting.key === "site_name")?.value || "Wayne Wang"

useSeoMeta({
  title: `Trade - ${siteName}`,
  ogTitle: `Trade - ${siteName}`,
  description: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang",
  ogDescription: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang"
})

const { isLoggedIn } = useAuth();

const form = reactive({
  symbol: "",
  type: "买入",
  datetime: "",
  price: null,
  quantity: null,
  strategy: "",
  marketSentiment: "中性",
  riskManagement: "",
  notes: "",
  reflection: "",
  chartImage: ""
});

const alertMessage = ref("");
const alertType = ref("");

const handleSubmit = async () => {
  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error("提交失败");
    }

    await response.json();
    alertMessage.value = "交易记录提交成功";
    alertType.value = "alert-success";

    Object.keys(form).forEach((key) => {
      form[key] = "";
    });
    form.type = "买入";
    form.marketSentiment = "中性";

  } catch (error) {
    console.error("Error:", error);
    alertMessage.value = "提交失败，请稍后重试";
    alertType.value = "alert-danger";
  }

  setTimeout(() => {
    alertMessage.value = "";
    alertType.value = "";
  }, 5000);
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #121212;
}

.form {
  width: 100%;
  max-width: 800px;
  background-color: #1e1e1e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #e0e0e0;
}

.group {
  margin-bottom: 1rem;
}

label {
  color: #b0b0b0;
  font-weight: bold;
}

input,
select,
textarea {
  background-color: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #3c3c3c;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

textarea {
  resize: none;
}

input[type="datetime-local"] {
  color-scheme: dark;
}

.btn-primary {
  background-color: #f26c4f;
  border-color: #f26c4f;
}
</style>