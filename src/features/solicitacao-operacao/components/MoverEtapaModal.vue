<script setup lang="ts">
import { ArrowRightLeft } from 'lucide-vue-next';

defineProps<{
  solicitacaoId: string;
  cedente: string;
  etapaOrigem: string;
  etapaDestino: string;
}>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 200; background: rgba(15, 23, 42, 0.45); padding: 24px"
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 440px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4);
        padding: 28px;
      "
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          background: color-mix(in srgb, var(--gci-base) 12%, transparent);
          color: var(--gci-base);
          margin-bottom: 18px;
        "
      >
        <ArrowRightLeft :size="24" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Mover solicitação {{ solicitacaoId }}?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 8px">
        <strong style="color: var(--text-strong)">{{ cedente }}</strong> será movida de
        <strong style="color: var(--text-strong)">{{ etapaOrigem }}</strong> para
        <strong style="color: var(--text-strong)">{{ etapaDestino }}</strong>.
      </p>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Confirme para atualizar a etapa no kanban.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--surface-card);
            color: var(--text-strong);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
          @click="emit('confirm')"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
