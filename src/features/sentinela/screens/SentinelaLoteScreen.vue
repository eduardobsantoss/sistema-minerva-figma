<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Download, FileSpreadsheet, Upload, X } from 'lucide-vue-next';
import UnderlineSubTabs from '@/features/passivo-novo/components/UnderlineSubTabs.vue';
import Alert from '@/components/feedback/Alert.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import { formatDocument, maskDocumentInput, onlyDigits } from '@/features/serasa/utils/serasaFormatters';
import {
  MODELO_CSV,
  STATUS_LOTE_LABEL,
  formatDateBR,
  isValidCnpj,
  lotesIniciais,
  montarLote,
  resumoLote,
  type LoteConsulta,
  type StatusLote,
} from '../data/sentinelaData';

const tabs = ['Digitar CNPJ', 'Subir lista'];
const tab = ref(tabs[0]);
const cnpjInput = ref('');
const chips = ref<string[]>([]);
const digitacaoErro = ref('');
const arquivoErro = ref('');
const arquivoNome = ref('');
const dragging = ref(false);
const preview = ref<{ raw: string; cnpj: string; valido: boolean }[]>([]);
const lotes = ref<LoteConsulta[]>(lotesIniciais());
const detalheId = ref<string | null>(null);
const fileRef = ref<HTMLInputElement | null>(null);
const emit = defineEmits<{ navigate: [view: string] }>();
const { success, info } = useToast();

const detalhe = computed(() => lotes.value.find((lote) => lote.id === detalheId.value));
const validosArquivo = computed(() => preview.value.filter((linha) => linha.valido));
const invalidosArquivo = computed(() => preview.value.filter((linha) => !linha.valido).length);
const prontos = computed(() => (tab.value === 'Digitar CNPJ' ? chips.value : validosArquivo.value.map((linha) => linha.cnpj)));

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => lotes.value, { defaultPageSize: 10 });

function statusTone(status: StatusLote) {
  if (status === 'concluido') return { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
  if (status === 'com-erros') return { background: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' };
  if (status === 'processando') return { background: 'var(--status-active-bg)', color: 'var(--status-active-text)' };
  return { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' };
}

function onCnpjInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  cnpjInput.value = maskDocumentInput(value);
  digitacaoErro.value = '';
}

function adicionarCnpj() {
  const digits = onlyDigits(cnpjInput.value);
  if (!isValidCnpj(digits)) {
    digitacaoErro.value = 'CNPJ inválido. Confira os 14 dígitos e o dígito verificador.';
    return;
  }
  if (chips.value.includes(digits)) {
    digitacaoErro.value = 'Este CNPJ já está na lista.';
    return;
  }
  chips.value = [...chips.value, digits];
  cnpjInput.value = '';
  digitacaoErro.value = '';
}

function removerChip(cnpj: string) {
  chips.value = chips.value.filter((item) => item !== cnpj);
}

function baixarModelo() {
  const blob = new Blob([MODELO_CSV], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo-consulta-cnpj.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function simularArquivo(file: File) {
  arquivoNome.value = file.name;
  arquivoErro.value = '';
  preview.value = ['10000003000189', '10000004000123', '123'].map((raw) => {
    const cnpj = onlyDigits(raw);
    return { raw, cnpj, valido: isValidCnpj(cnpj) };
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
  if (prontos.value.length === 0) return;
  const origem = tab.value === 'Digitar CNPJ' ? 'digitacao' : 'arquivo';
  const lote = montarLote(prontos.value, origem, origem === 'arquivo' ? arquivoNome.value : undefined);
  lotes.value = [lote, ...lotes.value];
  setPage(1);
  const fora = tab.value === 'Subir lista' ? invalidosArquivo.value : 0;
  success(`Consulta enviada com ${lote.itens.length} CNPJ${lote.itens.length === 1 ? '' : 's'}.`);
  if (fora > 0) info(`${fora} CNPJ${fora === 1 ? '' : 's'} inválido${fora === 1 ? '' : 's'} ficou de fora.`);
  chips.value = [];
  preview.value = [];
  arquivoNome.value = '';
  cnpjInput.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <template v-if="detalhe">
      <div>
        <button type="button" class="sn-focus flex items-center" style="gap: 6px; background: none; border: none; padding: 0; cursor: pointer; color: var(--text-link); font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: 10px" @click="detalheId = null">
          <ArrowLeft :size="15" />
          Voltar para os lotes
        </button>
        <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
          <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em">
            Lote {{ formatDateBR(detalhe.criadoEm) }}
          </h1>
          <span class="sn-chip" :style="statusTone(detalhe.status)">{{ STATUS_LOTE_LABEL[detalhe.status] }}</span>
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">{{ resumoLote(detalhe) }}</p>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="grid sn-head" style="grid-template-columns: minmax(180px, 1.2fr) 120px minmax(180px, 1.4fr)">
          <div>CNPJ</div>
          <div>Validação</div>
          <div>Resultado</div>
        </div>
        <div
          v-for="(item, index) in detalhe.itens"
          :key="`${item.cnpj}-${index}`"
          class="grid items-center sn-row"
          style="grid-template-columns: minmax(180px, 1.2fr) 120px minmax(180px, 1.4fr)"
        >
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ item.valido ? formatDocument(item.cnpj) : item.cnpj }}</div>
          <div>
            <span class="sn-chip" :style="item.valido ? statusTone('concluido') : statusTone('com-erros')">
              {{ item.valido ? 'Válido' : 'Inválido' }}
            </span>
          </div>
          <div style="color: var(--text-default)">{{ item.resultado }}</div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 16px; min-width: 0">
          <button
            type="button"
            aria-label="Voltar para a visão geral"
            class="sn-focus flex items-center justify-center"
            style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
            @click="emit('navigate', 'sentinela')"
          >
            <ArrowLeft :size="20" />
          </button>
          <div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
            Sentinela
          </div>
          <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
            Consulta em lote
          </h1>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Inicie consultas por CNPJ. O monitoramento continua nas outras telas do Sentinela.
          </p>
          </div>
        </div>
        <button
          type="button"
          class="sn-focus btn-animated btn-primary"
          :disabled="prontos.length === 0"
          style="height: 38px; padding: 0 16px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold)"
          @click="consultar"
        >
          Consultar
        </button>
      </div>

      <UnderlineSubTabs :tabs="tabs" :model-value="tab" @update:model-value="tab = $event" />

      <section v-if="tab === 'Digitar CNPJ'" style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 18px">
        <div class="filter-label">CNPJ</div>
        <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
          <input
            :value="cnpjInput"
            class="sn-focus filter-input"
            inputmode="numeric"
            placeholder="00.000.000/0000-00"
            style="max-width: 280px"
            @input="onCnpjInput"
            @keydown.enter.prevent="adicionarCnpj"
          />
          <button type="button" class="sn-focus" style="height: 38px; padding: 0 14px; background: var(--action-secondary-bg); color: var(--action-secondary-text); border: 1px solid var(--action-secondary-border); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold)" @click="adicionarCnpj">
            Adicionar
          </button>
        </div>
        <Alert v-if="digitacaoErro" type="error" title="CNPJ não adicionado" :message="digitacaoErro" style="margin-top: 12px" @dismiss="digitacaoErro = ''" />
        <div v-if="chips.length > 0" class="flex items-center" style="gap: 8px; flex-wrap: wrap; margin-top: 14px">
          <button
            v-for="cnpj in chips"
            :key="cnpj"
            type="button"
            class="sn-focus flex items-center"
            style="gap: 6px; height: 28px; padding: 0 10px; border-radius: var(--radius-full); background: var(--surface-selected); border: 1px solid var(--border-default); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @click="removerChip(cnpj)"
          >
            {{ formatDocument(cnpj) }}
            <X :size="12" />
          </button>
        </div>
      </section>

      <section v-else class="flex flex-col" style="gap: 14px">
        <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
          <div style="font-size: var(--text-sm); color: var(--text-muted)">Escolha um arquivo para ver uma pré-visualização ilustrativa.</div>
          <button type="button" class="sn-focus flex items-center" style="gap: 6px; height: 36px; padding: 0 12px; background: var(--action-secondary-bg); color: var(--action-secondary-text); border: 1px solid var(--action-secondary-border); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold)" @click="baixarModelo">
            <Download :size="14" />
            Baixar modelo
          </button>
        </div>
        <button
          type="button"
          class="sn-focus flex flex-col items-center justify-center"
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
        <Alert v-if="arquivoErro" type="error" title="Arquivo não lido" :message="arquivoErro" @dismiss="arquivoErro = ''" />

        <div v-if="preview.length > 0" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
          <div class="grid sn-head" style="grid-template-columns: minmax(180px, 1fr) 140px">
            <div>CNPJ</div>
            <div>Validação</div>
          </div>
          <div
            v-for="(linha, index) in preview"
            :key="`${linha.raw}-${index}`"
            class="grid items-center sn-row"
            style="grid-template-columns: minmax(180px, 1fr) 140px"
          >
            <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ linha.valido ? formatDocument(linha.cnpj) : linha.raw }}</div>
            <div>
              <span class="sn-chip" :style="linha.valido ? statusTone('concluido') : statusTone('com-erros')">
                {{ linha.valido ? 'Válido' : 'Inválido' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div>
        <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">Lotes recentes</h2>
        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
          <div class="grid sn-head" style="grid-template-columns: 120px 130px minmax(180px, 1.4fr) 110px 120px">
            <div>Data</div>
            <div>Status</div>
            <div>Resumo</div>
            <div>CNPJs</div>
            <div></div>
          </div>
          <div
            v-for="lote in pageItems"
            :key="lote.id"
            class="grid items-center sn-row"
            style="grid-template-columns: 120px 130px minmax(180px, 1.4fr) 110px 120px"
          >
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ formatDateBR(lote.criadoEm) }}</div>
            <div><span class="sn-chip" :style="statusTone(lote.status)">{{ STATUS_LOTE_LABEL[lote.status] }}</span></div>
            <div style="color: var(--text-default)">{{ resumoLote(lote) }}</div>
            <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ lote.itens.length }}</div>
            <div>
              <button type="button" class="sn-focus" style="background: none; border: none; padding: 0; color: var(--text-link); font-weight: var(--weight-semibold); cursor: pointer; font-size: var(--text-sm)" @click="detalheId = lote.id">
                Ver detalhe
              </button>
            </div>
          </div>
          <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sn-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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
  font-variant-numeric: tabular-nums;
}

.sn-head,
.sn-row {
  column-gap: 12px;
  padding: 12px 16px;
}

.sn-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
  align-items: center;
}

.sn-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.sn-chip {
  display: inline-flex;
  width: fit-content;
  font-size: 10px;
  font-weight: var(--weight-bold);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}
</style>
