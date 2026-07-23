<script setup lang="ts">
import { ArrowRight, X } from 'lucide-vue-next';
withDefaults(defineProps<{ solicitacaoId: string; cedente: string; etapaOrigem: string; etapaDestino: string }>(), {
  solicitacaoId: '',
  cedente: '',
  etapaOrigem: '',
  etapaDestino: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
   
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 520px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
     
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.18em;
              color: var(--gci-base);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Solicitação · Kanban
          </div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.25">
            Mover solicitação {{ solicitacaoId }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ cedente }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            flex-shrink: 0;
          "
         
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="padding: 24px 28px; background: var(--surface-sunken)">
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 16px">
          Confirme a mudança de etapa no kanban. A solicitação será movida imediatamente após a confirmação.
        </p>

        <div
          class="flex items-center"
          style="
            gap: 12px;
            padding: 16px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          "
        >
          <div style="flex: 1; min-width: 0">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 6px;
              "
            >
              De
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ etapaOrigem }}
            </div>
          </div>

          <div
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background: color-mix(in srgb, var(--gci-base) 12%, transparent);
              color: var(--gci-base);
              flex-shrink: 0;
            "
          >
            <ArrowRight :size="16" />
          </div>

          <div style="flex: 1; min-width: 0; text-align: right">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 6px;
              "
            >
              Para
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ etapaDestino }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between"
        style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
      >
        <button
          type="button"
          style="
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            padding: 10px 4px;
          "
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
