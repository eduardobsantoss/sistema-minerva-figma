<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { nomesAgrupamentos, type Agrupamento, type OperacaoVinculavel } from '../../../data/riscoData';

const props = defineProps<{ op: OperacaoVinculavel; agrupamentos: Agrupamento[]; checked: boolean }>();
const emit = defineEmits<{ toggle: [] }>();

const nomes = computed(() => nomesAgrupamentos(props.op, props.agrupamentos));
const subtitle = computed(() => (nomes.value.length > 0 ? `Agrupamento: ${nomes.value.join(', ')}` : 'Sem agrupamento'));
const badgeBg = computed(() => (props.op.tipo === 'CRA' ? 'var(--agro-light)' : 'var(--gci-light)'));
const badgeColor = computed(() => (props.op.tipo === 'CRA' ? 'var(--agro-base)' : 'var(--gci-base)'));
</script>

<template>
  <div
    class="flex items-center"
    :style="{ gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--border-default)', cursor: 'pointer', background: checked ? 'var(--surface-selected)' : 'transparent' }"
    @click="emit('toggle')"
  >
    <div @click.stop>
      <Checkbox :checked="checked" @change="emit('toggle')" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ op.nome }}
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ subtitle }}
      </div>
    </div>
    <span
      :style="{
        fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
        padding: '3px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
        background: badgeBg, color: badgeColor,
      }"
    >
      {{ op.tipo }}
    </span>
  </div>
</template>
