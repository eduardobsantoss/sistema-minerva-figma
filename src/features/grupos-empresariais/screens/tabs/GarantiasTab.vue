<script setup lang="ts">
import { computed } from 'vue';
import GarantiaMinutaStep from '@/features/solicitacao-operacao/components/modals/minuta/GarantiaMinutaStep.vue';
import type { GarantiaMinuta } from '@/features/solicitacao-operacao/data/minutaData';

const props = defineProps<{ garantias: GarantiaMinuta[] }>();
const emit = defineEmits<{ 'update:garantias': [items: GarantiaMinuta[]] }>();

const model = computed({
  get: () => props.garantias,
  set: (next) => emit('update:garantias', next),
});
</script>

<template>
  <GarantiaMinutaStep v-model:garantias="model" :edit-on-row-click="false" :show-possui-toggle="false" />
</template>
