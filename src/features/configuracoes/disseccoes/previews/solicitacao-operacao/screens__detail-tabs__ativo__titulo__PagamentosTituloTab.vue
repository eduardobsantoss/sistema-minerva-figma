<script setup lang="ts">
import { Wallet, ChevronDown, ChevronUp } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <div class="flex items-center justify-end" style="gap: 32px; flex-wrap: wrap">
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Valor em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(Math.max(ativo.valorTotal - totalPago, 0)) }}
        </div>
      </div>
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Juros remuneratórios em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(det.jurosRemuneratorioAberto) }}
        </div>
      </div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
  </div>
</template>
