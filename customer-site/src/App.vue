<script setup>
import NavBar from "./components/shared/NavBar.vue";
import { ref, computed } from 'vue';

const view = ref("landing");

const menuList = ref([
  { name: 'Home', link: '#home' },
  { name: 'About', link: '#about' },
  { name: 'Booking Software', link: '#services' },
  { name: 'Contact', link: '#contact' }
])

const currentLink = ref('home');

const navFunctions = {
  setCurrentLink(link) {
    currentLink.value = link;
  }
}

</script>

<template>
  <div class="app-container">
    <NavBar :nav-functions="navFunctions" :menu-list="menuList" :current-link="currentLink"></NavBar>
  </div>
</template>

<style>
.app-container {
  height: 200vh;
  background: url("../public/background-header-landing.png");
  background-repeat: no-repeat;
  background-position: top -300px center;
}
</style>
