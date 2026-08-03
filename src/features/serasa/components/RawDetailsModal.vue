<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
  title?: string;
  data: Record<string, unknown>;
}>();

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 600; background: rgba(15,23,42,0.45); padding: 24px"
    @click.self="emit('close')"
  >
    <div
      style="width: 100%; max-width: 640px; max-height: min(80vh, 720px); background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 1px solid var(--border-default); display: flex; flex-direction: column; overflow: hidden"
    >
      <div class="flex items-start justify-between" style="gap: 16px; padding: 22px 24px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div style="min-width: 0">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase">
            Dados brutos
          </div>
          <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 4px; line-height: 1.3">
            {{ title ?? 'Detalhes da ocorrência' }}
          </h3>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-md); border: 1px solid var(--border-default); background: var(--surface-sunken); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <pre
        style="flex: 1; overflow: auto; margin: 0; padding: 20px 24px; font-size: 12px; line-height: 1.5; color: var(--text-default); background: var(--surface-page); white-space: pre-wrap; word-break: break-word"
      >{{ JSON.stringify(data, null, 2) }}</pre>

      <div class="flex items-center justify-end" style="padding: 14px 24px; border-top: 1px solid var(--border-default); flex-shrink: 0">
        <button
          style="height: 40px; padding: 0 18px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; font-weight: var(--weight-semibold); font-size: var(--text-sm); color: var(--text-default)"
          @click="emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>
