<script setup lang="ts">
import { ref } from 'vue';
import { Trash2, PawPrint } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField, AddButton, EmptyState } from '../adicionar-contrato';
import {
  CONFINA_CATEGORIA_ANIMAL_OPTS,
  CONFINA_RACA_OPTS,
  CONFINA_TIPO_ANIMAL_OPTS,
  CONFINA_IDADE_RANGE_OPTS,
  emptyConfinaInfoAnimal,
  type ConfinaAnimaisForm,
  type ConfinaOperacaoForm,
  type ConfinaInfoAnimal,
} from '../../../data/minutaData';
import ConfinaPreviaSimulacao from './ConfinaPreviaSimulacao.vue';

const form = defineModel<ConfinaAnimaisForm>({ required: true });
defineProps<{ operacao: ConfinaOperacaoForm }>();

const draft = ref<ConfinaInfoAnimal>(emptyConfinaInfoAnimal());

function addTipo() {
  if (!draft.value.tipo || !draft.value.quantidade) return;
  form.value.infos = [...form.value.infos, { ...draft.value }];
  draft.value = emptyConfinaInfoAnimal();
}

function removeTipo(i: number) {
  form.value.infos = form.value.infos.filter((_, idx) => idx !== i);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Categoria"
        :options="[...CONFINA_CATEGORIA_ANIMAL_OPTS]"
        placeholder="Selecione"
        :span="4"
        v-model="form.categoria"
      />
      <SelectField
        label="Raça"
        :options="[...CONFINA_RACA_OPTS]"
        placeholder="Selecione"
        :span="4"
        v-model="form.raca"
      />
      <FormField
        label="Peso Mínimo Individual (Arroba)"
        placeholder="0"
        :span="4"
        v-model="form.pesoMinIndividualArroba"
      />
      <FormField label="Peso do Lote em arroba" placeholder="0" :span="6" v-model="form.pesoLoteArroba" />
      <FormField label="Peso do Lote em Kg" placeholder="0" :span="6" v-model="form.pesoLoteKg" />
    </StepGrid>

    <BentoBox title="Informações adicionais dos animais" :icon="PawPrint">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <SelectField
            label="Tipo de Animal"
            :options="[...CONFINA_TIPO_ANIMAL_OPTS]"
            placeholder="Selecione"
            :span="4"
            v-model="draft.tipo"
          />
          <SelectField
            label="Idade (Range médio)"
            :options="[...CONFINA_IDADE_RANGE_OPTS]"
            placeholder="Selecione"
            :span="4"
            v-model="draft.idade"
          />
          <FormField label="Quantidade" placeholder="0" :span="4" v-model="draft.quantidade" />
        </StepGrid>
        <div class="flex justify-end">
          <AddButton :disabled="!draft.tipo || !draft.quantidade" @click="addTipo">
            Adicionar tipo
          </AddButton>
        </div>

        <EmptyState
          v-if="form.infos.length === 0"
          :icon="PawPrint"
          title="Nenhum tipo adicionado"
          hint="Preencha tipo e quantidade e clique em Adicionar tipo."
        />
        <div
          v-else
          style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; background: var(--surface-card)"
        >
          <div
            class="grid"
            style="
              grid-template-columns: 1.2fr 1fr 0.8fr auto;
              padding: 10px 14px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Tipo do Animal</div>
            <div>Idade (Range Médio)</div>
            <div>Quantidade</div>
            <div />
          </div>
          <div
            v-for="(info, i) in form.infos"
            :key="i"
            class="grid items-center"
            style="
              grid-template-columns: 1.2fr 1fr 0.8fr auto;
              padding: 10px 14px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
            "
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ info.tipo }}</div>
            <div>{{ info.idade || '—' }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ info.quantidade }}</div>
            <button
              type="button"
              aria-label="Remover"
              class="flex items-center justify-center"
              style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
              @click="removeTipo(i)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </BentoBox>

    <ConfinaPreviaSimulacao :operacao="operacao" />
  </div>
</template>
