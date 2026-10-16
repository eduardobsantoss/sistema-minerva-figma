<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, BadgeCheck, Clock, ExternalLink, FileText, Phone, Users, Wallet, ClipboardList } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import CopyButton from '../../screens/titulo-detail/CopyButton.vue';
import {
  CRA_OPTS,
  FIDC_OPTS,
  SITUACOES_OPTS,
  STATUS_PREVENTIVO,
  TIPOS_TITULO_OPTS,
  brl,
  fmtData,
  situacaoColor,
  statusPreventivoColor,
  statusPreventivoLabel,
  type ContatoSacado,
  type RegistroTentativa,
  type SacadoPreventivo,
  type StatusPreventivo,
  type StatusVencimento,
  type TentativaRegistro,
  type TituloPreventivo,
} from '../../data/cobrancaPreventivaData';
import { contarFiltros, filtrosVazios, passaFiltros, type FiltrosTitulo } from '../../data/preventivaFiltros';
import RegistrarTentativaModal from './RegistrarTentativaModal.vue';
import MultiCheckDropdown from './MultiCheckDropdown.vue';
import FiltrosPopover from './FiltrosPopover.vue';
import ColunasMenu from './ColunasMenu.vue';
import BoletoMenu from './BoletoMenu.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

export type SacadoTab = 'titulos' | 'contatos' | 'registros';

const props = withDefaults(
  defineProps<{
    sacado: SacadoPreventivo;
    titulos: TituloPreventivo[];
    contatos?: ContatoSacado[];
    registros?: RegistroTentativa[];
    initialTab?: SacadoTab;
  }>(),
  { contatos: () => [], registros: () => [], initialTab: 'titulos' },
);
const emit = defineEmits<{
  back: [];
  registrar: [payload: { ids: string[]; tentativas: TentativaRegistro[]; observacoes: string }];
  evidencia: [registroId: string];
}>();

const { success } = useToast();

const tab = ref<SacadoTab>(props.initialTab);
const tabs = [
  { key: 'titulos', label: 'Títulos', icon: FileText },
  { key: 'contatos', label: 'Contatos', icon: Users },
  { key: 'registros', label: 'Registro de tentativas', icon: ClipboardList },
];

const selected = ref<string[]>([]);
const tentativaAberta = ref(false);

// ---------- Filtros ----------
const draft = ref<FiltrosTitulo>(filtrosVazios());
const applied = ref<FiltrosTitulo>(filtrosVazios());
const activeFilterCount = computed(() => contarFiltros(applied.value, true));

const statusOptions = STATUS_PREVENTIVO.map((s) => ({ key: s.key, label: s.label }));
const tipoOptions = TIPOS_TITULO_OPTS.map((t) => ({ key: t, label: t }));

function clonar(f: FiltrosTitulo): FiltrosTitulo {
  return { ...f, status: [...f.status], tipos: [...f.tipos], excluirGrupos: [...f.excluirGrupos] };
}
function aplicarFiltros() {
  applied.value = clonar(draft.value);
  setPage(1);
}
function limparFiltros() {
  draft.value = filtrosVazios();
  applied.value = filtrosVazios();
  setPage(1);
}
function onDraftStatus(value: string[]) {
  draft.value.status = value as StatusPreventivo[];
}

const titulosFiltrados = computed(() => props.titulos.filter((t) => passaFiltros(t, applied.value)));

// ---------- Colunas ----------
type ColKey =
  | 'lastro'
  | 'numero'
  | 'cedente'
  | 'tipo'
  | 'situacao'
  | 'veiculo'
  | 'cessao'
  | 'valor'
  | 'valorAPagar'
  | 'vencimento'
  | 'status'
  | 'statusVenc'
  | 'notificado'
  | 'confirmado'
  | 'responsavel';

interface Col {
  key: ColKey;
  label: string;
  width: string;
  right?: boolean;
}

const ALL_COLS: Col[] = [
  { key: 'lastro', label: 'Lastro', width: '90px' },
  { key: 'numero', label: 'Número', width: 'minmax(160px, 1.1fr)' },
  { key: 'cedente', label: 'Cedente', width: 'minmax(180px, 1.3fr)' },
  { key: 'tipo', label: 'Tipo', width: '72px' },
  { key: 'situacao', label: 'Situação', width: '130px' },
  { key: 'veiculo', label: 'Veículo', width: 'minmax(170px, 1.2fr)' },
  { key: 'cessao', label: 'Cessão', width: 'minmax(210px, 1.3fr)' },
  { key: 'valor', label: 'Valor', width: '120px', right: true },
  { key: 'valorAPagar', label: 'Valor a pagar', width: '140px', right: true },
  { key: 'vencimento', label: 'Vencimento', width: '120px' },
  { key: 'status', label: 'Status', width: '260px' },
  { key: 'statusVenc', label: 'Status de vencimento', width: '200px' },
  { key: 'notificado', label: 'Notificado', width: '120px' },
  { key: 'confirmado', label: 'Confirmado', width: '130px' },
  { key: 'responsavel', label: 'Responsável pela atuação', width: '240px' },
];

const visibleCols = ref<Set<string>>(new Set(ALL_COLS.map((c) => c.key)));
const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => `36px ${cols.value.map((c) => c.width).join(' ')} 64px`);
const tableMinWidth = computed(() => {
  const tracks = [36, ...cols.value.map((c) => Number(c.width.match(/(\d+)px/)?.[1] ?? 160)), 64];
  const gaps = Math.max(0, tracks.length - 1) * 16;
  return `${tracks.reduce((acc, n) => acc + n, 0) + gaps + 40}px`;
});

function toggleCol(key: string) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) {
    if (next.size === 1) return;
    next.delete(key);
  } else {
    next.add(key);
  }
  visibleCols.value = next;
}

// ---------- Seleção e paginação ----------
const allSelected = computed(
  () => titulosFiltrados.value.length > 0 && titulosFiltrados.value.every((t) => selected.value.includes(t.id)),
);
const someSelected = computed(
  () => titulosFiltrados.value.some((t) => selected.value.includes(t.id)) && !allSelected.value,
);

const valor = computed(() => props.titulos.reduce((acc, t) => acc + t.valor, 0));
const confirmados = computed(() => props.titulos.filter((t) => t.status === 'CONFIRMADO').length);
const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => titulosFiltrados.value, {
  defaultPageSize: 10,
});

const kpis = computed(() => [
  {
    label: 'Valor a vencer',
    value: brl(valor.value),
    icon: Wallet,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Títulos',
    value: String(props.titulos.length),
    icon: FileText,
    tone: { bg: 'color-mix(in srgb, var(--agro-base) 14%, transparent)', fg: 'var(--agro-base)' },
  },
  {
    label: 'Confirmados',
    value: String(confirmados.value),
    icon: BadgeCheck,
    tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  },
  {
    label: 'Pendentes',
    value: String(props.titulos.length - confirmados.value),
    icon: Clock,
    tone: { bg: 'color-mix(in srgb, var(--warning-base) 14%, transparent)', fg: 'var(--warning-base)' },
  },
]);

function toggleAll() {
  const ids = titulosFiltrados.value.map((t) => t.id);
  if (allSelected.value) selected.value = selected.value.filter((id) => !ids.includes(id));
  else selected.value = [...new Set([...selected.value, ...ids])];
}

function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = [...next];
}

function salvar(payload: { observacoes: string; tentativas: TentativaRegistro[] }) {
  emit('registrar', { ids: [...selected.value], tentativas: payload.tentativas, observacoes: payload.observacoes });
  selected.value = [];
  tentativaAberta.value = false;
}

function baixarBoleto(t: TituloPreventivo) {
  success(`Download do boleto iniciado: ${t.boleto}`);
}

// ---------- Estilos de chip ----------
function chipStyle(color: string) {
  return {
    fontSize: '10px',
    fontWeight: 'var(--weight-bold)',
    letterSpacing: '0.04em',
    padding: '4px 9px',
    borderRadius: '9999px',
    background: `color-mix(in srgb, ${color} 14%, transparent)`,
    color,
    whiteSpace: 'nowrap' as const,
  };
}

const VENC_COLOR: Record<StatusVencimento, string> = {
  'A vencer': 'var(--text-muted)',
  'Vence hoje': 'var(--warning-base)',
  Vencido: 'var(--danger-base)',
};

function textoCelula(t: TituloPreventivo, key: ColKey): string {
  switch (key) {
    case 'lastro':
      return t.lastro;
    case 'cedente':
      return t.cedente;
    case 'tipo':
      return t.tipoTitulo;
    case 'veiculo':
      return t.veiculo;
    case 'cessao':
      return t.cessao;
    case 'vencimento':
      return fmtData(t.vencimento);
    case 'responsavel':
      return t.responsavel || '—';
    default:
      return '';
  }
}

// ---------- Registros ----------
const registrosOrdenados = computed(() =>
  [...props.registros].sort((a, b) => b.dataContato.localeCompare(a.dataContato)),
);

function numerosDos(r: RegistroTentativa): string[] {
  return r.tituloIds
    .map((id) => props.titulos.find((t) => t.id === id)?.numero)
    .filter((n): n is string => Boolean(n));
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button type="button" aria-label="Voltar" class="back" @click="emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div class="eyebrow">Cobrança · Sacado</div>
        <h2 class="flex items-center" style="gap: 10px; flex-wrap: wrap; margin-top: 4px">
          {{ sacado.nome }}
          <span :style="chipStyle(situacaoColor(sacado.situacao))">
            {{ sacado.situacao }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
          {{ sacado.documento }} · {{ sacado.telefone }}
        </p>
      </div>
    </div>

    <div class="grid kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi">
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: kpi.tone.bg, color: kpi.tone.fg, flexShrink: 0 }"
        >
          <component :is="kpi.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabs"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as SacadoTab"
    />

    <!-- Títulos -->
    <template v-if="tab === 'titulos'">
      <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)">
        <div class="flex items-center justify-between" style="padding: 16px 20px; gap: 12px; flex-wrap: wrap">
          <div>
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">Títulos a vencer</h3>
            <span style="font-size: var(--text-sm); color: var(--text-muted)">
              {{ selected.length === 0 ? 'Nenhum título selecionado' : selected.length === 1 ? '1 título selecionado' : `${selected.length} títulos selecionados` }}
            </span>
          </div>
          <div class="flex items-center" style="gap: 10px">
            <FiltrosPopover :active-count="activeFilterCount" @apply="aplicarFiltros" @clear="limparFiltros">
              <MultiCheckDropdown
                :model-value="draft.status"
                label="Status de confirmação"
                :options="statusOptions"
                @update:model-value="onDraftStatus"
              />
              <MultiCheckDropdown v-model="draft.tipos" label="Tipo de título" :options="tipoOptions" :panel-width="240" />
              <div>
                <div class="filter-label">Situação</div>
                <AdminSelect v-model="draft.situacao" :options="[{ value: '', label: 'Todas' }, ...SITUACOES_OPTS.map((s) => ({ value: s, label: s }))]" />
              </div>
              <div>
                <div class="filter-label">Valor até</div>
                <input v-model="draft.valorAte" inputmode="decimal" placeholder="0,00" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Vencimento de</div>
                <AdminDateField v-model="draft.vencDe" />
              </div>
              <div>
                <div class="filter-label">Vencimento até</div>
                <AdminDateField v-model="draft.vencAte" />
              </div>
              <div>
                <div class="filter-label">Dias para vencimento</div>
                <input v-model="draft.dias" type="number" min="0" placeholder="Vence em até N dias" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">CRA</div>
                <AdminSelect v-model="draft.cra" :options="[{ value: '', label: 'Todos' }, ...CRA_OPTS.map((c) => ({ value: c, label: c }))]" />
              </div>
              <div>
                <div class="filter-label">FIDC</div>
                <AdminSelect v-model="draft.fidc" :options="[{ value: '', label: 'Todos' }, ...FIDC_OPTS.map((f) => ({ value: f, label: f }))]" />
              </div>
            </FiltrosPopover>
            <ColunasMenu :cols="ALL_COLS" :visible="visibleCols" @toggle="toggleCol" />
          </div>
        </div>

        <div style="overflow-x: auto; border-top: 1px solid var(--border-default)">
          <div
            class="grid items-center sacado-row sacado-header"
            :style="{ gridTemplateColumns: gridTemplate, width: '100%', minWidth: tableMinWidth }"
          >
            <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="toggleAll" />
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.right ? 'right' : 'left' }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-for="t in pageItems"
            :key="t.id"
            class="grid items-center sacado-row"
            :style="{ gridTemplateColumns: gridTemplate, width: '100%', minWidth: tableMinWidth }"
          >
            <Checkbox :checked="selected.includes(t.id)" @change="toggle(t.id)" />
            <template v-for="c in cols" :key="c.key">
              <div v-if="c.key === 'numero'" style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.numero }}</div>
              <div v-else-if="c.key === 'situacao'">
                <span :style="chipStyle(situacaoColor(t.situacaoCedente))">{{ t.situacaoCedente }}</span>
              </div>
              <div
                v-else-if="c.key === 'valor' || c.key === 'valorAPagar'"
                style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold); color: var(--text-strong)"
              >
                {{ brl(c.key === 'valor' ? t.valor : t.valorAPagar) }}
              </div>
              <div v-else-if="c.key === 'status'">
                <span :style="chipStyle(statusPreventivoColor(t.status))">{{ statusPreventivoLabel(t.status) }}</span>
              </div>
              <div v-else-if="c.key === 'statusVenc'">
                <span :style="chipStyle(VENC_COLOR[t.statusVencimento])">{{ t.statusVencimento }}</span>
              </div>
              <div v-else-if="c.key === 'notificado'">
                <span :style="chipStyle(t.notificado ? 'var(--status-success-text)' : 'var(--text-muted)')">
                  {{ t.notificado ? 'Sim' : 'Não' }}
                </span>
              </div>
              <div v-else-if="c.key === 'confirmado'">
                <span :style="chipStyle(t.confirmado ? 'var(--status-success-text)' : 'var(--text-muted)')">
                  {{ t.confirmado ? 'Sim' : 'Não' }}
                </span>
              </div>
              <div v-else-if="c.key === 'vencimento'" style="font-variant-numeric: tabular-nums">{{ textoCelula(t, c.key) }}</div>
              <div v-else-if="c.key === 'lastro'" style="font-variant-numeric: tabular-nums">{{ textoCelula(t, c.key) }}</div>
              <div v-else>{{ textoCelula(t, c.key) }}</div>
            </template>
            <BoletoMenu :boleto="t.boleto" @baixar="baixarBoleto(t)" />
          </div>

          <div
            v-if="titulosFiltrados.length === 0"
            style="padding: 36px 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
          >
            Nenhum título encontrado com os filtros aplicados.
          </div>
        </div>
        <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          class="primary"
          :disabled="selected.length === 0"
          :title="selected.length === 0 ? 'Selecione ao menos um título' : undefined"
          @click="tentativaAberta = true"
        >
          Registrar tentativa
        </button>
      </div>
    </template>

    <!-- Contatos -->
    <div
      v-else-if="tab === 'contatos'"
      style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <div class="flex items-center" style="padding: 16px 20px; gap: 8px">
        <Phone :size="16" style="color: var(--text-muted)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Contatos do sacado</h3>
      </div>
      <div style="overflow-x: auto">
        <div class="grid items-center sacado-row sacado-header" style="grid-template-columns: 48px 1.2fr 1.4fr 1fr; min-width: 640px">
          <div>#</div>
          <div>Nome</div>
          <div>E-mail</div>
          <div>Telefone</div>
        </div>
        <div
          v-for="(c, i) in contatos"
          :key="c.id"
          class="grid items-center sacado-row"
          style="grid-template-columns: 48px 1.2fr 1.4fr 1fr; min-width: 640px"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ i + 1 }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
          <div>{{ c.email }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ c.telefone }}</div>
        </div>
        <div
          v-if="contatos.length === 0"
          style="padding: 36px 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
        >
          Nenhum contato cadastrado para este sacado.
        </div>
      </div>
    </div>

    <!-- Registro de tentativas -->
    <div
      v-else
      style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <div class="flex items-center" style="padding: 16px 20px; gap: 8px">
        <ClipboardList :size="16" style="color: var(--text-muted)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Registro de tentativas</h3>
      </div>
      <div style="overflow-x: auto">
        <div class="grid items-start sacado-row sacado-header reg-grid">
          <div>Status</div>
          <div>Geral</div>
          <div>Observações</div>
          <div>Data do contato</div>
          <div>Registrado por</div>
          <div>Títulos</div>
          <div>Evidência</div>
        </div>
        <div v-for="r in registrosOrdenados" :key="r.id" class="grid items-start sacado-row reg-grid">
          <div><span :style="chipStyle(statusPreventivoColor(r.status))">{{ statusPreventivoLabel(r.status) }}</span></div>
          <div>{{ r.geral }}</div>
          <div style="color: var(--text-default)">{{ r.observacoes || '—' }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ fmtData(r.dataContato) }}</div>
          <div>{{ r.registradoPor }}</div>
          <div class="flex items-center" style="gap: 6px">
            <span :title="numerosDos(r).join(', ')">
              {{ r.tituloIds.length }} {{ r.tituloIds.length === 1 ? 'título' : 'títulos' }}
            </span>
            <CopyButton :value="numerosDos(r).join(', ')" />
          </div>
          <div>
            <button v-if="r.evidencia" type="button" class="link-btn" @click="emit('evidencia', r.id)">
              <ExternalLink :size="13" /> Abrir PDF
            </button>
            <span v-else style="color: var(--text-muted)">Não tem</span>
          </div>
        </div>
        <div
          v-if="registros.length === 0"
          style="padding: 36px 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
        >
          Nenhuma tentativa registrada para este sacado.
        </div>
      </div>
    </div>

    <RegistrarTentativaModal
      v-if="tentativaAberta"
      :quantidade-titulos="selected.length"
      @close="tentativaAberta = false"
      @save="salvar"
    />
  </div>
</template>

<style scoped>
.back {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  cursor: pointer;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.eyebrow {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.18em;
  color: var(--accent);
  text-transform: uppercase;
}
h2 {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.kpi-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.kpi {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 20px;
}
.kpi-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.kpi-value {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}
.sacado-row {
  column-gap: 16px;
  padding: 14px 20px;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.reg-grid {
  grid-template-columns: 180px 150px minmax(160px, 1.4fr) 100px 130px 130px 100px;
  min-width: 1076px;
}
.sacado-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.sacado-header > * {
  white-space: nowrap;
}
.sacado-row:not(.sacado-header) {
  border-top: 1px solid var(--border-default);
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-strong);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}
.link-btn:hover {
  background: var(--surface-sunken);
}
.filter-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.filter-input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.primary {
  height: 48px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
.primary:hover:not(:disabled) {
  background: var(--action-primary-bg-hover);
}
.primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
