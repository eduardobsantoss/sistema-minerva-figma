<script setup lang="ts">
import { computed, ref } from 'vue';
import { FolderOpen } from 'lucide-vue-next';
import SolicitacaoCard from './SolicitacaoCard.vue';
import MoverEtapaModal from './MoverEtapaModal.vue';
import { ETAPAS, etapaLabel, groupByEtapa, type Etapa, type Solicitacao } from '../data/operacaoData';

const props = defineProps<{
  solicitacoes: Solicitacao[];
}>();
const emit = defineEmits<{ open: [id: string]; move: [id: string, etapa: Etapa] }>();

const grupos = computed(() => groupByEtapa(props.solicitacoes));

const draggingId = ref<string | null>(null);
const dragOverEtapa = ref<Etapa | null>(null);
const suppressOpen = ref(false);

const pendingMove = ref<{
  solicitacao: Solicitacao;
  from: Etapa;
  to: Etapa;
} | null>(null);

function onDragStart(s: Solicitacao, e: DragEvent) {
  draggingId.value = s.id;
  suppressOpen.value = true;
  e.dataTransfer?.setData('text/plain', s.id);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd() {
  draggingId.value = null;
  dragOverEtapa.value = null;
  setTimeout(() => {
    suppressOpen.value = false;
  }, 80);
}

function onDragOver(etapa: Etapa, e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  dragOverEtapa.value = etapa;
}

function onDragLeave(etapa: Etapa) {
  if (dragOverEtapa.value === etapa) dragOverEtapa.value = null;
}

function onDrop(etapa: Etapa, e: DragEvent) {
  e.preventDefault();
  dragOverEtapa.value = null;
  const id = e.dataTransfer?.getData('text/plain') || draggingId.value;
  if (!id) return;

  const solicitacao = props.solicitacoes.find((s) => s.id === id);
  if (!solicitacao || solicitacao.etapa === etapa) {
    draggingId.value = null;
    return;
  }

  pendingMove.value = {
    solicitacao,
    from: solicitacao.etapa,
    to: etapa,
  };
  draggingId.value = null;
}

function confirmMove() {
  if (!pendingMove.value) return;
  const { solicitacao, to } = pendingMove.value;
  solicitacao.etapa = to;
  solicitacao.tempoEtapaHoras = 0;
  emit('move', solicitacao.id, to);
  pendingMove.value = null;
}

function cancelMove() {
  pendingMove.value = null;
}

function handleOpen(id: string) {
  if (suppressOpen.value) return;
  emit('open', id);
}
</script>

<template>
  <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px">
    <div
      v-for="etapa in ETAPAS"
      :key="etapa.key"
      class="flex flex-col"
      :style="{
        flex: '0 0 280px',
        width: '280px',
        background: dragOverEtapa === etapa.key
          ? `color-mix(in srgb, ${etapa.cor} 10%, var(--surface-sunken))`
          : 'var(--surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        borderTop: `3px solid ${etapa.cor}`,
        outline: dragOverEtapa === etapa.key ? `2px dashed ${etapa.cor}` : '2px solid transparent',
        outlineOffset: '-2px',
        padding: '12px',
        gap: '12px',
        minHeight: '200px',
        transition: 'background var(--duration-fast), outline-color var(--duration-fast)',
      }"
      @dragover="onDragOver(etapa.key, $event)"
      @dragleave="onDragLeave(etapa.key)"
      @drop="onDrop(etapa.key, $event)"
    >
      <!-- Header da coluna -->
      <div class="flex items-center justify-between" style="gap: 8px">
        <div class="flex items-center" style="gap: 8px; min-width: 0">
          <span :style="{ width: '8px', height: '8px', borderRadius: '9999px', background: etapa.cor, flexShrink: 0 }" />
          <span
            style="
              font-size: 11px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              color: var(--text-strong);
              text-transform: uppercase;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ etapa.label }}
          </span>
        </div>
        <span
          class="flex items-center justify-center"
          :style="{
            minWidth: '22px',
            height: '22px',
            padding: '0 7px',
            borderRadius: '9999px',
            background: `color-mix(in srgb, ${etapa.cor} 16%, transparent)`,
            fontSize: '11px',
            fontWeight: 'var(--weight-bold)',
            color: etapa.cor,
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
          }"
        >
          {{ grupos[etapa.key].length }}
        </span>
      </div>

      <!-- Cards -->
      <div class="flex flex-col" style="gap: 10px; flex: 1">
        <div
          v-if="grupos[etapa.key].length === 0"
          class="flex flex-col items-center justify-center"
          style="padding: 28px 8px; gap: 8px; text-align: center; color: var(--text-muted)"
        >
          <FolderOpen :size="22" :stroke-width="1.5" style="opacity: 0.5" />
          <span style="font-size: 11px">Nenhuma solicitação</span>
        </div>
        <div
          v-for="s in grupos[etapa.key]"
          :key="s.id"
          draggable="true"
          :style="{
            opacity: draggingId === s.id ? 0.45 : 1,
            cursor: 'grab',
            transition: 'opacity var(--duration-fast)',
          }"
          @dragstart="onDragStart(s, $event)"
          @dragend="onDragEnd"
        >
          <SolicitacaoCard :solicitacao="s" compact @open="handleOpen" />
        </div>
      </div>
    </div>
  </div>

  <MoverEtapaModal
    v-if="pendingMove"
    :solicitacao-id="pendingMove.solicitacao.id"
    :cedente="pendingMove.solicitacao.cedente"
    :etapa-origem="etapaLabel(pendingMove.from)"
    :etapa-destino="etapaLabel(pendingMove.to)"
    @close="cancelMove"
    @confirm="confirmMove"
  />
</template>
