<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>
