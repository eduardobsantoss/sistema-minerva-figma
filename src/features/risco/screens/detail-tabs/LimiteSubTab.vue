<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { AlertTriangle, Layers, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { brl, type ParametrizacaoLimite, type LimiteProdutoRow } from '../../data/riscoData';
import { TabCard } from './shared';
import IncluirLimiteModal from '../../components/modals/IncluirLimiteModal.vue';
import EditarLimiteModal from '../../components/modals/EditarLimiteModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  data: ParametrizacaoLimite;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoLimite] }>();
const form = reactive<ParametrizacaoLimite>({ ...props.data, limites: [...props.data.limites] });
const modalOpen = ref(false);
const editingLimite = ref<LimiteProdutoRow | null>(null);
const openMenuId = ref<string | null>(null);

const LIMITE_TABLE_GRID = 'minmax(140px, 2fr) minmax(88px, 1fr) minmax(100px, 1.1fr) 40px';

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => form.limites,
  { defaultPageSize: 5 },
);

const limitesAgrupadosPage = computed(() => {
  const map = new Map<string, LimiteProdutoRow[]>();
  for (const l of pageItems.value) {
    const arr = map.get(l.agrupamento) ?? [];
    arr.push(l);
    map.set(l.agrupamento, arr);
  }
  return [...map.entries()];
});

function handleIncluirLimites(novos: LimiteProdutoRow[]) {
  form.limites = [...form.limites, ...novos];
  modalOpen.value = false;
  emit('save', { ...form, limites: [...form.limites] });
}

function removeLimite(id: string) {
  form.limites = form.limites.filter((l) => l.id !== id);
  openMenuId.value = null;
  emit('save', { ...form, limites: [...form.limites] });
}

function openEditModal(row: LimiteProdutoRow) {
  editingLimite.value = row;
  openMenuId.value = null;
}

function handleEditConfirm(valor: number, vencimento: string) {
  if (!editingLimite.value) return;
  form.limites = form.limites.map((l) =>
    l.id === editingLimite.value!.id ? { ...l, valor, vencimento } : l,
  );
  editingLimite.value = null;
  emit('save', { ...form, limites: [...form.limites] });
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-limite-action-menu]')) {
    openMenuId.value = null;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div v-if="form.reparametrizacaoData" class="flex items-center" style="gap: 12px; padding: 14px 18px; border-radius: var(--radius-lg); background: var(--status-warning-bg); border: 1px solid var(--warning-base)">
      <AlertTriangle :size="18" style="color: var(--warning-dark); flex-shrink: 0" />
      <span style="font-size: var(--text-sm); color: var(--warning-dark); font-weight: var(--weight-semibold)">
        Este grupo possui reparametrização de limite agendada para {{ form.reparametrizacaoData }}.
      </span>
    </div>

    <TabCard title="Limites por Agrupamento" :icon="Layers">
      <div class="flex justify-end" style="margin-bottom: 14px">
        <button
          class="flex items-center"
          style="gap: 6px; height: 36px; padding: 0 16px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
          @click="modalOpen = true"
        >
          <Plus :size="14" /> INCLUIR LIMITE
        </button>
      </div>

      <div v-if="form.limites.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)">
        Nenhum limite cadastrado. Clique em "Incluir Limite" para adicionar.
      </div>

      <div
        v-for="[agrupamento, rows] in limitesAgrupadosPage"
        :key="agrupamento"
        class="limite-agrupamento"
        :class="{ 'limite-agrupamento--menu-open': rows.some((r) => r.id === openMenuId) }"
      >
        <div class="limite-agrupamento-header">
          {{ agrupamento }}
        </div>
        <div class="grid items-center limite-table-row limite-table-header" :style="{ gridTemplateColumns: LIMITE_TABLE_GRID }">
          <div>Produto</div><div class="limite-col-num">Limite</div><div class="limite-col-date">Vencimento</div><div />
        </div>
        <div
          v-for="row in rows"
          :key="row.id"
          class="grid items-center limite-table-row"
          :class="{ 'limite-table-row--menu-open': openMenuId === row.id }"
          :style="{ gridTemplateColumns: LIMITE_TABLE_GRID }"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.produto }}</div>
          <div class="limite-col-num">{{ brl(row.valor, { compact: true }) }}</div>
          <div class="limite-col-date">{{ row.vencimento }}</div>
          <div class="flex justify-end" style="position: relative" data-limite-action-menu>
            <button
              aria-label="Ações"
              class="flex items-center justify-center"
              style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
              @click="toggleMenu(row.id)"
            >
              <MoreVertical :size="14" />
            </button>
            <div
              v-if="openMenuId === row.id"
              class="flex flex-col limite-action-menu"
            >
              <button
                class="flex items-center limite-action-item"
                style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                @click="openEditModal(row)"
              >
                <Pencil :size="14" style="color: var(--text-muted)" />
                Editar
              </button>
              <button
                class="flex items-center limite-action-item"
                style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
                @click="removeLimite(row.id)"
              >
                <Trash2 :size="14" />
                Deletar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="form.limites.length > 0"
        style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-top: 4px"
      >
        <TablePagination
          sunken
          compact
          :total="total"
          :page="page"
          :page-size="pageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </TabCard>

    <IncluirLimiteModal v-if="modalOpen" @close="modalOpen = false" @confirm="handleIncluirLimites" />
    <EditarLimiteModal
      v-if="editingLimite"
      :agrupamento="editingLimite.agrupamento"
      :produto="editingLimite.produto"
      :valor="editingLimite.valor"
      :vencimento="editingLimite.vencimento"
      @close="editingLimite = null"
      @confirm="handleEditConfirm"
    />
  </div>
</template>

<style scoped>
.limite-agrupamento {
  position: relative;
  z-index: 1;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  margin-bottom: 12px;
  /* overflow visible: menu de ações precisa sair da linha sem ser cortado */
  overflow: visible;
  background: var(--surface-card);
}

.limite-agrupamento--menu-open {
  z-index: 40;
}

.limite-agrupamento-header {
  padding: 12px 16px;
  background: var(--surface-sunken);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.limite-table-row {
  column-gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  position: relative;
}

.limite-table-row--menu-open {
  z-index: 41;
}

.limite-table-header {
  padding: 10px 16px;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.limite-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.limite-col-date {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}

.limite-action-menu {
  position: absolute;
  top: 28px;
  right: 0;
  z-index: 50;
  min-width: 140px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 6px;
}

.limite-action-item:hover {
  background: var(--surface-sunken);
}
</style>
