<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/features/auth/components/ConfigureTwoFactorModal.vue
 */
import ConfigureTwoFactorModal from '@/features/auth/components/ConfigureTwoFactorModal.vue';

defineEmits<{ close: []; activate: [code: string] }>();
</script>

<template>
  <ConfigureTwoFactorModal
    account-label="usuario@empresa.com.br"
    @close="$emit('close')"
    @activate="$emit('activate', $event)"
  />
</template>
