<script setup>
import HeaderComponent from './components/Header.vue'
import FooterComponent from './components/Footer.vue'
</script>

<template>
  <body>
    <HeaderComponent/>
    <main>
      <RouterView />
    </main>
    <FooterComponent/>
  </body>
  
</template>

<style scoped>
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  background: var(--color-background);
}


</style>
