<template>
  <div v-if="isLoggedIn" class="page-wrapper">
    <div class="container py-4">
      <div v-if="user" class="text-center mb-5">
        <img v-if="user.avatar" :src="user.avatar" alt="用户头像" class="rounded-circle avatar mb-3" />
        <h2 class="mb-3">欢迎 {{ user.username }}</h2>
        <button @click="handleLogout" class="btn btn-outline-danger">退出登录</button>
      </div>
      <div v-else>
        <p class="text-center">正在加载用户信息...</p>
      </div>
      <div class="row justify-content-center mb-5">
        <div class="col-md-3 col-6 mb-3 mb-md-0">
          <a href="/editor" class="btn btn-accent w-100 text-center">专栏文章</a>
        </div>
        <div class="col-md-3 col-6">
          <a href="/trade" class="btn btn-accent w-100 text-center">财经日志</a>
        </div>
      </div>
      <div v-if="!loading" class="settings-form">
        <div class="row">
          <div class="col-md-8">
            <div class="card bg-card mb-4">
              <div class="card-header bg-header">
                <h3>General Settings</h3>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label for="site_name" class="form-label">Site Name</label>
                  <input v-model="settings.site_name" id="site_name" type="text" class="form-control bg-input">
                </div>
                <div class="mb-3">
                  <label for="site_description" class="form-label">Site Description</label>
                  <textarea v-model="settings.site_description" id="site_description" class="form-control bg-input"></textarea>
                </div>
                <div class="mb-3">
                  <label for="site_keywords" class="form-label">Site Keywords</label>
                  <input v-model="settings.site_keywords" id="site_keywords" type="text" class="form-control bg-input">
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card bg-card mb-4">
              <div class="card-header bg-header">
                <h3>Hero Images</h3>
              </div>
              <div class="card-body">
                <div class="form-group row">
                  <div class="col-md-12 mb-3">
                    <label for="hero_image" class="form-label">Hero Image URL</label>
                    <input v-model="settings.hero_image[0]" id="hero_image" type="text" class="form-control bg-input">
                  </div>
                  <div class="col-md-12 mb-3">
                    <label for="hero_image_sm" class="form-label">Hero Image Small URL</label>
                    <input v-model="settings.hero_image[1]" id="hero_image_sm" type="text" class="form-control bg-input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card bg-card mb-4">
              <div class="card-header bg-header">
                <h3>Traits</h3>
              </div>
              <div class="card-body">
                <div v-for="(trait, index) in settings.trait" :key="index" class="form-group row align-items-center mb-3">
                  <div class="col-9">
                    <input v-model="settings.trait[index]" type="text" class="form-control bg-input">
                  </div>
                  <div class="col-3">
                    <button @click="removeTrait(index)" type="button" class="btn btn-danger btn-sm w-100">Remove</button>
                  </div>
                </div>
                <button @click="addTrait" type="button" class="btn btn-accent w-100">Add Trait</button>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card bg-card mb-4">
              <div class="card-header bg-header">
                <h3>About Section</h3>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label for="about_description" class="form-label">About Description</label>
                  <textarea v-model="settings.about_description" id="about_description" class="form-control bg-input"></textarea>
                </div>
                <div class="mb-3">
                  <label for="about_image" class="form-label">About Image URL</label>
                  <input v-model="settings.about_image" id="about_image" type="text" class="form-control bg-input">
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card bg-card mb-4">
              <div class="card-header bg-header">
                <h3>Trading Records</h3>
              </div>
              <div class="card-body">
                <div v-for="(record, index) in tradingRecordTitles" :key="index" class="mb-3">
                  <label :for="'trading_record_' + index" class="form-label">{{ record }}</label>
                  <input :id="'trading_record_' + index" v-model="settings.trading_record[index]" type="text" class="form-control bg-input">
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-8">
            <div class="card bg-card mb-4">
              <div class="card-header bg-header">
                <h3>Contact Information</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div v-for="(field, index) in ['address', 'phone', 'email', 'chat']" :key="field" class="col-md-6 mb-3">
                    <label :for="'contact_' + field + '1'" class="form-label">{{ field.charAt(0).toUpperCase() + field.slice(1) }} 1</label>
                    <input v-model="settings['contact_' + field][0]" :id="'contact_' + field + '1'" :type="field === 'email' ? 'email' : 'text'" class="form-control bg-input">
                    <label :for="'contact_' + field + '2'" class="form-label">{{ field.charAt(0).toUpperCase() + field.slice(1) }} 2</label>
                    <input v-model="settings['contact_' + field][1]" :id="'contact_' + field + '2'" :type="field === 'email' ? 'email' : 'text'" class="form-control bg-input">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button @click="saveSettings" class="btn btn-accent btn-lg">保存设置</button>
        </div>
      </div>
      <div v-else class="text-center">
        <div class="spinner-border text-accent" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, isLoggedIn, setUser, logout } = useAuth();
const route = useRoute();
const settings = ref({
  site_name: "",
  site_description: "",
  site_keywords: "",
  username: "",
  trait: [],
  hero_image: ["", ""],
  about_description: "",
  about_image: "",
  trading_record: ["", "", "", ""],
  contact_address: ["", ""],
  contact_phone: ["", ""],
  contact_email: ["", ""],
  contact_chat: ["", ""]
});
const loading = ref(true);
const tradingRecordTitles = ["股票投资", "期货期权", "差价合约", "大宗商品"];

onMounted(async () => {
  loading.value = true;
  try {
    const params = {
      h: route.query.sso_h,
      b: route.query.sso_b
    };
    if (params.h && params.b) {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        isLoggedIn.value = true;
        console.log("用户数据:", userData);
      } else {
        throw new Error("登录失败");
      }
    }
    const response = await fetch("/api/settings");
    const data = await response.json();
    data.forEach(item => {
      if (["trait", "hero_image", "trading_record", "contact_address", "contact_phone", "contact_email", "contact_chat"].includes(item.key)) {
        settings.value[item.key] = JSON.parse(item.value);
      } else {
        settings.value[item.key] = item.value;
      }
    });
    const siteName = settings.value.site_name || "Wayne Wang";
    useSeoMeta({
      title: `Dashboard - ${siteName}`,
      ogTitle: `Dashboard - ${siteName}`,
      description: settings.value.site_description || "Official Website of Wayne Wang",
      ogDescription: settings.value.site_description || "Official Website of Wayne Wang"
    });
  } catch (error) {
    console.error("登录错误:", error);
  } finally {
    loading.value = false;
  }
});

const addTrait = () => {
  settings.value.trait.push("");
};

const removeTrait = index => {
  settings.value.trait.splice(index, 1);
};

const saveSettings = async () => {
  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings.value)
    });
    if (response.ok) {
      alert("Settings saved successfully");
    } else {
      throw new Error("Failed to save settings");
    }
  } catch (error) {
    console.error("Error saving settings:", error);
    alert("Failed to save settings");
  }
};

const handleLogout = () => {
  logout();
  window.location.href = "/";
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #1e1e1e;
  color: #e0e0e0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 2px solid #f26c4f;
}
.bg-card {
  background-color: #252525;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
}
.bg-header {
  background-color: #3a3a3a;
  color: #ffffff;
}
.bg-input {
  background-color: #3a3a3a;
  border: none;
  color: #ffffff;
}
.form-label {
  color: #ffffff; /* 设置所有表单标签为白色 */
}
.btn-accent {
  background-color: #f26c4f;
  border-color: #f26c4f;
  color: #ffffff;
}
.btn-accent:hover {
  background-color: #e05a3f;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
