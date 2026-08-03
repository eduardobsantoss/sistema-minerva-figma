<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  title: string;
  data: unknown;
}>();

const open = ref(false);

const rows = computed(() => {
  const { data } = props;
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      key: String(index + 1),
      value: item,
    }));
  }
  if (typeof data === 'object') {
    return Object.entries(data as Record<string, unknown>).map(([key, value]) => ({
      key,
      value,
    }));
  }
  return [{ key: 'valor', value: data }];
});

const isEmpty = computed(() => rows.value.length === 0);

function formatValue(value: unknown): string {
  if (value == null || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <button
      class="flex items-center w-full"
      style="gap: 8px; padding: 12px 16px; background: var(--surface-sunken); border: none; cursor: pointer; text-align: left"
      @click="open = !open"
    >
      <component :is="open ? ChevronDown : ChevronRight" :size="14" style="color: var(--text-muted); flex-shrink: 0" />
      <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-strong)">
        {{ title }}
      </span>
      <span v-if="isEmpty" style="font-size: var(--text-xs); color: var(--text-muted); margin-left: auto">
        Vazio
      </span>
      <span v-else style="font-size: var(--text-xs); color: var(--text-muted); margin-left: auto">
        {{ Array.isArray(data) ? `${(data as unknown[]).length} item(ns)` : `${rows.length} campo(s)` }}
      </span>
    </button>

    <div v-if="open && !isEmpty" style="padding: 12px 16px; display: flex; flex-direction: column; gap: 12px">
      <template v-if="Array.isArray(data)">
        <div
          v-for="(row, idx) in rows"
          :key="row.key"
          style="padding: 12px; background: var(--surface-sunken); border-radius: var(--radius-md); border: 1px solid var(--border-default)"
        >
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--accent); margin-bottom: 8px; letter-spacing: 0.12em">
            ITEM {{ idx + 1 }}
          </div>
          <div v-if="typeof row.value === 'object' && row.value" class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px 16px">
            <div v-for="([k, v], i) in Object.entries(row.value as Record<string, unknown>)" :key="i">
              <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">{{ k }}</div>
              <div style="font-size: var(--text-sm); color: var(--text-default); word-break: break-word">{{ formatValue(v) }}</div>
            </div>
          </div>
          <div v-else style="font-size: var(--text-sm); color: var(--text-default)">{{ formatValue(row.value) }}</div>
        </div>
      </template>
      <div v-else class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px 16px">
        <div v-for="row in rows" :key="row.key">
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">{{ row.key }}</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); word-break: break-word">{{ formatValue(row.value) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
