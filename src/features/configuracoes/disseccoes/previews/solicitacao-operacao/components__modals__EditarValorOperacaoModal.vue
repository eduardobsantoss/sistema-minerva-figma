<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, AlertTriangle } from 'lucide-vue-next';
withDefaults(defineProps<{ valorAtual: number; feePercent: number }>(), {
  valorAtual: 2,
  feePercent: 2
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
     
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
            Editar valor da operação
          </h3>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Atual: {{ brl(valorAtual) }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>

        <div
          style="
            padding: 14px 16px;
            background: var(--surface-sunken);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
          "
        >
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
            Prévia do impacto
          </div>
          <div class="flex items-center justify-between" style="margin-bottom: 8px">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">FEE ({{ feePercent }}%)</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ novoFee != null ? brl(novoFee) : '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">Valor da operação</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ novoValor != null ? brl(novoValor) : '—' }}
            </span>
          </div>
        </div>

        <div
          class="flex items-start"
          style="gap: 8px; font-size: var(--text-xs); color: var(--warning-dark); font-weight: var(--weight-semibold)"
        >
          <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
          Alterar o valor recalcula o Valor FEE e pode afetar validações e ativos vinculados.
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)">
        <button
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
         
        >
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canConfirm ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
