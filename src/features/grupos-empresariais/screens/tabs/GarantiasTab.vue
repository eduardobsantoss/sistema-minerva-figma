<script setup lang="ts">
import { ref } from 'vue';
import { Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { brl } from '@/features/risco/data/riscoData';
import type { GarantiaGrupo } from '../../data/gruposCadastroData';
import GarantiaModal from './GarantiaModal.vue';

const props = defineProps<{ garantias: GarantiaGrupo[] }>();
const emit = defineEmits<{
  add: [item: GarantiaGrupo];
  update: [item: GarantiaGrupo];
  remove: [id: string];
}>();

const editing = ref<GarantiaGrupo | null>(null);
const creating = ref(false);

function onSave(item: GarantiaGrupo) {
  if (creating.value) emit('add', item);
  else emit('update', item);
  creating.value = false;
  editing.value = null;
}

function excluir(id: string) {
  if (!window.confirm('Excluir esta garantia?')) return;
  emit('remove', id);
}

function statusColor(status: string) {
  if (status === 'Vigente') return 'var(--success-base)';
  if (status === 'Baixada') return 'var(--text-muted)';
  return 'var(--warning-base)';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex justify-end">
      <button
        type="button"
        class="flex items-center"
        style="gap: 8px; height: 38px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
        @click="editing = null; creating = true"
      >
        <Plus :size="14" />
        Cadastrar
      </button>
    </div>

    <div
      v-if="garantias.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhuma garantia cadastrada.
    </div>
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div class="grid items-center" style="grid-template-columns: 1.2fr 0.9fr 1fr 0.6fr 0.7fr 0.8fr auto; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Tipo</div>
        <div>Data aquisição</div>
        <div>Valor</div>
        <div>% usado</div>
        <div>Operações</div>
        <div>Status</div>
        <div style="text-align: right">Ação</div>
      </div>
      <div
        v-for="g in garantias"
        :key="g.id"
        class="grid items-center"
        style="grid-template-columns: 1.2fr 0.9fr 1fr 0.6fr 0.7fr 0.8fr auto; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.dataAquisicao || '—' }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.valor) }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ g.pctUsado }}%</div>
        <div style="font-variant-numeric: tabular-nums">{{ g.qtdOperacoes }}</div>
        <div :style="{ color: statusColor(g.status), fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-xs)' }">
          {{ g.status }}
        </div>
        <div class="flex justify-end" style="gap: 6px">
          <button type="button" aria-label="Editar garantia" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)" @click="editing = g">
            <Pencil :size="14" />
          </button>
          <button type="button" aria-label="Excluir garantia" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)" @click="excluir(g.id)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <GarantiaModal v-if="creating" :garantia="null" @close="creating = false" @save="onSave" />
    <GarantiaModal v-else-if="editing" :garantia="editing" @close="editing = null" @save="onSave" />
  </div>
</template>
