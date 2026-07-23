<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next';
withDefaults(defineProps<{ solicitacoes: Solicitacao[]; /** Filtro de esteira da listagem — controla colunas exclusivas da esteira Cliente. */
    esteiraFilter?: Esteira | 'TODAS' }>(), {
  solicitacoes: []
});
</script>

<template>
  <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px">
    <div
      v-for="etapa in colunas"
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
         
         
        >
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SolicitacaoCard</div>
        </div>
      </div>
    </div>
  </div>

  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">MoverEtapaModal</div>
</template>
