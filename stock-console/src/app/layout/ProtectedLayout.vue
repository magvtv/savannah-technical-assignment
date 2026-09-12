<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="protected-layout">
    <header>
      <h1>Stock Console</h1>
      <nav>
        <router-link to="/items">Catalogue</router-link>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.protected-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
header {
  padding: 1rem;
  background-color: #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
main {
  padding: 1rem;
  flex-grow: 1;
}
</style>
