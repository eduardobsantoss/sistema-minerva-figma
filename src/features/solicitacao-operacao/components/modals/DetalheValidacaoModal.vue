<script setup lang="ts">
import type { Component } from 'vue';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-vue-next';
import {
  VALIDACAO_STATUS_LABEL,
  type ItemValidacao,
  type ValidacaoStatus,
} from '../../data/operacaoData';

defineProps<{ v: ItemValidacao }>();
const emit = defineEmits<{ close: [] }>();

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
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Detalhes da validação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ v.titulo }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="flex: 1; overflow-y: auto; padding: 24px 28px; gap: 16px">
        <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
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
            class="flex items-center"
            :style="{
              gap: '4px',
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
            <component :is="valTone[v.status].icon" :size="11" />
            {{ VALIDACAO_STATUS_LABEL[v.status] }}
          </span>
        </div>

        <p style="font-size: var(--text-sm); color: var(--text-default); line-height: 1.5; margin: 0">
          {{ v.descricao }}
        </p>

        <div v-if="v.erros?.length">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Erros
          </div>
          <div class="flex flex-col" style="gap: 8px">
            <div
              v-for="(erro, i) in v.erros"
              :key="i"
              style="
                padding: 12px 14px;
                background: var(--status-danger-bg);
                border: 1px solid var(--danger-light);
                border-radius: var(--radius-lg);
                font-size: var(--text-sm);
                color: var(--text-strong);
                line-height: 1.5;
              "
            >
              {{ erro }}
            </div>
          </div>
        </div>

        <div
          v-else
          style="
            padding: 16px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-muted);
          "
        >
          Nenhum erro detalhado para esta validação.
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="emit('close')"
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
