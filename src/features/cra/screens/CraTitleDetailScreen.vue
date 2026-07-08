<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft, FileText, Paperclip, CreditCard, Activity,
  CheckCircle2, Clock, BadgeCheck, ArrowLeftRight, TrendingUp,
} from 'lucide-vue-next';
import { brl, type Cra, type CraOperacao, type CraTitulo, type TituloStatus } from '../data/craData';
import CopyButton from './cra-title-detail/CopyButton.vue';
import TabPill from './cra-title-detail/TabPill.vue';
import DetailsTab from './cra-title-detail/DetailsTab.vue';
import AnexosTab from './cra-title-detail/AnexosTab.vue';
import AccrualTab from './cra-title-detail/AccrualTab.vue';
import PagamentosTab from './cra-title-detail/PagamentosTab.vue';
import ConfirmacoesTab from './cra-title-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './cra-title-detail/MovimentacoesTab.vue';
import MovimentoTab from './cra-title-detail/MovimentoTab.vue';

const props = defineProps<{ cra: Cra; operacao: CraOperacao; titulo: CraTitulo }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';

const statusTone: Record<TituloStatus, { bg: string; fg: string; iconBg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', iconBg: 'var(--success-base)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', iconBg: 'var(--warning-base)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', iconBg: 'var(--danger-base)' },
};

const tab = ref<Tab>('detalhes');
const tone = computed(() => statusTone[props.titulo.status]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ cra.nome }} · {{ operacao.nome }}
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          Título #{{ titulo.numero }}
          <CopyButton :value="`Título #${titulo.numero}`" />
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Auditoria e ciclo de vida do direito creditório
        </p>
      </div>
      <span
        class="flex items-center"
        :style="{ gap: '8px', fontSize: '11px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', padding: '8px 14px', background: tone.bg, color: tone.fg, borderRadius: '9999px' }"
      >
        <CheckCircle2 v-if="titulo.status === 'CONFIRMADO'" :size="14" />
        <Clock v-else :size="14" />
        {{ titulo.status }}
      </span>
    </div>

    <!-- Value hero -->
    <div class="relative overflow-hidden flex items-center" style="background: var(--gci-base); border-radius: var(--radius-xl); padding: 28px 32px; color: #fff; box-shadow: 0 20px 40px -20px rgba(8,60,74,0.40)">
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(titulo.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Tipo: {{ titulo.tipo }} · Emissão: {{ titulo.emissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center" style="gap: 4px; padding: 4px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); align-self: flex-start; flex-wrap: wrap">
      <TabPill :active="tab === 'detalhes'" :icon="FileText" @click="tab = 'detalhes'">Detalhes</TabPill>
      <TabPill :active="tab === 'anexos'" :icon="Paperclip" @click="tab = 'anexos'">Anexos</TabPill>
      <TabPill :active="tab === 'accrual'" :icon="TrendingUp" @click="tab = 'accrual'">Accrual</TabPill>
      <TabPill :active="tab === 'pagamentos'" :icon="CreditCard" @click="tab = 'pagamentos'">Pagamentos</TabPill>
      <TabPill :active="tab === 'confirmacoes'" :icon="BadgeCheck" @click="tab = 'confirmacoes'">Confirmações</TabPill>
      <TabPill :active="tab === 'movimentacoes'" :icon="ArrowLeftRight" @click="tab = 'movimentacoes'">Movimentações</TabPill>
      <TabPill :active="tab === 'historico'" :icon="Activity" @click="tab = 'historico'">Histórico</TabPill>
    </div>

    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetailsTab v-if="tab === 'detalhes'" :titulo="titulo" :operacao="operacao" />
      <AnexosTab v-else-if="tab === 'anexos'" :titulo="titulo" />
      <AccrualTab v-else-if="tab === 'accrual'" :titulo="titulo" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :titulo="titulo" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :titulo="titulo" />
      <MovimentoTab v-else-if="tab === 'historico'" :titulo="titulo" />
    </div>
  </div>
</template>
