<script setup lang="ts">
import { reactive, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { FormField, SelectField, StepGrid } from './adicionar-contrato';

const emit = defineEmits<{
  close: [];
  create: [label: string];
}>();

const BANCO_OPTS = [
  '001 — Banco do Brasil',
  '033 — Santander',
  '104 — Caixa',
  '237 — Bradesco',
  '341 — Itaú',
];

const form = reactive({
  banco: '',
  agencia: '',
  conta: '',
  titular: '',
});

const canSubmit = computed(
  () => form.banco.trim() !== '' && form.agencia.trim() !== '' && form.conta.trim() !== '' && form.titular.trim() !== '',
);

function salvar() {
  if (!canSubmit.value) return;
  const bancoCode = form.banco.split('—')[0]?.trim() ?? form.banco;
  const label = `${bancoCode} · Ag ${form.agencia} · CC ${form.conta} — ${form.titular}`;
  emit('create', label);
  emit('close');
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 500;
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
            Nova Conta Bancária
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Cadastro rápido para uso no veículo da operação
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
          <SelectField label="Banco" :options="BANCO_OPTS" placeholder="Selecione" :span="4" v-model="form.banco" />
          <FormField label="Agência" placeholder="—" :span="4" v-model="form.agencia" />
          <FormField label="Conta" placeholder="—" :span="4" v-model="form.conta" />
          <FormField label="Titular da conta" placeholder="—" :span="12" v-model="form.titular" />
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
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="salvar"
        >
          CADASTRAR
        </button>
      </div>
    </div>
  </div>
</template>
