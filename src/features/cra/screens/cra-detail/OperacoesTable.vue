<script setup lang="ts">
import { brl, num, type CraOperacao } from '../../data/craData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ rows: CraOperacao[] }>();
const emit = defineEmits<{ open: [id: string] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const cols = '2.4fr 0.8fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr';
</script>

<template>
  <div v-if="!rows.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    Nenhuma operação cadastrada para este CRA.
  </div>
  <div v-else>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: cols,
        padding: '14px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>Nome da Operação</div>
      <div>Status</div>
      <div>Tipo</div>
      <div>VR. Emissão</div>
      <div>VR. Carteira</div>
      <div>VR. Vencido</div>
      <div style="text-align: right">Títulos</div>
    </div>
    <div
      v-for="r in pageItems"
      :key="r.id"
      class="cra-op-row grid items-center"
      :style="{
        gridTemplateColumns: cols,
        padding: '18px 20px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
        borderLeft: '3px solid var(--gci-base)',
      }"
      @click="emit('open', r.id)"
    >
      <div class="flex items-center" style="gap: 12px">
        <div
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: var(--text-xs); font-weight: var(--weight-bold)"
        >
          {{ r.numeroEmissao }}
        </div>
        <div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-size: var(--text-sm)">
            {{ r.nome }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ r.cessionaria }}
          </div>
        </div>
      </div>
      <div>
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 5px 10px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">
          {{ r.status }}
        </span>
      </div>
      <div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            background: r.tipo === 'MONO CRA' ? 'var(--agro-light)' : 'var(--gci-light)',
            color: r.tipo === 'MONO CRA' ? 'var(--agro-base)' : 'var(--gci-base)',
          }"
        >
          {{ r.tipo }}
        </span>
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(r.valorEmissao) }}</div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(r.carteira.valor) }}</div>
      <div style="font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums">{{ brl(r.vencido.valor) }}</div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right; font-variant-numeric: tabular-nums">{{ num(r.carteira.titulos) }}</div>
    </div>

    <TablePagination
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="setPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>

<style scoped>
.cra-op-row:hover {
  background: var(--surface-sunken);
}
</style>
