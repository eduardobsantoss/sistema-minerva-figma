<script setup lang="ts">
import { computed, ref } from 'vue';
import { Wallet, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { brl, type ContratoAtivo } from '../../../../data/operacaoData';
import type { AtivoDetalhePagamentos, AtivoPagamento } from '../../../../data/ativoData';
import {
  CONFIGURACAO_TITULO_FIELDS,
  REGISTRAR_PAGAMENTO_FIELDS,
  type PagamentoFormState,
} from '../../../../data/pagamentoFields';
import { Section, EmptyState, GhostButton } from '../../shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import DynamicPagamentoFormGrid from './DynamicPagamentoFormGrid.vue';
import DynamicConfigGrid from './DynamicConfigGrid.vue';

const props = defineProps<{ ativo: ContratoAtivo }>();
const det = ref<AtivoDetalhePagamentos>({ ...props.ativo.pagamentosDetalhe });

const emptyForm: PagamentoFormState = {
  valorAmortizacao: '',
  dataPagamento: '',
  tipoPagamento: '',
  jurosMoratorio: '',
  multa: '',
  jurosRemuneratorio: '',
  transferenciaParcial: false,
  observacao: '',
};
const form = ref<PagamentoFormState>({ ...emptyForm });
const configOpen = ref(false);

const {
  page: pagamentosPage,
  pageSize: pagamentosPageSize,
  total: pagamentosTotal,
  pageItems: pagamentosPageItems,
  setPage: setPagamentosPage,
  setPageSize: setPagamentosPageSize,
} = useTablePagination(() => det.value.pagamentos, { defaultPageSize: 10 });

const {
  page: cronogramaPage,
  pageSize: cronogramaPageSize,
  total: cronogramaTotal,
  pageItems: cronogramaPageItems,
  setPage: setCronogramaPage,
  setPageSize: setCronogramaPageSize,
} = useTablePagination(() => det.value.cronograma, { defaultPageSize: 10 });

const totalPago = computed(() =>
  det.value.pagamentos.filter((p) => !p.estornado).reduce((acc, p) => acc + p.valorAmortizacao, 0),
);
const canSalvar = computed(
  () => form.value.valorAmortizacao.trim() !== '' && form.value.dataPagamento.trim() !== '' && form.value.tipoPagamento.trim() !== '',
);

const configuracaoDisplay = computed(() => ({
  tipoCalculo: det.value.configuracao.tipoCalculo,
  valorEmissao: brl(det.value.configuracao.valorEmissao),
  vencimentoFinal: det.value.configuracao.vencimentoFinal || '—',
  taxa: det.value.configuracao.taxa,
  frequenciaTaxa: det.value.configuracao.frequenciaTaxa,
  tipoCapitalizacao: det.value.configuracao.tipoCapitalizacao,
  baseDias: det.value.configuracao.baseDias,
  fluxoAmortizacao: det.value.configuracao.fluxoAmortizacao,
  fluxoJuros: det.value.configuracao.fluxoJuros,
}));

function handleSalvar() {
  if (!canSalvar.value) return;
  const novo: AtivoPagamento = {
    data: form.value.dataPagamento,
    valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
    tipoPagamento: form.value.tipoPagamento,
    jurosRemuneratorio: Number(form.value.jurosRemuneratorio) || 0,
    jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
    multa: Number(form.value.multa) || 0,
    desconto: 0,
  };
  det.value = { ...det.value, pagamentos: [novo, ...det.value.pagamentos] };
  form.value = { ...emptyForm };
}
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <div class="flex items-center justify-end" style="gap: 32px; flex-wrap: wrap">
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Valor em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(Math.max(ativo.valorTotal - totalPago, 0)) }}
        </div>
      </div>
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Juros remuneratórios em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(det.jurosRemuneratorioAberto) }}
        </div>
      </div>
    </div>

    <Section title="Registrar Pagamento">
      <DynamicPagamentoFormGrid v-model="form" :fields="REGISTRAR_PAGAMENTO_FIELDS" :cols="3" />
      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <GhostButton v-if="canSalvar" :icon="Wallet" @click="handleSalvar">Registrar pagamento</GhostButton>
      </div>
    </Section>

    <Section title="Histórico de Pagamentos">
      <EmptyState v-if="det.pagamentos.length === 0" :icon="Wallet" title="Nenhum pagamento registrado" hint="Use o formulário acima para registrar um pagamento." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Valor</div><div>Tipo</div><div>Status</div>
        </div>
        <div v-for="(p, i) in pagamentosPageItems" :key="i" class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>{{ p.data }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.valorAmortizacao) }}</div>
          <div>{{ p.tipoPagamento }}</div>
          <div>{{ p.estornado ? 'Estornado' : 'Ativo' }}</div>
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

    <Section title="Configuração do Título">
      <button
        class="flex items-center"
        style="gap: 8px; background: none; border: none; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px"
        @click="configOpen = !configOpen"
      >
        <component :is="configOpen ? ChevronUp : ChevronDown" :size="16" />
        {{ configOpen ? 'Ocultar' : 'Expandir' }} configuração
      </button>
      <DynamicConfigGrid v-if="configOpen" :fields="CONFIGURACAO_TITULO_FIELDS" :data="configuracaoDisplay" :cols="3" />
    </Section>

    <Section title="Cronograma de Pagamentos">
      <EmptyState v-if="det.cronograma.length === 0" :icon="Wallet" title="Nenhuma parcela no cronograma" hint="O cronograma será gerado automaticamente ou manualmente." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Parcela</div><div>Vencimento</div><div>Amortização</div><div>Valor</div>
        </div>
        <div v-for="p in cronogramaPageItems" :key="p.parcela" class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>{{ p.parcela }}</div>
          <div>{{ p.vencimento }}</div>
          <div>{{ p.amortizacao != null ? brl(p.amortizacao) : '—' }}</div>
          <div>{{ p.valor != null ? brl(p.valor) : '—' }}</div>
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
  </div>
</template>
