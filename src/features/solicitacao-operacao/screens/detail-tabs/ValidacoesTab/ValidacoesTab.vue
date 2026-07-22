<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-vue-next';
import { detalheSolicitacao, type ItemValidacao } from '../../../data/operacaoData';
import { Section, GhostButton } from '../shared';
import ValidacaoRow from './ValidacaoRow.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
}>();
const emit = defineEmits<{
  openFullView: [];
  inserirEvidencia: [v: ItemValidacao];
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
}>();

const pendentes = computed(() => props.det.validacoes.filter((v) => v.status !== 'OK'));
const ok = computed(() => props.det.validacoes.filter((v) => v.status === 'OK'));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 8px; font-size: var(--text-xs); color: var(--text-muted)">
        <AlertCircle :size="15" style="color: var(--text-muted)" />
        As validações só rodam quando a operação tiver título e veículo vinculado.
      </div>
      <div class="flex items-center" style="gap: 8px">
        <button
          class="flex items-center"
          style="
            gap: 6px;
            height: 38px;
            padding: 0 14px;
            background: none;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.04em;
            color: var(--text-strong);
          "
          @click="emit('openFullView')"
        >
          <CheckCircle2 :size="14" /> Ver tela de validações
        </button>
        <GhostButton :icon="RefreshCw">Revalidar</GhostButton>
      </div>
    </div>

    <Section v-if="pendentes.length > 0" :title="`Pendentes (${pendentes.length})`">
      <div class="flex flex-col" style="gap: 10px">
        <ValidacaoRow
          v-for="v in pendentes"
          :key="v.titulo"
          :v="v"
          @inserir-evidencia="emit('inserirEvidencia', $event)"
          @ver-evidencia="emit('verEvidencia', $event)"
          @autorizar="emit('autorizar', $event)"
          @ver-detalhes="emit('verDetalhes', $event)"
        />
      </div>
    </Section>
    <Section v-if="ok.length > 0" :title="`Aprovadas (${ok.length})`">
      <div class="flex flex-col" style="gap: 10px">
        <ValidacaoRow
          v-for="v in ok"
          :key="v.titulo"
          :v="v"
          @inserir-evidencia="emit('inserirEvidencia', $event)"
          @ver-evidencia="emit('verEvidencia', $event)"
          @autorizar="emit('autorizar', $event)"
          @ver-detalhes="emit('verDetalhes', $event)"
        />
      </div>
    </Section>
  </div>
</template>
