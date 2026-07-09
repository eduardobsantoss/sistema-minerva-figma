<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
import type { AtivoPessoa } from '../../../../data/ativoData';
import { EmptyState } from '../../shared';

defineProps<{ pessoa: AtivoPessoa }>();
</script>

<template>
  <EmptyState
    v-if="pessoa.enderecos.length === 0"
    :icon="MapPin"
    title="Nenhum endereço cadastrado"
    hint="Não há endereços registrados para esta pessoa."
  />
  <div v-else class="flex flex-col" style="gap: 12px">
    <div
      v-for="e in pessoa.enderecos"
      :key="e.id"
      style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
    >
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
        {{ e.localidade }}, {{ e.numero }} — {{ e.bairro }}
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ e.cidade }}/{{ e.uf }} · CEP {{ e.cep }} · {{ e.pais }}
      </div>
      <div v-if="e.infoAdicionais" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
        {{ e.infoAdicionais }}
      </div>
    </div>
  </div>
</template>
