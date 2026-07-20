<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, SlidersHorizontal } from 'lucide-vue-next';
import type { GrupoEmpresarialVinculo } from '../../data/fidcsData';
import FormField from '../create-class/FormField.vue';
import StepGrid from '../create-class/StepGrid.vue';

const props = defineProps<{ grupo: GrupoEmpresarialVinculo | null }>();
const emit = defineEmits<{ close: []; save: [GrupoEmpresarialVinculo] }>();

const limite = ref('');
const juros = ref('');
const desconto = ref('');

watch(
  () => props.grupo,
  (g) => {
    if (!g) return;
    limite.value = String(g.limite);
    juros.value = g.juros != null ? String(g.juros) : '';
    desconto.value = g.desconto != null ? String(g.desconto) : '';
  },
  { immediate: true },
);

function parseNum(v: string) {
  return parseFloat(v.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handleSave() {
  if (!props.grupo) return;
  emit('save', {
    ...props.grupo,
    limite: parseNum(limite.value),
    juros: parseNum(juros.value),
    desconto: parseNum(desconto.value),
  });
}
</script>

<template>
  <div
    style="position: fixed; inset: 0; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px"
    @click.self="emit('close')"
  >
    <div
      style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 520px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 6px">
            FIDC · Grupo Empresarial
          </div>
          <h3 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); gap: 10px">
            <SlidersHorizontal :size="22" style="color: var(--gci-base)" />
            Editar Parâmetros
          </h3>
          <p v-if="grupo" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">{{ grupo.nome }}</p>
        </div>
        <button type="button" aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px" @click="emit('close')">
          <X :size="22" />
        </button>
      </div>

      <div style="padding: 24px 28px; background: var(--surface-sunken)">
        <StepGrid>
          <FormField v-model="limite" label="Limite (R$)" type="number" :span="6" />
          <FormField v-model="juros" label="Juros (% a.m.)" type="number" :span="3" />
          <FormField v-model="desconto" label="Desconto (%)" type="number" :span="3" />
        </StepGrid>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button type="button" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px" @click="emit('close')">
          Cancelar
        </button>
        <button
          type="button"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="handleSave"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
