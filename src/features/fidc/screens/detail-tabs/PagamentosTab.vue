<script setup lang="ts">
import { ref, computed } from 'vue';
import { Wallet, CalendarClock, ChevronDown, ChevronUp, Undo2, Calculator, Pencil } from 'lucide-vue-next';
import {
  brl, TIPO_PAGAMENTO_OPTS,
  type Title, type PagamentoTitulo, type StatusParcela, type ParcelaCronograma, type DetalhePagamentos,
} from '../../data/fidcsData';
import SimularValorizacaoModal from '../../components/modals/SimularValorizacaoModal.vue';
import EditarParcelasModal from '../../components/modals/EditarParcelasModal.vue';
import EstornoPagamentoModal from '../../components/modals/EstornoPagamentoModal.vue';
import HeaderStat from './pagamentos/HeaderStat.vue';
import Section from './pagamentos/Section.vue';
import Field from './pagamentos/Field.vue';
import EmptyState from './pagamentos/EmptyState.vue';
import GhostButton from './pagamentos/GhostButton.vue';
import FormField from './pagamentos/FormField.vue';
import SelectField from './pagamentos/SelectField.vue';
import ToggleRow from './pagamentos/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

defineProps<{ title: Title }>();
const det = defineModel<DetalhePagamentos>('det', { required: true });

const STATUS_TONE: Record<StatusParcela, { bg: string; fg: string; label: string }> = {
  PAGO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', label: 'Pago' },
  PAGO_PARCIAL_VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', label: 'Pago Parcial (Vencido)' },
  DESCONHECIDO: { bg: 'var(--neutral-100)', fg: 'var(--text-muted)', label: 'Desconhecido' },
};

const emptyForm = {
  valorAmortizacao: '', dataPagamento: '', tipoPagamento: '',
  jurosMoratorio: '', multa: '', jurosRemuneratorio: '',
  transferenciaParcial: false, observacao: '',
};

const form = ref({ ...emptyForm });
const showSimular = ref(false);
const showEditarParcelas = ref(false);
const estornoAlvo = ref<number | null>(null);
const configOpen = ref(false);

const totalPago = computed(() =>
  det.value.pagamentos.filter((p) => !p.estornado).reduce((acc, p) => acc + p.valorAmortizacao, 0),
);

const {
  page: pagamentosPage,
  pageSize: pagamentosPageSize,
  total: pagamentosTotal,
  pageItems: pagamentosPageItems,
  setPage: setPagamentosPage,
  setPageSize: setPagamentosPageSize,
} = useTablePagination(() => det.value.pagamentos, { defaultPageSize: 5 });

const {
  page: cronogramaPage,
  pageSize: cronogramaPageSize,
  total: cronogramaTotal,
  pageItems: cronogramaPageItems,
  setPage: setCronogramaPage,
  setPageSize: setCronogramaPageSize,
} = useTablePagination(() => det.value.cronograma, { defaultPageSize: 5 });

const pagamentosStartIndex = computed(() => (pagamentosPage.value - 1) * pagamentosPageSize.value);

const canSalvar = computed(
  () => form.value.valorAmortizacao.trim() !== '' && form.value.dataPagamento.trim() !== '' && form.value.tipoPagamento.trim() !== '',
);

function handleSalvar() {
  if (!canSalvar.value) return;
  const novo: PagamentoTitulo = {
    data: form.value.dataPagamento,
    valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
    tipoPagamento: form.value.tipoPagamento as PagamentoTitulo['tipoPagamento'],
    jurosRemuneratorio: Number(form.value.jurosRemuneratorio) || 0,
    jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
    multa: Number(form.value.multa) || 0,
    desconto: 0,
    observacao: form.value.observacao || undefined,
  };
  det.value = { ...det.value, pagamentos: [novo, ...det.value.pagamentos] };
  form.value = { ...emptyForm };
}

function handleUpdateCronograma(cronograma: ParcelaCronograma[]) {
  det.value = { ...det.value, cronograma };
  showEditarParcelas.value = false;
}

function handleConfirmEstorno(justificativa: string) {
  if (estornoAlvo.value === null) return;
  const idx = estornoAlvo.value;
  det.value = {
    ...det.value,
    pagamentos: det.value.pagamentos.map((p, i) => (i === idx ? { ...p, estornado: true, justificativaEstorno: justificativa } : p)),
  };
  estornoAlvo.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <!-- Header context -->
    <div class="flex items-center justify-end" style="gap: 32px; flex-wrap: wrap">
      <HeaderStat label="Valor em aberto" :value="brl(Math.max(title.vrNominal - totalPago, 0))" />
      <HeaderStat label="Juros remuneratórios em aberto" :value="brl(det.jurosRemuneratorioAberto)" />
    </div>

    <!-- Registrar Pagamento — sempre visível (mesmo padrão do compositor da Ata de Deliberação) -->
    <Section title="Registrar Pagamento">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <FormField label="Valor de amortização" placeholder="R$ 0,00" v-model="form.valorAmortizacao" />
        <FormField label="Data de pagamento" placeholder="dd/mm/aaaa" v-model="form.dataPagamento" />
        <SelectField label="Tipo de pagamento" :options="TIPO_PAGAMENTO_OPTS" placeholder="Selecione" v-model="form.tipoPagamento" />
        <FormField label="Juros moratório" placeholder="R$ 0,00" v-model="form.jurosMoratorio" />
        <FormField label="Multa" placeholder="R$ 0,00" v-model="form.multa" />
        <FormField label="Juros remuneratório" placeholder="R$ 0,00" v-model="form.jurosRemuneratorio" />
        <div style="grid-column: span 2; display: flex; align-items: flex-end">
          <ToggleRow label="Transferência parcial" :on="form.transferenciaParcial" @toggle="form.transferenciaParcial = !form.transferenciaParcial" />
        </div>
      </div>
      <div style="margin-top: 14px">
        <FormField label="Observação" placeholder="—" v-model="form.observacao" />
      </div>
      <div class="flex items-center justify-end" style="margin-top: 16px">
        <button
          :disabled="!canSalvar"
          :style="{
            height: '42px', padding: '0 24px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canSalvar ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canSalvar ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSalvar ? '#fff' : 'var(--text-disabled)',
            transition: 'background var(--duration-base)',
          }"
          @click="handleSalvar"
        >
          SALVAR
        </button>
      </div>
    </Section>

    <!-- Histórico de Pagamentos -->
    <Section title="Histórico de Pagamentos">
      <EmptyState v-if="det.pagamentos.length === 0" :icon="Wallet" title="Nenhum pagamento registrado" hint="Use o formulário acima para registrar baixas manuais deste título." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 0.9fr 1fr 1.3fr 1.1fr 1fr 0.8fr 0.8fr 0.6fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Val. Amortização</div><div>Tipo pagamento</div><div>Val. Juros Rem.</div><div>Val. Juros Mor.</div><div>Val. Multa</div><div>Val. Desconto</div><div style="text-align: right">Estornar</div>
        </div>
        <div
          v-for="(p, i) in pagamentosPageItems"
          :key="pagamentosStartIndex + i"
          class="grid items-center"
          :style="{
            gridTemplateColumns: '0.9fr 1fr 1.3fr 1.1fr 1fr 0.8fr 0.8fr 0.6fr', padding: '12px 16px',
            borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)',
            opacity: p.estornado ? 0.5 : 1,
          }"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.data }}</div>
          <div :style="{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', textDecoration: p.estornado ? 'line-through' : 'none' }">{{ brl(p.valorAmortizacao) }}</div>
          <div style="color: var(--text-default)">{{ p.tipoPagamento }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.jurosRemuneratorio) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.jurosMoratorio) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.multa) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.desconto) }}</div>
          <div class="flex justify-end">
            <button
              aria-label="Estornar pagamento"
              :title="p.estornado ? 'Pagamento já estornado' : 'Estornar pagamento'"
              :disabled="p.estornado"
              class="flex items-center justify-center"
              :style="{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'none', border: '1px solid var(--border-default)', cursor: p.estornado ? 'not-allowed' : 'pointer', color: p.estornado ? 'var(--text-disabled)' : 'var(--action-danger-text-only)' }"
              @click="estornoAlvo = pagamentosStartIndex + i"
            >
              <Undo2 :size="14" />
            </button>
          </div>
        </div>
        <TablePagination
          sunken
          compact
          :total="pagamentosTotal"
          :page="pagamentosPage"
          :page-size="pagamentosPageSize"
          @update:page="setPagamentosPage"
          @update:page-size="setPagamentosPageSize"
        />
      </div>
    </Section>

    <!-- Configuração do Título — somente leitura -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <button
        class="flex items-center justify-between"
        style="width: 100%; padding: 14px 18px; background: var(--surface-sunken); border: none; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
        @click="configOpen = !configOpen"
      >
        Configuração do Título — {{ det.configuracao.tipoCalculo }}
        <ChevronUp v-if="configOpen" :size="16" />
        <ChevronDown v-else :size="16" />
      </button>
      <div v-if="configOpen" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px">
        <Field label="Emissão">{{ title.emissao }}</Field>
        <Field label="Valor Emissão">{{ brl(det.configuracao.valorEmissao) }}</Field>
        <Field label="Vencimento final">{{ det.configuracao.vencimentoFinal }}</Field>
        <Field label="Taxa">{{ det.configuracao.taxa }}</Field>
        <Field label="Frequência da taxa">{{ det.configuracao.frequenciaTaxa }}</Field>
        <Field label="Tipo de capitalização">{{ det.configuracao.tipoCapitalizacao }}</Field>
        <Field label="Base de dias para cálculo">{{ det.configuracao.baseDias }}</Field>
        <Field label="Fluxo de amortização">{{ det.configuracao.fluxoAmortizacao }}</Field>
        <Field label="Fluxo de juros">{{ det.configuracao.fluxoJuros }}</Field>
      </div>
    </div>

    <!-- Cronograma de Pagamentos -->
    <Section title="Cronograma de Pagamentos">
      <template #action>
        <div class="flex items-center" style="gap: 10px">
          <GhostButton :icon="Calculator" @click="showSimular = true">Simular valorização</GhostButton>
          <GhostButton :icon="Pencil" @click="showEditarParcelas = true">Editar parcelas</GhostButton>
        </div>
      </template>
      <EmptyState v-if="det.cronograma.length === 0" :icon="CalendarClock" title="Nenhum pagamento esperado encontrado" hint="O cronograma será exibido aqui assim que houver parcelas programadas para este título." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1.3fr 1.2fr 1.2fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
          <div>Vencimento</div><div>Status</div><div>Total Esperado (PMT)</div><div style="text-align: right">Em Aberto</div>
        </div>
        <div
          v-for="(c, i) in cronogramaPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.3fr 1.2fr 1.2fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.vencimento }}</div>
          <div>
            <span :style="{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '9999px', background: STATUS_TONE[c.status].bg, color: STATUS_TONE[c.status].fg, textTransform: 'uppercase' }">{{ STATUS_TONE[c.status].label }}</span>
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(c.totalEsperado) }}</div>
          <div :style="{ textAlign: 'right', fontWeight: 'var(--weight-bold)', color: c.emAberto > 0 ? 'var(--warning-dark)' : 'var(--success-dark)', fontVariantNumeric: 'tabular-nums' }">{{ brl(c.emAberto) }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="cronogramaTotal"
          :page="cronogramaPage"
          :page-size="cronogramaPageSize"
          @update:page="setCronogramaPage"
          @update:page-size="setCronogramaPageSize"
        />
      </div>
    </Section>

    <SimularValorizacaoModal v-if="showSimular" :title="title" :cronograma="det.cronograma" @close="showSimular = false" />

    <EditarParcelasModal
      v-if="showEditarParcelas"
      :cronograma="det.cronograma"
      @close="showEditarParcelas = false"
      @update="handleUpdateCronograma"
    />

    <EstornoPagamentoModal
      v-if="estornoAlvo !== null"
      :pagamento="det.pagamentos[estornoAlvo]"
      @close="estornoAlvo = null"
      @confirm="handleConfirmEstorno"
    />
  </div>
</template>
