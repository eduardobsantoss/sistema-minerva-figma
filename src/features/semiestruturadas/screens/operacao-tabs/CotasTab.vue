<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { MoreVertical, Split } from 'lucide-vue-next';
import { brl, pct, num, type SemiCota } from '../../data/semiestruturadasData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ rows: SemiCota[] }>();
const emit = defineEmits<{ open: [cotaId: string]; distribuir: [cotaId: string] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const cols = 'minmax(180px, 1.8fr) minmax(110px, 0.9fr) minmax(110px, 0.9fr) minmax(140px, 1.1fr) minmax(140px, 1.1fr) 64px';
const rowHover = ref<string | null>(null);

// O menu é renderizado em um Teleport (position: fixed) para não ser cortado
// pelo overflow: hidden do card da tabela.
const MENU_WIDTH = 180;
const MENU_HEIGHT = 56;
const menu = ref<{ cotaId: string; top: number; left: number } | null>(null);

function toggleMenu(e: MouseEvent, cotaId: string) {
  if (menu.value?.cotaId === cotaId) {
    menu.value = null;
    return;
  }
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const cabeAbaixo = rect.bottom + 6 + MENU_HEIGHT < window.innerHeight;
  menu.value = {
    cotaId,
    top: cabeAbaixo ? rect.bottom + 6 : rect.top - 6 - MENU_HEIGHT,
    left: Math.max(8, rect.right - MENU_WIDTH),
  };
}

function pick() {
  const id = menu.value?.cotaId;
  menu.value = null;
  if (id) emit('distribuir', id);
}

function handleDocMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement | null;
  if (target?.closest('[data-cota-menu]')) return;
  menu.value = null;
}
function closeMenu() {
  menu.value = null;
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocMouseDown);
  window.addEventListener('scroll', closeMenu, true);
  window.addEventListener('resize', closeMenu);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleDocMouseDown);
  window.removeEventListener('scroll', closeMenu, true);
  window.removeEventListener('resize', closeMenu);
});
</script>

<template>
  <div>
    <div
      v-if="!rows.length"
      style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
    >
      Nenhuma cota cadastrada.
    </div>

    <template v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          columnGap: '20px',
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Veículo Adquirente</div>
        <div style="text-align: right">% Adquirido</div>
        <div style="text-align: right">Qtd. Cotas</div>
        <div style="text-align: right">Valor Unitário</div>
        <div style="text-align: right">Valor Total</div>
        <div style="text-align: right">Ações</div>
      </div>

      <div
        v-for="c in pageItems"
        :key="c.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: cols,
          columnGap: '20px',
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: rowHover === c.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @click="emit('open', c.id)"
        @mouseenter="rowHover = c.id"
        @mouseleave="rowHover = null"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ c.veiculoAdquirente }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-strong); white-space: nowrap">
          {{ pct(c.percentualAdquirido) }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default); white-space: nowrap">
          {{ num(c.quantidadeCotas) }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">
          {{ brl(c.valorUnitario) }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">
          {{ brl(c.valorTotal) }}
        </div>
        <div style="text-align: right">
          <button
            type="button"
            aria-label="Ações"
            data-cota-menu
            class="flex items-center justify-center"
            style="width: 36px; height: 36px; margin-left: auto; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click.stop="toggleMenu($event, c.id)"
          >
            <MoreVertical :size="16" />
          </button>
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

    <Teleport to="body">
      <div
        v-if="menu"
        data-cota-menu
        class="flex flex-col"
        :style="{
          position: 'fixed',
          top: menu.top + 'px',
          left: menu.left + 'px',
          width: MENU_WIDTH + 'px',
          zIndex: 400,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          padding: '6px',
        }"
      >
        <button
          type="button"
          class="flex items-center cota-menu-item"
          style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
          @click="pick"
        >
          <Split :size="14" />
          Distribuir cotas
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.cota-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
