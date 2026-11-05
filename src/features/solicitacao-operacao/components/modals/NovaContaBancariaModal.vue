<script setup lang="ts">
import { reactive, computed } from 'vue';

import { FormField, SelectField, StepGrid } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="sm" eyebrow="Solicitação" title="Nova Conta Bancária" subtitle="Cadastro rápido para uso no veículo da operação" @close="emit('close')">
    <div>
      <StepGrid>
        <SelectField label="Banco" :options="BANCO_OPTS" placeholder="Selecione" :span="4" v-model="form.banco" />
        <FormField label="Agência" placeholder="—" :span="4" v-model="form.agencia" />
        <FormField label="Conta" placeholder="—" :span="4" v-model="form.conta" />
        <FormField label="Titular da conta" placeholder="—" :span="12" v-model="form.titular" />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="salvar" type="button">Cadastrar</AdminButton>
    </template>
  </AdminModal>
</template>
