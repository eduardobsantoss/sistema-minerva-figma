<script setup lang="ts">
import { computed } from 'vue';
import { RefreshCw, Search, AlertTriangle } from 'lucide-vue-next';
import type { CreditQueryLatest } from '../data/serasaTypes';
import { queryStatusTone } from '../data/serasaConstants';
import { formatDocument, formatDateTimeUtc, maskDocumentInput, onlyDigits } from '../utils/serasaFormatters';
import { CopyButton } from '@/features/risco/screens/detail-tabs/shared';

const props = defineProps<{
  documentInput: string;
  loading?: boolean;
  latest?: CreditQueryLatest | null;
}>();

const emit = defineEmits<{
  'update:documentInput': [value: string];
  consult: [];
  refresh: [];
}>();

const localInput = computed({
  get: () => props.documentInput,
  set: (v: string) => emit('update:documentInput', maskDocumentInput(v)),
});

const canConsult = computed(() => {
  const d = onlyDigits(props.documentInput);
  return d.length === 11 || d.length === 14;
});

const statusTone = computed(() =>
  props.latest ? queryStatusTone(props.latest.status) : null,
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Risco · Due Diligence
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Consulta Serasa
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Consulte crédito, restrições oficiais e processos por CPF ou CNPJ.
      </p>
    </div>

    <div
      class="flex flex-wrap items-end"
      style="gap: 12px; padding: 20px 22px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
    >
      <div style="flex: 1; min-width: 220px">
        <label style="display: block; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px">
          CPF / CNPJ
        </label>
        <input
          v-model="localInput"
          type="text"
          inputmode="numeric"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); font-size: var(--text-sm); color: var(--text-strong); background: var(--surface-page)"
          @keyup.enter="canConsult && emit('consult')"
        />
      </div>
      <button
        :disabled="!canConsult || loading"
        class="flex items-center"
        :style="{
          gap: '8px',
          height: '40px',
          padding: '0 20px',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: canConsult && !loading ? 'pointer' : 'not-allowed',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.08em',
          background: canConsult && !loading ? 'var(--action-primary-bg)' : 'var(--surface-sunken)',
          color: canConsult && !loading ? '#fff' : 'var(--text-muted)',
        }"
        @click="emit('consult')"
      >
        <Search :size="16" />
        CONSULTAR
      </button>
    </div>

    <template v-if="latest">
      <div
        v-if="latest.isExpired"
        class="flex items-center"
        style="gap: 10px; padding: 12px 16px; border-radius: var(--radius-lg); background: var(--status-warning-bg); border: 1px solid color-mix(in srgb, var(--warning-base) 30%, transparent)"
      >
        <AlertTriangle :size="18" style="color: var(--warning-base); flex-shrink: 0" />
        <p style="flex: 1; font-size: var(--text-sm); color: var(--status-warning-text)">
          Os dados desta consulta podem estar desatualizados. A validade expirou em {{ formatDateTimeUtc(latest.validUntil) }}.
        </p>
        <button
          class="flex items-center"
          style="gap: 6px; height: 34px; padding: 0 14px; border: none; border-radius: var(--radius-md); background: var(--warning-base); color: #fff; cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold); flex-shrink: 0"
          @click="emit('refresh')"
        >
          <RefreshCw :size="14" />
          Atualizar
        </button>
      </div>

      <div
        class="flex flex-wrap items-start justify-between"
        style="gap: 16px; padding: 20px 22px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
      >
        <div style="flex: 1; min-width: 0">
          <div class="flex flex-wrap items-center" style="gap: 10px; margin-bottom: 6px">
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ latest.basicInfo?.name ?? 'Nome não disponível' }}
            </h2>
            <span
              v-if="statusTone"
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.1em',
                padding: '5px 11px',
                borderRadius: '9999px',
                background: statusTone.bg,
                color: statusTone.fg,
              }"
            >
              {{ latest.status.toUpperCase() }}
            </span>
          </div>
          <p class="flex items-center flex-wrap" style="gap: 6px; font-size: var(--text-sm); color: var(--text-muted)">
            <span style="font-variant-numeric: tabular-nums">{{ formatDocument(latest.document) }}</span>
            <CopyButton :value="latest.document" />
            <span style="color: var(--border-default)">·</span>
            <span>Consultado em {{ formatDateTimeUtc(latest.createdAt) }}</span>
            <span style="color: var(--border-default)">·</span>
            <span>Válido até {{ formatDateTimeUtc(latest.validUntil) }}</span>
          </p>
        </div>
        <button
          v-if="!latest.isExpired"
          class="flex items-center"
          style="gap: 6px; height: 36px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-default)"
          @click="emit('refresh')"
        >
          <RefreshCw :size="14" />
          Atualizar consulta
        </button>
      </div>

      <div class="flex flex-wrap items-center" style="gap: 16px; padding: 0 4px; font-size: var(--text-xs); color: var(--text-muted)">
        <span class="flex items-center" style="gap: 4px">
          ID da consulta: <strong style="color: var(--text-default)">{{ latest.queryId }}</strong>
          <CopyButton :value="String(latest.queryId)" />
        </span>
        <span class="flex items-center" style="gap: 4px">
          ID no provedor: <strong style="color: var(--text-default)">{{ latest.externalId }}</strong>
          <CopyButton :value="latest.externalId" />
        </span>
      </div>
    </template>
  </div>
</template>
