<script setup lang="ts">
import { computed } from 'vue';
import { brl, warrantyTypeName } from '../../../data/semiestruturadasData';
import type { NewSemiData } from '../types';
import Input from '../Input.vue';
import FieldLabel from '../FieldLabel.vue';

const form = defineModel<NewSemiData>({ required: true });

const preview = computed(() => {
  let total = 0;
  for (const row of form.value.required) {
    if (row.mode === 'value') total += row.value ?? 0;
  }
  return total;
});

function setMode(id: number, mode: 'value' | 'percentage') {
  form.value.required = form.value.required.map((r) =>
    r.warrantyTypeId === id ? { ...r, mode, value: undefined, percentage: undefined } : r,
  );
}

function parseInput(raw: string | number | null | undefined): number | undefined {
  if (raw === '' || raw == null) return undefined;
  const n = Number(String(raw).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

function setValue(id: number, raw: string | number) {
  const n = parseInput(raw);
  form.value.required = form.value.required.map((r) =>
    r.warrantyTypeId === id ? { ...r, value: n } : r,
  );
}

function setPct(id: number, raw: string | number) {
  const n = parseInput(raw);
  form.value.required = form.value.required.map((r) =>
    r.warrantyTypeId === id ? { ...r, percentage: n } : r,
  );
}
</script>

<template>
  <div class="flex flex-col" style="gap: 14px">
    <p style="font-size: var(--text-sm); color: var(--text-muted)">
      Defina o exigido em valor ou percentual sobre o saldo em aberto. Na criação o saldo é 0 — o R$ recalcula depois.
    </p>

    <div
      v-if="!form.required.length"
      style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)"
    >
      Nenhum tipo aceito no passo anterior.
    </div>

    <div
      v-for="row in form.required"
      :key="row.warrantyTypeId"
      style="padding: 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 12px"
    >
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
        {{ warrantyTypeName(row.warrantyTypeId) }}
      </div>
      <div class="flex" style="gap: 8px">
        <button
          type="button"
          :style="{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.10em',
            background: row.mode === 'value' ? 'var(--gci-base)' : 'var(--surface-sunken)',
            color: row.mode === 'value' ? '#fff' : 'var(--text-muted)',
          }"
          @click="setMode(row.warrantyTypeId, 'value')"
        >
          VALOR
        </button>
        <button
          type="button"
          :style="{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.10em',
            background: row.mode === 'percentage' ? 'var(--gci-base)' : 'var(--surface-sunken)',
            color: row.mode === 'percentage' ? '#fff' : 'var(--text-muted)',
          }"
          @click="setMode(row.warrantyTypeId, 'percentage')"
        >
          PERCENTUAL
        </button>
      </div>
      <div v-if="row.mode === 'value'">
        <FieldLabel>Valor exigido</FieldLabel>
        <Input
          :model-value="row.value != null ? String(row.value) : ''"
          type="text"
          inputmode="decimal"
          placeholder="0,00"
          @update:model-value="setValue(row.warrantyTypeId, $event)"
        />
      </div>
      <div v-else>
        <FieldLabel>Percentual exigido sobre saldo em aberto</FieldLabel>
        <Input
          :model-value="row.percentage != null ? String(row.percentage) : ''"
          type="text"
          inputmode="decimal"
          placeholder="0"
          @update:model-value="setPct(row.warrantyTypeId, $event)"
        />
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px">
          Com saldo 0 na criação, esta linha soma R$ 0 à garantia exigida.
        </div>
      </div>
    </div>

    <div
      style="padding: 14px 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center"
    >
      <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        Garantia exigida (preview)
      </span>
      <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(preview) }}
      </span>
    </div>
  </div>
</template>
