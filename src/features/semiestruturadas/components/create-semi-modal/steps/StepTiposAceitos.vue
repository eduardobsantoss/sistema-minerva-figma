<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import { WARRANTY_TYPES, warrantyTypeName } from '../../../data/semiestruturadasData';
import type { NewSemiData } from '../types';
import SelectField from '../SelectField.vue';
import Input from '../Input.vue';
import FieldLabel from '../FieldLabel.vue';

const form = defineModel<NewSemiData>({ required: true });

const unusedNames = computed(() => {
  const used = new Set(form.value.accepted.map((a) => a.warrantyTypeId));
  return WARRANTY_TYPES.filter((t) => !used.has(t.id)).map((t) => t.nome);
});

function addRow() {
  const first = WARRANTY_TYPES.find((t) => !form.value.accepted.some((a) => a.warrantyTypeId === t.id));
  if (!first) return;
  form.value.accepted = [...form.value.accepted, { warrantyTypeId: first.id, acceptedPercentage: 100 }];
}

function removeRow(id: number) {
  form.value.accepted = form.value.accepted.filter((a) => a.warrantyTypeId !== id);
}

function setType(index: number, nome: string) {
  const found = WARRANTY_TYPES.find((t) => t.nome === nome);
  if (!found) return;
  const next = [...form.value.accepted];
  next[index] = { ...next[index], warrantyTypeId: found.id };
  form.value.accepted = next;
}

function setPct(index: number, raw: string) {
  const n = Number(raw.replace(',', '.'));
  const next = [...form.value.accepted];
  next[index] = { ...next[index], acceptedPercentage: Number.isFinite(n) ? n : 0 };
  form.value.accepted = next;
}

function optionsFor(id: number) {
  return [warrantyTypeName(id), ...unusedNames.value];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 14px">
    <p style="font-size: var(--text-sm); color: var(--text-muted)">
      Escolha os tipos de garantia aceitos e a porcentagem de cobertura de cada um.
    </p>

    <div
      v-for="(row, i) in form.accepted"
      :key="`${row.warrantyTypeId}-${i}`"
      class="grid items-end"
      style="grid-template-columns: 1fr 140px 40px; gap: 12px"
    >
      <SelectField
        label="Tipo"
        :options="optionsFor(row.warrantyTypeId)"
        :model-value="warrantyTypeName(row.warrantyTypeId)"
        @update:model-value="setType(i, $event)"
      />
      <div>
        <FieldLabel>Porcentagem aceita</FieldLabel>
        <Input
          :model-value="String(row.acceptedPercentage)"
          type="number"
          @update:model-value="setPct(i, $event)"
        />
      </div>
      <button
        aria-label="Remover tipo"
        class="flex items-center justify-center"
        style="height: 40px; border: none; background: var(--surface-sunken); border-radius: var(--radius-md); cursor: pointer; color: var(--danger-base)"
        @click="removeRow(row.warrantyTypeId)"
      >
        <Trash2 :size="16" />
      </button>
    </div>

    <button
      class="flex items-center"
      :disabled="!unusedNames.length"
      style="
        gap: 8px;
        align-self: flex-start;
        padding: 10px 14px;
        background: var(--surface-sunken);
        border: none;
        border-radius: var(--radius-lg);
        cursor: pointer;
        font-size: var(--text-xs);
        font-weight: var(--weight-bold);
        letter-spacing: 0.08em;
        color: var(--gci-base);
      "
      @click="addRow"
    >
      <Plus :size="14" />
      ADICIONAR TIPO
    </button>
  </div>
</template>
