<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, Pencil, Search, Check, Link2 } from 'lucide-vue-next';
import type { EntidadeVinculo, OperacaoVinculavel, TipoOperacaoVinculo, VinculoLinkKey } from '../../data/riscoData';

type FiltroTipo = 'TODOS' | TipoOperacaoVinculo;

interface Props {
  target: EntidadeVinculo;
  targetLabel: string;
  linkKey: VinculoLinkKey;
  operacoes: OperacaoVinculavel[];
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
});
const emit = defineEmits<{
  close: [];
  edit: [];
  'update:operacoes': [operacoes: OperacaoVinculavel[]];
}>();

const search = ref('');
const filtro = ref<FiltroTipo>('TODOS');
const selectedIds = ref<Set<string>>(new Set());

function syncSelectionFromProps() {
  selectedIds.value = new Set(
    props.operacoes.filter((o) => o[props.linkKey].includes(props.target.id)).map((o) => o.id),
  );
}

watch(
  () => [props.target.id, props.linkKey, props.operacoes] as const,
  () => syncSelectionFromProps(),
  { immediate: true },
);

const filtered = computed(() => {
  const needle = search.value.trim().toLowerCase();
  return props.operacoes.filter((o) => {
    if (filtro.value !== 'TODOS' && o.tipo !== filtro.value) return false;
    if (needle && !o.nome.toLowerCase().includes(needle)) return false;
    return true;
  });
});

const selectedCount = computed(() => selectedIds.value.size);
const crasCount = computed(() =>
  props.operacoes.filter((o) => selectedIds.value.has(o.id) && o.tipo === 'CRA').length,
);
const fidcsCount = computed(() =>
  props.operacoes.filter((o) => selectedIds.value.has(o.id) && o.tipo === 'FIDC').length,
);

function isSelected(id: string) {
  return selectedIds.value.has(id);
}

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function confirmar() {
  const targetId = props.target.id;
  emit(
    'update:operacoes',
    props.operacoes.map((o) => {
      const linked = o[props.linkKey].includes(targetId);
      const shouldLink = selectedIds.value.has(o.id);
      if (shouldLink && !linked) return { ...o, [props.linkKey]: [...o[props.linkKey], targetId] };
      if (!shouldLink && linked) return { ...o, [props.linkKey]: o[props.linkKey].filter((id) => id !== targetId) };
      return o;
    }),
  );
  emit('close');
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
    @click.self="emit('close')"
  >
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1100px;
        max-height: calc(100vh - 64px);
        height: calc(100vh - 64px);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div class="flex items-center" style="gap: 10px; min-width: 0; flex: 1">
          <Link2 :size="18" style="color: var(--text-muted); flex-shrink: 0" />
          <div style="min-width: 0">
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.2">
              Vincular veículos
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ targetLabel }}: {{ target.nome }}
            </p>
          </div>
          <button
            v-if="editable"
            :aria-label="`Editar ${targetLabel.toLowerCase()}`"
            :title="`Editar ${targetLabel.toLowerCase()}`"
            class="flex items-center justify-center"
            style="width: 30px; height: 30px; border-radius: var(--radius-md); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
            @click="emit('edit')"
          >
            <Pencil :size="13" />
          </button>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 28px 32px; gap: 16px; overflow-y: auto; overflow-x: hidden; flex: 1; min-height: 0">
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0">
          Selecione os veículos (CRA/FIDC) vinculados a este {{ targetLabel.toLowerCase() }}.
          <strong style="color: var(--text-default)">{{ selectedCount }} selecionados</strong>
          <span style="color: var(--text-muted)"> · {{ crasCount }} CRA · {{ fidcsCount }} FIDC</span>.
        </p>

        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg); flex-shrink: 0">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="search"
            placeholder="Filtrar veículos..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>

        <div class="flex items-center" style="gap: 6px; flex-shrink: 0">
          <button
            v-for="f in ([
              { key: 'TODOS', label: 'Todos' },
              { key: 'CRA', label: 'CRA' },
              { key: 'FIDC', label: 'FIDC' },
            ] as const)"
            :key="f.key"
            :style="{
              padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer',
              fontSize: '10px', fontWeight: 'var(--weight-bold)',
              border: `1px solid ${filtro === f.key ? 'var(--gci-base)' : 'var(--border-default)'}`,
              background: filtro === f.key ? 'var(--surface-selected)' : 'var(--surface-card)',
              color: filtro === f.key ? 'var(--gci-base)' : 'var(--text-muted)',
              transition: 'all var(--duration-fast)',
            }"
            @click="filtro = f.key"
          >
            {{ f.label }}
          </button>
        </div>

        <div
          v-if="filtered.length === 0"
          style="padding: 40px 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
        >
          Nenhum veículo encontrado.
        </div>
        <div v-else class="grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px">
          <button
            v-for="o in filtered"
            :key="o.id"
            class="flex items-center"
            :style="{
              gap: '10px',
              padding: '12px 14px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: isSelected(o.id) ? 'var(--gci-base)' : 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              background: isSelected(o.id) ? 'var(--gci-light)' : 'var(--surface-card)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--duration-base)',
              minWidth: 0,
              overflow: 'hidden',
            }"
            @click="toggle(o.id)"
          >
            <span
              class="flex items-center justify-center"
              :style="{
                width: '20px',
                height: '20px',
                borderRadius: '9999px',
                flexShrink: 0,
                background: isSelected(o.id) ? 'var(--gci-base)' : 'var(--surface-sunken)',
                color: isSelected(o.id) ? '#fff' : 'var(--text-muted)',
                transition: 'all var(--duration-base)',
              }"
            >
              <Check v-if="isSelected(o.id)" :size="11" />
            </span>
            <div style="flex: 1; min-width: 0; overflow: hidden">
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: isSelected(o.id) ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                  color: isSelected(o.id) ? 'var(--gci-base)' : 'var(--text-default)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }"
              >
                {{ o.nome }}
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px">{{ o.tipo }}</div>
            </div>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card); flex-shrink: 0">
        <button
          style="height: 44px; padding: 0 20px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="confirmar"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
