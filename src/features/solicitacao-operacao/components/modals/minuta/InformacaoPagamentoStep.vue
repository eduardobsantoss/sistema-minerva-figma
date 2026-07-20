<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Landmark, Plus } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField, AddButton } from '../adicionar-contrato';
import {
  CONTAS_BANCARIAS_MOCK,
  BANCO_OPTS,
  TIPO_CONTA_OPTS,
  labelContaBancaria,
  emptyContaBancariaDraft,
  type ContaBancaria,
} from '../../../data/minutaData';

const contaBancariaId = defineModel<string>('contaBancariaId', { default: '' });
const contasExtras = defineModel<ContaBancaria[]>('contasExtras', { default: () => [] });

const showNova = ref(false);
const draft = reactive(emptyContaBancariaDraft());

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
    if (c) {
      showNova.value = false;
      resetDraft();
    }
  },
});

const temContaSelecionada = computed(() => !!contaBancariaId.value);

function toggleNovaConta() {
  if (temContaSelecionada.value) return;
  showNova.value = !showNova.value;
  if (!showNova.value) resetDraft();
}

function resetDraft() {
  Object.assign(draft, emptyContaBancariaDraft());
}

function adicionarConta() {
  if (!draft.banco || !draft.agencia || !draft.conta || !draft.digitoConta || !draft.tipoConta) return;
  const nova: ContaBancaria = {
    id: `cb-extra-${Date.now()}`,
    ...JSON.parse(JSON.stringify(draft)),
    titular: draft.titular || '—',
  };
  contasExtras.value = [...contasExtras.value, nova];
  contaBancariaId.value = nova.id;
  resetDraft();
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
          <div style="grid-column: span 2; align-self: end; width: 100%">
            <AddButton full-width :disabled="temContaSelecionada" @click="toggleNovaConta">
              <Plus :size="14" /> Conta
            </AddButton>
          </div>
        </StepGrid>

        <template v-if="showNova && !temContaSelecionada">
          <StepGrid>
            <SelectField label="Banco" :options="BANCO_OPTS" placeholder="Selecione" required :span="4" v-model="draft.banco" />
            <FormField label="Agência" placeholder="—" required :span="2" v-model="draft.agencia" />
            <FormField label="Dígito agência" placeholder="—" :span="2" v-model="draft.digitoAgencia" />
            <FormField label="Conta" placeholder="—" required :span="2" v-model="draft.conta" />
            <FormField label="Dígito conta" placeholder="—" required :span="2" v-model="draft.digitoConta" />
            <SelectField label="Tipo de conta" :options="TIPO_CONTA_OPTS" required :span="3" v-model="draft.tipoConta" />
            <FormField label="Chave PIX" placeholder="—" :span="4" v-model="draft.chavePix" />
            <FormField label="Titular" placeholder="—" :span="5" v-model="draft.titular" />
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
              @click="showNova = false; resetDraft()"
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
