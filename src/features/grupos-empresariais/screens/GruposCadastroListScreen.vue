<script setup lang="ts">
import { computed, ref } from 'vue';
import { Link2, MoreVertical, Plus, Search, SlidersHorizontal, Upload } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import EditarStatusOperacaoModal from '../components/modals/EditarStatusOperacaoModal.vue';
import GerarLinkAutoCadastroModal from '../components/modals/GerarLinkAutoCadastroModal.vue';
import ImportarGruposCsvModal from '../components/modals/ImportarGruposCsvModal.vue';
import type { GrupoCadastro, GrupoCsvLinha, StatusOperacao } from '../data/gruposCadastroData';

const props = defineProps<{ grupos: GrupoCadastro[] }>();
const emit = defineEmits<{
  open: [id: string];
  create: [];
  updateStatus: [id: string, status: StatusOperacao];
  importGrupos: [linhas: GrupoCsvLinha[]];
}>();

const COLS = '1.2fr 2fr 1fr 1.2fr 56px';
const searchQuery = ref('');
const menuOpenId = ref<string | null>(null);
const menuAnchor = ref<{ top: number; left: number } | null>(null);
const statusGrupo = ref<GrupoCadastro | null>(null);
const linkAtual = ref<{ nome: string; url: string } | null>(null);
const importOpen = ref(false);
const toast = useToast();

const filtered = computed(() => {
  const needle = searchQuery.value.trim().toLowerCase();
  if (!needle) return props.grupos;
  return props.grupos.filter(
    (g) =>
      g.nome.toLowerCase().includes(needle) ||
      g.documento.toLowerCase().includes(needle) ||
      g.gerente.toLowerCase().includes(needle),
  );
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const documentosExistentes = computed(() => props.grupos.map((g) => g.documento));

const menuGrupo = computed(() => pageItems.value.find((g) => g.id === menuOpenId.value) ?? null);

function toggleMenu(id: string, event: MouseEvent) {
  if (menuOpenId.value === id) {
    menuOpenId.value = null;
    menuAnchor.value = null;
    return;
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const width = 248;
  const height = 92;
  const left = Math.max(8, rect.right - width);
  const below = rect.bottom + 4;
  const top = below + height > window.innerHeight - 8 ? Math.max(8, rect.top - height - 4) : below;
  menuAnchor.value = { top, left };
  menuOpenId.value = id;
}

function closeMenu() {
  menuOpenId.value = null;
  menuAnchor.value = null;
}

function openStatus(grupo: GrupoCadastro) {
  closeMenu();
  statusGrupo.value = grupo;
}

function openLink(grupo: GrupoCadastro) {
  closeMenu();
  const token = btoa(`${grupo.id}|${grupo.documento}|${Date.now()}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  linkAtual.value = {
    nome: grupo.nome,
    url: `${window.location.origin}/auto-cadastro/${token}`,
  };
}

function confirmStatus(status: StatusOperacao) {
  if (!statusGrupo.value) return;
  emit('updateStatus', statusGrupo.value.id, status);
  toast.success('Status de operação atualizado.');
  statusGrupo.value = null;
}

function confirmImport(linhas: GrupoCsvLinha[]) {
  emit('importGrupos', linhas);
  importOpen.value = false;
  const n = linhas.length;
  toast.success(n === 1 ? '1 grupo importado.' : `${n} grupos importados.`);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-end justify-between" style="gap: 16px; flex-wrap: wrap">
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
          Grupos
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
          Grupos Empresariais
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ filtered.length }}
          {{ filtered.length === 1 ? 'grupo encontrado' : 'grupos encontrados' }}
        </p>
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <button
          type="button"
          class="flex items-center"
          style="
            gap: 8px;
            height: 48px;
            padding: 0 18px;
            background: var(--surface-card);
            color: var(--text-strong);
            border-radius: var(--radius-xl);
            border: 1px solid var(--border-default);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
          "
          @click="importOpen = true"
        >
          <Upload :size="16" />
          IMPORTAR CSV
        </button>

        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="
            gap: 8px;
            height: 48px;
            padding: 0 20px;
            background: var(--agro-base);
            color: #fff;
            border-radius: var(--radius-xl);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
            box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
          "
          @click="emit('create')"
        >
          <span
            class="flex items-center justify-center"
            style="
              width: 22px;
              height: 22px;
              border-radius: 9999px;
              background: rgba(255, 255, 255, 0.2);
            "
          >
            <Plus :size="14" />
          </span>
          NOVO GRUPO
        </button>
      </div>
    </div>

    <div style="position: relative; max-width: 420px">
      <Search
        :size="15"
        style="
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        "
      />
      <input
        v-model="searchQuery"
        placeholder="Buscar por nome, documento ou gerente"
        style="
          width: 100%;
          height: 38px;
          padding: 0 12px 0 36px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          outline: none;
          font-size: var(--text-sm);
          color: var(--text-strong);
        "
      />
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          columnGap: '12px',
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Tipo</div>
        <div>Gerente</div>
        <div style="text-align: right">Ações</div>
      </div>

      <div
        v-if="pageItems.length === 0"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum grupo cadastrado.
      </div>

      <div
        v-for="g in pageItems"
        :key="g.id"
        class="grid items-center grupo-row"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          columnGap: '12px',
        }"
        @click="emit('open', g.id)"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">
          {{ g.documento }}
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ g.nome }}
        </div>
        <div style="color: var(--text-default)">{{ g.tipoCliente }}</div>
        <div style="color: var(--text-default)">{{ g.gerente }}</div>
        <div class="flex justify-end" style="position: relative" @click.stop>
          <button
            type="button"
            aria-label="Ações"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click="toggleMenu(g.id, $event)"
          >
            <MoreVertical :size="15" />
          </button>
        </div>
      </div>

      <TablePagination
        sunken
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-size-options="[10, 25, 50]"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <Teleport to="body">
      <div v-if="menuGrupo && menuAnchor">
        <div style="position: fixed; inset: 0; z-index: 80" @click="closeMenu" />
        <div
          class="flex flex-col"
          :style="{
            position: 'fixed',
            top: `${menuAnchor.top}px`,
            left: `${menuAnchor.left}px`,
            zIndex: 81,
            width: '248px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            padding: '6px',
          }"
        >
          <button
            type="button"
            class="flex items-center grupo-menu-item"
            style="gap: 8px; width: 100%; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)"
            @click="openStatus(menuGrupo)"
          >
            <SlidersHorizontal :size="14" style="color: var(--text-muted); flex-shrink: 0" />
            Editar status de operação
          </button>
          <button
            type="button"
            class="flex items-center grupo-menu-item"
            style="gap: 8px; width: 100%; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)"
            @click="openLink(menuGrupo)"
          >
            <Link2 :size="14" style="color: var(--text-muted); flex-shrink: 0" />
            Gerar link de auto cadastro
          </button>
        </div>
      </div>
    </Teleport>

    <EditarStatusOperacaoModal
      v-if="statusGrupo"
      :grupo-nome="statusGrupo.nome"
      :status-atual="statusGrupo.statusOperacao"
      @close="statusGrupo = null"
      @confirm="confirmStatus"
    />

    <GerarLinkAutoCadastroModal
      v-if="linkAtual"
      :grupo-nome="linkAtual.nome"
      :link="linkAtual.url"
      @close="linkAtual = null"
    />

    <ImportarGruposCsvModal
      v-if="importOpen"
      :documentos-existentes="documentosExistentes"
      @close="importOpen = false"
      @confirm="confirmImport"
    />
  </div>
</template>

<style scoped>
.grupo-row:hover {
  background: var(--surface-sunken);
}

.grupo-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
