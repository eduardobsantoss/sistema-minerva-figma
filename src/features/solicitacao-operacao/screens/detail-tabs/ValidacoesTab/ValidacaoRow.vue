<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Send,
  Eye,
  ListTree,
  SlidersHorizontal,
  MessageSquare,
  MoreVertical,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import {
  VALIDACAO_STATUS_LABEL,
  type ValidacaoStatus,
  type ItemValidacao,
} from '../../../data/operacaoData';

const props = defineProps<{ v: ItemValidacao }>();
const emit = defineEmits<{
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
  habilitarOperacoes: [v: ItemValidacao];
  mensagens: [v: ItemValidacao];
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: Component }> = {
  PENDENTE: { bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', icon: Clock },
  PROCESSANDO: { bg: 'var(--status-active-bg)', fg: 'var(--gci-base)', icon: Loader2 },
  OK: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  NAO_OK: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle },
  EXCECAO: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
};

type MenuAction = {
  key: string;
  label: string;
  icon: Component;
  run: () => void;
};

const menuActions = computed<MenuAction[]>(() => {
  const v = props.v;
  const items: MenuAction[] = [];

  if (v.controleOperacoes) {
    items.push({
      key: 'habilitar',
      label: 'Habilitar operações',
      icon: SlidersHorizontal,
      run: () => emit('habilitarOperacoes', v),
    });
  } else {
    if (v.erros?.length) {
      items.push({
        key: 'detalhes',
        label: 'Ver detalhes',
        icon: ListTree,
        run: () => emit('verDetalhes', v),
      });
    }
    if (v.exigeAutorizacao) {
      items.push({
        key: 'solicitar',
        label: 'Solicitar autorização',
        icon: Send,
        run: () => {},
      });
      if (v.evidencia) {
        items.push({
          key: 'evidencia',
          label: 'Ver evidência',
          icon: Eye,
          run: () => emit('verEvidencia', v),
        });
      }
      items.push({
        key: 'autorizar',
        label: 'Autorizar',
        icon: CheckCircle2,
        run: () => emit('autorizar', v),
      });
    }
  }

  // Mensagens — disponível em todas as validações
  items.push({
    key: 'mensagens',
    label: 'Mensagens',
    icon: MessageSquare,
    run: () => emit('mensagens', v),
  });

  return items;
});

function handleDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}

function handleAction(a: MenuAction) {
  open.value = false;
  a.run();
}

onMounted(() => document.addEventListener('mousedown', handleDocClick));
onUnmounted(() => document.removeEventListener('mousedown', handleDocClick));
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

      <div ref="rootRef" style="position: relative; flex-shrink: 0">
        <button
          type="button"
          aria-label="Ações"
          class="flex items-center"
          style="
            gap: 8px;
            height: 38px;
            padding: 0 14px;
            background: var(--surface-card);
            color: var(--text-strong);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.06em;
          "
          @click="open = !open"
        >
          <MoreVertical :size="15" />
          Ações
        </button>
        <div
          v-if="open"
          class="flex flex-col"
          style="
            position: absolute;
            top: 44px;
            right: 0;
            z-index: 50;
            min-width: 220px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
            padding: 6px;
          "
        >
          <button
            v-for="a in menuActions"
            :key="a.key"
            type="button"
            class="flex items-center action-item"
            style="
              gap: 10px;
              padding: 10px 12px;
              background: none;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              text-align: left;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              width: 100%;
            "
            @click="handleAction(a)"
          >
            <component :is="a.icon" :size="16" style="color: var(--text-muted); flex-shrink: 0" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-item:hover {
  background: var(--surface-sunken);
}
</style>
