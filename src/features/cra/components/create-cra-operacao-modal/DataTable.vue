<script setup lang="ts" generic="T extends Record<string, string>">
import { computed } from 'vue';
import RowTrash from './RowTrash.vue';

const props = defineProps<{
  cols: { key: string; label: string; width: string; format?: (v: string) => string }[];
  rows: T[];
  empty: string;
}>();
const emit = defineEmits<{ remove: [i: number] }>();

const template = computed(() => props.cols.map((c) => c.width).join(' ') + ' 36px');
</script>

<template>
  <div v-if="!rows.length" style="padding: 16px 0; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    {{ empty }}
  </div>
  <div v-else style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-md); overflow: hidden">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: template,
        padding: '10px 14px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div v-for="c in cols" :key="c.key">{{ c.label }}</div>
      <div />
    </div>
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="grid items-center ccm-row"
      :style="{
        gridTemplateColumns: template,
        padding: '12px 14px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        fontVariantNumeric: 'tabular-nums',
      }"
    >
      <div v-for="c in cols" :key="c.key" style="color: var(--text-strong); font-weight: var(--weight-semibold)">
        {{ c.format ? c.format(row[c.key] ?? '') : (row[c.key] ?? '') }}
      </div>
      <RowTrash @click="emit('remove', i)" />
    </div>
  </div>
</template>
