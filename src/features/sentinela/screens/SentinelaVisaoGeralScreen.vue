<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CircleCheck,
  Clock,
  Radar,
  Search,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-vue-next';
import { brl, fmtPct } from '@/features/risco/data/riscoData';
import SeveridadeChart from '../components/charts/SeveridadeChart.vue';
import EvolucaoAlertasChart from '../components/charts/EvolucaoAlertasChart.vue';
import {
  FILTRO_VAZIO,
  TIPO_ALERTA_LABEL,
  formatDateBR,
  labelsEvolucao,
  montarPainel,
  variacaoDoPainel,
  type LinhaMonitorada,
  type PainelSentinela,
} from '../data/sentinelaData';

const emit = defineEmits<{ navigate: [view: string] }>();

const busca = ref('');
const meses = labelsEvolucao();
const macro = computed(() => montarPainel('credito', FILTRO_VAZIO));
const contraparte = computed(() => montarPainel('contraparte', FILTRO_VAZIO));

const kpis = computed(() => [
  {
    icon: Radar,
    title: 'Monitorados',
    tone: 'var(--text-strong)',
    primaryLabel: 'Entidades',
    primaryValue: String(macro.value.total.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(macro.value.total.exposicao),
  },
  {
    icon: AlertTriangle,
    title: 'Crítico',
    tone: 'var(--status-danger-text)',
    primaryLabel: 'Entidades',
    primaryValue: String(macro.value.critico.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(macro.value.critico.exposicao),
  },
  {
    icon: Clock,
    title: 'Atenção',
    tone: 'var(--status-warning-text)',
    primaryLabel: 'Entidades',
    primaryValue: String(macro.value.atencao.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(macro.value.atencao.exposicao),
  },
  {
    icon: CircleCheck,
    title: 'Ok',
    tone: 'var(--status-success-text)',
    primaryLabel: 'Entidades',
    primaryValue: String(macro.value.ok.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(macro.value.ok.exposicao),
  },
]);

function delta(value: number | null) {
  if (value == null) return { text: 'sem base', color: 'var(--text-muted)', icon: null };
  if (value > 0) return { text: `+${fmtPct(value)}`, color: 'var(--status-danger-text)', icon: TrendingUp };
  if (value < 0) return { text: fmtPct(value), color: 'var(--status-success-text)', icon: TrendingDown };
  return { text: fmtPct(0), color: 'var(--text-muted)', icon: null };
}

function fila(painel: PainelSentinela): LinhaMonitorada[] {
  const q = busca.value.trim().toLowerCase();
  return painel.linhas
    .filter((linha) => linha.severidade !== 'ok')
    .filter((linha) => !q || linha.entidade.nome.toLowerCase().includes(q))
    .slice(0, 5);
}

const modulos = computed(() => [
  {
    key: 'sentinela-credito',
    title: 'Crédito',
    hint: 'Serasa, protesto e concentração da carteira.',
    icon: ShieldAlert,
    painel: macro.value,
    variacao: variacaoDoPainel(macro.value),
  },
  {
    key: 'sentinela-contraparte',
    title: 'Cedente/Sacado',
    hint: 'Serasa e protesto das contrapartes.',
    icon: Users,
    painel: contraparte.value,
    variacao: variacaoDoPainel(contraparte.value),
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Sentinela
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Visão geral
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Carteira e contrapartes no mesmo recorte.
        </p>
      </div>
      <div style="position: relative; width: 320px; max-width: 100%">
        <Search :size="15" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="busca"
          class="sn-focus"
          placeholder="Buscar entidade nas filas"
          style="width: 100%; height: 42px; padding: 0 14px 0 38px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px"
      >
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <div
            class="flex items-center justify-center"
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`,
              color: kpi.tone,
              flexShrink: 0,
            }"
          >
            <component :is="kpi.icon" :size="18" />
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ kpi.title }}</div>
        </div>
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px">
          {{ kpi.primaryLabel }}
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            color: kpi.tone,
            marginBottom: '14px',
          }"
        >
          {{ kpi.primaryValue }}
        </div>
        <div class="flex items-center justify-between" style="padding-top: 12px; border-top: 1px solid var(--border-default)">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ kpi.secondaryLabel }}</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ kpi.secondaryValue }}</span>
        </div>
      </div>
    </div>

    <div class="grid vg-split" style="gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Severidade da carteira</h3>
        </div>
        <SeveridadeChart :critico="macro.critico.quantidade" :atencao="macro.atencao.quantidade" :ok="macro.ok.quantidade" />
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Evolução de alertas</h3>
        </div>
        <EvolucaoAlertasChart :labels="meses" :valores="macro.evolucao" />
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; align-items: start">
      <article
        v-for="card in modulos"
        :key="card.key"
        class="flex flex-col"
        style="gap: 14px; border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px"
      >
        <div class="flex items-start justify-between" style="gap: 12px">
          <div class="flex items-center" style="gap: 10px">
            <component :is="card.icon" :size="16" style="color: var(--text-muted)" />
            <div>
              <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ card.title }}</h2>
              <p style="margin-top: 2px; font-size: var(--text-xs); color: var(--text-muted)">{{ card.hint }}</p>
            </div>
          </div>
          <div class="flex items-center" :style="{ gap: '4px', color: delta(card.variacao).color, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }">
            <component :is="delta(card.variacao).icon" v-if="delta(card.variacao).icon" :size="14" />
            {{ delta(card.variacao).text }}
          </div>
        </div>

        <div class="grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px">
          <div style="background: var(--status-danger-bg); color: var(--status-danger-text); border-radius: var(--radius-lg); padding: 10px 12px">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase">Crítico</div>
            <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ card.painel.critico.quantidade }}</div>
          </div>
          <div style="background: var(--status-warning-bg); color: var(--status-warning-text); border-radius: var(--radius-lg); padding: 10px 12px">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase">Atenção</div>
            <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ card.painel.atencao.quantidade }}</div>
          </div>
          <div style="background: var(--status-success-bg); color: var(--status-success-text); border-radius: var(--radius-lg); padding: 10px 12px">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase">Ok</div>
            <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ card.painel.ok.quantidade }}</div>
          </div>
        </div>

        <div>
          <div
            v-for="bloco in card.painel.blocos"
            :key="bloco.tipo"
            class="flex items-center justify-between"
            style="gap: 12px; padding: 8px 0; border-top: 1px solid var(--border-default)"
          >
            <span style="font-size: var(--text-sm); color: var(--text-default)">{{ TIPO_ALERTA_LABEL[bloco.tipo] }}</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; white-space: nowrap">
              {{ bloco.quantidade }} · {{ brl(bloco.exposicao) }}
            </span>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="sn-focus btn-animated flex items-center"
            style="gap: 6px; height: 38px; padding: 0 14px; background: var(--action-secondary-bg); color: var(--action-secondary-text); border: 1px solid var(--action-secondary-border); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold)"
            @click="emit('navigate', card.key)"
          >
            Abrir
            <ArrowUpRight :size="15" />
          </button>
        </div>
      </article>

      <!-- Consulta em lote saiu da visão geral. A subida de lista ficou em Risco > Consultas.
      <article>Consulta em lote</article>
      -->
    </div>

    <div class="grid vg-split" style="gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <AlertTriangle :size="16" style="color: var(--status-danger-text)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Crédito pedindo tratativa</h3>
        </div>
        <div v-if="fila(macro).length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
          Nenhuma entidade neste recorte.
        </div>
        <template v-else>
          <div class="grid vg-table vg-head">
            <div>Entidade</div>
            <div class="vg-num">Exposição</div>
            <div>Prazo</div>
          </div>
          <button
            v-for="linha in fila(macro)"
            :key="linha.entidade.id"
            class="grid items-center vg-row vg-table"
            @click="emit('navigate', 'sentinela-credito')"
          >
            <div style="min-width: 0">
              <div class="vg-name">{{ linha.entidade.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ linha.acaoSugerida }}</div>
            </div>
            <div class="vg-num" :style="{ color: linha.severidade === 'critico' ? 'var(--status-danger-text)' : 'var(--status-warning-text)', fontWeight: 'var(--weight-bold)' }">
              {{ brl(linha.entidade.exposicao) }}
            </div>
            <div class="vg-date">{{ formatDateBR(linha.prazo) }}</div>
          </button>
        </template>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <Users :size="16" style="color: var(--status-warning-text)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Cedente/Sacado pedindo tratativa</h3>
        </div>
        <div v-if="fila(contraparte).length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
          Nenhuma entidade neste recorte.
        </div>
        <template v-else>
          <div class="grid vg-table vg-head">
            <div>Entidade</div>
            <div class="vg-num">Exposição</div>
            <div>Prazo</div>
          </div>
          <button
            v-for="linha in fila(contraparte)"
            :key="linha.entidade.id"
            class="grid items-center vg-row vg-table"
            @click="emit('navigate', 'sentinela-contraparte')"
          >
            <div style="min-width: 0">
              <div class="vg-name">{{ linha.entidade.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ linha.acaoSugerida }}</div>
            </div>
            <div class="vg-num" :style="{ color: linha.severidade === 'critico' ? 'var(--status-danger-text)' : 'var(--status-warning-text)', fontWeight: 'var(--weight-bold)' }">
              {{ brl(linha.entidade.exposicao) }}
            </div>
            <div class="vg-date">{{ formatDateBR(linha.prazo) }}</div>
          </button>
        </template>
      </div>
    </div>

  </div>
</template>

<style scoped>
.sn-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.vg-table {
  grid-template-columns: minmax(0, 1.6fr) 140px 96px;
  column-gap: 16px;
  width: 100%;
  padding: 10px 16px;
  font-size: var(--text-sm);
  text-align: left;
}

.vg-split {
  grid-template-columns: 1fr 1fr;
}

.vg-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.vg-row.vg-table {
  padding: 12px 16px;
  background: none;
  border: none;
  border-top: 1px solid var(--border-default);
  cursor: pointer;
}

.vg-row:hover {
  background: var(--surface-sunken);
}

.vg-name {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vg-num,
.vg-date {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.vg-num {
  text-align: right;
}

.vg-date {
  color: var(--text-muted);
}

.vg-lote:hover {
  background: var(--surface-sunken);
}

.vg-chip {
  display: inline-flex;
  font-size: 10px;
  font-weight: var(--weight-bold);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

@media (max-width: 960px) {
  .vg-split {
    grid-template-columns: 1fr;
  }
}
</style>
