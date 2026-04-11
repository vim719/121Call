<script setup lang="ts">
const route = useRoute()
const isAuthPage = computed(() => ['/login', '/register', '/confirm'].includes(route.path))
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-100 via-surface-50 to-white">
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --font-family: 'Outfit', system-ui, sans-serif;
}

* {
  font-family: var(--font-family);
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>