<script setup lang="ts">
import { computed, watch } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { StepGrid, FormField, SelectField, AddButton } from '../adicionar-contrato';
import { cidadesDaUf, emptyEnderecoLocacaoItem, type EnderecoLocacaoItem } from '../../../data/minutaData';

const lista = defineModel<EnderecoLocacaoItem[]>('lista', { default: () => [] });
const draft = defineModel<EnderecoLocacaoItem>('draft', { required: true });

const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const cidadeOpts = computed(() => cidadesDaUf(draft.value.estado));

watch(
  () => draft.value.estado,
  () => {
    if (draft.value.cidade && !cidadeOpts.value.includes(draft.value.cidade)) {
      draft.value.cidade = '';
    }
  },
);

function add() {
  if (!draft.value.cep && !draft.value.localidade && !draft.value.cidade) return;
  lista.value = [
    ...(lista.value ?? []),
    {
      cep: draft.value.cep,
      localidade: draft.value.localidade,
      numero: draft.value.numero,
      bairro: draft.value.bairro,
      infoAdicionais: draft.value.infoAdicionais,
      cidade: draft.value.cidade,
      estado: draft.value.estado,
      pais: draft.value.pais || 'Brasil',
    },
  ];
  Object.assign(draft.value, emptyEnderecoLocacaoItem());
}

function remove(i: number) {
  lista.value = lista.value.filter((_, idx) => idx !== i);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 14px">
    <StepGrid>
      <FormField label="CEP" placeholder="—" :span="3" v-model="draft.cep" />
      <FormField label="Localidade" placeholder="—" :span="6" v-model="draft.localidade" />
      <FormField label="Número" placeholder="—" :span="3" v-model="draft.numero" />
      <FormField label="Bairro" placeholder="—" :span="4" v-model="draft.bairro" />
      <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="draft.infoAdicionais" />
      <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="draft.estado" />
      <SelectField
        label="Cidade"
        :options="cidadeOpts"
        placeholder="Selecione"
        :span="5"
        :disabled="!draft.estado"
        v-model="draft.cidade"
      />
      <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="draft.pais" />
    </StepGrid>
    <div class="flex justify-end">
      <AddButton @click="add">Adicionar endereço</AddButton>
    </div>
    <div
      v-if="lista.length === 0"
      style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      Nenhum endereço adicionado.
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 0.8fr 1.4fr 1fr 0.5fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>CEP</div>
        <div>Logradouro</div>
        <div>Cidade</div>
        <div>UF</div>
        <div />
      </div>
      <div
        v-for="(e, i) in lista"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 0.8fr 1.4fr 1fr 0.5fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div>{{ e.cep || '—' }}</div>
        <div>{{ e.localidade || '—' }}</div>
        <div>{{ e.cidade || '—' }}</div>
        <div>{{ e.estado || '—' }}</div>
        <button
          aria-label="Remover"
          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
          @click="remove(i)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
