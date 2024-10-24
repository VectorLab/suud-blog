<template>
	<Navbar ref="navbar"></Navbar>
  <Hero ref="hero"></Hero>
  <About></About>
  <List></List>
  <Contact></Contact>
  <Footer></Footer>
</template>

<script setup>
const navbar = ref(null);
const hero = ref(null);

const { data: settings } = await useFetch("/api/settings")
const siteName = settings.value.find(setting => setting.key === "site_name")?.value || "Wayne Wang"

useSeoMeta({
  title: `Home - ${siteName}`,
  ogTitle: `Home - ${siteName}`,
  description: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang",
  ogDescription: settings.value.find(setting => setting.key === "site_description")?.value || "Official Website of Wayne Wang"
})

onMounted(() => {
  nextTick(() => {
    if (navbar.value && hero.value) {
      const navHeight = navbar.value.$el.offsetHeight;
      hero.value.$el.style.top = `${navHeight}px`;
      hero.value.$el.style.transition = "top 0.3s ease";
    }
  });
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 1rem;
  background-color: #020312;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: 400;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  margin-bottom: 1.5625rem;
  font-size: 1.25rem;
}

h4 {
  margin-bottom: 1.875rem;
}

h5 {
  font-size: 1.125rem;
}

h6 {
  font-size: 1rem;
}

a {
  color: #f26c4f;
  text-decoration: none;
  transition: .3s ease;
}

a:hover {
  color: #ed3a12;
  text-decoration: none;
}

p {
  margin-bottom: 1.875rem;
  line-height: 1.6875rem;
  opacity: .5;
}

.title h5 {
  font-weight: 400;
  opacity: .5;
}

.btn {
  display: inline-block;
  position: relative;
  padding: .75rem 1.25rem;
  border-radius: 0;
  outline: 0;
  font-weight: 500;
  font-size: .875rem;
  text-transform: uppercase;
}

.btn-effect {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
}

.btn-effect:hover .hidden {
  transform: translateX(0);
}

.btn-effect:hover .visible {
  transform: translateX(100%);
}

.btn-effect .visible {
  transform: translateX(0);
  transition: .3s ease;
}

.btn-effect .hidden {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: .3s ease;
}

.btn-primary:active,
.btn-primary:focus,
.btn-primary:hover {
  background-color: #f26c4f;
  border-color: #f26c4f;
  box-shadow: none;
}

.btn-primary {
  background-color: #f26c4f;
  border-color: #f26c4f;
  color: #fff;
}

dl dt {
  color: #f26c4f;
}

dl dd {
  margin-bottom: 1rem;
}

@media (min-width:576px) and (max-width:767px) {
  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.625rem;
  }

  h3 {
    font-size: 1.25rem;
  }
}

@media (min-width:768px) and (max-width:991px) {
  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 1.875rem;
  }

  h3 {
    font-size: 1.375rem;
  }
}

@media (min-width:992px) and (max-width:1199px) {
  h1 {
    font-size: 3.125rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.375rem;
  }

  .block {
    padding-top: 100px;
    padding-bottom: 100px;
  }
}

@media (min-width:1200px) {
  h1 {
    font-size: 3.5rem;
  }

  h2 {
    font-size: 2.25rem;
  }

  h3 {
    font-size: 1.875rem;
  }
}

@media (max-width:575px) {
  h1 {
    margin-bottom: 20px;
  }

  .title {
    margin-bottom: 30px;
  }
}

@media (min-width:576px) and (max-width:991px) {
  h1 {
    margin-bottom: 30px;
  }

  .title {
    margin-bottom: 50px;
  }
}

@media (min-width:992px) {
  h1 {
    margin-bottom: 40px;
  }

  .title {
    margin-bottom: 80px;
  }
}

@media (max-width:767px) {
  h4 {
    font-size: 1.125rem;
  }
}

@media (min-width:768px) {
  h4 {
    font-size: 1.5rem;
  }
}
</style>
