<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { SelectField, StepGrid } from './adicionar-contrato';
import { CONTAS_BANCARIAS_MOCK, labelContaBancaria } from '../../data/minutaData';

const emit = defineEmits<{
  close: [];
  confirm: [payload: { id: string; label: string }];
}>();

const CONTA_OPTS = CONTAS_BANCARIAS_MOCK.map((c) => labelContaBancaria(c));
const contaLabel = ref('');

const canSubmit = computed(() => contaLabel.value.trim() !== '');

function confirmar() {
  if (!canSubmit.value) return;
  const conta = CONTAS_BANCARIAS_MOCK.find((c) => labelContaBancaria(c) === contaLabel.value);
  if (!conta) return;
  emit('confirm', { id: conta.id, label: contaLabel.value });
  emit('close');
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 520px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Transferir conta bancária
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Defina a conta bancária de destino desta solicitação
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="padding: 24px 28px">
        <StepGrid>
          <SelectField
            label="Conta bancária de destino"
            :options="CONTA_OPTS"
            placeholder="Selecione"
            :span="12"
            v-model="contaLabel"
          />
        </StepGrid>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn-animated"
          :class="{ 'btn-primary': canSubmit }"
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? 'var(--action-primary-text)' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="confirmar"
        >
          TRANSFERIR
        </button>
      </div>
    </div>
  </div>
</template>
