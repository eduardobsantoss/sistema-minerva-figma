<script setup lang="ts">
import { ref } from 'vue';
import { RANK_ATIVO_SEED, type RankItemAtivo } from '../data/fundoPadraoData';
import OperationFundRankList from '../components/fundo-padrao/OperationFundRankList.vue';
import OperationFundRankEditor from '../components/fundo-padrao/OperationFundRankEditor.vue';

const activeRank = ref<RankItemAtivo[]>([...RANK_ATIVO_SEED]);

function handleSaveRank(items: RankItemAtivo[]) {
  activeRank.value = items.map((item, i) => ({
    ...item,
    priority: i + 1,
    isCurrent: i === 0,
  }));
}
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Fundo Padrão
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 640px; line-height: 1.5">
        Configure a ordem de prioridade dos fundos utilizados nas operações e acompanhe limites e utilização do rank
        ativo.
      </p>
    </div>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Rank ativo
      </div>
      <OperationFundRankList :items="activeRank" />
    </section>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Edição do rank
      </div>
      <OperationFundRankEditor :active-rank="activeRank" @save="handleSaveRank" />
    </section>
  </div>
</template>
