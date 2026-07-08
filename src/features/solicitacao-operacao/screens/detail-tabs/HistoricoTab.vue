<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section } from './shared';

defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="position: relative">
      <div
        v-for="(ev, i) in det.historico"
        :key="i"
        class="flex items-start"
        style="gap: 16px; padding: 12px 0; position: relative"
      >
        <div style="position: relative; width: 12px">
          <span
            style="
              display: block;
              width: 12px;
              height: 12px;
              border-radius: 9999px;
              background: var(--gci-base);
              margin-top: 4px;
            "
          />
          <span
            v-if="i < det.historico.length - 1"
            style="
              position: absolute;
              left: 5px;
              top: 16px;
              bottom: -12px;
              width: 2px;
              background: var(--border-default);
            "
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            <strong>{{ ev.autor }}</strong> {{ ev.acao }}
          </div>
          <div
            class="flex items-center"
            style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px"
          >
            <Clock :size="12" /> {{ ev.data }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
