<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ title: string; cols: string[]; rows: string[][] }>();
</script>

<template>
  <div>
    <FieldLabel>{{ title }}</FieldLabel>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-lg);
        overflow: hidden;
      "
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols.map(() => '1fr').join(' '),
          padding: '10px 14px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div v-for="c in cols" :key="c">{{ c }}</div>
      </div>
      <div
        v-for="(r, i) in rows"
        :key="i"
        class="grid"
        :style="{
          gridTemplateColumns: cols.map(() => '1fr').join(' '),
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-default)',
        }"
      >
        <div v-for="(cell, j) in r" :key="j">{{ cell }}</div>
      </div>
    </div>
  </div>
</template>
