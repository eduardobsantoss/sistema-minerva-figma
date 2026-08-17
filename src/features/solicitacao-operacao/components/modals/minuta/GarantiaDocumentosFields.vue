<script setup lang="ts">
import { computed, ref } from 'vue';
import { FileText, Paperclip, Download, Trash2, CheckCircle2, AlertTriangle } from 'lucide-vue-next';
import { StepGrid, FormField, SelectField, AddButton, EmptyState } from '../adicionar-contrato';
import {
  TIPO_ARQUIVO_GARANTIA_MINUTA_OPTS,
  isDocumentoGarantiaVigente,
  type GarantiaMinutaDocumento,
} from '../../../data/minutaData';

const documentos = defineModel<GarantiaMinutaDocumento[]>('documentos', { default: () => [] });

const tipo = ref('');
const arquivoNome = ref('');
const validade = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const canAdd = computed(() => !!tipo.value && !!arquivoNome.value.trim());

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  arquivoNome.value = file?.name ?? '';
}

function addDocumento() {
  if (!canAdd.value) return;
  documentos.value = [
    ...documentos.value,
    {
      id: `gdoc-${Date.now()}`,
      nome: arquivoNome.value.trim(),
      tipo: tipo.value,
      validade: validade.value.trim(),
    },
  ];
  tipo.value = '';
  arquivoNome.value = '';
  validade.value = '';
  if (fileInput.value) fileInput.value.value = '';
}

function removeDocumento(id: string) {
  documentos.value = documentos.value.filter((d) => d.id !== id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <StepGrid>
      <SelectField
        label="Tipo do arquivo"
        :options="[...TIPO_ARQUIVO_GARANTIA_MINUTA_OPTS]"
        placeholder="Selecione"
        :span="4"
        v-model="tipo"
      />
      <div :style="{ gridColumn: 'span 5' }">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          Insira o arquivo
        </div>
        <label
          class="flex items-center"
          :style="{
            height: '40px',
            padding: '0 14px',
            gap: '8px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            minWidth: 0,
          }"
        >
          <Paperclip :size="14" style="color: var(--text-muted); flex-shrink: 0" />
          <span
            :style="{
              fontSize: 'var(--text-sm)',
              color: arquivoNome ? 'var(--text-strong)' : 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }"
          >
            {{ arquivoNome || 'Selecionar arquivo' }}
          </span>
          <input ref="fileInput" type="file" style="display: none" @change="onFileChange" />
        </label>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
          {{ arquivoNome ? '1 arquivo(s)' : '0 arquivo(s)' }}
        </div>
      </div>
      <FormField label="Válido até" placeholder="dd/mm/aaaa" :span="3" v-model="validade" />
    </StepGrid>

    <div class="flex justify-end">
      <AddButton :disabled="!canAdd" @click="addDocumento">Salvar documentos</AddButton>
    </div>

    <EmptyState
      v-if="documentos.length === 0"
      :icon="FileText"
      title="Nenhum documento anexado"
      hint="Selecione o tipo, o arquivo e a validade e clique em Salvar documentos."
    />
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
    >
      <div
        class="grid"
        style="
          grid-template-columns: 1.6fr 1.1fr 0.7fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Nome</div>
        <div>Tipo</div>
        <div>Validade</div>
        <div />
      </div>
      <div
        v-for="d in documentos"
        :key="d.id"
        class="grid items-center"
        style="
          grid-template-columns: 1.6fr 1.1fr 0.7fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div
          class="flex items-center"
          style="gap: 8px; font-weight: var(--weight-semibold); color: var(--text-strong); min-width: 0"
        >
          <Paperclip :size="13" style="color: var(--text-muted); flex-shrink: 0" />
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ d.nome }}</span>
        </div>
        <div style="color: var(--text-muted)">{{ d.tipo }}</div>
        <div class="flex items-center" style="gap: 6px">
          <CheckCircle2
            v-if="isDocumentoGarantiaVigente(d.validade)"
            :size="16"
            style="color: var(--success-base)"
          />
          <AlertTriangle v-else :size="16" style="color: var(--warning-base)" />
          <span style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ d.validade || '—' }}</span>
        </div>
        <div class="flex items-center justify-end" style="gap: 4px">
          <button
            type="button"
            aria-label="Baixar"
            class="flex items-center justify-center"
            style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--gci-base)"
          >
            <Download :size="14" />
          </button>
          <button
            type="button"
            aria-label="Remover"
            class="flex items-center justify-center"
            style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
            @click="removeDocumento(d.id)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
