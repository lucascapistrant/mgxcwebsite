<script setup>
import HeaderComponent from './components/Header.vue'
</script>

<template>
  <header>
    <HeaderComponent/>
  </header>
  <body>
    <RouterView />
  </body>
</template>

<style scoped>
</style>
