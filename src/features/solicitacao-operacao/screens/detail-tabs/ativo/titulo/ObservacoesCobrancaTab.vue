<script setup lang="ts">
import { ref } from 'vue';
import { MessageSquare, Paperclip, Send, User } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import { EmptyState } from '../../shared';

defineProps<{ ativo: ContratoAtivo }>();

const mensagem = ref('');
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex" style="gap: 14px">
      <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: 9999px; background: var(--gci-light); color: var(--gci-base); flex-shrink: 0">
        <User :size="20" />
      </div>
      <div style="flex: 1">
        <textarea
          v-model="mensagem"
          placeholder="Escreva uma observação de cobrança..."
          rows="3"
          style="width: 100%; padding: 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; resize: vertical; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit"
        />
        <div class="flex items-center justify-between" style="margin-top: 12px">
          <button class="flex items-center" style="gap: 8px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.06em">
            <Paperclip :size="15" /> ANEXAR
          </button>
          <button class="flex items-center" style="gap: 8px; height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em">
            <Send :size="14" /> Postar
          </button>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="ativo.observacoesCobranca.length === 0"
      :icon="MessageSquare"
      title="Nenhuma observação de cobrança"
      hint="Registre observações sobre a cobrança deste título."
    />
    <div v-else class="flex flex-col" style="gap: 12px">
      <div
        v-for="(obs, i) in ativo.observacoesCobranca"
        :key="i"
        style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
      >
        <div style="font-size: var(--text-sm); color: var(--text-strong)">{{ obs.mensagem }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px">{{ obs.autor }} · {{ obs.data }}</div>
      </div>
    </div>
  </div>
</template>
