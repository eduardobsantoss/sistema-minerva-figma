<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Search,
  Plus,
  BellRing,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  Smartphone,
  Building2,
  Pencil,
  PowerOff,
  Power,
  MoreVertical,
  Trash2,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Notificacao, Metodo } from '../data/cobrancaData';
import CobrancaCard from '../components/CobrancaCard.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ notificacoes: Notificacao[] }>();
const emit = defineEmits<{
  new: [];
  edit: [id: string];
  toggleStatus: [id: string];
  delete: [id: string];
}>();

type ViewMode = 'cards' | 'list';

const METODOS: Metodo[] = ['Email', 'WhatsApp', 'SMS'];
const METODO_ICONS: Record<Metodo, Component> = {
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: Smartphone,
};

const q = ref('');
const focusSearch = ref(false);
const viewMode = ref<ViewMode>('cards');
const openRowMenu = ref<string | null>(null);
const rowHover = ref<string | null>(null);

const VIEW_MODE_OPTIONS = [
  { key: 'cards' as const, label: 'Visualização em Cards', icon: LayoutGrid },
  { key: 'list' as const, label: 'Visualização em Lista', icon: List },
];

const filtered = computed(() =>
  props.notificacoes.filter((n) => !q.value || n.nome.toLowerCase().includes(q.value.toLowerCase())),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });

const kpis = computed(() => [
  {
    label: 'Total de Réguas',
    value: String(props.notificacoes.length),
    icon: BellRing,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Réguas Ativas',
    value: String(props.notificacoes.filter((n) => n.status === 'Ativa').length),
    icon: BellRing,
    tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  },
  {
    label: 'Total de Veículos',
    value: String(new Set(props.notificacoes.flatMap((n) => n.veiculos)).size),
    icon: Building2,
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
  {
    label: 'Réguas Inativas',
    value: String(props.notificacoes.filter((n) => n.status === 'Inativa').length),
    icon: BellRing,
    tone: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
  },
]);

function toggleRowMenu(id: string) {
  openRowMenu.value = openRowMenu.value === id ? null : id;
}

function handleEdit(id: string) {
  openRowMenu.value = null;
  emit('edit', id);
}

function handleToggleStatus(id: string) {
  openRowMenu.value = null;
  emit('toggleStatus', id);
}

function handleDelete(id: string) {
  openRowMenu.value = null;
  emit('delete', id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Search + actions bar -->
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focusSearch ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focusSearch ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search :size="18" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Pesquisar régua de notificação..."
          style="
            width: 100%;
            height: 56px;
            border: none;
            outline: none;
            background: transparent;
            padding-left: 52px;
            padding-right: 160px;
            font-size: var(--text-base);
            color: var(--text-strong);
            border-radius: var(--radius-xl);
          "
          @focus="focusSearch = true"
          @blur="focusSearch = false"
          @input="setPage(1)"
        />
        <button
          style="
            position: absolute;
            right: 8px;
            top: 8px;
            bottom: 8px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
          "
        >
          PESQUISAR
        </button>
      </div>

      <SegmentedToggle
        :model-value="viewMode"
        :options="VIEW_MODE_OPTIONS"
        variant="brand"
        icon-only
        @update:model-value="viewMode = $event as ViewMode"
      />

      <button
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 56px;
          padding: 0 24px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-xl);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.10em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
          white-space: nowrap;
        "
        @click="emit('new')"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVA NOTIFICAÇÃO
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); padding: 20px"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="viewMode === 'cards'" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CobrancaCard
        v-for="n in filtered"
        :key="n.id"
        :notificacao="n"
        @edit="emit('edit', $event)"
        @toggle-status="emit('toggleStatus', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
    <div v-else style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <!-- Table header -->
      <div class="grid" style="grid-template-columns: 2fr 1.4fr 120px 120px 100px 100px 56px; padding: 10px 20px; background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <div
          v-for="col in ['Nome', 'Métodos', 'A Vencer', 'Vencidos', 'Veículos', 'Status', '']"
          :key="col"
          style="font-size: 9px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted)"
        >
          {{ col }}
        </div>
      </div>

      <!-- Rows -->
      <div
        v-for="(n, idx) in pageItems"
        :key="n.id"
        class="grid"
        :style="{
          gridTemplateColumns: '2fr 1.4fr 120px 120px 100px 100px 56px',
          padding: '14px 20px',
          alignItems: 'center',
          borderBottom: idx < pageItems.length - 1 ? '1px solid var(--border-default)' : 'none',
          transition: 'background var(--duration-fast)',
          background: rowHover === n.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @mouseenter="rowHover = n.id"
        @mouseleave="rowHover = null"
      >
        <!-- Nome -->
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 12px">
          {{ n.nome }}
        </div>

        <!-- Métodos -->
        <div class="flex flex-wrap" style="gap: 4px">
          <span
            v-for="m in METODOS"
            :key="m"
            :title="m"
            :style="{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              background: n.metodos.includes(m) ? 'var(--status-active-bg)' : 'var(--status-neutral-bg)',
              color: n.metodos.includes(m) ? 'var(--status-active-text)' : 'var(--neutral-300)',
            }"
          >
            <component :is="METODO_ICONS[m]" :size="12" :stroke-width="2.5" />
          </span>
        </div>

        <!-- A Vencer -->
        <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ n.intervalosAVencer.length }} intervalos
        </div>

        <!-- Vencidos -->
        <div style="font-size: var(--text-sm); color: var(--danger-base); font-variant-numeric: tabular-nums">
          {{ n.intervalosVencidos.length }} intervalos
        </div>

        <!-- Veículos -->
        <div class="flex items-center" style="gap: 4px; font-size: var(--text-sm); color: var(--text-default)">
          <Building2 :size="12" style="color: var(--text-muted)" />
          {{ n.veiculos.length }}
        </div>

        <!-- Status -->
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: n.status === 'Ativa' ? 'var(--status-success-bg)' : 'var(--status-neutral-bg)',
              color: n.status === 'Ativa' ? 'var(--status-success-text)' : 'var(--status-neutral-text)',
            }"
          >
            {{ n.status }}
          </span>
        </div>

        <!-- Actions -->
        <div style="position: relative">
          <button
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: openRowMenu === n.id ? 'var(--surface-sunken)' : 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
            @click.stop="toggleRowMenu(n.id)"
          >
            <MoreVertical :size="15" />
          </button>
          <div
            v-if="openRowMenu === n.id"
            style="
              position: absolute;
              top: 36px;
              right: 0;
              background: var(--surface-card);
              border-width: 1px;
              border-style: solid;
              border-color: var(--border-default);
              border-radius: var(--radius-lg);
              box-shadow: var(--shadow-md);
              z-index: 20;
              overflow: hidden;
              min-width: 160px;
            "
          >
            <button
              class="cobranca-row-menu-item flex items-center"
              style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left"
              @click="handleEdit(n.id)"
            >
              <Pencil :size="14" /> Editar
            </button>
            <button
              class="cobranca-row-menu-item flex items-center"
              :style="{
                gap: '10px', width: '100%', padding: '10px 14px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                color: n.status === 'Ativa' ? 'var(--text-default)' : 'var(--success-dark)',
                textAlign: 'left',
              }"
              @click="handleToggleStatus(n.id)"
            >
              <PowerOff v-if="n.status === 'Ativa'" :size="14" />
              <Power v-else :size="14" />
              {{ n.status === 'Ativa' ? 'Desativar' : 'Ativar' }}
            </button>
            <div style="height: 1px; background: var(--border-default); margin: 2px 0" />
            <button
              class="cobranca-row-menu-item flex items-center"
              style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--action-danger-text-only); text-align: left"
              @click="handleDelete(n.id)"
            >
              <Trash2 :size="14" /> Deletar notificação
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

<style scoped>
.cobranca-row-menu-item:hover {
  background: var(--surface-sunken) !important;
}
</style>
