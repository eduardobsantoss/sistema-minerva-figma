<script setup lang="ts">
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao>; solicitacaoId: string }>(), {
  det: '',
  solicitacaoId: ''
});
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
          {{ solicitacaoId }} · Solicitação de Operação
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          Validações
        </h2>
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        :style="{ gap: '12px', padding: '16px 18px', background: k.bg, borderRadius: 'var(--radius-xl)' }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.60)',
            color: k.fg,
            flexShrink: 0,
          }"
        >
          <component :is="k.icon" :size="18" />
        </div>
        <div>
          <div
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: k.fg,
              textTransform: 'uppercase',
              marginBottom: '4px',
              opacity: 0.8,
            }"
          >
            {{ k.label }}
          </div>
          <div :style="{ fontSize: '24px', fontWeight: 'var(--weight-bold)', color: k.fg, lineHeight: 1 }">
            {{ k.count }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: var(--text-xs);
        color: var(--text-muted);
        padding: 10px 14px;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
      "
    >
      <AlertCircle :size="14" />
      As validações só rodam quando a operação tiver título e veículo vinculado. Use "Revalidar todas" para
      atualizar.
    </div>

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div class="flex flex-col" style="gap: 32px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
      </div>
    </div>
  </div>
</template>
