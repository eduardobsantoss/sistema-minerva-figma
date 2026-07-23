<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Fundo Padrão
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 640px; line-height: 1.5">
        Configure a ordem de prioridade dos fundos utilizados nas operações e acompanhe limites e utilização do rank
        ativo.
      </p>
    </div>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Rank ativo
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">OperationFundRankList</div>
    </section>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Edição do rank
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">OperationFundRankEditor</div>
    </section>
  </div>
</template>
