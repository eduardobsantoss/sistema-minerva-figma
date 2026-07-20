<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ChevronDown, Filter, Pencil, ShieldCheck, SlidersHorizontal, X } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  VALIDACOES_SEED,
  SETOR_RESPONSAVEL_OPTS,
  escopoLabel,
  isEscopoConfigurado,
  setorColor,
  setorLabel,
  type SetorResponsavel,
  type ValidationItem,
} from '../data/validacoesConfigData';
import ValidationDetailView from '../components/validacoes-config/ValidationDetailView.vue';

const COLS = '0.55fr 1.1fr 2fr 1fr 1.15fr auto';

function cloneValidationItem(item: ValidationItem): ValidationItem {
  return {
    ...item,
    configs: item.configs.map((c) => ({ ...c, vehicleIds: [...c.vehicleIds] })),
  };
}

const items = ref<ValidationItem[]>(VALIDACOES_SEED.map(cloneValidationItem));

interface FilterDraft {
  nome: string;
  id: string;
  setor: '' | SetorResponsavel;
}

const EMPTY_FILTERS: FilterDraft = { nome: '', id: '', setor: '' };

const draft = ref<FilterDraft>({ ...EMPTY_FILTERS });
const applied = ref<FilterDraft>({ ...EMPTY_FILTERS });
const filterErrors = reactive({ nome: '', id: '' });
const showFilters = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);

const editing = ref<ValidationItem | null>(null);

const activeFilterCount = computed(
  () =>
    [applied.value.nome, applied.value.id, applied.value.setor].filter((v) => String(v).trim() !== '')
      .length,
);

const filtered = computed(() =>
  items.value.filter((row) => {
    const nome = applied.value.nome.trim();
    if (nome && !row.name.toLowerCase().includes(nome.toLowerCase())) return false;

    const idRaw = applied.value.id.trim();
    if (idRaw && row.id !== Number(idRaw)) return false;

    if (applied.value.setor !== '' && row.responsibleSector !== applied.value.setor) return false;

    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const filterPanelStyle = computed(() => ({
  position: 'absolute' as const,
  [filterPlacement.value === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
  right: '0px',
  zIndex: 31,
  width: '440px',
  maxWidth: 'calc(100vw - 48px)',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-lg)',
  padding: '16px 20px',
}));

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.10em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
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

function openDetails(row: ValidationItem) {
  editing.value = row;
}

function openFilters() {
  if (!showFilters.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  showFilters.value = !showFilters.value;
}

function handleFilter() {
  filterErrors.nome = '';
  filterErrors.id = '';

  const nome = draft.value.nome.trim();
  if (nome && nome.length < 3) {
    filterErrors.nome = 'Informe ao menos 3 caracteres';
    return;
  }

  const idRaw = draft.value.id.trim();
  if (idRaw && !/^\d+$/.test(idRaw)) {
    filterErrors.id = 'Informe somente números';
    return;
  }

  applied.value = {
    nome: draft.value.nome,
    id: draft.value.id,
    setor: draft.value.setor,
  };
  showFilters.value = false;
  setPage(1);
}

function handleClearFilters() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  filterErrors.nome = '';
  filterErrors.id = '';
  setPage(1);
}

function handleUpdate(updated: ValidationItem) {
  items.value = items.value.map((i) => (i.id === updated.id ? cloneValidationItem(updated) : i));
  editing.value = items.value.find((i) => i.id === updated.id) ?? null;
}

function closeDetails() {
  editing.value = null;
}
</script>

<template>
  <ValidationDetailView
    v-if="editing"
    :item="editing"
    @back="closeDetails"
    @update="handleUpdate"
  />
  <div v-else class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Validações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ items.length }}
        {{ items.length === 1 ? 'validação cadastrada' : 'validações cadastradas' }}
      </p>
    </div>

    <div class="flex items-center justify-end" style="gap: 12px; flex-wrap: wrap">
      <div style="position: relative">
        <button
          ref="filterBtnRef"
          type="button"
          class="flex items-center"
          :style="{
            gap: '8px',
            height: '42px',
            padding: '0 16px',
            cursor: 'pointer',
            background: showFilters || activeFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
            border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-lg)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.04em',
            color: showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast)',
          }"
          @click="openFilters"
        >
          <SlidersHorizontal :size="15" :stroke-width="2" />
          Filtros
          <span
            v-if="activeFilterCount > 0"
            style="
              min-width: 18px;
              height: 18px;
              padding: 0 5px;
              border-radius: 9999px;
              background: var(--gci-base);
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ activeFilterCount }}
          </span>
          <ChevronDown
            :size="14"
            :style="{
              transform: showFilters ? 'rotate(180deg)' : 'none',
              transition: 'transform var(--duration-base)',
            }"
          />
        </button>

        <template v-if="showFilters">
          <div style="position: fixed; inset: 0; z-index: 30" @click="showFilters = false" />
          <div :style="filterPanelStyle">
            <div class="flex items-center justify-between" style="margin-bottom: 16px">
              <span
                style="
                  font-size: 11px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.12em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Filtros adicionais
              </span>
              <button
                v-if="activeFilterCount > 0 || draft.nome || draft.id || draft.setor"
                type="button"
                class="flex items-center"
                style="
                  gap: 4px;
                  background: none;
                  border: none;
                  cursor: pointer;
                  font-size: var(--text-xs);
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                "
                @click="handleClearFilters"
              >
                <X :size="12" /> Limpar filtros
              </button>
            </div>

            <div class="flex flex-col" style="gap: 14px">
              <div>
                <div :style="labelStyle">Nome</div>
                <input v-model="draft.nome" placeholder="Buscar por nome" :style="inputStyle" />
                <div
                  v-if="filterErrors.nome"
                  style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
                >
                  {{ filterErrors.nome }}
                </div>
              </div>
              <div>
                <div :style="labelStyle">ID</div>
                <input
                  v-model="draft.id"
                  placeholder="Somente números"
                  inputmode="numeric"
                  :style="inputStyle"
                />
                <div
                  v-if="filterErrors.id"
                  style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
                >
                  {{ filterErrors.id }}
                </div>
              </div>
              <div>
                <div :style="labelStyle">Setor Responsável</div>
                <select v-model="draft.setor" :style="inputStyle">
                  <option value="">Todos</option>
                  <option v-for="s in SETOR_RESPONSAVEL_OPTS" :key="s.value" :value="s.value">
                    {{ s.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
              <button
                type="button"
                style="
                  height: 38px;
                  padding: 0 16px;
                  background: none;
                  border: 1px solid var(--border-default);
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                  font-size: var(--text-sm);
                "
                @click="handleClearFilters"
              >
                Limpar
              </button>
              <button
                type="button"
                class="flex items-center"
                style="
                  gap: 6px;
                  height: 38px;
                  padding: 0 18px;
                  background: var(--action-primary-bg);
                  color: #fff;
                  border: none;
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  font-weight: var(--weight-bold);
                  font-size: var(--text-xs);
                  letter-spacing: 0.06em;
                "
                @click="handleFilter"
              >
                <Filter :size="13" /> FILTRAR
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="filtered.length === 0"
      class="flex flex-col items-center justify-center"
      style="
        gap: 10px;
        padding: 48px 24px;
        text-align: center;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
        border: 1px dashed var(--border-default);
      "
    >
      <ShieldCheck :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
        Nenhuma validação encontrada
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">
        Ajuste os filtros ou cadastre novas validações na parametrização.
      </div>
    </div>

    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>ID</div>
        <div>Nome</div>
        <div>Descrição</div>
        <div>Setor Responsável</div>
        <div>Escopo</div>
        <div style="text-align: right">Ações</div>
      </div>

      <div
        v-for="row in pageItems"
        :key="row.id"
        class="grid items-center validacoes-row"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
        @click="openDetails(row)"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ row.id }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ row.name }}</div>
        <div class="validacoes-desc" style="color: var(--text-default)">{{ row.description }}</div>
        <div>
          <span
            :style="{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'var(--weight-bold)',
              color: '#fff',
              background: setorColor(row.responsibleSector),
            }"
          >
            {{ setorLabel(row.responsibleSector) }}
          </span>
        </div>
        <div>
          <span
            v-if="!isEscopoConfigurado(row)"
            :style="{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-muted)',
              background: 'var(--surface-sunken)',
            }"
          >
            Não configurado
          </span>
          <span
            v-else
            :style="{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-default)',
              border: '1px solid var(--border-default)',
              background: 'transparent',
            }"
          >
            {{ escopoLabel(row) }}
          </span>
        </div>
        <div class="flex items-center justify-end">
          <button
            type="button"
            aria-label="Editar validação"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              background: none;
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click.stop="openDetails(row)"
          >
            <Pencil :size="14" />
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
    </div>
  </div>
</template>

<style scoped>
.validacoes-row:hover {
  background: var(--surface-sunken);
}
.validacoes-desc {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
