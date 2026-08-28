<script setup lang="ts">
import { ref } from 'vue';
import { Download, FileText, Paperclip, Plus, Trash2 } from 'lucide-vue-next';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import { DOCUMENTO_TIPO_OPTS, type DocumentoGrupo } from '../../data/gruposCadastroData';

const props = defineProps<{ documentos: DocumentoGrupo[] }>();
const emit = defineEmits<{
  add: [doc: DocumentoGrupo];
  remove: [id: string];
}>();

const tipo = ref(DOCUMENTO_TIPO_OPTS[0] ?? '');
const validoAte = ref('');
const arquivoNome = ref('');
const fileRef = ref<HTMLInputElement | null>(null);
const toDelete = ref<DocumentoGrupo | null>(null);

function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  arquivoNome.value = input.files?.[0]?.name ?? '';
}

function inserir() {
  if (!arquivoNome.value.trim() || !tipo.value) return;
  emit('add', {
    id: `doc-${Date.now()}`,
    nome: arquivoNome.value.trim(),
    tipo: tipo.value,
    validoAte: validoAte.value.trim(),
  });
  arquivoNome.value = '';
  validoAte.value = '';
  if (fileRef.value) fileRef.value.value = '';
}

function confirmExcluir() {
  if (!toDelete.value) return;
  emit('remove', toDelete.value.id);
  toDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 18px">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="flex items-center"
        :disabled="documentos.length === 0"
        :style="{
          gap: '8px',
          height: '38px',
          padding: '0 14px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          cursor: documentos.length === 0 ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: documentos.length === 0 ? 'var(--text-disabled)' : 'var(--text-strong)',
        }"
      >
        <Download :size="14" /> Baixar todos
      </button>
    </div>

    <div class="flex items-end" style="gap: 12px; width: 100%">
      <div style="width: 200px; flex-shrink: 0">
        <SelectField v-model="tipo" label="Tipo do arquivo" :options="[...DOCUMENTO_TIPO_OPTS]" />
      </div>
      <div style="flex: 1; min-width: 180px">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          Insira o arquivo
        </div>
        <button
          type="button"
          class="flex items-center"
          style="
            gap: 8px;
            width: 100%;
            height: 40px;
            padding: 0 14px;
            background: var(--surface-sunken);
            border: 1px dashed var(--border-default);
            border-radius: var(--radius-lg);
            color: var(--text-muted);
            font-size: var(--text-sm);
            cursor: pointer;
            text-align: left;
          "
          @click="fileRef?.click()"
        >
          <Paperclip :size="15" style="flex-shrink: 0" />
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ arquivoNome || 'Selecionar...' }}
          </span>
        </button>
        <input ref="fileRef" type="file" hidden @change="onFile" />
      </div>
      <div style="width: 160px; flex-shrink: 0">
        <FormField v-model="validoAte" label="Válido até" placeholder="AAAA-MM-DD" />
      </div>
      <button
        type="button"
        class="flex items-center"
        :disabled="!arquivoNome"
        :style="{
          gap: '8px',
          height: '40px',
          padding: '0 18px',
          background: arquivoNome ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
          color: arquivoNome ? 'var(--action-primary-text)' : 'var(--text-disabled)',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: arquivoNome ? 'pointer' : 'not-allowed',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.06em',
          flexShrink: 0,
        }"
        @click="inserir"
      >
        <Plus :size="15" /> Inserir
      </button>
    </div>

    <div
      v-if="documentos.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhum documento anexado.
    </div>
    <div v-else class="flex flex-col" style="gap: 10px">
      <div
        v-for="d in documentos"
        :key="d.id"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); flex-shrink: 0"
        >
          <FileText :size="18" />
        </div>
        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ d.nome }}</span>
            <span
              style="
                font-size: 9px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 2px 7px;
                border-radius: var(--radius-sm);
                background: var(--status-neutral-bg);
                color: var(--status-neutral-text);
                text-transform: uppercase;
              "
            >
              {{ d.tipo }}
            </span>
          </div>
          <div
            v-if="d.validoAte"
            style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px"
          >
            Válido até {{ d.validoAte }}
          </div>
        </div>
        <button
          type="button"
          aria-label="Baixar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--gci-base)"
        >
          <Download :size="15" />
        </button>
        <button
          type="button"
          aria-label="Excluir"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
          @click="toDelete = d"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Excluir o documento “${toDelete.nome}”?`"
      description="Esta ação remove o arquivo anexado deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = null"
      @confirm="confirmExcluir"
    />
  </div>
</template>
