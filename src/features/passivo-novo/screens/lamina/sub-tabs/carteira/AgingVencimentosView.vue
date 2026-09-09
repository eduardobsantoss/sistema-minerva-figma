<script setup lang="ts">
import { Calendar, AlertTriangle } from 'lucide-vue-next';
import AgingBarsCard from '../../../../components/AgingBarsCard.vue';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import { brl, num, pct } from '../../../../data/passivoNovoData';
import type { CarteiraBundle } from '../../../../data/carteiraData';

defineProps<{ carteira: CarteiraBundle }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <AgingBarsCard title="Aging de próximos vencimentos" :icon="Calendar" :items="carteira.agingVencimentos" />
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <CarteiraTableCard
        title="5 maiores vencimentos em 30 dias"
        :icon="Calendar"
        :columns="['#', 'Devedor', 'Vencimento', 'Dias', 'VP']"
        col-template="0.4fr 2fr 1fr 0.6fr 1fr"
        :rows="carteira.vencimentos30d.map((r, i) => [String(i + 1), r.devedor, r.vencimento, num(r.dias, 0), brl(r.vp, true)])"
      />
      <CarteiraTableCard
        title="5 maiores cedentes vencidos"
        :icon="AlertTriangle"
        :columns="['#', 'Cedente', 'Lastros', 'Dias venc.', 'VP', '% PL']"
        col-template="0.4fr 2fr 0.7fr 0.8fr 1fr 0.7fr"
        :rows="carteira.cedentesVencidos.map((r, i) => [String(i + 1), r.cedente, num(r.lastros, 0), num(r.diasVenc, 0), brl(r.vp, true), pct(r.pctPl)])"
      />
    </div>
  </div>
</template>
