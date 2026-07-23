<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ role: string; name: string; cnpj: string; icon: Component }>(), {
  role: '',
  name: '',
  cnpj: '',
  icon: FileText
});
</script>

<template>
  <div
    class="flex items-center"
    style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
  >
    <div
      class="flex items-center justify-center"
      style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0"
    >
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
        {{ role }}
      </div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ name }}
      </div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">
        {{ cnpj }}<div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CopyButton</div>
      </div>
    </div>
  </div>
</template>
