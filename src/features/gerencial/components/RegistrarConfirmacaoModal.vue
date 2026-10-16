<script setup lang="ts">
import { computed, ref } from 'vue';
import { Trash2, X } from 'lucide-vue-next';
import XmlDropzone from '@/features/solicitacao-operacao/components/modals/XmlDropzone.vue';
import IconAction from '@/features/solicitacao-operacao/components/novo-pedido/IconAction.vue';
import { CONFIRMACAO_OPCOES, type ConfirmacaoTitulo } from '../data/gerencialData';

const emit = defineEmits<{ close: []; confirm: [payload: { status: ConfirmacaoTitulo; dia: string; hora: string; observacao: string; arquivos: string[] }] }>();

const status = ref<'' | ConfirmacaoTitulo>('');
const dia = ref('');
const hora = ref('');
const observacao = ref('');
const arquivos = ref<string[]>([]);
const erro = ref('');

const horaValida = computed(() => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora.value));

const EXTENSOES_EVIDENCIA = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.doc', '.docx', '.txt', '.mp3', '.wav', '.mp4', '.webm', '.xls', '.xlsx', '.csv'];
const rejeitados = ref<string[]>([]);

function onArquivos(files: File[]) {
  rejeitados.value = [];
  const conhecidos = new Set(arquivos.value);
  const novos = files.map((f) => f.name).filter((nome) => !conhecidos.has(nome));
  arquivos.value = [...arquivos.value, ...novos];
}

function onRejeitados(nomes: string[]) {
  rejeitados.value = nomes;
}

function removerArquivo(nome: string) {
  arquivos.value = arquivos.value.filter((a) => a !== nome);
}

function registrar() {
  if (!status.value) {
    erro.value = 'Informe o status da confirmação.';
    return;
  }
  if (!dia.value) {
    erro.value = 'Informe o dia.';
    return;
  }
  if (!horaValida.value) {
    erro.value = 'Informe a hora no formato HH:MM.';
    return;
  }
  erro.value = '';
  emit('confirm', {
    status: status.value,
    dia: dia.value,
    hora: hora.value,
    observacao: observacao.value.trim(),
    arquivos: arquivos.value,
  });
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(15, 23, 42, 0.45); padding: 24px"
    @click.self="emit('close')"
  >
    <form
      style="width: 100%; max-width: 520px; max-height: calc(100vh - 48px); overflow-y: auto; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4); padding: 24px"
      @submit.prevent="registrar"
      @click.stop
    >
      <div class="flex items-start justify-between" style="gap: 12px; margin-bottom: 18px">
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
            Registrar confirmação de título(s)
          </h2>
          <p class="ger-hint">Status, dia e hora são obrigatórios. A evidência é opcional.</p>
        </div>
        <button type="button" class="ger-back" aria-label="Fechar" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="flex flex-col" style="gap: 14px">
        <label>
          <div class="ger-label">Status da confirmação</div>
          <select v-model="status" class="ger-input" required>
            <option value="">Selecione</option>
            <option v-for="op in CONFIRMACAO_OPCOES" :key="op" :value="op">{{ op }}</option>
          </select>
        </label>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
          <label>
            <div class="ger-label">Dia</div>
            <input v-model="dia" type="date" class="ger-input" required />
          </label>
          <label>
            <div class="ger-label">Hora</div>
            <input v-model="hora" type="time" class="ger-input" required />
          </label>
        </div>
        <div class="flex flex-col" style="gap: 6px">
          <div class="ger-label">Evidência</div>
          <XmlDropzone
            :extensions="EXTENSOES_EVIDENCIA"
            heading="Solte os arquivos aqui"
            hint="PDF, imagem, áudio, vídeo, documento ou planilha"
            @files="onArquivos"
            @rejected="onRejeitados"
          />
          <div
            v-if="rejeitados.length"
            style="padding: 10px 12px; border-radius: var(--radius-md); background: var(--status-danger-bg); color: var(--status-danger-text); font-size: var(--text-xs); font-weight: var(--weight-semibold)"
          >
            Arquivos ignorados (formato não aceito): {{ rejeitados.join(', ') }}
          </div>
          <div v-if="arquivos.length" class="flex flex-col" style="gap: 8px">
            <div
              v-for="nome in arquivos"
              :key="nome"
              class="flex items-center"
              style="gap: 14px; padding: 10px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
            >
              <IconAction :icon="Trash2" label="Excluir" danger @click="removerArquivo(nome)" />
              <div style="flex: 1; min-width: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                {{ nome }}
              </div>
            </div>
          </div>
        </div>
        <label>
          <div class="ger-label">Observação</div>
          <textarea
            v-model="observacao"
            rows="3"
            class="ger-input"
            style="height: auto; padding: 10px 12px; resize: vertical"
          />
        </label>
        <p v-if="erro" style="font-size: var(--text-sm); color: var(--status-danger-text)">{{ erro }}</p>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button type="button" class="ger-btn-ghost" @click="emit('close')">Fechar</button>
        <button type="submit" class="ger-btn-primary">Registrar</button>
      </div>
    </form>
  </div>
</template>
