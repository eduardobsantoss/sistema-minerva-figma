<script setup lang="ts">
defineProps<{
  tabs: string[];
  modelValue: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default)">
    <button
      v-for="t in tabs"
      :key="t"
      type="button"
      :style="{
        padding: '10px 4px',
        marginRight: '22px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: modelValue === t ? 'var(--text-strong)' : 'var(--text-muted)',
        borderBottom: modelValue === t ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: '-1px',
      }"
      @click="emit('update:modelValue', t)"
    >
      {{ t }}
    </button>
  </div>
</template>
