<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Plus, Boxes, Search, Link2, Download, MoreVertical, Trash2, CalendarClock, CheckCircle2 } from 'lucide-vue-next';
import { brl, detalheSolicitacao, type ContratoAtivo } from '../../data/operacaoData';
import { Section, EmptyState, GhostButton } from './shared';
import AtivosTable from './ativos/AtivosTable.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
}>();

const emit = defineEmits<{
  addContrato: [];
  openAtivo: [ativo: ContratoAtivo];
  vincular: [];
  exportar: [];
  remover: [ids: string[]];
  prorrogar: [ids: string[]];
  confirmar: [ids: string[]];
}>();

const filtroLastro = ref('');
const filtroNumero = ref('');
const filtroSacado = ref('');
const selectedIds = ref<Set<string>>(new Set());
const menuOpen = ref(false);
const menuRef = ref<HTMLDivElement | null>(null);

const ativosFiltrados = computed(() => {
  const l = filtroLastro.value.trim().toLowerCase();
  const n = filtroNumero.value.trim().toLowerCase();
  const s = filtroSacado.value.trim().toLowerCase();
  return props.det.ativos.filter((a) => {
    if (l && !a.lastro.toLowerCase().includes(l)) return false;
    if (n && !a.numero.toLowerCase().includes(n)) return false;
    if (s && !a.sacadoNome.toLowerCase().includes(s)) return false;
    return true;
  });
});

const total = computed(() => props.det.ativos.reduce((acc, a) => acc + a.valorTotal, 0));
const totalSelecionado = computed(() =>
  props.det.ativos.filter((a) => selectedIds.value.has(a.id)).reduce((acc, a) => acc + a.valorTotal, 0),
);
const hasSelection = computed(() => selectedIds.value.size > 0);

const menuActions = [
  { key: 'remover', label: 'Remover', icon: Trash2, danger: true },
  { key: 'prorrogar', label: 'Prorrogar Vencimento', icon: CalendarClock },
  { key: 'confirmar', label: 'Confirmar', icon: CheckCircle2 },
] as const;

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleAll() {
  const all = ativosFiltrados.value.every((a) => selectedIds.value.has(a.id));
  const next = new Set(selectedIds.value);
  for (const a of ativosFiltrados.value) {
    if (all) next.delete(a.id);
    else next.add(a.id);
  }
  selectedIds.value = next;
}

function handleMenuAction(key: (typeof menuActions)[number]['key']) {
  menuOpen.value = false;
  const ids = [...selectedIds.value];
  if (key === 'remover') emit('remover', ids);
  else if (key === 'prorrogar') emit('prorrogar', ids);
  else if (key === 'confirmar') emit('confirmar', ids);
}

function handleDocClick(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) menuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleDocClick));
onUnmounted(() => document.removeEventListener('mousedown', handleDocClick));
</script>

<template>
  <Section title="Ativos Vinculados">
    <template #action>
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <GhostButton :icon="Link2" @click="emit('vincular')">Vincular Ativos</GhostButton>
        <GhostButton :icon="Plus" @click="emit('addContrato')">Adicionar Contrato</GhostButton>
        <GhostButton :icon="Download" @click="emit('exportar')">Exportar</GhostButton>
        <div ref="menuRef" style="position: relative">
          <button
            aria-label="Mais ações"
            class="flex items-center justify-center"
            style="
              width: 40px;
              height: 40px;
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-strong);
            "
            @click="menuOpen = !menuOpen"
          >
            <MoreVertical :size="18" />
          </button>
          <div
            v-if="menuOpen"
            class="flex flex-col"
            style="
              position: absolute;
              top: 46px;
              right: 0;
              z-index: 50;
              min-width: 220px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
              padding: 6px;
            "
          >
            <button
              v-for="a in menuActions"
              :key="a.key"
              :disabled="!hasSelection"
              class="flex items-center menu-item"
              :class="{ danger: a.danger }"
              style="
                gap: 10px;
                padding: 10px 12px;
                background: none;
                border: none;
                cursor: pointer;
                border-radius: var(--radius-md);
                text-align: left;
                font-size: var(--text-sm);
                font-weight: var(--weight-semibold);
                color: var(--text-default);
                width: 100%;
              "
              @click="handleMenuAction(a.key)"
            >
              <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
              {{ a.label }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="flex items-center" style="gap: 12px; margin-bottom: 16px; flex-wrap: wrap">
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroLastro" placeholder="Lastro" class="filter-input" />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroNumero" placeholder="Número" class="filter-input" />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroSacado" placeholder="Sacado" class="filter-input" />
      </div>
    </div>

    <EmptyState
      v-if="det.ativos.length === 0"
      :icon="Boxes"
      title="Nenhum ativo vinculado"
      hint="Use “Vincular Ativos” ou “Adicionar Contrato” para vincular lastros a esta solicitação."
    />
    <AtivosTable
      v-else
      :ativos="ativosFiltrados"
      :selected-ids="selectedIds"
      @toggle="toggle"
      @toggle-all="toggleAll"
      @open-ativo="emit('openAtivo', $event)"
    />

    <div
      class="flex items-center justify-between"
      style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 12px"
    >
      <div class="flex items-center" style="gap: 24px; flex-wrap: wrap">
        <div>
          <span style="font-size: var(--text-xs); color: var(--text-muted); display: block">Valor total</span>
          <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(total) }}
          </span>
        </div>
        <div v-if="hasSelection">
          <span style="font-size: var(--text-xs); color: var(--text-muted); display: block">Valor total dos selecionados</span>
          <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--accent); font-variant-numeric: tabular-nums">
            {{ brl(totalSelecionado) }}
          </span>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.filter-input {
  width: 100%;
  height: 40px;
  padding-left: 36px;
  padding-right: 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.menu-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
.menu-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.menu-item.danger:not(:disabled) {
  color: var(--action-danger-text-only);
}
</style>
