<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Layers } from 'lucide-vue-next';
import type { Agrupamento } from '../../data/riscoData';

const props = defineProps<{ initial?: Agrupamento }>();
const emit = defineEmits<{ close: []; save: [nome: string] }>();

const nome = ref(props.initial?.nome ?? '');
const canSave = computed(() => nome.value.trim() !== '');

function handleSave() {
  if (!canSave.value) return;
  emit('save', nome.value.trim());
}
</script>

<template>
  <div
    style="
      position: fixed; inset: 0;
      background: rgba(8,60,74,0.55); backdrop-filter: blur(8px);
      z-index: 400; display: flex; align-items: center; justify-content: center;
      padding: 32px; animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 480px;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <Layers :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
              {{ initial ? 'Renomear Agrupamento' : 'Novo Agrupamento' }}
            </h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              Usado no bloco "Agrupamentos" da parametrização de limite dos grupos
            </p>
          </div>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Body -->
      <div style="padding: 28px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
          <input
            v-model="nome"
            placeholder="Ex.: Confina"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canSave"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            transition: 'background var(--duration-base)',
          }"
          @click="handleSave"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
