<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/features/auth/components/ForgotPasswordModal.vue
 */
import ForgotPasswordModal from '@/features/auth/components/ForgotPasswordModal.vue';

defineEmits<{ close: []; submit: [email: string] }>();
</script>

<template>
  <ForgotPasswordModal
    initial-email="exemplo@empresa.com.br"
    @close="$emit('close')"
    @submit="$emit('submit', $event)"
  />
</template>
