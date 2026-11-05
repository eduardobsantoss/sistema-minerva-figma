<script setup lang="ts">
import type { Component } from 'vue';
import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-vue-next';
import {
  VALIDACAO_STATUS_LABEL,
  type ItemValidacao,
  type ValidacaoStatus,
} from '../../data/operacaoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="md" eyebrow="Solicitação" title="Detalhes da validação" :subtitle="`${v.titulo}`" footer-align="end" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
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
            letter-spacing: 0.12em;
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

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')" type="button">Fechar</AdminButton>
    </template>
  </AdminModal>
</template>
