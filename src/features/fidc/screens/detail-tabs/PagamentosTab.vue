<script setup lang="ts">
import { ref, computed } from 'vue';
import { Wallet, Percent, History, CalendarClock, Settings2, ChevronDown, ChevronUp, Undo2, Calculator, Pencil } from 'lucide-vue-next';
import {
  brl, TIPO_PAGAMENTO_OPTS,
  type Title, type PagamentoTitulo, type StatusParcela, type ParcelaCronograma, type DetalhePagamentos,
} from '../../data/fidcsData';
import SimularValorizacaoModal from '../../components/modals/SimularValorizacaoModal.vue';
import EditarParcelasModal from '../../components/modals/EditarParcelasModal.vue';
import EstornoPagamentoModal from '../../components/modals/EstornoPagamentoModal.vue';
import { TabCard, ToggleRow, EmptyState } from '@/features/risco/screens/detail-tabs/shared';
import Field from './pagamentos/Field.vue';
import FieldLabel from './pagamentos/FieldLabel.vue';
import GhostButton from './pagamentos/GhostButton.vue';
import FormField from './pagamentos/FormField.vue';
import SelectField from './pagamentos/SelectField.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import ValorPresenteInfo from '@/components/ui/ValorPresenteInfo.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: Title }>();
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

const kpis = computed(() => [
  { icon: Wallet, label: 'Valor presente', hint: true, value: brl(Math.max(props.title.vrNominal - totalPago.value, 0)) },
  { icon: Percent, label: 'Juros remuneratórios em aberto', hint: false, value: brl(det.value.jurosRemuneratorioAberto) },
]);

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
  <div class="flex flex-col" style="gap: 20px">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
      >
        <div
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base); flex-shrink: 0"
        >
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 6px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
            <ValorPresenteInfo v-if="k.hint" :size="12" />
          </div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <TabCard title="Registrar pagamento" :icon="Wallet" has-save :save-disabled="!canSalvar" @save="handleSalvar">
      <div class="flex flex-col" style="gap: 16px">
        <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
          <FormField label="Valor de amortização" placeholder="R$ 0,00" v-model="form.valorAmortizacao" />
          <FormField label="Data de pagamento" placeholder="dd/mm/aaaa" v-model="form.dataPagamento" />
          <SelectField label="Tipo de pagamento" :options="TIPO_PAGAMENTO_OPTS" placeholder="Selecione" v-model="form.tipoPagamento" />
          <FormField label="Juros moratório" placeholder="R$ 0,00" v-model="form.jurosMoratorio" />
          <FormField label="Multa" placeholder="R$ 0,00" v-model="form.multa" />
          <FormField label="Juros remuneratório" placeholder="R$ 0,00" v-model="form.jurosRemuneratorio" />
        </div>
        <ToggleRow label="Transferência parcial" :on="form.transferenciaParcial" @toggle="form.transferenciaParcial = !form.transferenciaParcial" />
        <div>
          <FieldLabel>Observação</FieldLabel>
          <textarea
            v-model="form.observacao"
            placeholder="—"
            rows="3"
            style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); resize: vertical; font-family: inherit"
          />
        </div>
      </div>
    </TabCard>

    <TabCard title="Histórico de pagamentos" :icon="History">
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
    </TabCard>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <button
        type="button"
        class="flex items-center"
        style="width: 100%; gap: 10px; padding: 16px 22px; background: none; border: none; cursor: pointer; text-align: left"
        @click="configOpen = !configOpen"
      >
        <Settings2 :size="16" style="color: var(--text-muted); flex-shrink: 0" />
        <span style="flex: 1; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Configuração do título</span>
        <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-muted)">{{ det.configuracao.tipoCalculo }}</span>
        <ChevronUp v-if="configOpen" :size="16" style="color: var(--text-muted)" />
        <ChevronDown v-else :size="16" style="color: var(--text-muted)" />
      </button>
      <div v-if="configOpen" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 22px; border-top: 1px solid var(--border-default)">
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

    <TabCard title="Cronograma de pagamentos" :icon="CalendarClock">
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
    </TabCard>

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
