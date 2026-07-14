<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { brl, fmtDuracao, slaRatio, etapaLabel, etapaCor, type Solicitacao } from '../data/operacaoData';

const props = defineProps<{
  solicitacoes: Solicitacao[];
}>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.solicitacoes,
  { defaultPageSize: 10 },
);
const emit = defineEmits<{ open: [id: string] }>();

const COLS = '90px 1.6fr 0.9fr 1.2fr 1fr 1.1fr 1fr';

const hoveredId = ref<string | null>(null);
</script>

<template>
  <div
    style="
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--surface-card);
    "
  >
    <!-- Header -->
    <div
      class="grid"
      :style="{
        gridTemplateColumns: COLS,
        padding: '12px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>ID</div>
      <div>Cedente</div>
      <div>Tipo</div>
      <div>Veículo</div>
      <div style="text-align: right">Valor</div>
      <div>Etapa</div>
      <div>SLA da Etapa</div>
    </div>

    <!-- Rows -->
    <div
      v-if="solicitacoes.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      Nenhuma solicitação encontrada.
    </div>
    <template v-else>
      <div
        v-for="s in pageItems"
        :key="s.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: hoveredId === s.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @click="emit('open', s.id)"
        @mouseenter="hoveredId = s.id"
        @mouseleave="hoveredId = null"
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ s.id }}
        </div>
        <div class="flex items-center" style="gap: 8px; min-width: 0">
          <span
            class="flex items-center justify-center"
            :style="{ flexShrink: 0, color: s.validacao === 'VALIDO' ? 'var(--success-base)' : 'var(--danger-base)' }"
            :title="s.validacao === 'VALIDO' ? 'Válido' : 'Inválido'"
          >
            <CheckCircle2 v-if="s.validacao === 'VALIDO'" :size="15" :stroke-width="2.25" />
            <XCircle v-else :size="15" :stroke-width="2.25" />
          </span>
          <span
            style="
              font-weight: var(--weight-semibold);
              color: var(--text-strong);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ s.cedente }}
          </span>
        </div>
        <div style="color: var(--text-default)">{{ s.tipoContrato }}</div>
        <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
          {{ s.veiculo }}
        </div>
        <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(s.valor) }}
        </div>
        <div>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              width: 'fit-content',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.06em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${etapaCor(s.etapa)} 14%, transparent)`,
              color: etapaCor(s.etapa),
              whiteSpace: 'nowrap',
            }"
          >
            <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: etapaCor(s.etapa) }" />
            {{ etapaLabel(s.etapa) }}
          </span>
        </div>
        <div class="flex items-center" style="gap: 8px">
          <div
            :style="{
              flex: 1,
              height: '5px',
              background: slaRatio(s) > 1 ? 'var(--danger-light)' : 'var(--success-light)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }"
          >
            <div
              :style="{
                height: '100%',
                width: `${Math.min(Math.max(slaRatio(s), 0), 1) * 100}%`,
                background: slaRatio(s) > 1 ? 'var(--danger-base)' : 'var(--success-base)',
                borderRadius: '9999px',
              }"
            />
          </div>
          <span
            :style="{
              fontSize: '10px',
              color: slaRatio(s) > 1 ? 'var(--danger-base)' : 'var(--text-muted)',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              fontWeight: slaRatio(s) > 1 ? 'var(--weight-bold)' : 'var(--weight-regular)',
            }"
          >
            {{ fmtDuracao(s.tempoEtapaHoras) }} / {{ fmtDuracao(s.slaEtapaHoras) }}
          </span>
        </div>
      </div>
      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </template>
  </div>
</template>
