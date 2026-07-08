<script setup lang="ts">
import { ref } from 'vue';
import { brl, type FidcClass } from '../../data/fidcsData';

defineProps<{ rows: FidcClass[] }>();
const emit = defineEmits<{ open: [id: string] }>();

const rowHover = ref<string | null>(null);
</script>

<template>
  <div
    v-if="!rows.length"
    style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
  >
    Nenhuma classe cadastrada para este fundo.
  </div>
  <div v-else>
    <div
      class="grid"
      style="
        grid-template-columns: 2.4fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr;
        padding: 14px 20px;
        background: var(--surface-sunken);
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.14em;
        color: var(--text-muted);
        text-transform: uppercase;
      "
    >
      <div>Nome da Unidade</div>
      <div>Status</div>
      <div>VR. Nominal</div>
      <div>VR. Aberto</div>
      <div>VR. Presente</div>
      <div style="text-align: right">VR. Vencido</div>
    </div>
    <div
      v-for="r in rows"
      :key="r.id"
      class="grid items-center"
      :style="{
        gridTemplateColumns: '2.4fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr',
        padding: '18px 20px',
        borderTop: '1px solid var(--border-default)',
        borderLeft: '3px solid var(--gci-base)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
        background: rowHover === r.id ? 'var(--surface-sunken)' : 'transparent',
      }"
      @click="emit('open', r.id)"
      @mouseenter="rowHover = r.id"
      @mouseleave="rowHover = null"
    >
      <div class="flex items-center" style="gap: 12px">
        <div
          class="flex items-center justify-center"
          style="
            width: 32px;
            height: 32px;
            border-radius: var(--radius-md);
            background: var(--surface-sunken);
            color: var(--gci-base);
            font-size: var(--text-xs);
            font-weight: var(--weight-bold);
          "
        >
          T
        </div>
        <div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-size: var(--text-sm)">
            {{ r.name }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ r.cnpj }}
          </div>
        </div>
      </div>
      <div>
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            padding: 5px 10px;
            border-radius: 9999px;
            background: var(--success-light);
            color: var(--success-dark);
          "
        >
          EM ANDAMENTO
        </span>
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(r.vrNominal) }}
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(r.vrAberto) }}
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(r.vrPresente) }}
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums; text-align: right">
        {{ brl(r.vrVencido) }}
      </div>
    </div>
  </div>
</template>
