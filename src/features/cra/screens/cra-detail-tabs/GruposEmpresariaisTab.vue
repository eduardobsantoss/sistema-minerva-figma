<script setup lang="ts">
import { computed, ref } from 'vue';
import { MoreVertical, Upload, Eye, FileText } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  GRUPO_STATUS_OPERACAO,
  type GrupoEmpresarialVinculo,
  type GrupoStatusOperacao,
} from '../../data/craData';

const props = defineProps<{ grupos: GrupoEmpresarialVinculo[] }>();
const emit = defineEmits<{
  open: [id: string];
  upload: [grupo: GrupoEmpresarialVinculo];
  toggleApto: [id: string];
  update: [GrupoEmpresarialVinculo];
}>();

const filterNome = ref('');
const filterStatus = ref('');
const openMenuId = ref<string | null>(null);

const filtered = computed(() =>
  props.grupos.filter((g) => {
    if (filterNome.value && !g.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterStatus.value && g.statusOperacao !== filterStatus.value) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS = '1.2fr 1fr 0.75fr 0.85fr 0.85fr 0.45fr';

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

function statusStyle(s: GrupoStatusOperacao) {
  const map: Record<GrupoStatusOperacao, { bg: string; fg: string }> = {
    APROVADO: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    'EM ANÁLISE': { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
    REJEITADO: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
    PENDENTE: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
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

function onRowClick(g: GrupoEmpresarialVinculo) {
  emit('open', g.id);
}

function onToggleApto(g: GrupoEmpresarialVinculo, e: Event) {
  e.stopPropagation();
  if (!g.apto && !g.masterContractUrl) {
    alert('É necessário subir o Contrato Mãe antes de marcar o grupo como Apto.');
    return;
  }
  emit('toggleApto', g.id);
}

function onUpload(g: GrupoEmpresarialVinculo) {
  closeMenu();
  emit('upload', g);
}

function onVisualizar(g: GrupoEmpresarialVinculo) {
  closeMenu();
  if (g.masterContractUrl) window.open(g.masterContractUrl, '_blank');
}
</script>

<template>
  <div @click="closeMenu">
    <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
        Grupos Empresariais
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ grupos.length }} grupos vinculados
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="filterNome" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status de Operação</div>
        <select v-model="filterStatus" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option v-for="s in GRUPO_STATUS_OPERACAO" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <div v-if="!filtered.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum grupo encontrado.
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
        <div>Status de Operação</div>
        <div>Apto/Inapto</div>
        <div>Data firma</div>
        <div>Contrato Mãe</div>
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
          cursor: 'pointer',
        }"
        @click="onRowClick(r)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: statusStyle(r.statusOperacao).bg,
              color: statusStyle(r.statusOperacao).fg,
            }"
          >
            {{ r.statusOperacao }}
          </span>
        </div>
        <div>
          <button
            type="button"
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              background: r.apto ? 'var(--status-success-bg)' : 'var(--surface-sunken)',
              color: r.apto ? 'var(--status-success-text)' : 'var(--text-muted)',
            }"
            @click="onToggleApto(r, $event)"
          >
            {{ r.apto ? 'Apto' : 'Inapto' }}
          </button>
        </div>
        <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.masterContractDate ?? '—' }}</div>
        <div>
          <FileText v-if="r.masterContractUrl" :size="18" style="color: var(--gci-base)" />
          <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
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
            style="position: absolute; top: 40px; right: 0; z-index: 40; min-width: 180px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
            @click.stop
          >
            <button
              type="button"
              class="flex items-center"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left"
              @click="onUpload(r)"
            >
              <Upload :size="14" /> Subir Contrato Mãe
            </button>
            <button
              type="button"
              class="flex items-center"
              :disabled="!r.masterContractUrl"
              :style="{ opacity: r.masterContractUrl ? 1 : 0.4, cursor: r.masterContractUrl ? 'pointer' : 'not-allowed' }"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left"
              @click="onVisualizar(r)"
            >
              <Eye :size="14" /> Visualizar
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
