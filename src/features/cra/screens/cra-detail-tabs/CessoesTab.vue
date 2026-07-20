<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Download, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  CESSAO_TIPOS,
  ROUND_STATUSES,
  type Cessao,
  type RoundStatus,
} from '../../data/craData';

const props = defineProps<{ cessoes: Cessao[] }>();
const emit = defineEmits<{
  create: [];
  edit: [Cessao];
  delete: [id: string];
}>();

const filterNome = ref('');
const filterData = ref('');
const filterStatus = ref('');
const filterTipo = ref('');
const filterCedente = ref('');

const openMenuId = ref<string | null>(null);

const filtered = computed(() =>
  props.cessoes.filter((c) => {
    if (filterNome.value && !c.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterData.value && c.data !== filterData.value) return false;
    if (filterStatus.value && c.status !== filterStatus.value) return false;
    if (filterTipo.value && c.tipo !== filterTipo.value) return false;
    if (filterCedente.value && !(c.cedente ?? '').toLowerCase().includes(filterCedente.value.toLowerCase())) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS =
  '1.4fr 0.9fr 1.1fr 0.9fr 0.85fr 0.75fr 0.9fr 0.9fr 0.45fr 0.55fr';

const filterInputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

function statusStyle(s: RoundStatus) {
  const map: Record<RoundStatus, { bg: string; fg: string }> = {
    ABERTA: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    FECHADA: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
    CANCELADA: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
    'EM ANDAMENTO': { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  };
  return map[s];
}

function toggleMenu(id: string, e: Event) {
  e.stopPropagation();
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function onEdit(c: Cessao) {
  closeMenu();
  emit('edit', c);
}

function onDelete(id: string) {
  closeMenu();
  emit('delete', id);
}
</script>

<template>
  <div @click="closeMenu">
    <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="flex: 1; min-width: 200px">
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
          Cessões
        </div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
          {{ cessoes.length }} cessões cadastradas
        </div>
      </div>
      <button
        type="button"
        class="flex items-center btn-animated btn-agro"
        style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
        @click="emit('create')"
      >
        <Plus :size="14" /> NOVA CESSÃO
      </button>
    </div>

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="filterNome" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Data</div>
        <input v-model="filterData" type="date" :style="filterInputStyle" @change="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status</div>
        <select v-model="filterStatus" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option v-for="s in ROUND_STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo de desembolso</div>
        <select v-model="filterTipo" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option v-for="t in CESSAO_TIPOS" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Cedente</div>
        <input v-model="filterCedente" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
    </div>

    <div v-if="!filtered.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhuma cessão encontrada.
    </div>
    <div v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Nome</div>
        <div>Data do termo</div>
        <div>Tipo</div>
        <div>Valor Aberto</div>
        <div>Status</div>
        <div>Taxa (%)</div>
        <div>Valor Presente</div>
        <div>Valor Total</div>
        <div>Termo</div>
        <div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="r in pageItems"
        :key="r.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
        <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.data }}</div>
        <div>
          <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 4px 6px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            {{ r.tipo }}
          </span>
        </div>
        <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(r.valorAberto) }}</div>
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: statusStyle(r.status).bg,
              color: statusStyle(r.status).fg,
            }"
          >
            {{ r.status }}
          </span>
        </div>
        <div style="font-variant-numeric: tabular-nums">{{ r.taxaCessao != null ? `${r.taxaCessao}%` : '—' }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ r.valorPresente != null ? brl(r.valorPresente) : '—' }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ r.valorTotal != null ? brl(r.valorTotal) : '—' }}</div>
        <div>
          <Download v-if="r.temTermo" :size="18" style="color: var(--gci-base); cursor: pointer" aria-label="Baixar termo" />
          <span v-else style="color: var(--text-muted)">—</span>
        </div>
        <div style="text-align: right; position: relative">
          <button
            type="button"
            aria-label="Ações"
            class="flex items-center justify-center"
            style="width: 36px; height: 36px; margin-left: auto; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click="toggleMenu(r.id, $event)"
          >
            <MoreVertical :size="16" />
          </button>
          <div
            v-if="openMenuId === r.id"
            class="flex flex-col"
            style="position: absolute; top: 40px; right: 0; z-index: 40; min-width: 160px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
            @click.stop
          >
            <button
              type="button"
              class="flex items-center"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left"
              @click="onEdit(r)"
            >
              <Pencil :size="14" /> Editar
            </button>
            <button
              type="button"
              class="flex items-center"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--danger-base); width: 100%; text-align: left"
              @click="onDelete(r.id)"
            >
              <Trash2 :size="14" /> Excluir
            </button>
          </div>
        </div>
      </div>
      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>
