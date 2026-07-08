<script setup lang="ts">
withDefaults(defineProps<{ showError?: boolean }>(), { showError: false });
</script>

<template>
  <div
    :style="{
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.14em',
      color: showError ? 'var(--danger-base)' : 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: '6px',
    }"
  >
    <template v-if="showError">* </template><slot />
  </div>
</template>
