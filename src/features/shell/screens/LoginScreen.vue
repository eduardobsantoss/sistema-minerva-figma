<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/features/auth/screens/LoginScreen.vue
 */
import LoginScreen from '@/features/auth/screens/LoginScreen.vue';
</script>

<template>
  <div style="height: 640px; overflow: hidden; border-radius: var(--radius-lg)">
    <LoginScreen />
  </div>
</template>
