<script setup lang="ts">
import { computed, ref } from 'vue';
import { Download, FileSpreadsheet, Upload } from 'lucide-vue-next';
import {
  modeloGruposCsv,
  parseGruposCsv,
  type GrupoCsvLinha,
} from '../../data/gruposCadastroData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ documentosExistentes: string[] }>();
const emit = defineEmits<{ close: []; confirm: [linhas: GrupoCsvLinha[]] }>();

const fileRef = ref<HTMLInputElement | null>(null);
const arquivoNome = ref('');
const linhas = ref<GrupoCsvLinha[]>([]);
const erros = ref<string[]>([]);
const dragging = ref(false);
const leuArquivo = ref(false);

const podeImportar = computed(() => linhas.value.length > 0);

function lerTexto(file: File) {
  arquivoNome.value = file.name;
  leuArquivo.value = true;
  const reader = new FileReader();
  reader.onload = () => {
    const text = typeof reader.result === 'string' ? reader.result : '';
    const parsed = parseGruposCsv(text, props.documentosExistentes);
    linhas.value = parsed.linhas;
    erros.value = parsed.erros;
  };
  reader.onerror = () => {
    linhas.value = [];
    erros.value = ['Não foi possível ler o arquivo.'];
  };
  reader.readAsText(file);
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) lerTexto(file);
  input.value = '';
}

function onDrop(event: DragEvent) {
  dragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  if (!/\.csv$/i.test(file.name) && file.type && !file.type.includes('csv') && !file.type.includes('text')) {
    arquivoNome.value = file.name;
    leuArquivo.value = true;
    linhas.value = [];
    erros.value = ['Envie um arquivo .csv.'];
    return;
  }
  lerTexto(file);
}

function baixarModelo() {
  const blob = new Blob([`\uFEFF${modeloGruposCsv()}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modelo-grupos-empresariais.csv';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <AdminModal size="md" eyebrow="Grupos empresariais" title="Importar CSV" subtitle="Colunas: documento, nome, tipo e gerente. Status é opcional." @close="emit('close')">

    <div>
      <div class="flex items-center justify-end" style="margin-bottom: 12px">
        <button
          type="button"
          class="flex items-center"
          style="gap: 6px; height: 34px; padding: 0 12px; background: var(--surface-card); color: var(--text-default); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold)"
          @click="baixarModelo"
        >
          <Download :size="14" />
          Baixar modelo
        </button>
      </div>

      <button
        type="button"
        class="flex flex-col items-center justify-center"
        :style="{
          gap: '8px',
          width: '100%',
          minHeight: '120px',
          borderRadius: 'var(--radius-xl)',
          border: `1px dashed ${dragging ? 'var(--border-focus)' : 'var(--border-strong)'}`,
          background: dragging ? 'var(--surface-selected)' : 'var(--surface-sunken)',
          cursor: 'pointer',
          color: 'var(--text-default)',
        }"
        @click="fileRef?.click()"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <Upload :size="22" />
        <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">
          Solte o CSV ou clique para escolher
        </span>
        <span v-if="arquivoNome" class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted)">
          <FileSpreadsheet :size="14" /> {{ arquivoNome }}
        </span>
      </button>
      <input ref="fileRef" type="file" accept=".csv,text/csv" hidden @change="onFileChange" />

      <div v-if="erros.length" style="margin-top: 16px; display: flex; flex-direction: column; gap: 6px">
        <div
          v-for="erro in erros"
          :key="erro"
          style="font-size: var(--text-sm); color: var(--danger-base); background: color-mix(in srgb, var(--danger-base) 10%, transparent); border-radius: var(--radius-md); padding: 8px 12px"
        >
          {{ erro }}
        </div>
      </div>

      <div
        v-if="linhas.length"
        style="margin-top: 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
      >
        <div
          class="grid"
          style="grid-template-columns: 1.2fr 1.6fr 1fr 1.1fr 1fr; padding: 10px 14px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase; gap: 10px"
        >
          <div>Documento</div>
          <div>Nome</div>
          <div>Tipo</div>
          <div>Gerente</div>
          <div>Status</div>
        </div>
        <div
          v-for="linha in linhas"
          :key="`${linha.documento}-${linha.nome}`"
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1.6fr 1fr 1.1fr 1fr; padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); gap: 10px"
        >
          <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ linha.documento }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ linha.nome }}</div>
          <div style="color: var(--text-default)">{{ linha.tipoCliente }}</div>
          <div style="color: var(--text-default)">{{ linha.gerente }}</div>
          <div style="color: var(--text-default)">{{ linha.statusOperacao }}</div>
        </div>
      </div>

      <p v-else-if="leuArquivo && !erros.length" style="margin-top: 16px; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhuma linha válida para importar.
      </p>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!podeImportar" @click="emit('confirm', linhas)" type="button">Importar</AdminButton>
    </template>
  </AdminModal>
</template>
