<script setup lang="ts">
import { computed, ref } from 'vue';
import { FileText, Paperclip, Download, Trash2 } from 'lucide-vue-next';
import type { Cedente, DocumentoCedente } from '../../../data/riscoData';
import { TIPO_ARQUIVO_OPTS } from '../../../data/riscoData';
import { FormField, SelectField, EmptyState, AddButton } from '../../../screens/detail-tabs/shared';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ update: [cedente: Cedente] }>();

const tipo = ref('');
const arquivo = ref('');
const filtroNome = ref('');
const filtroTipo = ref('');

function add() {
  if (!tipo.value || !arquivo.value.trim()) return;
  const novo: DocumentoCedente = { id: `doc-${Date.now()}`, nome: arquivo.value, tipo: tipo.value };
  emit('update', { ...props.cedente, documentos: [...props.cedente.documentos, novo] });
  arquivo.value = '';
  tipo.value = '';
}

function remove(id: string) {
  emit('update', { ...props.cedente, documentos: props.cedente.documentos.filter((d) => d.id !== id) });
}

const documentosFiltrados = computed(() =>
  props.cedente.documentos.filter((d) => {
    if (filtroNome.value.trim() && !d.nome.toLowerCase().includes(filtroNome.value.trim().toLowerCase())) return false;
    if (filtroTipo.value && d.tipo !== filtroTipo.value) return false;
    return true;
  }),
);
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr auto; gap: 14px">
      <SelectField label="Tipo do arquivo" :options="TIPO_ARQUIVO_OPTS" placeholder="Selecione" :value="tipo" @change="tipo = ($event.target as HTMLSelectElement).value" />
      <FormField label="Insira o arquivo" placeholder="Nome do arquivo" v-model="arquivo" />
      <AddButton @click="add" />
    </div>

    <div class="flex items-end" style="gap: 14px; flex-wrap: wrap">
      <div style="min-width: 200px">
        <FormField label="Nome" placeholder="Buscar por nome" v-model="filtroNome" />
      </div>
      <div style="min-width: 180px">
        <SelectField label="Tipo" :options="TIPO_ARQUIVO_OPTS" placeholder="Todos" :value="filtroTipo" @change="filtroTipo = ($event.target as HTMLSelectElement).value" />
      </div>
      <button
        :disabled="cedente.documentos.length === 0"
        class="flex items-center"
        :style="{
          gap: '8px', height: '40px', padding: '0 16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-card)', cursor: cedente.documentos.length === 0 ? 'not-allowed' : 'pointer',
          color: cedente.documentos.length === 0 ? 'var(--text-disabled)' : 'var(--text-strong)',
          fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', whiteSpace: 'nowrap',
        }"
      >
        <Download :size="14" /> BAIXAR TODOS
      </button>
    </div>

    <EmptyState v-if="documentosFiltrados.length === 0" :icon="FileText" title="Nenhum documento encontrado" hint="Use o formulário acima para anexar um documento deste cedente." />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid items-center" style="grid-template-columns: 1.6fr 1fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome</div><div>Tipo</div><div />
      </div>
      <div v-for="d in documentosFiltrados" :key="d.id" class="grid items-center" style="grid-template-columns: 1.6fr 1fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
        <div class="flex items-center" style="gap: 8px; font-weight: var(--weight-semibold); color: var(--text-strong)">
          <Paperclip :size="13" style="color: var(--text-muted)" /> {{ d.nome }}
        </div>
        <div style="color: var(--text-muted)">{{ d.tipo }}</div>
        <div class="flex justify-end">
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="remove(d.id)">
            <Trash2 :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
