<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckCircle2, ChevronDown, ChevronRight, ExternalLink } from 'lucide-vue-next';
import type { IbamaRestriction } from '../../data/serasaTypes';
import { formatDateOnly, formatDateTimeUtc, formatDocument } from '../../utils/serasaFormatters';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';

const props = defineProps<{ items: IbamaRestriction[] }>();

const typeFilter = ref('');
const ufFilter = ref('');
const expandedDetails = ref<Set<number>>(new Set());

const types = computed(() =>
  Array.from(new Set(props.items.map((i) => i.restrictionType))).sort(),
);

const ufs = computed(() =>
  Array.from(new Set(props.items.map((i) => i.stateCode).filter(Boolean) as string[])).sort(),
);

const filtered = computed(() =>
  props.items.filter((item) => {
    if (typeFilter.value && item.restrictionType !== typeFilter.value) return false;
    if (ufFilter.value && item.stateCode !== ufFilter.value) return false;
    return true;
  }),
);

const batchFooter = computed(() => {
  const first = props.items[0]?.batch;
  return first ?? null;
});

function toggleDetails(id: number) {
  const next = new Set(expandedDetails.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedDetails.value = next;
}
</script>

<template>
  <EmptyState
    v-if="items.length === 0"
    :icon="CheckCircle2"
    title="Nenhuma restrição IBAMA"
    hint="Não há embargos ou autuações ambientais associados a este documento nas listas importadas."
  />

  <div v-else class="flex flex-col" style="gap: 16px">
    <div class="flex flex-wrap items-center justify-between" style="gap: 12px">
      <p style="font-size: var(--text-sm); color: var(--text-muted)">
        {{ items.length }} ocorrência(s) ambiental(is)
      </p>
      <div class="flex flex-wrap items-center" style="gap: 8px">
        <select
          v-model="typeFilter"
          style="height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); font-size: var(--text-xs); color: var(--text-default)"
        >
          <option value="">Todos os tipos</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
        <select
          v-model="ufFilter"
          style="height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); font-size: var(--text-xs); color: var(--text-default)"
        >
          <option value="">Todas as UFs</option>
          <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
        </select>
      </div>
    </div>

    <div
      v-for="item in filtered"
      :key="item.id"
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 18px 20px"
    >
      <div class="flex flex-wrap items-start justify-between" style="gap: 12px; margin-bottom: 14px">
        <div style="min-width: 0; flex: 1">
          <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ item.personName || 'Nome não informado' }}
          </h3>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
            {{ formatDocument(item.document) }}
            <span v-if="item.referenceCode"> · {{ item.referenceCode }}</span>
          </p>
        </div>
        <div class="flex flex-wrap items-center" style="gap: 6px">
          <span
            style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 10px; border-radius: 9999px; background: var(--status-warning-bg); color: var(--status-warning-text)"
          >
            {{ item.restrictionType }}
          </span>
          <span
            v-if="item.stateCode"
            style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 10px; border-radius: 9999px; background: var(--status-active-bg); color: var(--status-active-text)"
          >
            {{ item.stateCode }}
          </span>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px 20px">
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Município</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.municipalityName || '—' }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Data da ocorrência</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ formatDateOnly(item.occurredAt) }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Tipo de documento</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.documentType }}</div>
        </div>
      </div>

      <div v-if="item.details" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-default)">
        <button
          class="flex items-center"
          style="gap: 6px; background: none; border: none; cursor: pointer; padding: 0; font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent)"
          @click="toggleDetails(item.id)"
        >
          <component :is="expandedDetails.has(item.id) ? ChevronDown : ChevronRight" :size="14" />
          {{ expandedDetails.has(item.id) ? 'Ocultar detalhes' : 'Ver detalhes' }}
        </button>
        <p
          v-if="expandedDetails.has(item.id)"
          style="font-size: var(--text-sm); color: var(--text-default); margin-top: 10px; line-height: 1.5"
        >
          {{ item.details }}
        </p>
      </div>
    </div>

    <p v-if="filtered.length === 0" style="font-size: var(--text-sm); color: var(--text-muted); text-align: center; padding: 24px">
      Nenhum registro corresponde aos filtros selecionados.
    </p>

    <div
      v-if="batchFooter"
      class="flex flex-wrap items-center"
      style="gap: 8px; padding: 12px 14px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: 1px solid var(--border-default); font-size: var(--text-xs); color: var(--text-muted)"
    >
      <span>
        Fonte: <strong style="color: var(--text-default)">{{ batchFooter.sourceCode }}</strong>
        <template v-if="batchFooter.resourceName"> · {{ batchFooter.resourceName }}</template>
        · atualizado em {{ formatDateTimeUtc(batchFooter.executedAt) }}
      </span>
      <a
        v-if="batchFooter.resourceUrl"
        :href="batchFooter.resourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center"
        style="gap: 4px; color: var(--accent); font-weight: var(--weight-semibold); text-decoration: none"
      >
        ver origem
        <ExternalLink :size="12" />
      </a>
    </div>
  </div>
</template>
