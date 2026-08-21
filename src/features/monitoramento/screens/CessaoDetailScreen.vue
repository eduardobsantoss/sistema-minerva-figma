<script setup lang="ts">
import { computed, type Component } from 'vue';
import { ArrowLeft, ExternalLink, CheckCircle2, Clock, Settings } from 'lucide-vue-next';
import { Section, Field } from '@/features/solicitacao-operacao/screens/detail-tabs/shared';
import {
  brl,
  formatDateBR,
  veiculoTone,
  toneStyle,
  pctBarColor,
  produtoGarantiaTone,
  cardStatusTone,
  type MonitoringPedido,
  type Cessao,
  type CardGarantiaStatus,
} from '../data/monitoramentoData';

const props = defineProps<{
  pedido: MonitoringPedido;
  cessao: Cessao;
}>();

const emit = defineEmits<{ back: [] }>();

const veiculoStyle = computed(() => toneStyle(veiculoTone(props.cessao.veiculo)));
const cards = computed(() => props.cessao.cardsGarantia ?? []);

const STATUS_ICON: Record<CardGarantiaStatus, Component> = {
  Finalizado: CheckCircle2,
  'Em Andamento': Clock,
  'Em Configuração': Settings,
};
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Monitoramento · Cessão
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ cessao.nome }}
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: veiculoStyle.bg,
              color: veiculoStyle.text,
            }"
          >
            {{ cessao.veiculo }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ pedido.cliente }}
        </p>
      </div>
    </div>

    <div
      class="flex items-center justify-between"
      style="gap: 16px; flex-wrap: wrap; background: var(--gci-base); border-radius: var(--radius-xl); padding: 22px 26px; color: #fff"
    >
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 8px">
          Valor da Cessão
        </div>
        <div style="font-size: 32px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(cessao.valor) }}
        </div>
      </div>
      <div class="flex items-center" style="gap: 28px; flex-wrap: wrap">
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; margin-bottom: 6px">
            Taxa
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ cessao.taxa.toFixed(1).replace('.', ',') }}% a.a.
          </div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; margin-bottom: 6px">
            Data
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ formatDateBR(cessao.data) }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 32px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
    <Section title="Informações da Cessão">
      <template #action>
        <a
          :href="cessao.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center"
          style="gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-link); text-decoration: none"
        >
          Acessar Cessão
          <ExternalLink :size="14" />
        </a>
      </template>
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 24px">
        <Field label="Nome da Cessão">{{ cessao.nome }}</Field>
        <Field label="Número da Operação">
          <span style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ cessao.numeroOperacao }}
          </span>
        </Field>
        <Field label="Veículo">
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: veiculoStyle.bg,
              color: veiculoStyle.text,
            }"
          >
            {{ cessao.veiculo }}
          </span>
        </Field>
      </div>
    </Section>

    <Section v-if="cards.length > 0" :title="`Cards de Garantia (${cards.length})`">
      <div class="flex flex-col" style="gap: 10px">
        <div
          v-for="card in cards"
          :key="card.id"
          class="garantia-card"
        >
          <div class="flex items-start justify-between" style="gap: 12px; flex-wrap: wrap">
            <a
              :href="card.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center"
              style="gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-link); text-decoration: none; min-width: 0"
            >
              <span>{{ card.nome }}</span>
              <ExternalLink :size="13" style="flex-shrink: 0" />
            </a>
            <span
              class="flex items-center"
              :style="{
                gap: '6px',
                width: 'fit-content',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                padding: '4px 9px',
                borderRadius: '9999px',
                background: toneStyle(cardStatusTone(card.status)).bg,
                color: toneStyle(cardStatusTone(card.status)).text,
              }"
            >
              <component :is="STATUS_ICON[card.status]" :size="12" :stroke-width="2.25" />
              {{ card.status }}
            </span>
          </div>
          <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px 20px; margin-top: 12px">
            <div>
              <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                Tipo
              </div>
              <span
                :style="{
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: card.composto ? toneStyle('active').bg : toneStyle('neutral').bg,
                  color: card.composto ? toneStyle('active').text : toneStyle('neutral').text,
                }"
              >
                {{ card.composto ? 'Composto' : 'Não Composto' }}
              </span>
            </div>
            <div>
              <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                Valor da Garantia
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ brl(card.valor) }}
              </div>
            </div>
            <div>
              <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                Valor da Composição
              </div>
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: card.valorComposicao > 0 ? 'var(--weight-bold)' : 'var(--weight-regular)',
                  color: card.valorComposicao > 0 ? 'var(--text-strong)' : 'var(--text-muted)',
                  fontVariantNumeric: 'tabular-nums',
                }"
              >
                {{ card.valorComposicao > 0 ? brl(card.valorComposicao) : '—' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <Section :title="`Produtos de Garantia (${pedido.produtosGarantia.length})`">
      <div
        v-if="pedido.produtosGarantia.length === 0"
        style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-sunken)"
      >
        Nenhum produto de garantia.
      </div>
      <div v-else class="flex flex-col" style="gap: 10px">
        <div
          v-for="prod in pedido.produtosGarantia"
          :key="prod.id"
          class="garantia-card"
        >
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap; margin-bottom: 12px">
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
                background: toneStyle(produtoGarantiaTone(prod.tipo)).bg,
                color: toneStyle(produtoGarantiaTone(prod.tipo)).text,
                textTransform: 'uppercase',
              }"
            >
              {{ prod.tipo }}
            </span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ brl(prod.valor) }}
            </span>
          </div>
          <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px 20px">
            <div>
              <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                % Usado
              </div>
              <div class="flex items-center" style="gap: 10px">
                <div style="width: 120px; height: 6px; background: var(--neutral-200); border-radius: 9999px; overflow: hidden; flex-shrink: 0">
                  <div
                    :style="{
                      width: `${Math.min(prod.pctUsado, 100)}%`,
                      height: '100%',
                      background: pctBarColor(prod.pctUsado),
                      borderRadius: '9999px',
                    }"
                  />
                </div>
                <span
                  style="font-size: var(--text-xs); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums"
                  :style="{ color: pctBarColor(prod.pctUsado) }"
                >
                  {{ prod.pctUsado }}%
                </span>
              </div>
            </div>
            <div>
              <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                Ativo
              </div>
              <div style="font-size: var(--text-sm); color: var(--text-default)">{{ prod.ativo }}</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
    </div>
  </div>
</template>

<style scoped>
.garantia-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: var(--surface-card);
  padding: 16px;
}
</style>
