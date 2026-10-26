<script setup lang="ts">
import { BadgeCheck, ClipboardList, MessageSquare, Users } from 'lucide-vue-next';
import type { TituloPreventivo } from '../../data/cobrancaPreventivaData';

defineProps<{ titulos: TituloPreventivo[] }>();

const blocos = [
  {
    icon: Users,
    title: 'Sacados em confirmação',
    text: 'Listagem por sacado com títulos a vencer ou no dia, foco em obter retorno de pagamento (confirmado, pendente, aguardando retorno).',
  },
  {
    icon: MessageSquare,
    title: 'Registro de tentativas',
    text: 'Fluxo de contato e status preventivo já usado hoje, com ênfase em confirmação antes do vencimento.',
  },
  {
    icon: ClipboardList,
    title: 'Fila operacional',
    text: 'Priorização por valor, vencimento e situação da carteira; filtros alinhados à preventiva.',
  },
  {
    icon: BadgeCheck,
    title: 'Indicadores',
    text: 'KPIs de confirmação por valor e por sacado, taxa no período e evolução diária.',
  },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="sketch-banner">
      <strong>Esboço — Cobrança de confirmação</strong>
      <p>
        Atuação entre o contato preventivo e o vencimento: confirmar pagamento, registrar tentativas e
        acompanhar retornos. Reutiliza sacado, títulos e status já modelados na preventiva.
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
  background: color-mix(in srgb, var(--gci-base) 12%, transparent);
  color: var(--gci-base);
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
