<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft,
  FileText,
  Paperclip,
  CreditCard,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  BadgeCheck,
  ArrowLeftRight,
} from 'lucide-vue-next';
import { brl, detalhePagamentos, type Fidc, type FidcClass, type Title, type TitleStatus } from '../data/fidcsData';
import PagamentosTab from './detail-tabs/PagamentosTab.vue';
import CopyButton from './title-detail/CopyButton.vue';
import TabPill from './title-detail/TabPill.vue';
import DetailsTab from './title-detail/DetailsTab.vue';
import AnexosTab from './title-detail/AnexosTab.vue';
import AccrualTab from './title-detail/AccrualTab.vue';
import ConfirmacoesTab from './title-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './title-detail/MovimentacoesTab.vue';
import MovimentoTab from './title-detail/MovimentoTab.vue';

const props = defineProps<{ fidc: Fidc; klass: FidcClass; title: Title }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';

const statusTone: Record<TitleStatus, { bg: string; fg: string; iconBg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', iconBg: 'var(--success-base)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', iconBg: 'var(--warning-base)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', iconBg: 'var(--danger-base)' },
};

const tab = ref<Tab>('detalhes');
const det = ref(detalhePagamentos(props.title));
const tone = computed(() => statusTone[props.title.status]);
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
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ fidc.name }} • {{ klass.name }}
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          Título #{{ title.numero }}
          <CopyButton :value="`Título #${title.numero}`" />
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Auditoria e ciclo de vida do direito creditório
        </p>
      </div>
      <span
        class="flex items-center"
        :style="{
          gap: '8px',
          fontSize: '11px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '8px 14px',
          background: tone.bg,
          color: tone.fg,
          borderRadius: '9999px',
        }"
      >
        <CheckCircle2 v-if="title.status === 'CONFIRMADO'" :size="14" />
        <Clock v-else :size="14" />
        {{ title.status }}
      </span>
    </div>

    <!-- Painel valor -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8,60,74,0.40);
      "
    >
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(title.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Lastro: {{ title.lastro.replace('_', '-') }} • Emissão {{ title.emissao }} • Vencimento
          {{ title.vencimento }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div
      class="flex items-center"
      style="gap: 4px; padding: 4px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); align-self: flex-start"
    >
      <TabPill :active="tab === 'detalhes'" :icon="FileText" @click="tab = 'detalhes'">Detalhes</TabPill>
      <TabPill :active="tab === 'anexos'" :icon="Paperclip" @click="tab = 'anexos'">Anexos</TabPill>
      <TabPill :active="tab === 'accrual'" :icon="TrendingUp" @click="tab = 'accrual'">Accrual</TabPill>
      <TabPill :active="tab === 'pagamentos'" :icon="CreditCard" @click="tab = 'pagamentos'">Pagamentos</TabPill>
      <TabPill :active="tab === 'confirmacoes'" :icon="BadgeCheck" @click="tab = 'confirmacoes'">Confirmações</TabPill>
      <TabPill :active="tab === 'movimentacoes'" :icon="ArrowLeftRight" @click="tab = 'movimentacoes'">Movimentações</TabPill>
      <TabPill :active="tab === 'historico'" :icon="Activity" @click="tab = 'historico'">Histórico</TabPill>
    </div>

    <div
      style="
        background: var(--surface-card);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <DetailsTab v-if="tab === 'detalhes'" :title="title" :klass="klass" />
      <AnexosTab v-else-if="tab === 'anexos'" :title="title" />
      <AccrualTab v-else-if="tab === 'accrual'" :title="title" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" :title="title" v-model:det="det" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :title="title" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :title="title" />
      <MovimentoTab v-else-if="tab === 'historico'" :title="title" />
    </div>
  </div>
</template>
