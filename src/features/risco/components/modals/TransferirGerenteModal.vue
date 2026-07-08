<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, UserCog } from 'lucide-vue-next';
import { GERENTES_SEED } from '../../data/riscoData';

const props = defineProps<{ grupoNome: string; gerenteAtual: string }>();
const emit = defineEmits<{ close: []; confirm: [novoGerente: string] }>();

const gerente = ref('');
const canConfirm = computed(() => gerente.value !== '' && gerente.value !== props.gerenteAtual);
</script>

<template>
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 460px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <UserCog :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Transferir gerente</h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ grupoNome }}</p>
          </div>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
          Gerente atual
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-default); margin-bottom: 18px">{{ gerenteAtual }}</div>

        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
          Novo gerente
        </div>
        <select
          v-model="gerente"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        >
          <option value="">Selecione</option>
          <option v-for="g in GERENTES_SEED.filter((x) => x !== gerenteAtual)" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canConfirm ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm ? '#fff' : 'var(--text-disabled)',
          }"
          @click="canConfirm && emit('confirm', gerente)"
        >
          TRANSFERIR
        </button>
      </div>
    </div>
  </div>
</template>
