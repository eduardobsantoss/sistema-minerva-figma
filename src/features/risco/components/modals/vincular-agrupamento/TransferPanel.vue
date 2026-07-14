<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import type { EntidadeVinculo, OperacaoVinculavel, TipoOperacaoVinculo, VinculoLinkKey } from '../../../data/riscoData';
import OperationRow from './OperationRow.vue';
import { FILTRO_OPTS } from './constants';

export type FiltroTipo = 'TODOS' | TipoOperacaoVinculo;

defineProps<{
  title: string;
  search: string;
  filter: FiltroTipo;
  items: OperacaoVinculavel[];
  entidades: EntidadeVinculo[];
  entityLabel: string;
  linkKey: VinculoLinkKey;
  selected: Set<string>;
}>();

const emit = defineEmits<{
  'update:search': [v: string];
  'update:filter': [v: FiltroTipo];
  'toggle-item': [id: string];
}>();
</script>

<template>
  <div class="flex flex-col" style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; min-height: 0">
    <div style="padding: 12px 14px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 10px">
        {{ title }}
      </div>
      <div class="relative" style="margin-bottom: 10px">
        <Search :size="14" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          :value="search"
          placeholder="Buscar CRA ou FIDC pelo nome"
          style="width: 100%; height: 34px; padding-left: 32px; padding-right: 10px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs); color: var(--text-strong)"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex items-center" style="gap: 6px">
        <button
          v-for="f in FILTRO_OPTS"
          :key="f.key"
          :style="{
            padding: '4px 10px', borderRadius: '9999px', cursor: 'pointer',
            fontSize: '10px', fontWeight: 'var(--weight-bold)',
            border: `1px solid ${filter === f.key ? 'var(--gci-base)' : 'var(--border-default)'}`,
            background: filter === f.key ? 'var(--surface-selected)' : 'var(--surface-card)',
            color: filter === f.key ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast)',
          }"
          @click="emit('update:filter', f.key)"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div style="overflow-y: auto; max-height: 340px; min-height: 340px">
      <div v-if="items.length === 0" style="padding: 32px 16px; text-align: center; font-size: var(--text-xs); color: var(--text-muted)">
        Nenhuma operação encontrada.
      </div>
      <OperationRow
        v-for="op in items"
        :key="op.id"
        :op="op"
        :entidades="entidades"
        :entity-label="entityLabel"
        :link-key="linkKey"
        :checked="selected.has(op.id)"
        @toggle="emit('toggle-item', op.id)"
      />
    </div>
  </div>
</template>
