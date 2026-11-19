<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { EstoqueTab, ImovelDetalhe, brl, imovelResumo, useEstoque, valorAtual, type VeiculoRef } from '@/features/estoque';
import EstoqueChip from '@/features/estoque/components/EstoqueChip.vue';

const props = defineProps<{ veiculo: VeiculoRef }>();
const emit = defineEmits<{ back: [] }>();

const estoque = useEstoque();
const imovelId = ref<string | null>(null);

const imoveis = computed(() => estoque.doVeiculo(props.veiculo));
const resumo = computed(() => {
  let mercado = 0;
  let vencidas = 0;
  for (const i of imoveis.value) {
    mercado += valorAtual(i);
    vencidas += imovelResumo(i).parcelasVencidas;
  }
  return { mercado, vencidas };
});
</script>

<template>
  <ImovelDetalhe v-if="imovelId" :imovel-id="imovelId" @back="imovelId = null" />

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Monitoramento · Estoque
        </div>
        <h2 class="flex items-center flex-wrap" style="gap: 10px; font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ veiculo.nome }}
          <EstoqueChip :label="veiculo.tipo" :tone="{ bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' }" />
          <EstoqueChip
            v-if="resumo.vencidas"
            :label="`${resumo.vencidas} parcela${resumo.vencidas === 1 ? '' : 's'} vencida${resumo.vencidas === 1 ? '' : 's'}`"
            :tone="{ bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' }"
          />
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ veiculo.cnpj ?? '—' }} · {{ imoveis.length }} {{ imoveis.length === 1 ? 'imóvel' : 'imóveis' }} em estoque · {{ brl(resumo.mercado) }}
        </p>
      </div>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <EstoqueTab :veiculo="veiculo" external-detail @open="imovelId = $event" />
    </div>
  </div>
</template>
