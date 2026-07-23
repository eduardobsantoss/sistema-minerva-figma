<script setup lang="ts">
import { ArrowLeft, User, MapPin, Phone } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ parte: ParteRelacionada; solicitacaoId: string }>(), {
  parte: '',
  solicitacaoId: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
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
          {{ solicitacaoId }} · Parte Relacionada
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 8px;
            flex-wrap: wrap;
          "
        >
          {{ parte.nome }}
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CopyButton</div>
        </h2>
        <p
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            margin-top: 4px;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ parte.documento }} · {{ parte.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabOptions"
      variant="brand"
     
    />

    <!-- Conteúdo do anexo ativo -->
    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DynamicFieldGrid</div>

      <!-- Tabela de contatos relacionados (Anexo 1) -->
      <div v-if="tab === 'anexo-1'" style="margin-top: 32px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
      </div>

      <!-- Tipos (Anexo 3) -->
      <div v-if="tab === 'anexo-3'" style="margin-top: 32px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
      </div>
    </div>
  </div>
</template>
