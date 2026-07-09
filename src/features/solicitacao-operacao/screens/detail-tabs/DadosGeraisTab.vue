<script setup lang="ts">
import { Plus, Banknote, ArrowRightLeft, Layers } from 'lucide-vue-next';
import {
  brl,
  esteiraLabel,
  detalheSolicitacao,
  type Solicitacao,
  type ParteTipo,
  type ParteRelacionada,
} from '../../data/operacaoData';
import { CopyButton, Section, Field, Card, EmptyState, GhostButton } from './shared';

const props = defineProps<{
  s: Solicitacao;
  det: ReturnType<typeof detalheSolicitacao>;
}>();
const emit = defineEmits<{ addParte: []; openParte: [parte: ParteRelacionada] }>();

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CON: { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
};
const PARTE_LEGENDA: Record<ParteTipo, string> = {
  AVA: 'Avalista',
  ITA: 'Interveniente',
  SOC: 'Sócio',
  REP: 'Representante',
  CON: 'Cônjuge',
  PROC: 'Procurador',
};

/** Defaults de exibição quando o mock não trouxe os campos opcionais. */
function display(s: Solicitacao) {
  return {
    unidadeNegocio: s.unidadeNegocio ?? 'Ceres Investimentos',
    documento: s.documento ?? '07.366.063/0001-05',
    banco: s.banco ?? '341 - Itaú Unibanco S.A.',
    agencia: s.agencia ?? '1475-0',
    conta: s.conta ?? '43810-5',
    tipoTaxa: s.tipoTaxa ?? 'Pré-fixado',
    frequencia: s.frequencia ?? 'Mensal',
    fee: s.fee ?? 2,
    valorFee: s.valorFee ?? s.valor * 0.02,
    percSeguro: s.percSeguro ?? 0,
    valorSeguro: s.valorSeguro ?? 0,
    quitacaoVencidos: s.quitacaoVencidos ?? false,
  };
}

const d = display(props.s);
const partesTipos = Object.keys(PARTE_LEGENDA) as ParteTipo[];
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <!-- Valor em destaque -->
    <div
      class="flex items-center justify-between"
      style="
        gap: 16px;
        flex-wrap: wrap;
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 22px 26px;
        color: #fff;
      "
    >
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 8px;
          "
        >
          Valor da Operação (Nominal)
        </div>
        <div
          style="
            font-size: 32px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          {{ brl(s.valor) }}
        </div>
      </div>
      <div class="flex items-center" style="gap: 28px; flex-wrap: wrap">
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Taxa
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ `${s.taxa.toFixed(2).replace('.', ',')}%` }}
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            FEE
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ `${d.fee}%` }}
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Valor FEE
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ brl(d.valorFee) }}
          </div>
        </div>
      </div>
    </div>

    <Section title="Identificação">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 24px">
        <Field label="Tipo de Operação">{{ s.tipoContrato }}</Field>
        <Field label="Unidade de Negócio">{{ d.unidadeNegocio }}</Field>
        <Field label="Veículo">{{ s.veiculo || '—' }}</Field>
        <Field label="Grupo Empresarial">{{ s.grupoEmpresarial }}</Field>
        <Field label="Documento">
          <span class="flex items-center" style="gap: 6px">{{ d.documento }}<CopyButton :value="d.documento" /></span>
        </Field>
        <Field label="Gerente">{{ s.gerente }}</Field>
      </div>
    </Section>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <Card title="Dados Bancários" :icon="Banknote">
        <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 18px">
          <Field label="Banco">{{ d.banco }}</Field>
          <Field label="Agência">{{ d.agencia }}</Field>
          <Field label="Conta">{{ d.conta }}</Field>
        </div>
      </Card>
      <Card title="Configuração" :icon="ArrowRightLeft">
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 18px">
          <Field label="Esteira">{{ esteiraLabel(s.esteira) }}</Field>
          <Field label="Quitação de Vencidos">{{ d.quitacaoVencidos ? 'Sim' : 'Não' }}</Field>
        </div>
      </Card>
    </div>

    <Section title="Condições Financeiras">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Tipo de Taxa">{{ d.tipoTaxa }}</Field>
        <Field label="Frequência">{{ d.frequencia }}</Field>
        <Field label="Taxa de Operação">{{ `${s.taxa.toFixed(2).replace('.', ',')}%` }}</Field>
        <Field label="FEE">{{ `${d.fee}%` }}</Field>
        <Field label="Valor FEE">{{ brl(d.valorFee) }}</Field>
        <Field label="% Seguro Prestamista">{{ `${d.percSeguro}%` }}</Field>
        <Field label="Valor Seguro Prestamista">{{ brl(d.valorSeguro) }}</Field>
      </div>
    </Section>

    <Section title="Agrupamento de Limites">
      <EmptyState
        v-if="det.limites.length === 0"
        :icon="Layers"
        title="Nenhum limite agrupado"
        hint="Os agrupamentos de limite aparecerão aqui quando vinculados a esta solicitação."
      />
    </Section>

    <Section title="Partes Relacionadas">
      <template #action>
        <GhostButton :icon="Plus" @click="emit('addParte')">Nova parte</GhostButton>
      </template>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: 1.6fr 1.1fr 1.4fr 1fr 0.9fr;
            padding: 12px 16px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Nome</div>
          <div>Documento</div>
          <div>E-mail</div>
          <div>Telefone</div>
          <div>Tipo</div>
        </div>
        <div
          v-for="(p, i) in det.partes"
          :key="`${p.documento}-${i}`"
          class="grid items-center parte-row"
          role="button"
          tabindex="0"
          style="
            grid-template-columns: 1.6fr 1.1fr 1.4fr 1fr 0.9fr;
            padding: 12px 16px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
            transition: background var(--duration-fast);
          "
          @click="emit('openParte', p)"
          @keydown.enter="emit('openParte', p)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.documento }}</div>
          <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ p.email }}
          </div>
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ p.telefone }}</div>
          <div class="flex items-center" style="gap: 4px; flex-wrap: wrap">
            <span
              v-for="t in p.tipos"
              :key="t"
              :title="PARTE_LEGENDA[t]"
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '3px 7px',
                borderRadius: 'var(--radius-sm)',
                background: parteTone[t].bg,
                color: parteTone[t].fg,
              }"
            >
              {{ t }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 16px; margin-top: 12px; flex-wrap: wrap">
        <span
          v-for="t in partesTipos"
          :key="t"
          class="flex items-center"
          style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted)"
        >
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: parteTone[t].bg,
              color: parteTone[t].fg,
            }"
          >
            {{ t }}
          </span>
          {{ PARTE_LEGENDA[t] }}
        </span>
      </div>
    </Section>
  </div>
</template>

<style scoped>
.parte-row:hover {
  background: var(--surface-sunken);
}
</style>
