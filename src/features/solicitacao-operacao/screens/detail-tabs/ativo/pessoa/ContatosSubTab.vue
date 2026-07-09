<script setup lang="ts">
import { Phone, Trash2 } from 'lucide-vue-next';
import type { AtivoPessoa } from '../../../../data/ativoData';
import { EmptyState } from '../../shared';

defineProps<{ pessoa: AtivoPessoa }>();
</script>

<template>
  <EmptyState
    v-if="pessoa.contatos.length === 0"
    :icon="Phone"
    title="Nenhum contato cadastrado"
    hint="Não há contatos registrados para esta pessoa."
  />
  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid items-center"
      style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase"
    >
      <div>Nome</div>
      <div>E-mail</div>
      <div>Telefone</div>
      <div />
    </div>
    <div
      v-for="c in pessoa.contatos"
      :key="c.id"
      class="grid items-center"
      style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
      <div style="color: var(--text-muted)">{{ c.email }}</div>
      <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.ddi }} {{ c.telefone }}</div>
      <div class="flex justify-end">
        <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)">
          <Trash2 :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>
