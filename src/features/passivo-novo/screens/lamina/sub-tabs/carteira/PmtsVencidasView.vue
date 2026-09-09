<script setup lang="ts">
import { FileWarning } from 'lucide-vue-next';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import { brl, num } from '../../../../data/passivoNovoData';
import type { CarteiraBundle } from '../../../../data/carteiraData';

defineProps<{ carteira: CarteiraBundle }>();
</script>

<template>
  <CarteiraTableCard
    title="Títulos com PMTs vencidas"
    :icon="FileWarning"
    :columns="['#', 'Lastro', 'Cedente', 'Tipo', 'Data PMT', 'Dias venc.', 'Valor PMT']"
    col-template="0.4fr 0.8fr 2.2fr 0.7fr 1fr 0.8fr 1fr"
    :rows="carteira.pmtsVencidas.map((r, i) => [String(i + 1), r.lastro, r.cedente, r.tipo, r.dataPmt, num(r.diasVenc, 0), brl(r.valorPmt, true)])"
  />
</template>
