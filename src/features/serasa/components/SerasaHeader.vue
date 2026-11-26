<script setup lang="ts">
import { computed } from 'vue';
import { RefreshCw, Search } from 'lucide-vue-next';
import type { CreditQueryLatest } from '../data/serasaTypes';
import { queryStatusLabel, queryStatusTone } from '../data/serasaConstants';
import { formatDocument, formatDateTimeUtc, maskDocumentInput, onlyDigits } from '../utils/serasaFormatters';
import { CopyButton } from '@/features/risco/screens/detail-tabs/shared';
import Alert from '@/components/feedback/Alert.vue';
import AdminButton from '@/components/ui/AdminButton.vue';

const props = withDefaults(defineProps<{
  documentInput: string;
  loading?: boolean;
  latest?: CreditQueryLatest | null;
  lote?: boolean;
  title?: string;
}>(), {
  title: 'Consultas',
});

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
        Carteira
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        {{ title }}
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ lote ? 'Suba uma lista de CPF ou CNPJ e consulte o lote de uma vez.' : 'Consulte crédito, restrições oficiais e processos por CPF ou CNPJ.' }}
      </p>
      <div style="margin-top: 16px">
        <slot />
      </div>
    </div>

    <div
      v-if="!lote"
      class="flex flex-col"
      style="gap: 16px; padding: 20px 22px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
    >
      <div class="flex flex-wrap items-end" style="gap: 12px">
      <div style="flex: 1; min-width: 220px">
        <label style="display: block; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px">
          CPF / CNPJ
        </label>
        <input
          v-model="localInput"
          class="consulta-input"
          type="text"
          inputmode="numeric"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); font-size: var(--text-sm); color: var(--text-strong); background: var(--surface-card)"
          @keyup.enter="canConsult && emit('consult')"
        />
      </div>
      <AdminButton :icon="Search" :disabled="!canConsult || loading" @click="emit('consult')">Consultar</AdminButton>
      </div>
      <slot name="atalhos" />
    </div>

    <template v-if="latest">
      <Alert
        v-if="latest.isExpired"
        type="warning"
        :dismissible="false"
        title="Consulta expirada"
        :message="`Os dados podem estar desatualizados. A validade expirou em ${formatDateTimeUtc(latest.validUntil)}.`"
        action-label="Atualizar"
        @action="emit('refresh')"
      />

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
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: statusTone.bg,
                color: statusTone.fg,
              }"
            >
              {{ queryStatusLabel(latest.status) }}
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
        <AdminButton variant="secondary" size="compact" :icon="RefreshCw" v-if="!latest.isExpired" @click="emit('refresh')">Atualizar consulta</AdminButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.consulta-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: var(--focus-ring);
}
</style>
