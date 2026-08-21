<script setup lang="ts">
import type { ParametrizacaoAdicional } from '../../data/riscoData';

defineProps<{ itens: ParametrizacaoAdicional[] }>();
const emit = defineEmits<{ toggle: [id: string] }>();

const COLS = 'minmax(220px, 1.4fr) minmax(320px, 2.4fr) 120px';
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
    <div
      class="grid items-center"
      :style="{
        gridTemplateColumns: COLS,
        padding: '12px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.10em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        columnGap: '16px',
      }"
    >
      <div>Parâmetro</div>
      <div>Descrição</div>
      <div style="text-align: center">Validação</div>
    </div>

    <div
      v-for="item in itens"
      :key="item.id"
      class="grid items-center pa-row"
      :style="{
        gridTemplateColumns: COLS,
        padding: '14px 20px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        columnGap: '16px',
      }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ item.parametro }}</div>
      <div style="color: var(--text-default); line-height: 1.45">{{ item.descricao }}</div>
      <div class="flex justify-center">
        <button
          type="button"
          :aria-label="item.valida ? 'Válida' : 'Não valida'"
          :aria-pressed="item.valida"
          style="background: none; border: none; cursor: pointer; padding: 0"
          @click="emit('toggle', item.id)"
        >
          <span
            :style="{
              display: 'block',
              width: '36px',
              height: '20px',
              borderRadius: 'var(--radius-full)',
              background: item.valida ? 'var(--gci-base)' : 'var(--neutral-300)',
              position: 'relative',
              transition: 'background var(--duration-base) var(--ease-standard)',
            }"
          >
            <span
              :style="{
                position: 'absolute',
                top: '2px',
                left: item.valida ? '18px' : '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: 'var(--shadow-xs)',
                transition: 'left var(--duration-base) var(--ease-standard)',
              }"
            />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
