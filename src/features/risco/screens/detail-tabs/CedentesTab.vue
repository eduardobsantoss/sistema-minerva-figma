<script setup lang="ts">
import { computed, ref } from 'vue';
import { Users } from 'lucide-vue-next';
import type { Cedente } from '../../data/riscoData';
import { EmptyState } from './shared';
import CedenteDetailModal from '../../components/modals/CedenteDetailModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  cedentes: Cedente[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update-cedente': [cedente: Cedente] }>();

const COLS = '1.2fr 1.8fr 1.6fr 1fr 1fr';

const selecionadoId = ref<string | null>(null);
const selecionado = computed(() => props.cedentes.find((c) => c.id === selecionadoId.value) ?? null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.cedentes,
  { defaultPageSize: 10 },
);
</script>

<template>
  <EmptyState v-if="cedentes.length === 0" :icon="Users" title="Nenhum cedente vinculado" hint="Este grupo ainda não possui cedentes cadastrados." />
  <template v-else>
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
        <div>Documento</div><div>Nome</div><div>E-mail</div><div>Cidade-UF</div><div>Tipo</div>
      </div>
      <div
        v-for="c in pageItems"
        :key="c.id"
        class="grid items-center cedentes-row"
        :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }"
        @click="selecionadoId = c.id"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ c.documento }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
        <div :style="{ color: c.email ? 'var(--text-default)' : 'var(--text-muted)' }">{{ c.email ?? 'Não cadastrado' }}</div>
        <div style="color: var(--text-default)">{{ c.cidade }}-{{ c.uf }}</div>
        <div style="color: var(--text-default)">{{ c.tipo }}</div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <CedenteDetailModal
      v-if="selecionado"
      :cedente="selecionado"
      @close="selecionadoId = null"
      @update="emit('update-cedente', $event)"
    />
  </template>
</template>

<style scoped>
.cedentes-row:hover {
  background: var(--surface-sunken);
}
</style>
