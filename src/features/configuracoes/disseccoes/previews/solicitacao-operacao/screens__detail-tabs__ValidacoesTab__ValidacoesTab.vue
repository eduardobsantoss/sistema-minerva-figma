<script setup lang="ts">
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-vue-next';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 8px; font-size: var(--text-xs); color: var(--text-muted)">
        <AlertCircle :size="15" style="color: var(--text-muted)" />
        As validações só rodam quando a operação tiver título e veículo vinculado.
      </div>
      <div class="flex items-center" style="gap: 8px">
        <button
          class="flex items-center"
          style="
            gap: 6px;
            height: 38px;
            padding: 0 14px;
            background: none;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.04em;
            color: var(--text-strong);
          "
         
        >
          <CheckCircle2 :size="14" /> Ver tela de validações
        </button>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
      </div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
  </div>
</template>
