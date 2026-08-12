<script setup lang="ts">
import { Plus, Minus } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  CONFINA_FAZENDA_OPTS,
  CONFINA_POSICAO_ANEXO_OPTS,
  type ConfinaParceiroForm,
  type ConfinaOperacaoForm,
} from '../../../data/minutaData';
import ConfinaPreviaSimulacao from './ConfinaPreviaSimulacao.vue';

const form = defineModel<ConfinaParceiroForm>({ required: true });
defineProps<{ operacao: ConfinaOperacaoForm }>();

function addTestemunha() {
  form.value.testemunhas = [...form.value.testemunhas, { nome: '', cpf: '' }];
}

function removeTestemunha(i: number) {
  if (form.value.testemunhas.length <= 1) return;
  form.value.testemunhas = form.value.testemunhas.filter((_, idx) => idx !== i);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Fazenda"
        :options="[...CONFINA_FAZENDA_OPTS]"
        placeholder="Selecione"
        :span="6"
        v-model="form.fazenda"
      />
      <FormField label="Proprietário" placeholder="—" :span="6" v-model="form.proprietario" />
      <SelectField
        label="Posição Anexo"
        :options="[...CONFINA_POSICAO_ANEXO_OPTS]"
        placeholder="Selecione"
        :span="4"
        v-model="form.posicaoAnexo"
      />
    </StepGrid>

    <BentoBox title="Testemunhas">
      <div class="flex flex-col" style="gap: 12px">
        <div
          v-for="(t, i) in form.testemunhas"
          :key="i"
          class="grid items-end"
          style="grid-template-columns: 1fr 1fr auto; gap: 12px"
        >
          <FormField label="Nome da Testemunha" placeholder="—" v-model="t.nome" />
          <FormField label="CPF da Testemunha" placeholder="000.000.000-00" v-model="t.cpf" />
          <div class="flex" style="gap: 8px; padding-bottom: 0">
            <button
              v-if="i === form.testemunhas.length - 1"
              type="button"
              aria-label="Adicionar testemunha"
              class="flex items-center justify-center"
              style="
                width: 40px;
                height: 40px;
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                background: var(--surface-card);
                cursor: pointer;
                color: var(--gci-base);
              "
              @click="addTestemunha"
            >
              <Plus :size="16" />
            </button>
            <button
              v-if="form.testemunhas.length > 1"
              type="button"
              aria-label="Remover testemunha"
              class="flex items-center justify-center"
              style="
                width: 40px;
                height: 40px;
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                background: var(--surface-card);
                cursor: pointer;
                color: var(--danger-base);
              "
              @click="removeTestemunha(i)"
            >
              <Minus :size="16" />
            </button>
          </div>
        </div>
      </div>
    </BentoBox>

    <ConfinaPreviaSimulacao :operacao="operacao" />
  </div>
</template>
