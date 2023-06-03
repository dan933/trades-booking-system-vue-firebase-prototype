<script setup>
import NavBar from "./components/shared/NavBar.vue";
</script>

<template>
  <v-app style="min-height: 100vh">
    <v-parallax
      class="parallax-container"
      src="https://images.unsplash.com/photo-1481277542470-605612bd2d61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1406&q=80"
    >
      <div class="router-container">
        <NavBar></NavBar>
        <router-view></router-view>
      </div>
    </v-parallax>
  </v-app>
</template>

<style lang="scss">
.router-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 60px;
  column-gap: 10px;
  // overflow: auto;
  height: 100%;
}

.v-application__wrap {
  min-height: 0vh !important;
}

.parallax-container {
  overflow: auto;
  width: 100vw;
  max-height: 100vh;
}
</style>
