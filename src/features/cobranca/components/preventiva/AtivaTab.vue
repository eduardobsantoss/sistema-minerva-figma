<script setup lang="ts">
import { AlertTriangle, Banknote, FileText, Scale } from 'lucide-vue-next';
import type { TituloPreventivo } from '../../data/cobrancaPreventivaData';

defineProps<{ titulos: TituloPreventivo[] }>();

const blocos = [
  {
    icon: AlertTriangle,
    title: 'Carteira vencida',
    text: 'Títulos em atraso com valor em aberto, dias de atraso e filas por operador ou carteira.',
  },
  {
    icon: Scale,
    title: 'Negociação e acordos',
    text: 'Status em negociação, prorrogação e acompanhamento pós-vencimento (espelha ações da listagem de Títulos).',
  },
  {
    icon: Banknote,
    title: 'Boletagem e cobrança',
    text: 'Gerar boleto, reenviar notificações e registrar retorno do sacado na fase ativa.',
  },
  {
    icon: FileText,
    title: 'Relatórios de atuação',
    text: 'Indicadores de inadimplência, recuperação e efetividade, conectados ao dashboard de Cobrança.',
  },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="sketch-banner">
      <strong>Esboço — Cobrança ativa</strong>
      <p>
        Cobrança após o vencimento: recuperação, negociação e execução (boleto, notificação, registro).
        Deve conversar com Títulos, Dashboard e Réguas já existentes no módulo.
      </p>
    </div>

    <div class="grid sketch-grid">
      <div v-for="item in blocos" :key="item.title" class="sketch-card">
        <div class="sketch-icon">
          <component :is="item.icon" :size="20" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sketch-banner {
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-default);
  background: var(--surface-sunken);
  font-size: var(--text-sm);
  color: var(--text-default);
  line-height: 1.45;
}
.sketch-banner strong {
  display: block;
  color: var(--text-strong);
  margin-bottom: 6px;
}
.sketch-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.sketch-card {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 18px 20px;
}
.sketch-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--warning-base) 14%, transparent);
  color: var(--warning-base);
  margin-bottom: 12px;
}
.sketch-card h3 {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  margin-bottom: 6px;
}
.sketch-card p {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.45;
}
</style>
