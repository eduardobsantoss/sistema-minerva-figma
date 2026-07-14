<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { ArrowLeft, MoreVertical, RefreshCw, Download, FileText, BarChart3 } from 'lucide-vue-next';
import {
  statusDisparoColor,
  statusDisparoLabel,
  taxaEntrega,
  taxaAbertura,
  fmtPct,
  type DisparoNotificacao,
} from '../data/resultadoNotificacoesData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const props = defineProps<{ disparo: DisparoNotificacao }>();
const emit = defineEmits<{
  back: [];
  reenviar: [id: string];
  exportar: [id: string];
}>();

type Tab = 'resumo' | 'destinatarios';

const TABS = [
  { key: 'resumo' as const, label: 'Resumo', icon: BarChart3 },
  { key: 'destinatarios' as const, label: 'Destinatários', icon: FileText },
];

const tab = ref<Tab>('resumo');
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusDisparoColor(props.disparo.status));

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) {
    actionMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Cobrança · Resultado de Notificação
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          {{ disparo.lote }}
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusDisparoLabel(disparo.status).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ disparo.campanha }} · {{ disparo.dataHora }}
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-strong);
          "
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="
            position: absolute;
            top: 52px;
            right: 0;
            z-index: 50;
            min-width: 180px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 6px;
          "
        >
          <button
            v-if="disparo.status !== 'PROCESSANDO'"
            class="flex items-center disp-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="
              actionMenuOpen = false;
              emit('reenviar', disparo.id);
            "
          >
            <RefreshCw :size="15" style="color: var(--text-muted)" />
            Reenviar lote
          </button>
          <button
            class="flex items-center disp-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="
              actionMenuOpen = false;
              emit('exportar', disparo.id);
            "
          >
            <Download :size="15" style="color: var(--text-muted)" />
            Exportar
          </button>
        </div>
      </div>
    </div>

    <div
      class="relative overflow-hidden grid"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Destinatários
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">
          {{ disparo.totalDestinatarios }}
        </div>
      </div>
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Entregues
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">
          {{ disparo.entregues }}
        </div>
        <div style="font-size: var(--text-xs); color: var(--agro-base); margin-top: 4px">
          {{ fmtPct(taxaEntrega(disparo)) }}
        </div>
      </div>
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Abertos
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">
          {{ disparo.abertos }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 4px">
          {{ fmtPct(taxaAbertura(disparo)) }}
        </div>
      </div>
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Falhas
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; color: #FCA5A5">
          {{ disparo.falhas }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div v-if="tab === 'resumo'" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Canal
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ disparo.canal }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Veículo
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ disparo.veiculoNome }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Notificações vinculadas
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ disparo.notificacaoIds.length }}
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col" style="gap: 10px">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Notificações do lote
        </div>
        <div
          v-for="nid in disparo.notificacaoIds"
          :key="nid"
          style="
            padding: 12px 14px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-sunken);
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ nid.toUpperCase() }}
        </div>
        <div
          v-if="!disparo.notificacaoIds.length"
          style="padding: 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
        >
          Nenhuma notificação vinculada a este disparo.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.disp-action-item:hover {
  background: var(--surface-sunken);
}
</style>
