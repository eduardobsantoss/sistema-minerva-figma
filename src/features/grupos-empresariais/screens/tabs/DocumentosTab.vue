<script setup lang="ts">
import { ref } from 'vue';
import { Download, Trash2 } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
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

function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  arquivoNome.value = input.files?.[0]?.name ?? '';
}

function cadastrar() {
  if (!arquivoNome.value.trim() || !tipo.value) return;
  emit('add', {
    id: `doc-${Date.now()}`,
    nome: arquivoNome.value.trim(),
    tipo: tipo.value,
    validoAte: validoAte.value,
  });
  arquivoNome.value = '';
  validoAte.value = '';
  if (fileRef.value) fileRef.value.value = '';
}

function excluir(id: string) {
  if (!window.confirm('Excluir este documento?')) return;
  emit('remove', id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
      <StepGrid>
        <SelectField v-model="tipo" label="Tipo do arquivo" :options="[...DOCUMENTO_TIPO_OPTS]" :span="4" />
        <div style="grid-column: span 5">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Insira o arquivo
          </div>
          <input
            ref="fileRef"
            type="file"
            style="width: 100%; height: 40px; font-size: var(--text-sm); color: var(--text-default)"
            @change="onFile"
          />
        </div>
        <div style="grid-column: span 3">
          <FormField v-model="validoAte" label="Válido até" placeholder="AAAA-MM-DD" />
        </div>
      </StepGrid>
      <div class="flex justify-end" style="margin-top: 14px">
        <button
          type="button"
          :disabled="!arquivoNome"
          :style="{
            height: '40px',
            padding: '0 18px',
            background: arquivoNome ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: arquivoNome ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: arquivoNome ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="cadastrar"
        >
          CADASTRAR
        </button>
      </div>
    </div>

    <div
      v-if="documentos.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhum documento cadastrado.
    </div>
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div class="grid items-center" style="grid-template-columns: 1.6fr 1.2fr 0.9fr auto; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome</div>
        <div>Tipo</div>
        <div>Válido até</div>
        <div style="text-align: right">Ação</div>
      </div>
      <div
        v-for="d in documentos"
        :key="d.id"
        class="grid items-center"
        style="grid-template-columns: 1.6fr 1.2fr 0.9fr auto; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ d.nome }}</div>
        <div style="color: var(--text-default)">{{ d.tipo }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ d.validoAte || '—' }}</div>
        <div class="flex justify-end" style="gap: 6px">
          <button type="button" aria-label="Download" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)">
            <Download :size="14" />
          </button>
          <button type="button" aria-label="Excluir documento" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)" @click="excluir(d.id)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
