<script setup lang="ts">
withDefaults(defineProps<{ pessoa: AtivoPessoa; titulo: string; historico?: EventoHistorico[] }>(), {
  pessoa: '',
  titulo: '',
  historico: []
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in tabs"
        :key="t"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
       
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DadosSubTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ContatosSubTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EnderecosSubTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">HistoricoSubTab</div>
    </div>
  </div>
</template>
