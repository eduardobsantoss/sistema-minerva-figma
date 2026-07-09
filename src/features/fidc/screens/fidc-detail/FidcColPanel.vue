<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';

const props = defineProps<{ tab: 'classes' | 'titulos' }>();
const emit = defineEmits<{ close: [] }>();

const FIDC_CLASS_COLS = ['Nome da Unidade', 'Status', 'VR. Nominal', 'VR. Aberto', 'VR. Presente', 'VR. Vencido'];
const FIDC_TIT_COLS = ['Classe', 'Nº Título', 'Lastro', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'];

const cols = props.tab === 'classes' ? FIDC_CLASS_COLS : FIDC_TIT_COLS;
const checked = ref<Record<string, boolean>>(Object.fromEntries(cols.map((c) => [c, true])));

function toggleCol(col: string) {
  checked.value = { ...checked.value, [col]: !checked.value[col] };
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
        :key="c"
        class="flex items-center"
        style="gap: 10px; cursor: pointer"
        @click="toggleCol(c)"
      >
        <div @click.stop>
          <Checkbox :checked="checked[c]" @change="toggleCol(c)" />
        </div>
        <span style="font-size: var(--text-sm); color: var(--text-default)">{{ c }}</span>
      </div>
    </div>
  </div>
</template>
