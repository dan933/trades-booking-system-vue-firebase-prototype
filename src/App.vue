<script setup>
  import navBar from './components/shared/navBar.vue';
</script>

<template>
  <div class="app-container">
    <navBar></navBar>
    <main style="max-width:100vw; height: 100%; overflow: auto;">
      
    </main>
  </div>
</template>

<style lang="scss">
.app-container{
  display: flex;
  flex-flow: column;
  height: 100vh;
}

</style>
