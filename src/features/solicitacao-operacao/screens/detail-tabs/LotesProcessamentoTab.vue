<script setup lang="ts">
import { ref } from 'vue';
import {
  Layers, AlertTriangle, Files, CheckCircle2, Clock, XCircle, Loader2,
} from 'lucide-vue-next';
import {
  LOTE_STATUS_LABEL,
  LOTE_STATUS_TONE,
  seedLotesProcessamento,
  type LoteProcessamento,
} from '../../data/lotesProcessamentoData';
import { Section, EmptyState } from './shared';
import VerArquivosLoteModal from '../../components/modals/VerArquivosLoteModal.vue';
import VerErrosLoteModal from '../../components/modals/VerErrosLoteModal.vue';

const lotes = ref(seedLotesProcessamento());
const hoveredId = ref<string | null>(null);
const loteArquivos = ref<LoteProcessamento | null>(null);
const loteErros = ref<LoteProcessamento | null>(null);

function openArquivos(lote: LoteProcessamento) {
  loteArquivos.value = lote;
}

function openErros(lote: LoteProcessamento) {
  loteErros.value = lote;
}
</script>

<template>
  <Section title="Lotes em Processamento">
    <EmptyState
      v-if="lotes.length === 0"
      :icon="Layers"
      title="Nenhum lote em processamento"
      hint="Os lotes de arquivos XML enviados nesta solicitação aparecerão aqui."
    />

    <div
      v-else
      class="grid"
      style="
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      "
    >
      <div
        v-for="lote in lotes"
        :key="lote.id"
        class="flex flex-col"
        :style="{
          gap: '16px',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredId === lote.id ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          boxShadow:
            hoveredId === lote.id
              ? '0 20px 40px -16px rgba(8,60,74,0.10)'
              : 'none',
          transform: hoveredId === lote.id ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @mouseenter="hoveredId = lote.id"
        @mouseleave="hoveredId = null"
      >
        <div class="flex items-start justify-between" style="gap: 12px">
          <div
            class="flex items-center justify-center"
            style="
              width: 42px;
              height: 42px;
              border-radius: var(--radius-lg);
              background: var(--accent-bg);
              color: var(--accent);
              flex-shrink: 0;
            "
          >
            <Layers :size="20" />
          </div>
          <span
            style="
              display: inline-flex;
              align-items: center;
              height: 24px;
              padding: 0 10px;
              border-radius: var(--radius-sm);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              text-transform: uppercase;
              white-space: nowrap;
            "
            :style="{
              background: LOTE_STATUS_TONE[lote.status].bg,
              color: LOTE_STATUS_TONE[lote.status].fg,
            }"
          >
            {{ LOTE_STATUS_LABEL[lote.status] }}
          </span>
        </div>

        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Lote
          </div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              line-height: 1.35;
            "
          >
            {{ lote.nome }}
          </div>
        </div>

        <div
          class="grid"
          style="
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            padding: 12px;
            background: var(--surface-sunken);
            border-radius: var(--radius-lg);
          "
        >
          <div class="flex flex-col" style="gap: 2px; align-items: center">
            <Files :size="13" style="color: var(--text-muted)" />
            <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ lote.total }}
            </div>
            <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.06em; color: var(--text-muted); text-transform: uppercase">
              Total
            </div>
          </div>
          <div class="flex flex-col" style="gap: 2px; align-items: center">
            <CheckCircle2 :size="13" style="color: var(--status-success-text)" />
            <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--status-success-text); font-variant-numeric: tabular-nums">
              {{ lote.processados }}
            </div>
            <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.06em; color: var(--text-muted); text-transform: uppercase">
              Processados
            </div>
          </div>
          <div class="flex flex-col" style="gap: 2px; align-items: center">
            <component
              :is="lote.pendentes > 0 && lote.status === 'PROCESSANDO' ? Loader2 : Clock"
              :size="13"
              style="color: var(--text-muted)"
            />
            <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ lote.pendentes }}
            </div>
            <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.06em; color: var(--text-muted); text-transform: uppercase">
              Pendentes
            </div>
          </div>
          <div class="flex flex-col" style="gap: 2px; align-items: center">
            <XCircle :size="13" style="color: var(--status-danger-text)" />
            <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--status-danger-text); font-variant-numeric: tabular-nums">
              {{ lote.falhas }}
            </div>
            <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.06em; color: var(--text-muted); text-transform: uppercase">
              Falhas
            </div>
          </div>
        </div>

        <div class="flex items-center" style="gap: 8px; margin-top: auto">
          <button
            type="button"
            class="flex items-center"
            style="
              flex: 1;
              gap: 6px;
              height: 36px;
              justify-content: center;
              padding: 0 12px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
            "
            :style="{
              color: lote.falhas > 0 ? 'var(--action-danger-text-only)' : 'var(--text-muted)',
              opacity: lote.falhas > 0 ? 1 : 0.55,
              cursor: lote.falhas > 0 ? 'pointer' : 'not-allowed',
            }"
            :disabled="lote.falhas === 0"
            @click="openErros(lote)"
          >
            <AlertTriangle :size="13" /> Ver Erros
          </button>
          <button
            type="button"
            class="flex items-center"
            style="
              flex: 1;
              gap: 6px;
              height: 36px;
              justify-content: center;
              padding: 0 12px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
            "
            @click="openArquivos(lote)"
          >
            <Files :size="13" /> Ver Arquivos
          </button>
        </div>
      </div>
    </div>
  </Section>

  <VerArquivosLoteModal
    v-if="loteArquivos"
    :lote="loteArquivos"
    @close="loteArquivos = null"
  />

  <VerErrosLoteModal
    v-if="loteErros"
    :lote="loteErros"
    @close="loteErros = null"
  />
</template>
