<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Landmark, Plus } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField, AddButton } from '../adicionar-contrato';
import {
  CONTAS_BANCARIAS_MOCK,
  labelContaBancaria,
  type ContaBancaria,
} from '../../../data/minutaData';

const contaBancariaId = defineModel<string>('contaBancariaId', { default: '' });
const contasExtras = defineModel<ContaBancaria[]>('contasExtras', { default: () => [] });

const showNova = ref(false);
const draft = reactive({ banco: '', agencia: '', conta: '', titular: '' });

const todasContas = computed(() => [...CONTAS_BANCARIAS_MOCK, ...contasExtras.value]);
const contaOpts = computed(() => todasContas.value.map(labelContaBancaria));

const contaSelecionada = computed({
  get: () => {
    const c = todasContas.value.find((x) => x.id === contaBancariaId.value);
    return c ? labelContaBancaria(c) : '';
  },
  set: (label: string) => {
    const c = todasContas.value.find((x) => labelContaBancaria(x) === label);
    contaBancariaId.value = c?.id ?? '';
  },
});

function adicionarConta() {
  if (!draft.banco || !draft.agencia || !draft.conta) return;
  const nova: ContaBancaria = {
    id: `cb-extra-${Date.now()}`,
    banco: draft.banco,
    agencia: draft.agencia,
    conta: draft.conta,
    titular: draft.titular || '—',
  };
  contasExtras.value = [...contasExtras.value, nova];
  contaBancariaId.value = nova.id;
  draft.banco = '';
  draft.agencia = '';
  draft.conta = '';
  draft.titular = '';
  showNova.value = false;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="Informação de Pagamento" :icon="Landmark">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <SelectField
            label="Conta bancária"
            :options="contaOpts"
            placeholder="Selecione"
            required
            :span="10"
            v-model="contaSelecionada"
          />
          <div style="grid-column: span 2; align-self: end">
            <AddButton @click="showNova = !showNova">
              <Plus :size="14" /> Conta
            </AddButton>
          </div>
        </StepGrid>

        <template v-if="showNova">
          <StepGrid>
            <FormField label="Banco" placeholder="341 - Itaú" :span="4" v-model="draft.banco" />
            <FormField label="Agência" placeholder="—" :span="2" v-model="draft.agencia" />
            <FormField label="Conta" placeholder="—" :span="3" v-model="draft.conta" />
            <FormField label="Titular" placeholder="—" :span="3" v-model="draft.titular" />
          </StepGrid>
          <div class="flex justify-end" style="gap: 8px">
            <button
              type="button"
              style="
                height: 40px;
                padding: 0 16px;
                background: none;
                border: none;
                cursor: pointer;
                color: var(--text-muted);
                font-weight: var(--weight-semibold);
                font-size: var(--text-sm);
              "
              @click="showNova = false"
            >
              Cancelar
            </button>
            <AddButton @click="adicionarConta">Adicionar conta bancária</AddButton>
          </div>
        </template>
      </div>
    </BentoBox>
  </div>
</template>
