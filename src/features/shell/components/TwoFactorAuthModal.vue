<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/features/auth/components/TwoFactorAuthModal.vue
 */
import TwoFactorAuthModal from '@/features/auth/components/TwoFactorAuthModal.vue';

defineEmits<{ close: []; verify: [code: string] }>();
</script>

<template>
  <TwoFactorAuthModal
    @close="$emit('close')"
    @verify="$emit('verify', $event)"
  />
</template>
