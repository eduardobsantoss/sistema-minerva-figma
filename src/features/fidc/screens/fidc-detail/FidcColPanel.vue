<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import ValorPresenteInfo from '@/components/ui/ValorPresenteInfo.vue';

const props = defineProps<{ tab: 'classes' | 'titulos' }>();
const emit = defineEmits<{ close: [] }>();

const FIDC_CLASS_COLS = [
  { id: 'nome', label: 'Nome da Unidade' },
  { id: 'status', label: 'Status' },
  { id: 'vrNominal', label: 'VR. Nominal' },
  { id: 'vrAberto', label: 'VR. Presente', hint: true },
  { id: 'vrPresente', label: 'VR. Presente' },
  { id: 'vrVencido', label: 'VR. Vencido' },
];
const FIDC_TIT_COLS = [
  { id: 'classe', label: 'Classe' },
  { id: 'numero', label: 'Nº Título' },
  { id: 'lastro', label: 'Lastro' },
  { id: 'cedente', label: 'Cedente' },
  { id: 'sacado', label: 'Sacado' },
  { id: 'vencimento', label: 'Vencimento' },
  { id: 'vrNominal', label: 'VR. Nominal' },
  { id: 'status', label: 'Status' },
];

const cols = props.tab === 'classes' ? FIDC_CLASS_COLS : FIDC_TIT_COLS;
const checked = ref<Record<string, boolean>>(Object.fromEntries(cols.map((c) => [c.id, true])));

function toggleCol(id: string) {
  checked.value = { ...checked.value, [id]: !checked.value[id] };
}
</script>

<template>
  <div style="position: fixed; inset: 0; z-index: 10" @click="emit('close')" />
  <div
    style="
      position: absolute;
      top: 48px;
      right: 0;
      z-index: 20;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
      padding: 16px;
      min-width: 220px;
      box-shadow: var(--shadow-md);
    "
  >
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px">
      Colunas visíveis
    </div>
    <div class="flex flex-col" style="gap: 8px">
      <div
        v-for="c in cols"
        :key="c.id"
        class="flex items-center"
        style="gap: 10px; cursor: pointer"
        @click="toggleCol(c.id)"
      >
        <div @click.stop>
          <Checkbox :checked="checked[c.id]" @change="toggleCol(c.id)" />
        </div>
        <span class="flex items-center" style="gap: 6px; font-size: var(--text-sm); color: var(--text-default)">
          {{ c.label }}
          <ValorPresenteInfo v-if="c.hint" :size="12" />
        </span>
      </div>
    </div>
  </div>
</template>
