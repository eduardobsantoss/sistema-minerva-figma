<script setup lang="ts">
import { GRUPOS_SEED } from '@/features/risco/data/riscoData';
import Checkbox from '@/components/ui/Checkbox.vue';
import type { NewSemiData } from '../types';

const form = defineModel<NewSemiData>({ required: true });

function isOn(id: string) {
  return form.value.grupoIds.includes(id);
}

function toggle(id: string) {
  const ids = form.value.grupoIds;
  form.value.grupoIds = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 12px">
    <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 4px">
      Selecione ao menos um grupo empresarial (cedente) da operação.
    </p>
    <div
      v-for="g in GRUPOS_SEED"
      :key="g.id"
      class="flex items-center"
      style="
        gap: 14px;
        padding: 14px 16px;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-default);
        background: var(--surface-card);
        cursor: pointer;
      "
      @click="toggle(g.id)"
    >
      <div @click.stop>
        <Checkbox :checked="isOn(g.id)" @change="toggle(g.id)" />
      </div>
      <div style="min-width: 0; flex: 1">
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ g.nome }}
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
          {{ g.documento }} · {{ g.tipoCliente }}
        </div>
      </div>
    </div>
  </div>
</template>
