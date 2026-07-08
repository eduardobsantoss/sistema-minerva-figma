<script setup lang="ts">
import { Clock, History } from 'lucide-vue-next';
import type { HistoricoEvento } from '../../data/riscoData';
import { Section, EmptyState } from './shared';

defineProps<{ eventos: HistoricoEvento[] }>();
</script>

<template>
  <EmptyState v-if="eventos.length === 0" :icon="History" title="Nenhum evento registrado" hint="O histórico deste grupo aparecerá aqui conforme novos eventos ocorrerem." />
  <Section v-else title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in eventos" :key="e.id" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span v-if="i < eventos.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ e.descricao }}
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ e.datetime }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
