<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Boxes, Search } from 'lucide-vue-next';
import { brl, detalheSolicitacao } from '../../data/operacaoData';
import { Section, EmptyState, GhostButton } from './shared';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
}>();
const emit = defineEmits<{ addContrato: [] }>();

const total = computed(() => props.det.ativos.reduce((acc, a) => acc + a.valorTotal, 0));
</script>

<template>
  <Section title="Ativos Vinculados">
    <template #action>
      <GhostButton :icon="Plus" @click="emit('addContrato')">Adicionar contrato</GhostButton>
    </template>

    <div class="flex items-center" style="gap: 12px; margin-bottom: 16px; flex-wrap: wrap">
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          placeholder="Lastros"
          style="
            width: 100%;
            height: 40px;
            padding-left: 36px;
            padding-right: 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          placeholder="Número"
          style="
            width: 100%;
            height: 40px;
            padding-left: 36px;
            padding-right: 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          placeholder="Sacado"
          style="
            width: 100%;
            height: 40px;
            padding-left: 36px;
            padding-right: 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />
      </div>
    </div>

    <EmptyState
      v-if="det.ativos.length === 0"
      :icon="Boxes"
      title="Nenhum ativo vinculado"
      hint="Use “Adicionar contrato” para vincular lastros a esta solicitação. O valor total será calculado automaticamente."
    />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1fr 1fr 1fr 1fr 1.4fr;
          padding: 12px 16px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Número</div>
        <div>Tipo</div>
        <div>Emissão</div>
        <div>Vencimento</div>
        <div>Sacado</div>
      </div>
      <div
        v-for="(a, i) in det.ativos"
        :key="`${a.numero}-${i}`"
        class="grid items-center"
        style="
          grid-template-columns: 1fr 1fr 1fr 1fr 1.4fr;
          padding: 12px 16px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ a.numero || '—' }}</div>
        <div style="color: var(--text-default)">{{ a.tipo }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.emissao || '—' }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.vencimento || '—' }}</div>
        <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
          {{ a.sacadoNome || '—' }}
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between"
      style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-default)"
    >
      <span style="font-size: var(--text-xs); color: var(--text-muted)">Valor total</span>
      <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(total) }}
      </span>
    </div>
  </Section>
</template>
