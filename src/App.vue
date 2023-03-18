<script setup>
  import NavBar from './components/shared/NavBar.vue';
</script>

<template>
  <v-app>
    <v-parallax
    class="parallax-container"
    src="https://images.unsplash.com/photo-1481277542470-605612bd2d61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1406&q=80">

    <div class="app-container">
      <NavBar></NavBar>
      <div class="router-container">
        <router-view></router-view>
      </div>
    </div>
  </v-parallax>

  </v-app>
</template>

<style lang="scss">

.router-container{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 60px;
  column-gap: 10px;
  overflow: auto;
  height: 100%;
}

.v-application__wrap{
  min-height: 0vh !important;
}

.app-container{
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: auto;
}

.parallax-container{
  // min-height: 100vh;
  height: 100vh;
}

</style>
