<script setup lang="ts">
import { Users, Building2, List, FileSpreadsheet } from 'lucide-vue-next';
import PddRankingCard from '../../../../components/PddRankingCard.vue';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import { brl, pct } from '../../../../data/passivoNovoData';
import type { CarteiraBundle } from '../../../../data/carteiraData';

defineProps<{ carteira: CarteiraBundle }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <PddRankingCard title="Maiores PDDs por sacado" :icon="Users" :items="carteira.pddPorSacado" />
      <PddRankingCard title="Maiores PDDs por cedente" :icon="Building2" :items="carteira.pddPorCedente" />
    </div>
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <CarteiraTableCard
        title="Aging list"
        :icon="List"
        :columns="['Faixa', 'VN', 'VP', '% carteira']"
        col-template="1.4fr 1fr 1fr 0.9fr"
        :rows="carteira.agingList.map((r) => [r.faixa, brl(r.vn, true), brl(r.vp, true), pct(r.pctCarteira)])"
      />
      <CarteiraTableCard
        title="Abertura do PDD"
        :icon="FileSpreadsheet"
        :columns="['Cedente', 'Valor aberto', 'PDD', 'Status']"
        col-template="1.6fr 1fr 0.9fr 1.2fr"
        :rows="carteira.aberturaPdd.map((r) => [r.cedente, brl(r.valorAberto, true), brl(r.pdd, true), r.status])"
      />
    </div>
  </div>
</template>
