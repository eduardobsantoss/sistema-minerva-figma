<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type Titulo } from '../../data/titulosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: Titulo }>();

type MovSub = 'registro' | 'cessao';
const sub = ref<MovSub>('registro');

const registroRows = computed(() => [
  { data: props.titulo.emissao, operacao: 'Inclusão', registradora: 'B3', protocolo: '#' + props.titulo.lastro, valor: brl(props.titulo.vrNominal) },
  ...(props.titulo.boletoGeradoEm
    ? [{ data: props.titulo.boletoGeradoEm, operacao: 'Boleto gerado', registradora: '—', protocolo: '—', valor: brl(props.titulo.vrAberto) }]
    : []),
]);

const cessaoRows = computed(() => [
  { data: props.titulo.emissao, cedente: props.titulo.cedente, cessionario: props.titulo.veiculoNome, valor: brl(props.titulo.vrNominal) },
]);

const {
  page: registroPage,
  pageSize: registroPageSize,
  total: registroTotal,
  pageItems: registroPageItems,
  setPage: setRegistroPage,
  setPageSize: setRegistroPageSize,
} = useTablePagination(() => registroRows.value, { defaultPageSize: 5 });

const {
  page: cessaoPage,
  pageSize: cessaoPageSize,
  total: cessaoTotal,
  pageItems: cessaoPageItems,
  setPage: setCessaoPage,
  setPageSize: setCessaoPageSize,
} = useTablePagination(() => cessaoRows.value, { defaultPageSize: 5 });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start">
      <button
        v-for="s in (['registro', 'cessao'] as MovSub[])"
        :key="s"
        :style="{
          padding: '8px 16px',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          background: sub === s ? 'var(--surface-card)' : 'transparent',
          color: sub === s ? 'var(--text-strong)' : 'var(--text-muted)',
          boxShadow: sub === s ? 'var(--shadow-xs)' : 'none',
          transition: 'all var(--duration-base)',
        }"
        @click="sub = s"
      >
        {{ s === 'registro' ? 'MOVIMENTAÇÕES DE REGISTRO' : 'MOVIMENTO DE CESSÃO' }}
      </button>
    </div>

    <Section v-if="sub === 'registro'" title="Movimentações de Registro">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Operação</div><div>Registradora</div><div>Protocolo</div><div style="text-align: right">Valor</div>
        </div>
        <div
          v-for="(r, i) in registroPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.operacao }}</div>
          <div style="color: var(--text-default)">{{ r.registradora }}</div>
          <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.protocolo }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right; font-variant-numeric: tabular-nums">{{ r.valor }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="registroTotal"
          :page="registroPage"
          :page-size="registroPageSize"
          @update:page="setRegistroPage"
          @update:page-size="setRegistroPageSize"
        />
      </div>
    </Section>

    <Section v-if="sub === 'cessao'" title="Movimento de Cessão">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Cedente</div><div>Cessionário</div><div>Valor</div><div style="text-align: right">Status</div>
        </div>
        <div
          v-for="(r, i) in cessaoPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cessionario }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ r.valor }}</div>
          <div style="text-align: right">
            <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 8px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">LIQUIDADO</span>
          </div>
        </div>
        <TablePagination
          sunken
          compact
          :total="cessaoTotal"
          :page="cessaoPage"
          :page-size="cessaoPageSize"
          @update:page="setCessaoPage"
          @update:page-size="setCessaoPageSize"
        />
      </div>
    </Section>
  </div>
</template>
