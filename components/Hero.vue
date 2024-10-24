<template>
  <div class="hero">
    <div class="container position-relative h-100 hero-container">
      <div class="row w-100">
        <div class="col-md-8">
          <h1>I am {{ username }}</h1>
          <h1 class="bubble-border" ref="bubbleBorder">
            <i v-for="index in 5" :key="index"></i>
            <span class="title-rotate">
              <span v-for="(trait, index) in traits" :key="index" :class="{ active: index === 0 }">{{ trait }}</span>
            </span>
          </h1>
          <div class="mt-4 mb-4">
            <a href="#contact" class="btn-effect mr-2">
              <span class="visible btn btn-primary">Contact Me</span>
              <span class="hidden btn btn-primary" data-bg-color="#d44729">Contact Me</span>
            </a>
            <button class="btn btn-outline-light" @click.prevent="oauthLogin">Dashboard</button>
          </div>
        </div>
      </div>
    </div>
    <div class="background">
      <div class="background-image" :style="backgroundImageVars"></div>
    </div>
  </div>
</template>

<script setup>
const bubbleBorder = ref(null);
const ssoClientID = "";
const dashboardURL = "/dashboard";

const { data: settings } = await useFetch("/api/settings");
const username = computed(() => settings.value.find(s => s.key === "username")?.value || "Wayne Wang");
const traits = computed(() => {
  const traitString = settings.value.find(s => s.key === "trait")?.value;
  return traitString ? JSON.parse(traitString) : ["Explorer", "Analyst", "Trader"];
});
const heroImage = computed(() => {
  const imageString = settings.value.find(s => s.key === "hero_image")?.value;
  return imageString ? JSON.parse(imageString) : ["/bg-hero.jpg", "/bg-hero-sm.jpg"];
});

const backgroundImageVars = computed(() => ({
  "--bg-image-desktop": `url(${heroImage.value[0]})`,
  "--bg-image-mobile": `url(${heroImage.value[1]})`
}));

onMounted(() => {
  nextTick(() => {
    initBubbleBorder();
    window.addEventListener("scroll", animateElements);
    animateElements();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", animateElements);
});

const oauthLogin = () => {
  const SUUD = new URL("/sso", "https://suud.net");
  SUUD.searchParams.set("s", ssoClientID);
  SUUD.searchParams.set("t", "cert");
  
  const permissions = [1, 2, 3];
  permissions.forEach(p => SUUD.searchParams.append("p", p));

  const callbackURL = new URL(dashboardURL, window.location.href);
  SUUD.searchParams.set("cb", callbackURL.toString());

  try {
    window.location.assign(SUUD.toString());
  } catch (error) {
    console.error(error);
  }
};

const checkInView = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const animateElements = () => {
  if (bubbleBorder.value && checkInView(bubbleBorder.value)) {
    bubbleBorder.value.classList.add(bubbleBorder.value.getAttribute("data-animate"));
  }
};

const initBubbleBorder = () => {
  if (bubbleBorder.value) {
    const active = bubbleBorder.value.querySelector(".active");
    if (active) {
      bubbleBorder.value.style.width = `${active.offsetWidth}px`;
      bubbleBorder.value.style.height = `${active.offsetHeight}px`;

      setTimeout(() => {
        bubbleBorder.value.classList.add("in");
        setInterval(() => {
          const currentActive = bubbleBorder.value.querySelector(".active");
          if (currentActive) {
            currentActive.classList.add("out");
            setTimeout(() => {
              currentActive.classList.remove("active", "out");
              const nextActive = currentActive.nextElementSibling || bubbleBorder.value.querySelector(".title-rotate span:first-child");
              if (nextActive) {
                nextActive.classList.add("active");
                bubbleBorder.value.style.width = `${nextActive.offsetWidth}px`;
                bubbleBorder.value.style.height = `${nextActive.offsetHeight}px`;
              }
            }, 800);
          }
        }, 3000);
      }, 500);
    }
  }
};
</script>

<style scoped>
.hero {
  position: relative;
  top: 0;
  display: flex;
  height: 100vh;
  margin-bottom: 100px;
  overflow: hidden;
  transition: top 0.3s ease;
}

.hero-container {
  display: flex;
  align-items: center;
}

.background {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  background-image: var(--bg-image-desktop);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-width: 768px) {
  .background-image {
    background-image: var(--bg-image-mobile);
  }
}

.btn-outline-light {
  color: #fff;
  border: 1px solid #fff;
}

.btn-outline-light:hover {
  color: #f26c4f;
  background-color: #fff;
  border: 1px solid #fff;
}

.title-rotate {
  position: absolute;
  top: 0;
  left: 0;
}

.title-rotate span {
  position: absolute;
  display: inline-block;
  padding: 1.5rem 2.25rem;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-0.3125rem) rotate(0.02deg);
  transition: 0.8s ease;
  transition-delay: 0.3s;
}

.title-rotate span.active {
  opacity: 1;
  transform: translateY(0) rotate(0.02deg);
}

.title-rotate span.out {
  opacity: 0;
  transform: translateY(0.3125rem) rotate(0.02deg);
}

.bubble-border {
  position: relative;
  display: inline-block;
  transition: 0.6s ease;
}

.bubble-border i {
  position: absolute;
  background-color: #fff;
  transition: 0.2s ease-in;
}

.bubble-border i:first-child {
  top: 0;
  left: 0;
  width: 0;
  height: 0.1875rem;
}

.bubble-border i:nth-child(2) {
  top: 0;
  right: 0;
  width: 0.1875rem;
  height: 0;
  transition-delay: 0.2s;
}

.bubble-border i:nth-child(3) {
  right: 0;
  bottom: 0;
  width: 0;
  height: 0.1875rem;
  transition-delay: 0.4s;
}

.bubble-border i:nth-child(4) {
  bottom: 0;
  left: 0;
  width: 0.1875rem;
  height: 0;
  transition-delay: 0.6s;
}

.bubble-border i:nth-child(5) {
  bottom: 0;
  left: 2rem;
  opacity: 0;
  transition-delay: 0.6s;
}

.bubble-border i:nth-child(5):after {
  position: absolute;
  border-color: #fff transparent transparent;
  border-style: solid;
  border-width: 0.625rem 0.625rem 0 0;
  content: "";
}

.bubble-border.in i:first-child,
.bubble-border.in i:nth-child(3) {
  width: 100%;
}

.bubble-border.in i:nth-child(2),
.bubble-border.in i:nth-child(4) {
  height: 100%;
}

.bubble-border.in i:nth-child(5) {
  opacity: 1;
}
</style>