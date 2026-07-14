<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Gauge, Pencil } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { RATINGS_SEED, fmtPct, type Rating } from '../data/riscoData';
import CreateRatingModal from '../components/modals/CreateRatingModal.vue';

const COLS = '1fr 1fr 1fr auto';

const ratings = ref<Rating[]>(RATINGS_SEED);
const creating = ref(false);
const editing = ref<Rating | null>(null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => ratings.value,
  { defaultPageSize: 10 },
);

function handleCreate(data: { nome: string; taxa: number }) {
  ratings.value = [
    ...ratings.value,
    { id: `rating-${Date.now()}`, nome: data.nome, taxa: data.taxa, criadoEm: new Date().toLocaleDateString('pt-BR') },
  ];
  creating.value = false;
}

function handleEdit(data: { nome: string; taxa: number }) {
  if (!editing.value) return;
  ratings.value = ratings.value.map((r) => (r.id === editing.value!.id ? { ...r, nome: data.nome, taxa: data.taxa } : r));
  editing.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Identificação + ação primária -->
    <div class="flex items-center justify-between" style="gap: 16px">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Cadastro Global · Risco
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Ratings
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ ratings.length }} {{ ratings.length === 1 ? 'rating cadastrado' : 'ratings cadastrados' }}
        </p>
      </div>
      <button
        class="flex items-center btn-animated btn-agro"
        style="gap: 8px; height: 48px; padding: 0 22px; background: var(--agro-base); color: #fff; border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -8px rgba(242,125,38,0.40)"
        @click="creating = true"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVO RATING
      </button>
    </div>

    <!-- Tabela -->
    <div v-if="ratings.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)">
      <Gauge :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum rating cadastrado</div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">Use "Novo rating" para cadastrar o primeiro indicativo de rating do cliente.</div>
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)">
      <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
        <div>Nome</div><div>Taxa</div><div>Criado em</div><div style="text-align: right">Ações</div>
      </div>
      <div v-for="r in pageItems" :key="r.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ r.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ fmtPct(r.taxa) }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ r.criadoEm }}</div>
        <div class="flex justify-end">
          <button
            aria-label="Editar rating"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click="editing = r"
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

    <CreateRatingModal v-if="creating" @close="creating = false" @save="handleCreate" />
    <CreateRatingModal v-if="editing" :initial="editing" @close="editing = null" @save="handleEdit" />
  </div>
</template>
