<template>
  <nav class="navbar navbar-expand-lg bg-light fixed-top">
    <div class="container">
      <img class="navbar-brand position-absolute" src="/logo.png" alt="" />
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="link in links" :key="link.href">
            <a
              class="nav-link"
              :class="{ active: activeLink === link.href }"
              :href="link.href"
              @click="setActive(link.href)"
            >
              {{ link.text }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
const activeLink = ref("#");
const links = [
  { text: "Home", href: "#" },
  { text: "About", href: "#about" },
  { text: "Columns", href: "/columns" },
  { text: "Notes", href: "/notes" },
  { text: "Contact", href: "#contact" },
];

const setActive = (href) => {
  activeLink.value = href;
};
</script>

<style scoped>
.navbar {
  font-size: 0.875rem;
  font-weight: 500;
  transition: 0.3s ease;
  text-transform: uppercase;
  padding: 0;
}

.nav-link {
  position: relative;
  padding: 1rem 20px;
  border-bottom: none;
}

.nav-link:after {
  border-top: 0.1875rem solid #f26c4f;
  content: "";
  height: 0.1875rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: 1s ease;
}

.nav-link.active:after {
  opacity: 1;
}

.navbar-toggler {
  margin: 0.5rem 0;
}

.navbar-brand {
  transform: translateY(50%);
  bottom: 0;
  z-index: 1;
  width: 64px;
}

@media (max-width: 768px) {
  .navbar-toggler {
    margin-left: auto;
    margin-right: 1rem;
  }
  .navbar-brand {
    display: none;
  }
  .nav-link:after {
  display: none;
}
}
</style>