<script setup lang="ts">
import { AlertCircle, CheckCircle2, XCircle, Clock, Loader2, Send, Eye, ListTree } from 'lucide-vue-next';
import type { Component } from 'vue';
import {
  VALIDACAO_STATUS_LABEL,
  type ValidacaoStatus,
  type ItemValidacao,
} from '../../../data/operacaoData';
import { GhostButton } from '../shared';

defineProps<{ v: ItemValidacao }>();
const emit = defineEmits<{
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
}>();

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: Component }> = {
  PENDENTE: { bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', icon: Clock },
  PROCESSANDO: { bg: 'var(--status-active-bg)', fg: 'var(--gci-base)', icon: Loader2 },
  OK: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  NAO_OK: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle },
  EXCECAO: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
};
</script>

<template>
  <div
    :style="{
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${v.status === 'NAO_OK' || v.status === 'EXCECAO' ? 'var(--danger-light)' : 'var(--border-default)'}`,
      background: v.status === 'NAO_OK' ? 'var(--status-danger-bg)' : 'var(--surface-card)',
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
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
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
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
                background: valTone[v.status].bg,
                color: valTone[v.status].fg,
                textTransform: 'uppercase',
              }"
            >
              {{ VALIDACAO_STATUS_LABEL[v.status] }}
            </span>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 3px">{{ v.descricao }}</div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 8px; flex-shrink: 0">
        <GhostButton
          v-if="v.erros?.length"
          :icon="ListTree"
          @click="emit('verDetalhes', v)"
        >
          Ver detalhes
        </GhostButton>
        <template v-if="v.exigeAutorizacao">
          <GhostButton :icon="Send">Solicitar autorização</GhostButton>
          <GhostButton v-if="v.evidencia" :icon="Eye" @click="emit('verEvidencia', v)">Ver evidência</GhostButton>
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
            @click="emit('autorizar', v)"
          >
            <CheckCircle2 :size="15" /> Autorizar
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
