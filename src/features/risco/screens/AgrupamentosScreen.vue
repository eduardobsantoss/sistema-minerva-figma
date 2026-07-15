<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Layers, Pencil, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  AGRUPAMENTOS_SEED, OPERACOES_VINCULAVEIS_SEED, contarVinculos,
  type Agrupamento, type OperacaoVinculavel,
} from '../data/riscoData';
import CreateAgrupamentoModal from '../components/modals/CreateAgrupamentoModal.vue';
import DeleteAgrupamentoModal from '../components/modals/DeleteAgrupamentoModal.vue';
import VincularAgrupamentoModal from '../components/modals/VincularAgrupamentoModal.vue';

const COLS = '2fr 0.8fr 0.8fr 0.8fr 1fr auto';

const agrupamentos = ref<Agrupamento[]>(AGRUPAMENTOS_SEED);
const operacoes = ref<OperacaoVinculavel[]>(OPERACOES_VINCULAVEIS_SEED);
const creating = ref(false);
const editing = ref<Agrupamento | null>(null);
const deleting = ref<Agrupamento | null>(null);
const vinculando = ref<Agrupamento | null>(null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => agrupamentos.value,
  { defaultPageSize: 10 },
);

function handleCreate(nome: string) {
  agrupamentos.value = [
    ...agrupamentos.value,
    { id: `agp-${Date.now()}`, nome, criadoEm: new Date().toLocaleDateString('pt-BR') },
  ];
  creating.value = false;
}

function handleRename(nome: string) {
  if (!editing.value) return;
  agrupamentos.value = agrupamentos.value.map((a) => (a.id === editing.value!.id ? { ...a, nome } : a));
  editing.value = null;
}

function handleDelete() {
  if (!deleting.value) return;
  agrupamentos.value = agrupamentos.value.filter((a) => a.id !== deleting.value!.id);
  deleting.value = null;
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
          Agrupamentos de Limite
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ agrupamentos.length }} {{ agrupamentos.length === 1 ? 'agrupamento cadastrado' : 'agrupamentos cadastrados' }}
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
        NOVO AGRUPAMENTO
      </button>
    </div>

    <!-- Tabela -->
    <div v-if="agrupamentos.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)">
      <Layers :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum agrupamento cadastrado</div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">Use "Novo agrupamento" para cadastrar o primeiro agrupamento de limite.</div>
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)">
      <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
        <div>Agrupamento</div><div>CRAs</div><div>FIDCs</div><div>Total</div><div>Criado em</div><div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="a in pageItems"
        :key="a.id"
        class="grid items-center agrupamentos-row"
        :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }"
        @click="vinculando = a"
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ a.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ contarVinculos(a.id, operacoes).cras }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ contarVinculos(a.id, operacoes).fidcs }}</div>
        <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ contarVinculos(a.id, operacoes).total }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.criadoEm }}</div>
        <div class="flex items-center justify-end" style="gap: 8px">
          <button
            aria-label="Renomear agrupamento"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click.stop="editing = a"
          >
            <Pencil :size="14" />
          </button>
          <button
            aria-label="Excluir agrupamento"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)"
            @click.stop="deleting = a"
          >
            <Trash2 :size="14" />
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

    <CreateAgrupamentoModal v-if="creating" @close="creating = false" @save="handleCreate" />
    <CreateAgrupamentoModal v-if="editing" :initial="editing" @close="editing = null" @save="handleRename" />
    <DeleteAgrupamentoModal v-if="deleting" :agrupamento="deleting" @close="deleting = null" @confirm="handleDelete" />
    <VincularAgrupamentoModal
      v-if="vinculando"
      :target="vinculando"
      target-label="Agrupamento"
      link-key="agrupamentoIds"
      :operacoes="operacoes"
      editable
      @update:operacoes="operacoes = $event"
      @close="vinculando = null"
      @edit="() => { editing = vinculando; vinculando = null; }"
    />
  </div>
</template>

<style scoped>
.agrupamentos-row:hover {
  background: var(--surface-sunken);
}
</style>
