<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Download, FileSpreadsheet, Upload } from 'lucide-vue-next';
import Alert from '@/components/feedback/Alert.vue';
import { useToast } from '@/composables/useToast';
import { formatDocument, onlyDigits } from '../utils/serasaFormatters';

type StatusLote = 'pendente' | 'processando' | 'concluido' | 'com-erros';

interface LinhaPreview {
  raw: string;
  documento: string;
  valido: boolean;
}

interface ItemLote {
  documento: string;
  valido: boolean;
  resultado: string;
}

interface LoteConsulta {
  id: string;
  criadoEm: string;
  status: StatusLote;
  arquivo?: string;
  itens: ItemLote[];
}

const STATUS_LABEL: Record<StatusLote, string> = {
  pendente: 'Pendente',
  processando: 'Processando',
  concluido: 'Concluído',
  'com-erros': 'Com erros',
};

const MODELO = 'documento\n123.456.789-01\n12.345.678/0001-90\n';

const lotes = ref<LoteConsulta[]>([
  {
    id: 'lote-1',
    criadoEm: '2026-10-12',
    status: 'concluido',
    arquivo: 'lista-cedentes.csv',
    itens: [
      { documento: '12345678901', valido: true, resultado: 'Restrição encontrada' },
      { documento: '98765432100', valido: true, resultado: 'Sem apontamento' },
    ],
  },
  {
    id: 'lote-2',
    criadoEm: '2026-10-02',
    status: 'com-erros',
    arquivo: 'lista-sacados.csv',
    itens: [
      { documento: '12345678000190', valido: true, resultado: 'Restrição encontrada' },
      { documento: '123', valido: false, resultado: 'Documento inválido' },
    ],
  },
]);

const arquivoNome = ref('');
const dragging = ref(false);
const preview = ref<LinhaPreview[]>([]);
const detalheId = ref<string | null>(null);
const fileRef = ref<HTMLInputElement | null>(null);
const { success, info } = useToast();

const detalhe = computed(() => lotes.value.find((lote) => lote.id === detalheId.value));
const validos = computed(() => preview.value.filter((linha) => linha.valido));
const invalidos = computed(() => preview.value.filter((linha) => !linha.valido).length);

function documentoValido(digits: string) {
  if (digits.length !== 11 && digits.length !== 14) return false;
  return !/^(\d)\1+$/.test(digits);
}

function statusTone(status: StatusLote) {
  if (status === 'concluido') return { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
  if (status === 'com-erros') return { background: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' };
  if (status === 'processando') return { background: 'var(--status-active-bg)', color: 'var(--status-active-text)' };
  return { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' };
}

function formatDateBR(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function resumo(lote: LoteConsulta) {
  const apontamentos = lote.itens.filter((item) => item.resultado === 'Restrição encontrada').length;
  const erros = lote.itens.filter((item) => !item.valido).length;
  if (lote.status === 'processando') return 'Consulta em andamento';
  if (lote.status === 'pendente') return 'Aguardando envio';
  const partes = [`${apontamentos} com restrição`];
  if (erros > 0) partes.push(`${erros} inválido${erros === 1 ? '' : 's'}`);
  return partes.join(' · ');
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

function simularArquivo(file: File) {
  arquivoNome.value = file.name;
  preview.value = ['12345678901', '12345678000190', '123'].map((raw) => {
    const documento = onlyDigits(raw);
    return { raw, documento, valido: documentoValido(documento) };
  });
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) simularArquivo(file);
}

function onDrop(event: DragEvent) {
  dragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) simularArquivo(file);
}

function consultar() {
  if (validos.value.length === 0) return;
  const lote: LoteConsulta = {
    id: `lote-${Date.now()}`,
    criadoEm: new Date().toISOString().slice(0, 10),
    status: 'concluido',
    arquivo: arquivoNome.value || undefined,
    itens: validos.value.map((linha) => ({
      documento: linha.documento,
      valido: true,
      resultado: 'Sem apontamento',
    })),
  };
  lotes.value = [lote, ...lotes.value];
  success(`Consulta enviada com ${validos.value.length} documento${validos.value.length === 1 ? '' : 's'}.`);
  if (invalidos.value > 0) info(`${invalidos.value} documento${invalidos.value === 1 ? '' : 's'} inválido${invalidos.value === 1 ? '' : 's'} ficou de fora.`);
  preview.value = [];
  arquivoNome.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <template v-if="detalhe">
      <div>
        <button type="button" class="lote-focus flex items-center" style="gap: 6px; background: none; border: none; padding: 0; cursor: pointer; color: var(--text-link); font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: 10px" @click="detalheId = null">
          <ArrowLeft :size="15" />
          Voltar para os lotes
        </button>
        <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
            Lote {{ formatDateBR(detalhe.criadoEm) }}
          </h2>
          <span class="lote-chip" :style="statusTone(detalhe.status)">{{ STATUS_LABEL[detalhe.status] }}</span>
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">{{ resumo(detalhe) }}</p>
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="grid lote-head" style="grid-template-columns: minmax(180px, 1.2fr) 120px minmax(180px, 1.4fr)">
          <div>Documento</div>
          <div>Validação</div>
          <div>Resultado</div>
        </div>
        <div
          v-for="(item, index) in detalhe.itens"
          :key="`${item.documento}-${index}`"
          class="grid items-center lote-row"
          style="grid-template-columns: minmax(180px, 1.2fr) 120px minmax(180px, 1.4fr)"
        >
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ item.valido ? formatDocument(item.documento) : item.documento }}</div>
          <div>
            <span class="lote-chip" :style="item.valido ? statusTone('concluido') : statusTone('com-erros')">
              {{ item.valido ? 'Válido' : 'Inválido' }}
            </span>
          </div>
          <div style="color: var(--text-default)">{{ item.resultado }}</div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
        <p style="font-size: var(--text-sm); color: var(--text-muted)">Escolha um arquivo para ver uma pré-visualização ilustrativa.</p>
        <div class="flex items-center" style="gap: 8px">
          <button type="button" class="lote-focus flex items-center" style="gap: 6px; height: 40px; padding: 0 14px; background: var(--action-secondary-bg); color: var(--action-secondary-text); border: 1px solid var(--action-secondary-border); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.06em" @click="baixarModelo">
            <Download :size="14" />
            BAIXAR MODELO
          </button>
          <button
            type="button"
            class="lote-focus"
            :disabled="validos.length === 0"
            :style="{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: validos.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: validos.length > 0 ? 'var(--action-primary-bg)' : 'var(--surface-sunken)',
              color: validos.length > 0 ? '#fff' : 'var(--text-muted)',
            }"
            @click="consultar"
          >
            CONSULTAR
          </button>
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
          <FileSpreadsheet :size="14" /> {{ arquivoNome }} · pré-visualização ilustrativa
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
      <Alert v-if="invalidos > 0" type="warning" title="Documentos fora da consulta" :message="`${invalidos} linha${invalidos === 1 ? '' : 's'} da pré-visualização não entra no lote.`" />

      <div>
        <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">Lotes recentes</h2>
        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
          <div class="grid lote-head" style="grid-template-columns: 120px 130px minmax(180px, 1.4fr) 120px 120px">
            <div>Data</div>
            <div>Status</div>
            <div>Resumo</div>
            <div>Documentos</div>
            <div></div>
          </div>
          <div
            v-for="lote in lotes"
            :key="lote.id"
            class="grid items-center lote-row"
            style="grid-template-columns: 120px 130px minmax(180px, 1.4fr) 120px 120px"
          >
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ formatDateBR(lote.criadoEm) }}</div>
            <div><span class="lote-chip" :style="statusTone(lote.status)">{{ STATUS_LABEL[lote.status] }}</span></div>
            <div style="color: var(--text-default)">{{ resumo(lote) }}</div>
            <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ lote.itens.length }}</div>
            <div>
              <button type="button" class="lote-focus" style="background: none; border: none; padding: 0; color: var(--text-link); font-weight: var(--weight-semibold); cursor: pointer; font-size: var(--text-sm)" @click="detalheId = lote.id">
                Ver detalhe
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.lote-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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
</style>
