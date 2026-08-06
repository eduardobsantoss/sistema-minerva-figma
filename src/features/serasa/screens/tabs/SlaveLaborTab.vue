<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckCircle2 } from 'lucide-vue-next';
import type { SlaveLaborRestriction } from '../../data/serasaTypes';
import { formatDateOnly, formatDateTimeUtc, formatDocument } from '../../utils/serasaFormatters';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';

const props = defineProps<{ items: SlaveLaborRestriction[] }>();

const statusFilter = ref<'all' | 'active' | 'ended'>('all');
const ufFilter = ref('');

function isActive(item: SlaveLaborRestriction) {
  return !item.registryInclusionEndDate;
}

const ufs = computed(() =>
  Array.from(new Set(props.items.map((i) => i.state))).sort(),
);

const filtered = computed(() =>
  props.items.filter((item) => {
    if (statusFilter.value === 'active' && !isActive(item)) return false;
    if (statusFilter.value === 'ended' && isActive(item)) return false;
    if (ufFilter.value && item.state !== ufFilter.value) return false;
    return true;
  }),
);

const activeCount = computed(() => props.items.filter(isActive).length);
</script>

<template>
  <EmptyState
    v-if="items.length === 0"
    :icon="CheckCircle2"
    title="Nenhuma restrição de Trabalho Escravo"
    hint="Este documento não consta no Cadastro de Empregadores (Lista Suja do Trabalho Escravo)."
  />

  <div v-else class="flex flex-col" style="gap: 16px">
    <div class="flex flex-wrap items-center justify-between" style="gap: 12px">
      <p style="font-size: var(--text-sm); color: var(--text-muted)">
        {{ items.length }} registro(s)
        <span v-if="activeCount"> · <strong style="color: var(--status-danger-text)">{{ activeCount }} na lista</strong></span>
      </p>
      <div class="flex flex-wrap items-center" style="gap: 8px">
        <select
          v-model="statusFilter"
          style="height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); font-size: var(--text-xs); color: var(--text-default)"
        >
          <option value="all">Todos os status</option>
          <option value="active">Na lista</option>
          <option value="ended">Fora da lista</option>
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
            {{ item.employerName }}
          </h3>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
            {{ formatDocument(item.federalDocument) }}
          </p>
        </div>
        <div class="flex flex-wrap items-center" style="gap: 6px">
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: isActive(item) ? 'var(--status-danger-bg)' : 'var(--status-neutral-bg)',
              color: isActive(item) ? 'var(--status-danger-text)' : 'var(--status-neutral-text)',
            }"
            :title="isActive(item) ? 'Empregador atualmente na lista' : `Saiu da lista em ${formatDateOnly(item.registryInclusionEndDate)}`"
          >
            {{ isActive(item) ? 'NA LISTA' : 'FORA DA LISTA' }}
          </span>
          <span
            style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 10px; border-radius: 9999px; background: var(--status-active-bg); color: var(--status-active-text)"
          >
            {{ item.state }}
          </span>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px 20px">
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Local</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.location }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">CNAE</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.cnae }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Ano da ação fiscal</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.fiscalActionYear ?? '—' }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Trabalhadores envolvidos</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.workersInvolved ?? '—' }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Início da inclusão</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ formatDateOnly(item.registryInclusionStartDate) }}</div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Fim da inclusão</div>
          <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ formatDateOnly(item.registryInclusionEndDate) }}</div>
        </div>
      </div>

      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-default)">
        <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Decisão administrativa</div>
        <div style="font-size: var(--text-sm); color: var(--text-default); margin-top: 4px">{{ item.administrativeDecision }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px">
          Importado em {{ formatDateTimeUtc(item.createdAt) }}
        </div>
      </div>
    </div>

    <p v-if="filtered.length === 0" style="font-size: var(--text-sm); color: var(--text-muted); text-align: center; padding: 24px">
      Nenhum registro corresponde aos filtros selecionados.
    </p>
  </div>
</template>
