<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';
import { ArrowLeft, BarChart3, ChevronRight, Download, Radar } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import {
  NIVEL_DISPENSA_LABEL,
  NIVEL_NOTIFICACAO_LABEL,
  NIVEL_RISCO_LABEL,
  PAGE_SIZE_OPTIONS,
  RECORTE_GERENCIAL_INICIAL,
  RECORTE_POS_INICIAL,
  TIPO_CESSAO_OPCOES,
  TIPO_CLIENTE_OPCOES,
  brl,
  corAlertaComposicao,
  corAlertaRegistro,
  corConfirmacao,
  corFaixa,
  corInadimplencia,
  corNaoConfirmado,
  datasValidas,
  exportarGerencial,
  exportarPos,
  filtrarGerencial,
  filtrarPos,
  fmtPct,
  gerentes,
  hojeIso,
  toneOf,
  veiculos,
  veiculosAtivos,
  type RecorteGerencial,
  type RecortePos,
} from '../data/gerencialData';

type ReportKey = 'gerencial' | 'pos';

const REPORTS: { key: ReportKey; title: string; description: string; icon: Component }[] = [
  {
    key: 'gerencial',
    title: 'Relatório gerencial',
    description: 'Grupos do recorte: limite, risco, inadimplência, confirmação e valor não confirmado.',
    icon: BarChart3,
  },
  {
    key: 'pos',
    title: 'Relatório pós desembolso',
    description: 'Clientes do monitoramento: confirmação, registro dos títulos e alertas de garantia.',
    icon: Radar,
  },
];

const { warn } = useToast();
const selected = ref<ReportKey | null>(null);
const hoveredKey = ref<ReportKey | null>(null);
const draftGerencial = ref<RecorteGerencial>({ ...RECORTE_GERENCIAL_INICIAL });
const appliedGerencial = ref<RecorteGerencial>({ ...RECORTE_GERENCIAL_INICIAL });
const draftPos = ref<RecortePos>({ ...RECORTE_POS_INICIAL });
const appliedPos = ref<RecortePos>({ ...RECORTE_POS_INICIAL });

const report = computed(() => REPORTS.find((item) => item.key === selected.value) ?? null);
const grupos = computed(() => filtrarGerencial(appliedGerencial.value));
const clientes = computed(() => filtrarPos(appliedPos.value));
const ativos = computed(() => veiculosAtivos());
const hoje = hojeIso();

const {
  page: grupoPage,
  pageSize: grupoPageSize,
  total: grupoTotal,
  pageItems: grupoPageItems,
  setPage: setGrupoPage,
  setPageSize: setGrupoPageSize,
} = useTablePagination(() => grupos.value, { defaultPageSize: 5 });

const {
  page: clientePage,
  pageSize: clientePageSize,
  total: clienteTotal,
  pageItems: clientePageItems,
  setPage: setClientePage,
  setPageSize: setClientePageSize,
} = useTablePagination(() => clientes.value, { defaultPageSize: 5 });

watch(appliedGerencial, () => setGrupoPage(1), { deep: true });
watch(appliedPos, () => setClientePage(1), { deep: true });

function abrir(key: ReportKey) {
  selected.value = key;
  draftGerencial.value = { ...RECORTE_GERENCIAL_INICIAL };
  appliedGerencial.value = { ...RECORTE_GERENCIAL_INICIAL };
  draftPos.value = { ...RECORTE_POS_INICIAL };
  appliedPos.value = { ...RECORTE_POS_INICIAL };
}

function filtrarAtual() {
  if (selected.value === 'gerencial') {
    const erro = datasValidas(draftGerencial.value.dataInicial, draftGerencial.value.dataFinal);
    if (erro) {
      warn(erro);
      return;
    }
    appliedGerencial.value = { ...draftGerencial.value };
    return;
  }
  const erro = datasValidas(draftPos.value.dataInicial, draftPos.value.dataFinal, true);
  if (erro) {
    warn(erro);
    return;
  }
  appliedPos.value = { ...draftPos.value };
}

function limpar() {
  if (selected.value === 'gerencial') {
    draftGerencial.value = { ...RECORTE_GERENCIAL_INICIAL };
    appliedGerencial.value = { ...RECORTE_GERENCIAL_INICIAL };
    return;
  }
  draftPos.value = { ...RECORTE_POS_INICIAL };
  appliedPos.value = { ...RECORTE_POS_INICIAL };
}

function baixar() {
  if (selected.value === 'gerencial') exportarGerencial(grupos.value);
  else exportarPos(clientes.value);
}

const gridGerencial = 'minmax(200px, 1.8fr) minmax(130px, 1.1fr) 150px 130px 160px 150px';
const gridPos = 'minmax(180px, 1.5fr) 120px 140px 120px 130px 130px minmax(180px, 1.3fr)';
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Gerencial
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar o recorte e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="item in REPORTS"
        :key="item.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === item.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === item.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === item.key ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="abrir(item.key)"
        @mouseenter="hoveredKey = item.key"
        @mouseleave="hoveredKey = null"
      >
        <div class="flex items-center justify-center" style="width: 42px; height: 42px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)">
          <component :is="item.icon" :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
            {{ item.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ item.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === item.key ? 1 : 0,
            transform: hoveredKey === item.key ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Relatórios · Gerencial
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ report?.title }}
        </h2>
      </div>
      <button type="button" class="ger-btn-primary" @click="baixar">
        <Download :size="15" />
        Baixar CSV
      </button>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div v-if="selected === 'gerencial'" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px">
        <label>
          <div class="ger-label">Grupo empresarial</div>
          <input v-model="draftGerencial.grupoNome" class="ger-input" placeholder="Nome do grupo" />
        </label>
        <label>
          <div class="ger-label">Gerente comercial</div>
          <select v-model="draftGerencial.gerente" class="ger-input">
            <option value="">Todos</option>
            <option v-for="g in gerentes()" :key="g" :value="g">{{ g }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Veículo de operação</div>
          <select v-model="draftGerencial.veiculoId" class="ger-input">
            <option value="">Todos</option>
            <option v-for="v in ativos" :key="v.id" :value="v.id">{{ v.nome }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Tipo de operação</div>
          <select v-model="draftGerencial.tipoOperacao" class="ger-input">
            <option value="">Todos</option>
            <option value="CRA">CRA</option>
            <option value="FIDC">FIDC</option>
            <option value="GARANTIA">GARANTIA</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Data do termo inicial</div>
          <input v-model="draftGerencial.dataInicial" type="date" class="ger-input" />
        </label>
        <label>
          <div class="ger-label">Data do termo final</div>
          <input v-model="draftGerencial.dataFinal" type="date" class="ger-input" />
        </label>
        <label>
          <div class="ger-label">Buscar cessões</div>
          <select v-model="draftGerencial.busca" class="ger-input">
            <option value="abertas">Abertas</option>
            <option value="liquidadas">Liquidadas</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Nível de risco</div>
          <select v-model="draftGerencial.nivelRisco" class="ger-input">
            <option value="">Todos</option>
            <option v-for="(label, key) in NIVEL_RISCO_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Nível de confirmação</div>
          <select v-model="draftGerencial.nivelConfirmacao" class="ger-input">
            <option value="">Todos</option>
            <option value="nao-exige">Não exige confirmação</option>
            <option value="sem">Sem confirmação</option>
            <option value="parcial">Parcialmente confirmados</option>
            <option value="confirmado">Confirmados</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Nível de notificação</div>
          <select v-model="draftGerencial.nivelNotificacao" class="ger-input">
            <option value="">Todos</option>
            <option v-for="(label, key) in NIVEL_NOTIFICACAO_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Dispensa de confirmação</div>
          <select v-model="draftGerencial.nivelDispensa" class="ger-input">
            <option value="">Todos</option>
            <option v-for="(label, key) in NIVEL_DISPENSA_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Situação da cessão</div>
          <select v-model="draftGerencial.situacao" class="ger-input">
            <option value="todas">Todas</option>
            <option value="aprovada">Cessões aprovadas</option>
            <option value="nao-aprovada">Cessões não aprovadas</option>
          </select>
        </label>
      </div>

      <div v-else class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px">
        <label>
          <div class="ger-label">Cliente</div>
          <input v-model="draftPos.cliente" class="ger-input" placeholder="Nome do grupo" />
        </label>
        <label>
          <div class="ger-label">Tipo de cliente</div>
          <select v-model="draftPos.tipoCliente" class="ger-input">
            <option value="">Todos</option>
            <option v-for="t in TIPO_CLIENTE_OPCOES" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Nível de risco</div>
          <select v-model="draftPos.nivelRisco" class="ger-input">
            <option value="">Todos</option>
            <option v-for="(label, key) in NIVEL_RISCO_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Veículo de operação</div>
          <select v-model="draftPos.veiculoId" class="ger-input">
            <option value="">Todos</option>
            <option v-for="v in veiculos" :key="v.id" :value="v.id">{{ v.nome }}</option>
          </select>
        </label>
        <label>
          <div class="ger-label">Data inicial da cessão</div>
          <input v-model="draftPos.dataInicial" type="date" class="ger-input" :max="hoje" />
        </label>
        <label>
          <div class="ger-label">Data final da cessão</div>
          <input v-model="draftPos.dataFinal" type="date" class="ger-input" :max="hoje" />
        </label>
        <label>
          <div class="ger-label">Tipo de cessão</div>
          <select v-model="draftPos.tipoCessao" class="ger-input">
            <option value="">Todos</option>
            <option v-for="t in TIPO_CESSAO_OPCOES" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button type="button" class="ger-btn-ghost" @click="limpar">Limpar</button>
        <button type="button" class="ger-btn-primary" @click="filtrarAtual">Filtrar</button>
      </div>
    </div>

    <div class="ger-card">
      <div class="ger-scroll">
        <div v-if="selected === 'gerencial'" style="min-width: 980px">
          <div class="grid ger-table-head" :style="{ gridTemplateColumns: gridGerencial }">
            <div>Grupo</div>
            <div>Gerente</div>
            <div>Limite / risco</div>
            <div>Inadimplência</div>
            <div>Confirmação</div>
            <div>Não confirmado</div>
          </div>
          <div v-if="grupoPageItems.length === 0" style="padding: 40px 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
            Nenhum grupo neste recorte.
          </div>
          <div v-for="item in grupoPageItems" :key="item.grupo.id" class="grid ger-row" :style="{ gridTemplateColumns: gridGerencial }">
            <div class="ger-strong" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ item.grupo.nome }}</div>
            <div>{{ item.grupo.gerente ?? '—' }}</div>
            <div>
              <div class="ger-num ger-strong">{{ brl(item.grupo.limite) }}</div>
              <div class="ger-num ger-hint">{{ item.grupo.risco <= 0 ? 'Sem risco' : brl(item.grupo.risco) }}</div>
            </div>
            <div class="ger-num" :style="{ color: toneOf(corInadimplencia(item.grupo.inadimplencia)).text, fontWeight: 'var(--weight-bold)' }">
              {{ brl(item.grupo.inadimplencia) }}
            </div>
            <div>
              <span class="ger-pill" :style="toneOf(corConfirmacao(item.totais.pctConfirmados, item.grupo.pctConfirmacaoEsperada))">
                {{ fmtPct(item.totais.pctConfirmados) }}
              </span>
              <div class="ger-hint">meta {{ fmtPct(item.grupo.pctConfirmacaoEsperada) }}</div>
            </div>
            <div>
              <div class="ger-num" :style="{ color: toneOf(corNaoConfirmado(item.totais.pctNao)).text, fontWeight: 'var(--weight-bold)' }">
                {{ brl(item.totais.valorNao) }}
              </div>
              <div class="ger-hint">{{ fmtPct(item.totais.pctNao) }}</div>
            </div>
          </div>
        </div>

        <div v-else style="min-width: 1080px">
          <div class="grid ger-table-head" :style="{ gridTemplateColumns: gridPos }">
            <div>Cliente</div>
            <div>Tipo</div>
            <div>Limite / risco</div>
            <div>Inadimplência</div>
            <div>Confirmação</div>
            <div>Registro</div>
            <div>Alertas</div>
          </div>
          <div v-if="clientePageItems.length === 0" style="padding: 40px 24px; text-align: center; color: var(--text-muted)">
            Nenhum cliente neste recorte.
          </div>
          <div v-for="item in clientePageItems" :key="item.grupo.id" class="grid ger-row" :style="{ gridTemplateColumns: gridPos }">
            <div class="ger-strong" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ item.grupo.nome }}</div>
            <div>{{ item.grupo.tipoCliente }}</div>
            <div>
              <div class="ger-num ger-strong">{{ brl(item.grupo.limite) }}</div>
              <div class="ger-num ger-hint">{{ item.grupo.risco <= 0 ? 'Sem risco' : brl(item.grupo.risco) }}</div>
            </div>
            <div class="ger-num" :style="{ color: toneOf(corInadimplencia(item.grupo.inadimplencia)).text, fontWeight: 'var(--weight-bold)' }">
              {{ brl(item.grupo.inadimplencia) }}
            </div>
            <div>
              <span class="ger-pill" :style="toneOf(corFaixa(item.totais.pctConfirmados))">{{ fmtPct(item.totais.pctConfirmados) }}</span>
            </div>
            <div>
              <span class="ger-pill" :style="toneOf(corFaixa(item.totais.pctRegistrado))">{{ fmtPct(item.totais.pctRegistrado) }}</span>
            </div>
            <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
              <span v-if="!item.grupo.temGarantia" class="ger-pill" :style="toneOf('muted')">Sem garantia</span>
              <template v-else>
                <span class="ger-pill" :style="toneOf(corAlertaComposicao(item.grupo.composicaoAlerta))">{{ item.grupo.composicaoTexto }}</span>
                <span class="ger-pill" :style="toneOf(corAlertaRegistro(item.grupo.registroAlerta))">{{ item.grupo.registroTexto }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <TablePagination
        v-if="selected === 'gerencial'"
        :total="grupoTotal"
        :page="grupoPage"
        :page-size="grupoPageSize"
        :page-size-options="PAGE_SIZE_OPTIONS"
        @update:page="setGrupoPage"
        @update:page-size="setGrupoPageSize"
      />
      <TablePagination
        v-else
        :total="clienteTotal"
        :page="clientePage"
        :page-size="clientePageSize"
        :page-size-options="PAGE_SIZE_OPTIONS"
        @update:page="setClientePage"
        @update:page-size="setClientePageSize"
      />
    </div>
  </div>
</template>
