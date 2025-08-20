<script setup>
import NavBar from "./components/shared/NavBar.vue";
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const view = ref("landing");

const menuList = ref([
  { name: 'Home', link: '#home' },
  { name: 'About', link: '#about' },
  { name: 'Contact', link: '#contact' }
])

const currentLink = ref('home');


const scrollPosition = ref(0);

const navFunctions = {
  setCurrentLink(link) {
    currentLink.value = link;
  }
}

const handleScroll = () => {
  scrollPosition.value = window.scrollY || window.pageYOffset;

  const sections = ['home', 'about', 'services', 'contact'];

  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentLink.value = section;
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <div class="app-container">
    <NavBar :nav-functions="navFunctions" :menu-list="menuList" :current-link="currentLink"></NavBar>
    <RouterView></RouterView>
  </div>
</template>

<style>
.app-container {
  min-height: 200vh;
  height: fit-content;
  background: url("../public/background-header-landing.png");
  background-repeat: no-repeat;
  background-position: top -300px center;
}
</style>
