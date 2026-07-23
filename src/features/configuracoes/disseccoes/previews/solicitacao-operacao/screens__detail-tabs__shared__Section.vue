<script setup lang="ts">
withDefaults(defineProps<{ title: string }>(), {
  title: 'Label'
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between" style="margin-bottom: 16px; gap: 12px">
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
        "
      >
        {{ title }}
      </div>
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>
