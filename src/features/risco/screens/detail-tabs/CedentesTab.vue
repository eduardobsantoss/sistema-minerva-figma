<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Users } from 'lucide-vue-next';
import type { Cedente } from '../../data/riscoData';
import { EmptyState } from './shared';
import CedenteDetailModal from '../../components/modals/CedenteDetailModal.vue';

interface Props {
  cedentes: Cedente[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update-cedente': [cedente: Cedente] }>();

const COLS = '1.2fr 1.8fr 1.6fr 1fr 1fr';

const page = ref(1);
const pageSize = ref(10);
const selecionadoId = ref<string | null>(null);
const selecionado = computed(() => props.cedentes.find((c) => c.id === selecionadoId.value) ?? null);

const totalPages = computed(() => Math.max(1, Math.ceil(props.cedentes.length / pageSize.value)));
const clampedPage = computed(() => Math.min(page.value, totalPages.value));
const pageItems = computed(() =>
  props.cedentes.slice((clampedPage.value - 1) * pageSize.value, clampedPage.value * pageSize.value),
);

function handlePageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value);
  page.value = 1;
}

function pageButtonStyle(disabled: boolean) {
  return {
    width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
    background: 'var(--surface-card)', cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-muted)',
  };
}
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

      <div class="flex items-center justify-between" style="padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-xs); color: var(--text-muted)">
        <div class="flex items-center" style="gap: 8px">
          <span>Itens por página</span>
          <select
            :value="pageSize"
            style="height: 30px; padding: 0 8px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); color: var(--text-default); font-size: var(--text-xs)"
            @change="handlePageSizeChange"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <div class="flex items-center" style="gap: 14px">
          <span style="font-variant-numeric: tabular-nums">
            {{ (clampedPage - 1) * pageSize + 1 }}–{{ Math.min(clampedPage * pageSize, cedentes.length) }} de {{ cedentes.length }}
          </span>
          <div class="flex items-center" style="gap: 4px">
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === 1)" :disabled="clampedPage === 1" @click="page = 1"><ChevronsLeft :size="14" /></button>
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === 1)" :disabled="clampedPage === 1" @click="page = Math.max(1, page - 1)"><ChevronLeft :size="14" /></button>
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === totalPages)" :disabled="clampedPage === totalPages" @click="page = Math.min(totalPages, page + 1)"><ChevronRight :size="14" /></button>
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === totalPages)" :disabled="clampedPage === totalPages" @click="page = totalPages"><ChevronsRight :size="14" /></button>
          </div>
        </div>
      </div>
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
