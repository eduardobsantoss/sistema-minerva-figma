<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Search } from 'lucide-vue-next';
import type { VeiculoTipo } from '../../data/cobrancaData';
import { mockVeiculos } from '../../data/cobrancaData';
import Checkbox from '@/components/ui/Checkbox.vue';

type VeiculosTabKey = 'Todos' | 'FIDC' | 'CRA' | 'Garantia';

const TAB_LABELS: Record<VeiculosTabKey, string> = {
  Todos: 'Todos',
  FIDC: 'FIDCs',
  CRA: 'CRAs',
  Garantia: 'Garantias',
};

const TIPO_BADGE: Record<VeiculoTipo, { bg: string; fg: string }> = {
  FIDC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  CRA: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  Garantia: { bg: '#EEF0FF', fg: '#4F46E5' },
};

const TABS: VeiculosTabKey[] = ['Todos', 'FIDC', 'CRA', 'Garantia'];

const props = defineProps<{ selected: string[] }>();
const emit = defineEmits<{ 'update:selected': [v: string[]] }>();

const tab = ref<VeiculosTabKey>('Todos');
const query = ref('');
const rowHover = ref<string | null>(null);

const tabVeiculos = computed(() =>
  tab.value === 'Todos' ? mockVeiculos : mockVeiculos.filter((v) => v.tipo === tab.value),
);

const visible = computed(() =>
  query.value.trim()
    ? tabVeiculos.value.filter((v) => v.nome.toLowerCase().includes(query.value.toLowerCase()))
    : tabVeiculos.value,
);

function toggle(id: string) {
  emit(
    'update:selected',
    props.selected.includes(id)
      ? props.selected.filter((s) => s !== id)
      : [...props.selected, id],
  );
}

function remove(id: string) {
  emit('update:selected', props.selected.filter((s) => s !== id));
}

const visibleIds = computed(() => visible.value.map((v) => v.id));
const allChecked = computed(
  () => visibleIds.value.length > 0 && visibleIds.value.every((id) => props.selected.includes(id)),
);
const someChecked = computed(() => visibleIds.value.some((id) => props.selected.includes(id)));
const indeterminate = computed(() => someChecked.value && !allChecked.value);

function toggleAll() {
  if (allChecked.value) {
    emit('update:selected', props.selected.filter((id) => !visibleIds.value.includes(id)));
  } else {
    emit('update:selected', [...new Set([...props.selected, ...visibleIds.value])]);
  }
}

const selectedInTab = computed(() =>
  tab.value === 'Todos'
    ? mockVeiculos.filter((v) => props.selected.includes(v.id))
    : mockVeiculos.filter((v) => v.tipo === tab.value && props.selected.includes(v.id)),
);

function countByType(t: VeiculoTipo) {
  return mockVeiculos.filter((v) => v.tipo === t && props.selected.includes(v.id)).length;
}

function tabCount(t: VeiculosTabKey) {
  return t === 'Todos'
    ? props.selected.length
    : mockVeiculos.filter((v) => v.tipo === t && props.selected.includes(v.id)).length;
}

function selectTab(t: VeiculosTabKey) {
  tab.value = t;
  query.value = '';
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <div>
      <div style="font-size: var(--text-lg); font-weight: 700; color: var(--text-strong); margin-bottom: 6px">
        Veículos associados
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted)">
        Selecione os veículos que executarão esta notificação.
      </div>
    </div>

    <!-- Tabs -->
    <div style="display: flex; border-bottom: 1px solid var(--border-default)">
      <button
        v-for="t in TABS"
        :key="t"
        class="flex items-center"
        :style="{
          gap: '6px',
          padding: '10px 20px',
          background: 'transparent',
          border: 'none',
          borderBottom: tab === t ? '2px solid var(--agro-base)' : '2px solid transparent',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: tab === t ? 700 : 500,
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          marginBottom: '-1px',
          transition: 'color var(--duration-fast)',
        }"
        @click="selectTab(t)"
      >
        {{ TAB_LABELS[t] }}
        <span
          v-if="tabCount(t) > 0"
          :style="{
            fontSize: '9px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            background: tab === t ? 'var(--agro-light)' : 'var(--status-neutral-bg)',
            color: tab === t ? 'var(--agro-base)' : 'var(--status-neutral-text)',
          }"
        >
          {{ tabCount(t) }}
        </span>
      </button>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
      <input
        v-model="query"
        placeholder="Filtrar por nome..."
        style="
          height: 40px;
          padding-left: 36px;
          padding-right: 14px;
          width: 100%;
          background: var(--surface-card);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-md);
          outline: none;
          font-size: var(--text-sm);
          color: var(--text-strong);
        "
      />
    </div>

    <!-- Vehicle list -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <label
        class="flex items-center"
        style="
          gap: 10px;
          padding: 10px 14px;
          background: var(--surface-sunken);
          border-bottom: 1px solid var(--border-default);
          cursor: pointer;
        "
      >
        <Checkbox :checked="allChecked" :indeterminate="indeterminate" @change="toggleAll" />
        <span style="font-size: var(--text-xs); font-weight: 700; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase">
          Selecionar todos
        </span>
        <span style="font-size: 11px; color: var(--text-muted); margin-left: auto">
          {{ visibleIds.filter((id) => selected.includes(id)).length }} / {{ visible.length }}
        </span>
      </label>

      <div
        v-if="visible.length === 0"
        class="flex items-center justify-center"
        style="padding: 24px 14px; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum veículo encontrado.
      </div>
      <template v-else>
        <label
          v-for="(v, idx) in visible"
          :key="v.id"
          class="flex items-center"
          :style="{
            gap: '10px',
            padding: '11px 14px',
            borderBottom: idx < visible.length - 1 ? '1px solid var(--border-default)' : 'none',
            background: selected.includes(v.id)
              ? 'rgba(8,60,74,0.03)'
              : rowHover === v.id
                ? 'var(--surface-sunken)'
                : 'transparent',
            cursor: 'pointer',
            transition: 'background var(--duration-fast)',
          }"
          @mouseenter="rowHover = v.id"
          @mouseleave="rowHover = null"
        >
          <Checkbox :checked="selected.includes(v.id)" @change="toggle(v.id)" />
          <span
            :style="{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: TIPO_BADGE[v.tipo].bg,
              color: TIPO_BADGE[v.tipo].fg,
              flexShrink: 0,
            }"
          >
            {{ v.tipo }}
          </span>
          <span :style="{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: selected.includes(v.id) ? 600 : 400, color: 'var(--text-strong)' }">
            {{ v.nome }}
          </span>
        </label>
      </template>
    </div>

    <!-- Selected chips -->
    <div v-if="selectedInTab.length > 0">
      <div class="flex items-center" style="gap: 8px; margin-bottom: 10px">
        <span style="font-size: var(--text-sm); font-weight: 700; color: var(--text-strong)">
          {{ tab === 'Todos' ? 'Selecionados' : `Selecionados — ${TAB_LABELS[tab]}` }}
        </span>
        <span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: var(--status-active-bg); color: var(--status-active-text)">
          {{ selectedInTab.length }}
        </span>
      </div>
      <div class="flex flex-wrap" style="gap: 8px">
        <span
          v-for="v in selectedInTab"
          :key="v.id"
          class="flex items-center"
          style="gap: 6px; padding: 5px 10px; border-radius: var(--radius-full); background: var(--status-active-bg); color: var(--status-active-text); font-size: var(--text-xs); font-weight: 600"
        >
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              background: TIPO_BADGE[v.tipo].bg,
              color: TIPO_BADGE[v.tipo].fg,
            }"
          >
            {{ v.tipo }}
          </span>
          {{ v.nome }}
          <button
            title="Remover"
            style="background: none; border: none; cursor: pointer; color: var(--status-active-text); display: flex; padding: 0; margin-left: 2px"
            @click="remove(v.id)"
          >
            <X :size="12" />
          </button>
        </span>
      </div>
    </div>

    <!-- Cross-tab summary -->
    <div style="padding: 10px 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); font-size: var(--text-xs); color: var(--text-muted)">
      <strong style="color: var(--text-default)">{{ countByType('FIDC') }}</strong> FIDCs ·
      <strong style="color: var(--text-default)">{{ countByType('CRA') }}</strong> CRAs ·
      <strong style="color: var(--text-default)">{{ countByType('Garantia') }}</strong> Garantias selecionados
    </div>
  </div>
</template>
