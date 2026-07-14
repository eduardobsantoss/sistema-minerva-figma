<script setup lang="ts">
import { Check, Plus, X } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { ToggleRow, AddButton } from '../adicionar-contrato';
import Checkbox from '@/components/ui/Checkbox.vue';
import type { AvalistaMinutaRow } from '../../../data/minutaData';

const props = defineProps<{
  possuiAvalistas: boolean;
  rows: AvalistaMinutaRow[];
}>();
const emit = defineEmits<{
  togglePossui: [];
  toggleAssinatura: [i: number];
  toggleConjuge: [i: number];
  addAvalista: [];
}>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 10 },
);

function globalIndex(pageIdx: number) {
  return (page.value - 1) * pageSize.value + pageIdx;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 240px">
        <ToggleRow label="Possui avalistas" :on="possuiAvalistas" @toggle="emit('togglePossui')" />
      </div>
      <AddButton v-if="possuiAvalistas" @click="emit('addAvalista')">
        <Plus :size="14" /> Adicionar novo avalista
      </AddButton>
    </div>

    <template v-if="possuiAvalistas">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: 40px 1.4fr 1fr 0.9fr 1.4fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div />
          <div>Nome</div>
          <div>Documento</div>
          <div>Possui cônjuge</div>
          <div>Cônjuge é interveniente anuente</div>
        </div>
        <div
          v-for="(r, pageIdx) in pageItems"
          :key="r.documento"
          class="grid items-center"
          style="
            grid-template-columns: 40px 1.4fr 1fr 0.9fr 1.4fr;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <Checkbox :checked="r.selecionadoAssinatura" @change="emit('toggleAssinatura', globalIndex(pageIdx))" />
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ r.documento }}</div>
          <div class="flex items-center" style="color: r.possuiConjuge ? 'var(--success-base)' : 'var(--danger-base)'">
            <Check v-if="r.possuiConjuge" :size="16" style="color: var(--success-base)" />
            <X v-else :size="16" style="color: var(--danger-base)" />
          </div>
          <div>
            <Checkbox
              :checked="r.conjugeInterveniente"
              :disabled="!r.possuiConjuge"
              @change="r.possuiConjuge && emit('toggleConjuge', globalIndex(pageIdx))"
            />
          </div>
        </div>
        <div
          v-if="rows.length === 0"
          style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
        >
          Nenhum avalista cadastrado nesta solicitação.
        </div>
        <TablePagination
          v-if="rows.length > 0"
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </template>
  </div>
</template>
