<script setup lang="ts">
import { reactive } from 'vue';
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import DocGroup from '../../../../components/novo-pedido/DocGroup.vue';

const props = defineProps<{ ativo: ContratoAtivo }>();

const docFiles = reactive<Record<string, boolean>>(
  Object.fromEntries(props.ativo.anexosDocs.map((d) => [d.id, d.enviado])),
);

const docs = props.ativo.anexosDocs.map((d) => ({ id: d.id, nome: d.nome, obrigatorio: d.obrigatorio }));

function toggleDoc(id: string) {
  docFiles[id] = !docFiles[id];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 10px">
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--success-light); color: var(--success-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <CheckCircle2 :size="16" /> Confirmar Anexos
      </button>
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--danger-light); color: var(--danger-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <XCircle :size="16" /> Rejeitar Anexos
      </button>
    </div>
    <DocGroup title="Documentos do Título" :docs="docs" :doc-files="docFiles" @toggle-doc="toggleDoc" />
  </div>
</template>
