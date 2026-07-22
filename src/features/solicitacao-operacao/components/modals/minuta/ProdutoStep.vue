<script setup lang="ts">
import { computed, watch } from 'vue';
import { Trash2, Package } from 'lucide-vue-next';
import { UF_OPTIONS, brl } from '../../../data/operacaoData';
import { StepGrid, FormField, SelectField, AddButton, EmptyState } from '../adicionar-contrato';
import {
  PRODUTO_TIPO_OPTS,
  UNIDADE_MEDIDA_OPTS,
  cidadesDaUf,
  emptyProdutoMinuta,
  type ProdutoMinuta,
} from '../../../data/minutaData';

const produtos = defineModel<ProdutoMinuta[]>('produtos', { default: () => [] });
const form = defineModel<ProdutoMinuta>('form', { required: true });

const cidadeProducaoOpts = computed(() => cidadesDaUf(form.value.estadoProducao));
const cidadeRegistroOpts = computed(() => cidadesDaUf(form.value.ufRegistro));
const ufOpts = computed(() => ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)));

watch(
  () => form.value.estadoProducao,
  () => {
    if (form.value.cidadeProducao && !cidadeProducaoOpts.value.includes(form.value.cidadeProducao)) {
      form.value.cidadeProducao = '';
    }
  },
);
watch(
  () => form.value.ufRegistro,
  () => {
    if (form.value.cidadeRegistro && !cidadeRegistroOpts.value.includes(form.value.cidadeRegistro)) {
      form.value.cidadeRegistro = '';
    }
  },
);

function addProduto() {
  if (!form.value.tipo) return;
  produtos.value = [...produtos.value, { ...form.value }];
  form.value = emptyProdutoMinuta();
}

function removeProduto(i: number) {
  produtos.value = produtos.value.filter((_, idx) => idx !== i);
}

function fmtValor(v: string) {
  const n = Number(String(v).replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? brl(n) : v || '—';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField label="Tipo" :options="PRODUTO_TIPO_OPTS" placeholder="Selecione" :span="3" v-model="form.tipo" />
      <SelectField label="Unidade de medida" :options="UNIDADE_MEDIDA_OPTS" placeholder="Selecione" :span="3" v-model="form.unidadeMedida" />
      <FormField label="Valor unitário" placeholder="R$ 0,00" currency :span="3" v-model="form.valorUnitario" />
      <FormField label="Quantidade" placeholder="—" :span="3" v-model="form.quantidade" />
      <FormField label="Safra" placeholder="2025/2026" :span="3" v-model="form.safra" />
      <FormField label="Local de produção" placeholder="—" :span="3" v-model="form.localProducao" />
      <SelectField label="Estado de produção" :options="ufOpts" placeholder="UF" :span="3" v-model="form.estadoProducao" />
      <SelectField
        label="Cidade de produção"
        :options="cidadeProducaoOpts"
        placeholder="Selecione"
        :span="3"
        :disabled="!form.estadoProducao"
        v-model="form.cidadeProducao"
      />
      <FormField label="Nº da matrícula" placeholder="—" :span="4" v-model="form.matricula" />
      <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
      <SelectField
        label="Cidade de registro"
        :options="cidadeRegistroOpts"
        placeholder="Selecione"
        :span="4"
        :disabled="!form.ufRegistro"
        v-model="form.cidadeRegistro"
      />
    </StepGrid>

    <div class="flex justify-end">
      <AddButton @click="addProduto">Adicionar produto</AddButton>
    </div>

    <EmptyState
      v-if="produtos.length === 0"
      :icon="Package"
      title="Nenhum produto adicionado"
      hint="Preencha os campos acima e clique em Adicionar produto."
    />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Tipo</div>
        <div>Valor unitário</div>
        <div>Quantidade</div>
        <div>Safra</div>
        <div />
      </div>
      <div
        v-for="(p, i) in produtos"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.tipo }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ fmtValor(p.valorUnitario) }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ p.quantidade || '—' }}</div>
        <div>{{ p.safra || '—' }}</div>
        <button
          aria-label="Remover"
          class="flex items-center justify-center"
          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
          @click="removeProduto(i)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
