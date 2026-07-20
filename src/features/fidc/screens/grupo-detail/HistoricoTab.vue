<script setup lang="ts">
import { Clock, History } from 'lucide-vue-next';
import type { GrupoHistoricoEvento } from '../../data/fidcsData';

defineProps<{ eventos: GrupoHistoricoEvento[] }>();
</script>

<template>
  <div v-if="!eventos.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    <History :size="32" style="margin: 0 auto 12px; opacity: 0.5" />
    Nenhum evento registrado para este grupo.
  </div>
  <div v-else style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 16px">
      Linha do Tempo
    </div>
    <div class="flex flex-col" style="gap: 0">
      <div v-for="(e, i) in eventos" :key="e.id" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span v-if="i < eventos.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.message }}</div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ e.datetime }}
            <span v-if="e.createdBy"> · {{ e.createdBy }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
