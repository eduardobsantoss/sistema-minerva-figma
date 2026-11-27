<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Upload,
  X,
} from 'lucide-vue-next';
import Alert from '@/components/feedback/Alert.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import { brl } from '@/features/passivo/data/passivoData';
import FiltrosPopover from '@/features/cobranca/components/preventiva/FiltrosPopover.vue';
import MultiCheckDropdown from '@/features/cobranca/components/preventiva/MultiCheckDropdown.vue';
import { formatDocument, maskDocumentInput, onlyDigits } from '../utils/serasaFormatters';
import {
  APONTAMENTO_LABEL,
  DECISAO_LABEL,
  itemDeDocumento,
  lotesCarteira,
  resumoLote,
  type DecisaoLote,
  type ItemLote,
  type LoteConsulta,
  type TipoApontamento,
} from '../data/loteData';

interface LinhaPreview {
  raw: string;
  documento: string;
  valido: boolean;
}

interface FiltroLote {
  documento: string;
  nome: string;
  decisao: string;
  scoreAte: string;
  apontamentos: TipoApontamento[];
  valorDe: string;
  valorAte: string;
}

const MODELO = 'documento\n123.456.789-01\n12.345.678/0001-90\n';
const EXEMPLO = ['12345678901', '12345678000190', '123'];

const STATUS_LABEL = {
  pendente: 'Pendente',
  processando: 'Processando',
  concluido: 'Concluído',
  'com-erros': 'Com erros',
} as const;

const COLUNAS_APONTAMENTO: TipoApontamento[] = [
  'pefin',
  'refin',
  'protesto',
  'cheque',
  'processo',
  'trabalhoEscravo',
  'ibama',
];

const emit = defineEmits<{
  'update:aberto': [value: boolean];
  'abrir-consulta': [documento: string];
}>();

const lotes = lotesCarteira;
const arquivoNome = ref('');
const dragging = ref(false);
const preview = ref<LinhaPreview[]>([]);
const detalheId = ref<string | null>(null);
const fileRef = ref<HTMLInputElement | null>(null);
const { success, info } = useToast();

const filtroLinha = ref({ documento: '', nome: '', decisao: '', scoreAte: '' });
const draftExtra = ref<{ apontamentos: TipoApontamento[]; valorDe: string; valorAte: string }>({
  apontamentos: [],
  valorDe: '',
  valorAte: '',
});
const appliedExtra = ref({ apontamentos: [] as TipoApontamento[], valorDe: '', valorAte: '' });

const detalhe = computed(() => lotes.value.find((lote) => lote.id === detalheId.value) ?? null);
const validos = computed(() => preview.value.filter((linha) => linha.valido));
const invalidos = computed(() => preview.value.filter((linha) => !linha.valido).length);
const painel = computed(() => (detalhe.value ? resumoLote(detalhe.value.itens) : null));

const filtroAtivo = computed<FiltroLote>(() => ({
  documento: filtroLinha.value.documento,
  nome: filtroLinha.value.nome,
  decisao: filtroLinha.value.decisao,
  scoreAte: filtroLinha.value.scoreAte,
  apontamentos: appliedExtra.value.apontamentos,
  valorDe: appliedExtra.value.valorDe,
  valorAte: appliedExtra.value.valorAte,
}));

const itensFiltrados = computed(() => {
  if (!detalhe.value) return [];
  return detalhe.value.itens.filter((item) => passaFiltro(item, filtroAtivo.value));
});

const chips = computed(() => {
  const items: { key: string; label: string }[] = [];
  const f = filtroAtivo.value;
  if (f.documento.trim()) items.push({ key: 'documento', label: `Documento ${f.documento}` });
  if (f.nome.trim()) items.push({ key: 'nome', label: `Nome ${f.nome}` });
  if (f.decisao) items.push({ key: 'decisao', label: DECISAO_LABEL[f.decisao as DecisaoLote] ?? f.decisao });
  if (f.scoreAte.trim()) items.push({ key: 'scoreAte', label: `Score até ${f.scoreAte}` });
  for (const tipo of f.apontamentos) {
    items.push({ key: `apont:${tipo}`, label: APONTAMENTO_LABEL[tipo] });
  }
  if (f.valorDe.trim()) items.push({ key: 'valorDe', label: `Valor de ${f.valorDe}` });
  if (f.valorAte.trim()) items.push({ key: 'valorAte', label: `Valor até ${f.valorAte}` });
  return items;
});

const activeFilterCount = computed(() => {
  let n = 0;
  if (appliedExtra.value.apontamentos.length) n += 1;
  if (appliedExtra.value.valorDe.trim()) n += 1;
  if (appliedExtra.value.valorAte.trim()) n += 1;
  return n;
});

const lotesPaginados = useTablePagination(() => lotes.value, { defaultPageSize: 10 });
const itensPaginados = useTablePagination(() => itensFiltrados.value, { defaultPageSize: 10 });

watch(detalheId, (id) => emit('update:aberto', id != null), { immediate: true });
watch(itensFiltrados, () => itensPaginados.setPage(1));

const decisaoOptions = [
  { value: '', label: 'Todas' },
  { value: 'apto', label: 'Apto' },
  { value: 'com-ressalva', label: 'Com ressalva' },
  { value: 'recusado', label: 'Recusado' },
];

const apontamentoOptions = COLUNAS_APONTAMENTO.map((key) => ({
  key,
  label: APONTAMENTO_LABEL[key],
}));

function documentoValido(digits: string) {
  if (digits.length !== 11 && digits.length !== 14) return false;
  return !/^(\d)\1+$/.test(digits);
}

function statusTone(status: LoteConsulta['status']) {
  if (status === 'concluido') return { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
  if (status === 'com-erros') return { background: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' };
  if (status === 'processando') return { background: 'var(--status-active-bg)', color: 'var(--status-active-text)' };
  return { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' };
}

function decisaoTone(decisao: DecisaoLote | null) {
  if (decisao === 'apto') return { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
  if (decisao === 'com-ressalva') return { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' };
  if (decisao === 'recusado') return { background: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' };
  return { background: 'var(--status-neutral-bg)', color: 'var(--status-neutral-text)' };
}

function formatDateBR(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function numero(texto: string): number {
  return Number(texto.trim().replace(/\./g, '').replace(',', '.'));
}

function passaFiltro(item: ItemLote, f: FiltroLote) {
  const digits = onlyDigits(f.documento);
  if (digits && !item.documento.includes(digits)) return false;
  if (f.nome.trim() && !item.nome.toLowerCase().includes(f.nome.trim().toLowerCase())) return false;
  if (f.decisao) {
    if (f.decisao === 'sem' && item.decisao != null) return false;
    if (f.decisao !== 'sem' && item.decisao !== f.decisao) return false;
  }
  if (f.scoreAte.trim() && !Number.isNaN(numero(f.scoreAte))) {
    if (item.score == null || item.score > numero(f.scoreAte)) return false;
  }
  if (f.apontamentos.length > 0 && !f.apontamentos.some((tipo) => item[tipo].quantidade > 0)) return false;
  if (f.valorDe.trim() && !Number.isNaN(numero(f.valorDe)) && item.valorTotal < numero(f.valorDe)) return false;
  if (f.valorAte.trim() && !Number.isNaN(numero(f.valorAte)) && item.valorTotal > numero(f.valorAte)) return false;
  return true;
}

function aplicarFiltros() {
  appliedExtra.value = {
    apontamentos: [...draftExtra.value.apontamentos],
    valorDe: draftExtra.value.valorDe,
    valorAte: draftExtra.value.valorAte,
  };
}

function limparFiltros() {
  draftExtra.value = { apontamentos: [], valorDe: '', valorAte: '' };
  appliedExtra.value = { apontamentos: [], valorDe: '', valorAte: '' };
  filtroLinha.value = { documento: '', nome: '', decisao: '', scoreAte: '' };
}

function removeChip(key: string) {
  if (key === 'documento') filtroLinha.value.documento = '';
  else if (key === 'nome') filtroLinha.value.nome = '';
  else if (key === 'decisao') filtroLinha.value.decisao = '';
  else if (key === 'scoreAte') filtroLinha.value.scoreAte = '';
  else if (key.startsWith('apont:')) {
    const tipo = key.slice(6) as TipoApontamento;
    appliedExtra.value = {
      ...appliedExtra.value,
      apontamentos: appliedExtra.value.apontamentos.filter((item) => item !== tipo),
    };
    draftExtra.value.apontamentos = [...appliedExtra.value.apontamentos];
  } else if (key === 'valorDe') {
    appliedExtra.value = { ...appliedExtra.value, valorDe: '' };
    draftExtra.value.valorDe = '';
  } else if (key === 'valorAte') {
    appliedExtra.value = { ...appliedExtra.value, valorAte: '' };
    draftExtra.value.valorAte = '';
  }
}

function baixarModelo() {
  const blob = new Blob([MODELO], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo-consulta.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function montarPreview(nome: string, linhas: string[]) {
  arquivoNome.value = nome;
  preview.value = linhas.map((raw) => {
    const documento = onlyDigits(raw);
    return { raw, documento, valido: documentoValido(documento) };
  });
}

function simularLista() {
  montarPreview('lista-exemplo.csv', EXEMPLO);
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) montarPreview(file.name, EXEMPLO);
}

function onDrop(event: DragEvent) {
  dragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) montarPreview(file.name, EXEMPLO);
}

function consultar() {
  if (validos.value.length === 0) return;
  const itens = validos.value.map((linha) => itemDeDocumento(linha.documento));
  const lote: LoteConsulta = {
    id: `lote-${Date.now()}`,
    criadoEm: new Date().toISOString().slice(0, 10),
    status: 'concluido',
    arquivo: arquivoNome.value || undefined,
    itens,
  };
  lotes.value = [lote, ...lotes.value];
  success(`Consulta enviada com ${itens.length} documento${itens.length === 1 ? '' : 's'}.`);
  if (invalidos.value > 0) info(`${invalidos.value} documento${invalidos.value === 1 ? '' : 's'} inválido${invalidos.value === 1 ? '' : 's'} ficou de fora.`);
  preview.value = [];
  arquivoNome.value = '';
  detalheId.value = lote.id;
}

function setDecisao(item: ItemLote, value: string | number) {
  const texto = String(value);
  const decisao = (texto || null) as DecisaoLote | null;
  item.decisao = decisao;
  item.decisaoManual = decisao !== item.decisaoSugerida;
}

function celula(apontamento: { quantidade: number; valor: number }, comValor: boolean) {
  if (apontamento.quantidade <= 0) return '—';
  if (comValor && apontamento.valor > 0) return `${apontamento.quantidade} · ${brl(apontamento.valor)}`;
  return String(apontamento.quantidade);
}

function scoreDelta(item: ItemLote) {
  if (item.score == null || item.previousScore == null || item.score === item.previousScore) return null;
  return {
    direction: item.score > item.previousScore ? 'up' as const : 'down' as const,
    value: Math.abs(item.score - item.previousScore),
  };
}

function resumoLista(lote: LoteConsulta) {
  return resumoLote(lote.itens);
}

function onDocumentoInput(event: Event) {
  filtroLinha.value.documento = maskDocumentInput((event.target as HTMLInputElement).value);
}

defineExpose({
  reopen(id: string) {
    detalheId.value = id;
  },
  currentId: () => detalheId.value,
});
</script>

<template>
  <div v-if="detalhe && painel" class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button type="button" class="lote-voltar flex items-center justify-center" aria-label="Voltar" @click="detalheId = null">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Sentinela · Aquisição de Carteira
        </div>
        <h2 class="flex items-center" style="gap: 10px; flex-wrap: wrap; font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          Lote {{ formatDateBR(detalhe.criadoEm) }}
          <span class="lote-chip" :style="statusTone(detalhe.status)">{{ STATUS_LABEL[detalhe.status] }}</span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ detalhe.arquivo || 'Lista sem nome' }} · {{ painel.total }} documento{{ painel.total === 1 ? '' : 's' }}
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px">
      <div class="kpi-card">
        <div class="kpi-label">Documentos</div>
        <div class="kpi-value">{{ painel.total }}</div>
        <div class="kpi-sub">{{ painel.comApontamento }} com apontamento</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Apto</div>
        <div class="kpi-value" style="color: var(--status-success-text)">{{ painel.apto }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Com ressalva</div>
        <div class="kpi-value" style="color: var(--status-warning-text)">{{ painel.comRessalva }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Recusado</div>
        <div class="kpi-value" style="color: var(--status-danger-text)">{{ painel.recusado }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Valor total</div>
        <div class="kpi-value">{{ brl(painel.valorTotal) }}</div>
      </div>
      <div v-for="tipo in COLUNAS_APONTAMENTO" :key="tipo" class="kpi-card">
        <div class="kpi-label">{{ APONTAMENTO_LABEL[tipo] }}</div>
        <div class="kpi-value">{{ painel[tipo].documentos }}</div>
        <div class="kpi-sub">
          {{ painel[tipo].quantidade }} oc.
          <template v-if="painel[tipo].valor > 0"> · {{ brl(painel[tipo].valor) }}</template>
        </div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 10px">
      <div class="flex items-end" style="gap: 12px; flex-wrap: wrap">
        <div class="grid search-grid" style="flex: 1; min-width: 280px">
          <label class="search-field">
            <span class="filter-label">Documento</span>
            <input
              class="filter-input"
              placeholder="CPF ou CNPJ"
              inputmode="numeric"
              :value="filtroLinha.documento"
              @input="onDocumentoInput"
            />
          </label>
          <label class="search-field">
            <span class="filter-label">Nome</span>
            <input v-model="filtroLinha.nome" class="filter-input" placeholder="Nome" />
          </label>
          <label class="search-field">
            <span class="filter-label">Decisão</span>
            <AdminSelect v-model="filtroLinha.decisao" :options="decisaoOptions" />
          </label>
          <label class="search-field">
            <span class="filter-label">Score até</span>
            <input v-model="filtroLinha.scoreAte" class="filter-input" inputmode="numeric" placeholder="Ex.: 700" />
          </label>
        </div>
        <FiltrosPopover :active-count="activeFilterCount" :columns="2" @apply="aplicarFiltros" @clear="limparFiltros">
          <MultiCheckDropdown
            :model-value="draftExtra.apontamentos"
            label="Apontamentos"
            :options="apontamentoOptions"
            :panel-width="260"
            @update:model-value="draftExtra.apontamentos = $event as TipoApontamento[]"
          />
          <div>
            <div class="filter-label">Valor de</div>
            <input v-model="draftExtra.valorDe" class="filter-input" inputmode="decimal" placeholder="0,00" />
          </div>
          <div>
            <div class="filter-label">Valor até</div>
            <input v-model="draftExtra.valorAte" class="filter-input" inputmode="decimal" placeholder="0,00" />
          </div>
        </FiltrosPopover>
      </div>

      <div v-if="chips.length" class="flex flex-wrap items-center" style="gap: 8px">
        <button
          v-for="chip in chips"
          :key="chip.key"
          type="button"
          class="chip-ativo flex items-center"
          @click="removeChip(chip.key)"
        >
          {{ chip.label }}
          <X :size="12" />
        </button>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <table class="lote-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nome</th>
              <th>Score</th>
              <th v-for="tipo in COLUNAS_APONTAMENTO" :key="tipo">{{ APONTAMENTO_LABEL[tipo] }}</th>
              <th>Valor total</th>
              <th>Decisão</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itensPaginados.pageItems.value" :key="item.id">
              <td style="font-variant-numeric: tabular-nums; color: var(--text-strong)">
                {{ item.valido ? formatDocument(item.documento) : item.documento }}
              </td>
              <td style="color: var(--text-default)">{{ item.nome }}</td>
              <td>
                <span class="flex items-center" style="gap: 6px; font-weight: var(--weight-bold); font-variant-numeric: tabular-nums; color: var(--text-strong)">
                  {{ item.score ?? '—' }}
                  <span
                    v-if="scoreDelta(item)"
                    class="flex items-center"
                    :style="{
                      gap: '2px',
                      fontSize: 'var(--text-xs)',
                      color: scoreDelta(item)?.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
                    }"
                  >
                    <ArrowUp v-if="scoreDelta(item)?.direction === 'up'" :size="14" />
                    <ArrowDown v-else :size="14" />
                    {{ scoreDelta(item)?.value }}
                  </span>
                </span>
              </td>
              <td style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ celula(item.pefin, true) }}</td>
              <td style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ celula(item.refin, true) }}</td>
              <td style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ celula(item.protesto, true) }}</td>
              <td style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ celula(item.cheque, true) }}</td>
              <td style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ celula(item.processo, true) }}</td>
              <td style="font-variant-numeric: tabular-nums">{{ celula(item.trabalhoEscravo, false) }}</td>
              <td style="font-variant-numeric: tabular-nums">{{ celula(item.ibama, false) }}</td>
              <td style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">
                {{ item.valorTotal > 0 ? brl(item.valorTotal) : '—' }}
              </td>
              <td style="min-width: 180px">
                <template v-if="item.valido">
                  <AdminSelect
                    :model-value="item.decisao ?? ''"
                    :options="[
                      { value: 'apto', label: 'Apto' },
                      { value: 'com-ressalva', label: 'Com ressalva' },
                      { value: 'recusado', label: 'Recusado' },
                    ]"
                    @update:model-value="setDecisao(item, $event)"
                  />
                  <div v-if="!item.decisaoManual && item.decisaoSugerida" style="font-size: 10px; color: var(--text-muted); margin-top: 4px">
                    Sugerido
                  </div>
                </template>
                <span v-else class="lote-chip" :style="decisaoTone(null)">Inválido</span>
              </td>
              <td>
                <AdminButton
                  v-if="item.valido"
                  variant="secondary"
                  size="compact"
                  type="button"
                  @click="emit('abrir-consulta', item.documento)"
                >
                  Abrir consulta
                </AdminButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="padding: 12px 16px; border-top: 1px solid var(--border-default)">
        <TablePagination
          :page="itensPaginados.page.value"
          :page-size="itensPaginados.pageSize.value"
          :total="itensPaginados.total.value"
          @update:page="itensPaginados.setPage"
          @update:page-size="itensPaginados.setPageSize"
        />
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
      <p style="font-size: var(--text-sm); color: var(--text-muted)">Envie uma lista ou simule um arquivo para consultar o lote.</p>
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <AdminButton variant="secondary" :icon="Download" type="button" @click="baixarModelo">Baixar modelo</AdminButton>
        <AdminButton variant="secondary" :icon="FileSpreadsheet" type="button" @click="simularLista">Simular lista</AdminButton>
        <AdminButton type="button" :disabled="validos.length === 0" @click="consultar">Consultar</AdminButton>
      </div>
    </div>

    <button
      type="button"
      class="lote-focus flex flex-col items-center justify-center"
      :style="{
        gap: '8px',
        minHeight: '140px',
        borderRadius: 'var(--radius-xl)',
        border: `1px dashed ${dragging ? 'var(--border-focus)' : 'var(--border-strong)'}`,
        background: dragging ? 'var(--surface-selected)' : 'var(--surface-card)',
        cursor: 'pointer',
        color: 'var(--text-default)',
      }"
      @click="fileRef?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <Upload :size="22" />
      <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">Solte o arquivo ou clique para escolher</span>
      <span v-if="arquivoNome" class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted)">
        <FileSpreadsheet :size="14" /> {{ arquivoNome }}
      </span>
    </button>
    <input ref="fileRef" type="file" accept=".csv,.txt" style="display: none" @change="onFileChange" />

    <div v-if="preview.length > 0" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="grid lote-head" style="grid-template-columns: minmax(180px, 1fr) 140px">
        <div>Documento</div>
        <div>Validação</div>
      </div>
      <div
        v-for="(linha, index) in preview"
        :key="`${linha.raw}-${index}`"
        class="grid items-center lote-row"
        style="grid-template-columns: minmax(180px, 1fr) 140px"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ linha.valido ? formatDocument(linha.documento) : linha.raw }}</div>
        <div>
          <span class="lote-chip" :style="linha.valido ? statusTone('concluido') : statusTone('com-erros')">
            {{ linha.valido ? 'Válido' : 'Inválido' }}
          </span>
        </div>
      </div>
    </div>
    <Alert
      v-if="invalidos > 0"
      type="warning"
      :dismissible="false"
      title="Documentos fora da consulta"
      :message="`${invalidos} linha${invalidos === 1 ? '' : 's'} da pré-visualização não entra no lote.`"
    />

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="grid lote-head" style="grid-template-columns: 110px minmax(140px, 1fr) 120px minmax(220px, 1.6fr) 100px 130px">
        <div>Data</div>
        <div>Arquivo</div>
        <div>Status</div>
        <div>Resumo</div>
        <div>Docs</div>
        <div></div>
      </div>
      <button
        v-for="lote in lotesPaginados.pageItems.value"
        :key="lote.id"
        type="button"
        class="lote-focus grid items-center lote-row"
        style="grid-template-columns: 110px minmax(140px, 1fr) 120px minmax(220px, 1.6fr) 100px 130px; width: 100%; border-left: none; border-right: none; border-bottom: none; cursor: pointer; text-align: left"
        @click="detalheId = lote.id"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ formatDateBR(lote.criadoEm) }}</div>
        <div style="color: var(--text-strong); font-weight: var(--weight-semibold)">{{ lote.arquivo || '—' }}</div>
        <div><span class="lote-chip" :style="statusTone(lote.status)">{{ STATUS_LABEL[lote.status] }}</span></div>
        <div style="color: var(--text-default); font-size: var(--text-xs)">
          {{ resumoLista(lote).apto }} apto · {{ resumoLista(lote).comRessalva }} ressalva · {{ resumoLista(lote).recusado }} recusado
          · {{ resumoLista(lote).comApontamento }} com apontamento
          · {{ brl(resumoLista(lote).valorTotal) }}
        </div>
        <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ lote.itens.length }}</div>
        <div class="flex items-center" style="gap: 4px; color: var(--text-link); font-weight: var(--weight-semibold)">
          Ver detalhe
          <ChevronRight :size="16" />
        </div>
      </button>
      <div style="padding: 12px 16px; border-top: 1px solid var(--border-default)">
        <TablePagination
          :page="lotesPaginados.page.value"
          :page-size="lotesPaginados.pageSize.value"
          :total="lotesPaginados.total.value"
          @update:page="lotesPaginados.setPage"
          @update:page-size="lotesPaginados.setPageSize"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.lote-voltar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  cursor: pointer;
  color: var(--text-strong);
  flex-shrink: 0;
}

.lote-voltar:focus-visible,
.lote-focus:focus-visible,
.filter-input:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.lote-focus:hover {
  background: var(--surface-sunken);
}

button:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.kpi-card {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  background: var(--surface-sunken);
}

.kpi-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: 8px;
}

.kpi-value {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}

.kpi-sub {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 4px;
}

.search-grid {
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 10px;
}

.search-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.filter-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.filter-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
}

.chip-ativo {
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--accent);
  color: var(--surface-card);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  cursor: pointer;
}

.lote-head,
.lote-row {
  column-gap: 12px;
  padding: 12px 16px;
}

.lote-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
  align-items: center;
  white-space: nowrap;
}

.lote-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  background: var(--surface-card);
}

.lote-chip {
  display: inline-flex;
  width: fit-content;
  font-size: 10px;
  font-weight: var(--weight-bold);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.lote-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
  white-space: nowrap;
}

.lote-table th {
  padding: 12px 16px;
  background: var(--surface-sunken);
  text-align: left;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.lote-table td {
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  vertical-align: middle;
}
</style>
