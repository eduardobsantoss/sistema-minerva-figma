<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Search } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { GrupoCadastro } from '../data/gruposCadastroData';

const props = defineProps<{ grupos: GrupoCadastro[] }>();
const emit = defineEmits<{
  open: [id: string];
  create: [];
}>();

const COLS = '1.2fr 2fr 1fr 1.2fr';
const searchQuery = ref('');

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
          Cadastro
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
          Cadastro de Grupos
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ filtered.length }}
          {{ filtered.length === 1 ? 'grupo encontrado' : 'grupos encontrados' }}
        </p>
      </div>

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
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Tipo</div>
        <div>Gerente</div>
      </div>

      <div
        v-if="pageItems.length === 0"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum grupo cadastrado.
      </div>

      <button
        v-for="g in pageItems"
        :key="g.id"
        type="button"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          width: '100%',
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          background: 'transparent',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
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
      </button>

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
  </div>
</template>
