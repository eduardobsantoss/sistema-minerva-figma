<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Trash2, Pencil } from 'lucide-vue-next';
import type { ParteTipo, ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import { PARTE_TIPO_LABEL } from '@/features/solicitacao-operacao/data/parteRelacionadaFields';

const props = defineProps<{ partes: ParteRelacionada[] }>();
const emit = defineEmits<{
  add: [];
  open: [parte: ParteRelacionada];
  remove: [parte: ParteRelacionada];
}>();

const COLS = '1.1fr 1.8fr 1.2fr auto';

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CON: { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
};

const tiposUsados = computed(() => {
  const set = new Set<ParteTipo>();
  props.partes.forEach((p) => p.tipos.forEach((t) => set.add(t)));
  return [...set];
});

function onRemove(parte: ParteRelacionada, e: Event) {
  e.stopPropagation();
  if (!window.confirm('Remover esta parte relacionada?')) return;
  emit('remove', parte);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex items-center justify-between" style="gap: 12px">
      <div style="font-size: var(--text-sm); color: var(--text-muted)">
        {{ partes.length }}
        {{ partes.length === 1 ? 'parte cadastrada' : 'partes cadastradas' }}
      </div>
      <button
        type="button"
        class="flex items-center"
        style="
          gap: 8px;
          height: 38px;
          padding: 0 14px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
        "
        @click="emit('add')"
      >
        <Plus :size="14" />
        Cadastrar
      </button>
    </div>

    <div
      v-if="partes.length === 0"
      style="
        padding: 40px;
        text-align: center;
        font-size: var(--text-sm);
        color: var(--text-muted);
        background: var(--surface-sunken);
        border-radius: var(--radius-xl);
        border: 1px dashed var(--border-default);
      "
    >
      Nenhuma parte relacionada cadastrada.
    </div>

    <div
      v-else
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: var(--surface-card);
      "
    >
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Tipo</div>
        <div style="text-align: right">Ação</div>
      </div>

      <div
        v-for="(p, idx) in partes"
        :key="`${p.documento}-${idx}`"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">
          {{ p.documento }}
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ p.nome }}
        </div>
        <div class="flex items-center" style="gap: 4px; flex-wrap: wrap">
          <span
            v-for="t in p.tipos"
            :key="t"
            :title="PARTE_TIPO_LABEL[t]"
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.06em',
              padding: '3px 7px',
              borderRadius: 'var(--radius-sm)',
              background: parteTone[t].bg,
              color: parteTone[t].fg,
            }"
          >
            {{ t }}
          </span>
        </div>
        <div class="flex justify-end" style="gap: 6px">
          <button
            type="button"
            aria-label="Editar parte relacionada"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              background: none;
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click="emit('open', p)"
          >
            <Pencil :size="14" />
          </button>
          <button
            type="button"
            aria-label="Remover parte relacionada"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              background: none;
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--action-danger-text-only);
            "
            @click="onRemove(p, $event)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="tiposUsados.length" class="flex items-center" style="gap: 16px; flex-wrap: wrap">
      <span
        v-for="t in tiposUsados"
        :key="t"
        class="flex items-center"
        style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted)"
      >
        <span
          :style="{
            fontSize: '9px',
            fontWeight: 'var(--weight-bold)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            background: parteTone[t].bg,
            color: parteTone[t].fg,
          }"
        >
          {{ t }}
        </span>
        {{ PARTE_TIPO_LABEL[t] }}
      </span>
    </div>
  </div>
</template>
