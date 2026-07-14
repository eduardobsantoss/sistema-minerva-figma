<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  Building2,
  User,
} from 'lucide-vue-next';
import {
  brl,
  TONE_CRA_STATUS,
  type CraComposicao,
} from '../../data/passivoData';
import Section from '../shared/Section.vue';
import Field from '../shared/Field.vue';
import ValidarPuModal from './ValidarPuModal.vue';
import PagamentoExtraordinarioModal from './PagamentoExtraordinarioModal.vue';

defineProps<{ cra: CraComposicao; cotaNome?: string }>();
const emit = defineEmits<{ back: [] }>();

const showValidarPu = ref(false);
const showExtraordinario = ref(false);

function pct(n: number): string {
  return `${(n * 100).toFixed(3)}%`;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header — Guidelines §10 / CraTitleDetail -->
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
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ cotaNome || 'Passivo' }} · Drilldown CRA
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          {{ cra.cedente }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Sacado: {{ cra.sacado }} · Tipo {{ cra.tipoTitulo }}
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
          background: TONE_CRA_STATUS[cra.status].bg,
          color: TONE_CRA_STATUS[cra.status].fg,
          borderRadius: '9999px',
        }"
      >
        <CheckCircle2 v-if="cra.status === 'Em carteira'" :size="14" />
        {{ cra.status }}
      </span>
    </div>

    <!-- Hero PU -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 10px;
          "
        >
          PU Atualizado
        </div>
        <div
          style="
            font-size: 36px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          R$ {{ cra.puAtualizado.toFixed(2) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Face: {{ brl(cra.valorFace) }} · Taxa {{ cra.taxa }}% a.a. · Venc. {{ cra.dataVencimento }}
        </div>
      </div>
    </div>

    <!-- Content card -->
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
        gap: 32px;
      "
    >
      <Section title="Informações do CRA">
        <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
          <Field label="Valor de Aquisição">{{ brl(cra.valorAquisicao) }}</Field>
          <Field label="Valor de Face">{{ brl(cra.valorFace) }}</Field>
          <Field label="Data de Aquisição">{{ cra.dataAquisicao }}</Field>
          <Field label="Vencimento">{{ cra.dataVencimento }}</Field>
          <Field label="Valor de Liquidação">{{ brl(cra.valorLiquidacao) }}</Field>
          <Field label="Data de Liquidação">{{ cra.dataLiquidacao }}</Field>
          <Field label="Faixa de Atraso">
            <span
              :style="{
                color: cra.faixaAtraso === 'Em dia' ? 'var(--success-base)' : 'var(--danger-base)',
                fontWeight: 'var(--weight-bold)',
              }"
            >
              {{ cra.faixaAtraso }}
            </span>
          </Field>
          <Field label="Taxa">{{ cra.taxa }}% a.a.</Field>
          <Field label="PDD">{{ (cra.pdd * 100).toFixed(2) }}%</Field>
          <Field label="Tipo de Título">{{ cra.tipoTitulo }}</Field>
        </div>
      </Section>

      <Section title="Participantes">
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <div
            class="flex"
            style="
              gap: 14px;
              padding: 16px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
            "
          >
            <div
              class="flex items-center justify-center"
              style="
                width: 44px;
                height: 44px;
                border-radius: var(--radius-lg);
                background: var(--surface-card);
                color: var(--gci-base);
                flex-shrink: 0;
              "
            >
              <Building2 :size="20" />
            </div>
            <div>
              <div
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.14em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Cedente
              </div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 2px">
                {{ cra.cedente }}
              </div>
            </div>
          </div>
          <div
            class="flex"
            style="
              gap: 14px;
              padding: 16px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
            "
          >
            <div
              class="flex items-center justify-center"
              style="
                width: 44px;
                height: 44px;
                border-radius: var(--radius-lg);
                background: var(--surface-card);
                color: var(--gci-base);
                flex-shrink: 0;
              "
            >
              <User :size="20" />
            </div>
            <div>
              <div
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.14em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Sacado
              </div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 2px">
                {{ cra.sacado }}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Valorização recente">
        <div class="flex flex-col" style="gap: 14px">
          <div
            v-for="row in [
              { date: 'Hoje (D-0)', percent: pct(cra.valorizacaoD1), value: '+R$ 4.291,55', neg: cra.valorizacaoD1 < 0 },
              { date: 'D-1', percent: pct(cra.valorizacaoD2), value: '+R$ 3.844,12', neg: cra.valorizacaoD2 < 0 },
              { date: 'D-2', percent: pct(cra.valorizacaoD3), value: '+R$ 4.103,09', neg: cra.valorizacaoD3 < 0 },
            ]"
            :key="row.date"
            class="flex items-center justify-between"
            style="
              padding: 12px 16px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
            "
          >
            <div class="flex items-center" style="gap: 10px">
              <div
                :style="{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: row.neg ? 'var(--danger-base)' : 'var(--success-base)',
                }"
              />
              <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
                {{ row.date }}
              </span>
            </div>
            <div class="flex items-center" style="gap: 16px">
              <span
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)',
                  fontVariantNumeric: 'tabular-nums',
                  color: row.neg ? 'var(--danger-base)' : 'var(--success-base)',
                }"
              >
                {{ row.percent }}
              </span>
              <span
                style="
                  font-size: var(--text-xs);
                  font-weight: var(--weight-semibold);
                  font-variant-numeric: tabular-nums;
                  color: var(--text-muted);
                "
              >
                {{ row.value }}
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Gestão de Pagamento">
        <div class="flex" style="gap: 12px">
          <button
            type="button"
            class="flex items-center justify-center"
            style="
              height: 44px;
              padding: 0 24px;
              gap: 8px;
              background: var(--action-primary-bg);
              color: var(--action-primary-text);
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.08em;
            "
            @click="showValidarPu = true"
          >
            <CheckCircle2 :size="16" />
            VALIDAR PU PROGRAMADO
          </button>
          <button
            type="button"
            class="flex items-center justify-center"
            style="
              height: 44px;
              padding: 0 24px;
              gap: 8px;
              background: var(--action-secondary-bg);
              color: var(--action-secondary-text);
              border: 1px solid var(--action-secondary-border);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.08em;
            "
            @click="showExtraordinario = true"
          >
            <Plus :size="16" style="color: var(--warning-base)" />
            PAGAMENTO EXTRAORDINÁRIO
          </button>
        </div>
      </Section>
    </div>

    <ValidarPuModal
      v-if="showValidarPu"
      @close="showValidarPu = false"
      @confirm="showValidarPu = false"
    />
    <PagamentoExtraordinarioModal
      v-if="showExtraordinario"
      @close="showExtraordinario = false"
      @confirm="showExtraordinario = false"
    />
  </div>
</template>
