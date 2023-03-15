<script setup>
  import NavBar from './components/shared/NavBar.vue';
</script>

<template>
  <v-app>
    <div class="app-container">
      <NavBar></NavBar>
      <div class="router-container">
        <router-view></router-view>
      </div>
    </div>

  </v-app>
</template>

<style lang="scss">

.router-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
  column-gap: 10px;
  overflow: auto;
}

.v-application__wrap{
  min-height: 0vh !important;
}

.app-container{
  display: flex;
  flex-flow: column;
  min-height: 95vh;
  overflow: auto;
}

</style>
