<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { ESTEIRAS } from '../../data/operacaoData';
import type { NewPedidoData } from './types';
import BentoBox from './BentoBox.vue';
import BentoGrid from './BentoGrid.vue';
import FieldLabel from './FieldLabel.vue';
import FormField from './FormField.vue';
import SelectField from './SelectField.vue';
import ToggleRow from './ToggleRow.vue';

defineProps<{ form: NewPedidoData }>();

const TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata',
  'Contrato NC',
  'Contrato NP',
  'Contrato CCB',
  'Contrato CPR',
  'Contrato CPRF',
  'Contrato CDCA',
];
const TIPO_CONTRATO_OPTS = ['CCB', 'CPR-F', 'CDCA', 'CDA-WA', 'NCE'];
const UNIDADE_OPTS = ['Ceres Trading', 'Ceres Confina', 'Ceres Investimentos'];
const GERENTE_OPTS = ['Ana Martins', 'Carlos Eduardo', 'Fernanda Lima', 'Roberto Alves'];
const FUNDO_OPTS = ['CRA Semeagro', 'CRA Ceres Agro', 'CRA BTG Agro', 'FIDC Boa Safra'];
const GRUPO_OPTS = ['Grupo Ceres', 'Semeagro', 'BTG Agro', 'Raízen', 'Cargill Brasil', 'Coamo', 'Castrolanda'];
const CONTA_OPTS = ['001 - BB · Ag 1234 · CC 56789-0', '341 - Itaú · Ag 4567 · CC 12345-6'];
const TIPO_TAXA_OPTS = ['Pré-fixado', 'Pós-fixado', 'Híbrido'];

const AGRUPAMENTO_ROWS = [
  { agrupamento: 'Confina', limite: 'R$ 1.000.000', risco: 'R$ 500.000', riscoSolic: 'R$ 540.000' },
  { agrupamento: 'Multicedentes', limite: 'R$ 4.000.000', risco: 'R$ 0', riscoSolic: 'R$ 40.000' },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <BentoBox title="Identificação">
      <BentoGrid :cols="3">
        <SelectField label="Tipo de operação" :options="TIPO_OPERACAO_OPTS" placeholder="Selecione" v-model="form.tipoOperacao" />
        <SelectField label="Esteira" :options="ESTEIRAS.map((e) => e.label)" placeholder="Selecione" v-model="form.esteira" />
        <SelectField label="Tipo de contrato" :options="TIPO_CONTRATO_OPTS" placeholder="Selecione" v-model="form.tipoContrato" />
      </BentoGrid>
    </BentoBox>

    <BentoBox title="Responsáveis">
      <BentoGrid :cols="2">
        <SelectField label="Unidade de negócio" :options="UNIDADE_OPTS" placeholder="Selecione" v-model="form.unidadeNegocio" />
        <SelectField label="Gerente comercial" :options="GERENTE_OPTS" placeholder="Selecione" v-model="form.gerenteComercial" />
      </BentoGrid>
    </BentoBox>

    <BentoBox title="Veículo">
      <BentoGrid :cols="3">
        <SelectField label="Fundo" :options="FUNDO_OPTS" placeholder="Selecione" v-model="form.fundo" />
        <SelectField label="Grupo empresarial" :options="GRUPO_OPTS" placeholder="Selecione" v-model="form.grupoEmpresarial" />
        <div>
          <FieldLabel>Conta bancária</FieldLabel>
          <div class="flex items-center" style="gap: 8px">
            <div style="flex: 1">
              <SelectField :options="CONTA_OPTS" placeholder="Selecione" v-model="form.contaBancaria" />
            </div>
            <button
              aria-label="Adicionar conta"
              class="flex items-center justify-center"
              style="
                width: 40px;
                height: 40px;
                flex-shrink: 0;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-default);
                background: var(--surface-card);
                color: var(--gci-base);
                cursor: pointer;
              "
            >
              <Plus :size="16" />
            </button>
          </div>
        </div>
      </BentoGrid>
    </BentoBox>

    <BentoBox title="Taxas">
      <BentoGrid :cols="form.tipoTaxa === 'Pós-fixado' ? 4 : 3">
        <SelectField label="Tipo de taxa" :options="TIPO_TAXA_OPTS" v-model="form.tipoTaxa" />
        <template v-if="form.tipoTaxa === 'Pós-fixado'">
          <SelectField label="Índice" :options="['CDI', 'IPCA', 'Selic']" placeholder="Selecione" v-model="form.indicePos" />
          <SelectField label="Operador" :options="['Percentual', 'Spread']" placeholder="Selecione" v-model="form.operadorPos" />
          <FormField label="Valor da taxa" placeholder="100%" v-model="form.valorTaxaPos" />
        </template>
        <FormField v-else label="Taxa operação (%)" placeholder="0,00" v-model="form.taxaOperacao" />
        <FormField label="FEE da Operação (%)" placeholder="0,00" v-model="form.fee" />
      </BentoGrid>
    </BentoBox>

    <!-- Toggle quitação de vencidos — linha própria -->
    <ToggleRow
      label="Operação para quitação de vencidos"
      :on="form.quitacaoVencidos"
      @toggle="form.quitacaoVencidos = !form.quitacaoVencidos"
    />

    <!-- Tabela de Agrupamento — empty state discreto -->
    <BentoBox title="Agrupamento">
      <div
        style="
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Agrupamento</div>
          <div>Limite</div>
          <div>Risco</div>
          <div>Risco c/ Solicitação</div>
        </div>
        <div
          v-for="row in AGRUPAMENTO_ROWS"
          :key="row.agrupamento"
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            font-variant-numeric: tabular-nums;
          "
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.agrupamento }}</div>
          <div style="color: var(--text-default)">{{ row.limite }}</div>
          <div style="color: var(--text-default)">{{ row.risco }}</div>
          <div style="color: var(--text-default)">{{ row.riscoSolic }}</div>
        </div>
      </div>
    </BentoBox>
  </div>
</template>
