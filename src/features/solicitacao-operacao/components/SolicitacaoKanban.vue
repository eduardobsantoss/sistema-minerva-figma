<script setup lang="ts">
import { computed } from 'vue';
import { FolderOpen } from 'lucide-vue-next';
import SolicitacaoCard from './SolicitacaoCard.vue';
import { ETAPAS, groupByEtapa, type Solicitacao } from '../data/operacaoData';

const props = defineProps<{
  solicitacoes: Solicitacao[];
}>();
const emit = defineEmits<{ open: [id: string] }>();

// TODO: drag-and-drop — cada coluna é o drop target para mover solicitações entre etapas.
const grupos = computed(() => groupByEtapa(props.solicitacoes));
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
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        borderTop: `3px solid ${etapa.cor}`,
        padding: '12px',
        gap: '12px',
        minHeight: '200px',
      }"
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
      <div class="flex flex-col" style="gap: 10px">
        <div
          v-if="grupos[etapa.key].length === 0"
          class="flex flex-col items-center justify-center"
          style="padding: 28px 8px; gap: 8px; text-align: center; color: var(--text-muted)"
        >
          <FolderOpen :size="22" :stroke-width="1.5" style="opacity: 0.5" />
          <span style="font-size: 11px">Nenhuma solicitação</span>
        </div>
        <SolicitacaoCard
          v-for="s in grupos[etapa.key]"
          :key="s.id"
          :solicitacao="s"
          compact
          @open="emit('open', $event)"
        />
      </div>
    </div>
  </div>
</template>
