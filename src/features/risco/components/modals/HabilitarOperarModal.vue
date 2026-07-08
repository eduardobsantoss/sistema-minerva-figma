<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next';

defineProps<{ grupoNome: string }>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <div class="flex items-center justify-center" style="position: fixed; inset: 0; z-index: 600; background: rgba(15,23,42,0.45); padding: 24px">
    <div style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 28px">
      <div class="flex items-center justify-center" style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-success-bg); color: var(--success-base); margin-bottom: 18px">
        <ShieldCheck :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Habilitar "{{ grupoNome }}" para operar?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 22px">
        O grupo passará a poder realizar novas operações dentro do limite parametrizado.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 18px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm); background: var(--success-base); color: #fff"
          @click="emit('confirm')"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
