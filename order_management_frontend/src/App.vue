<template>
  <div id="app">
    <!-- Show navbar only for authenticated routes -->
    <Navbar v-if="$route.meta.requiresAuth" />
    
    <!-- Main content area -->
    <main :class="{ 'container-fluid': $route.meta.requiresAuth, 'container': !$route.meta.requiresAuth }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import Navbar from './components/Navbar.vue';

const authStore = useAuthStore();

onMounted(() => {
  // Initialize auth state from localStorage
  if (authStore.token) {
    // You could fetch user data here if needed
  }
});
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: 20px;
}

/* Global styles */
body {
  background-color: #f8f9fa;
}

/* Custom scrollbar for cart */
.cart-items::-webkit-scrollbar {
  width: 6px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>