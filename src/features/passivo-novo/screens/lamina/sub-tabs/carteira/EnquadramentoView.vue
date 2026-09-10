<script setup lang="ts">
import { computed } from 'vue';
import { Scale, Landmark, Users } from 'lucide-vue-next';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import { brl, pct } from '../../../../data/passivoNovoData';
import type { CarteiraBundle, EnquadramentoRow } from '../../../../data/carteiraData';

const props = defineProps<{ carteira: CarteiraBundle }>();

function permitido(row: EnquadramentoRow) {
  return row.permitido === null ? '100%' : pct(row.permitido);
}

const tipoRows = computed(() =>
  props.carteira.tipoAtivo.map((r) => [r.label, permitido(r), pct(r.posicaoAtual), brl(r.vp ?? 0, true), r.status]),
);

const cedenteRows = computed(() =>
  props.carteira.limitesCedente.map((r) => [r.label, permitido(r), pct(r.posicaoAtual), r.status]),
);

const sacadoRows = computed(() =>
  props.carteira.limitesSacado.map((r) => [r.label, permitido(r), pct(r.posicaoAtual), r.status]),
);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <p style="font-size: var(--text-sm); color: var(--text-muted)">
      Base do enquadramento: {{ carteira.baseEnquadramento.label }} ({{ brl(carteira.baseEnquadramento.valor) }}).
    </p>
    <CarteiraTableCard
      title="Concentração por tipo de ativo"
      :icon="Scale"
      :columns="['Tipo de Garantia', 'Permitido', 'Atual', 'VP', 'Status']"
      col-template="1.8fr 0.9fr 0.9fr 1fr 0.8fr"
      :rows="tipoRows"
    />
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <CarteiraTableCard
        title="Enquadramento por cedente"
        :icon="Landmark"
        :columns="['Regra', 'Permitido', 'Atual', 'Status']"
        col-template="1.6fr 0.9fr 0.9fr 0.8fr"
        :rows="cedenteRows"
      />
      <CarteiraTableCard
        title="Enquadramento por sacado"
        :icon="Users"
        :columns="['Regra', 'Permitido', 'Atual', 'Status']"
        col-template="1.6fr 0.9fr 0.9fr 0.8fr"
        :rows="sacadoRows"
      />
    </div>
  </div>
</template>
