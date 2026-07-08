<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <div
    style="
      padding: 60px;
      text-align: center;
      color: var(--text-muted);
      font-size: var(--text-sm);
      background: var(--surface-card);
      border-radius: var(--radius-xl);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
    "
  >
    O módulo "{{ name }}" será implementado em breve.
  </div>
</template>
