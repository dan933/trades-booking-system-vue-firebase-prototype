<script setup>
import { useRoute } from "vue-router";
import NavBar from "./components/shared/NavBar.vue";
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useStore } from "vuex";


const route = useRoute();

const store = useStore();

const view = computed(() => store.state.navigation.view)

const menuList = computed(() => {

  if (view.value !== "landing") {
    return [];
  }

  let menu = [
    { name: 'Home', link: '#home' },
    { name: 'About', link: '#about' }
  ]

  return menu;
})

const currentLink = ref('home');


const scrollPosition = ref(0);

const navFunctions = {
  setCurrentLink(link) {
    currentLink.value = link;
  }

}

const handleScroll = () => {
  scrollPosition.value = window.scrollY || window.pageYOffset;

  const sections = ['home', 'about'];


  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentLink.value = section;
        window.location.hash = `#${section}`;
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
  display: block;
  flex-direction: column;
  gap: 35px;
  min-height: 100vh;
  min-height: 200vh;
  height: fit-content;
  background: url("/background-header-landing.png");
  background-repeat: no-repeat;
  background-position: top -300px center;
}
</style>
