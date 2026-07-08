<script setup lang="ts">
import { AlertCircle, CheckCircle2, XCircle, Send } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { ValidacaoStatus, ItemValidacao } from '../../../data/operacaoData';
import { GhostButton } from '../shared';

defineProps<{ v: ItemValidacao }>();

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: Component }> = {
  OK: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  ALERTA: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
  ERRO: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle },
};
</script>

<template>
  <div
    :style="{
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${v.status === 'ERRO' ? 'var(--danger-light)' : 'var(--border-default)'}`,
      background: v.status === 'ERRO' ? 'var(--status-danger-bg)' : 'var(--surface-card)',
      padding: '16px',
    }"
  >
    <div class="flex items-center justify-between" style="gap: 12px">
      <div class="flex items-center" style="gap: 12px; min-width: 0">
        <span
          class="flex items-center justify-center"
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: valTone[v.status].bg,
            color: valTone[v.status].fg,
            flexShrink: 0,
          }"
        >
          <component :is="valTone[v.status].icon" :size="17" />
        </span>
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              v.titulo
            }}</span>
            <span
              style="
                font-size: 9px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 2px 7px;
                border-radius: var(--radius-sm);
                background: var(--status-active-bg);
                color: var(--gci-base);
                text-transform: uppercase;
              "
            >
              {{ v.area }}
            </span>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 3px">{{ v.descricao }}</div>
        </div>
      </div>
      <div v-if="v.exigeAutorizacao" class="flex items-center" style="gap: 8px; flex-shrink: 0">
        <GhostButton :icon="Send">Solicitar autorização</GhostButton>
        <button
          class="flex items-center"
          style="
            gap: 6px;
            height: 38px;
            padding: 0 16px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.06em;
          "
        >
          <CheckCircle2 :size="15" /> Autorizar
        </button>
      </div>
    </div>
  </div>
</template>
