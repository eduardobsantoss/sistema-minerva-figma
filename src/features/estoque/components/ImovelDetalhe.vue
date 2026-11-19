<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Home,
  Landmark,
  Pencil,
  ReceiptText,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import OverflowMenu, { type OverflowMenuItem } from '@/components/ui/OverflowMenu.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { Alert } from '@/components/feedback';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import { useEstoque } from '../composables/useEstoque';
import {
  CONTRATO_LABEL,
  CONTRAPARTE_LABEL,
  IMOVEL_STATUS_LABEL,
  IMOVEL_STATUS_TONE,
  ORIGEM_LABEL,
  PARCELA_STATUS_LABEL,
  PARCELA_STATUS_TONE,
  brl,
  formatDate,
  imovelResumo,
  parcelaSaldo,
  parcelaStatus,
  valorAtual,
  type EstoqueParcela,
  type NovoImovelInput,
} from '../data/estoqueData';
import BaixaParcelaModal from './BaixaParcelaModal.vue';
import ContratoParcelasModal from './ContratoParcelasModal.vue';
import EstoqueChip from './EstoqueChip.vue';
import EstoqueKpi from './EstoqueKpi.vue';
import ImovelFormModal from './ImovelFormModal.vue';
import MonitoramentoModal from './MonitoramentoModal.vue';

/**
 * Details do imóvel, no padrão do Details de Solicitação: header, ação primária,
 * menu ⋮ com as ações críticas e abas. `embedded` só acrescenta respiro quando
 * a tela é aberta dentro de um card (aba Estoque do CRA/FIDC, relatório).
 */
const props = withDefaults(defineProps<{ imovelId: string; embedded?: boolean }>(), { embedded: false });
const emit = defineEmits<{ back: [] }>();

type Tab = 'gerais' | 'contrato' | 'monitoramento';
const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'gerais', label: 'Dados Gerais', icon: FileText },
  { key: 'contrato', label: 'Contrato e parcelas', icon: ReceiptText },
  { key: 'monitoramento', label: 'Monitoramento', icon: ClipboardCheck },
];
const tab = ref<Tab>('gerais');

const menuItems = computed<OverflowMenuItem[]>(() => [
  { key: 'editar', label: 'Editar imóvel', icon: Pencil },
  {
    key: 'contrato',
    label: imovel.value?.contrato ? 'Editar contrato e parcelas' : 'Lançar contrato',
    icon: ReceiptText,
  },
  { key: 'excluir', label: 'Excluir imóvel', icon: Trash2, danger: true },
]);

function onMenu(key: string) {
  if (key === 'editar') editando.value = true;
  else if (key === 'contrato') contratoAberto.value = true;
  else if (key === 'excluir') excluindo.value = true;
}

const { success } = useToast();
const estoque = useEstoque();

const imovel = computed(() => estoque.get(props.imovelId));
const resumo = computed(() => (imovel.value ? imovelResumo(imovel.value) : null));

const parcelas = computed(() => imovel.value?.contrato?.parcelas ?? []);
const monitoramentos = computed(() =>
  [...(imovel.value?.monitoramentos ?? [])].sort((a, b) => b.data.localeCompare(a.data)),
);

const parc = useTablePagination(() => parcelas.value, { defaultPageSize: 10 });
const mon = useTablePagination(() => monitoramentos.value, { defaultPageSize: 5 });

const editando = ref(false);
const contratoAberto = ref(false);
const monitorando = ref(false);
const excluindo = ref(false);
const baixando = ref<EstoqueParcela | null>(null);

function salvarEdicao(input: NovoImovelInput) {
  estoque.update(props.imovelId, input);
  editando.value = false;
  success('Imóvel atualizado.');
}

function salvarContrato(contrato: Parameters<typeof estoque.setContrato>[1]) {
  estoque.setContrato(props.imovelId, contrato);
  contratoAberto.value = false;
  success(`Contrato salvo. Status do imóvel: ${IMOVEL_STATUS_LABEL[imovel.value!.status]}.`);
}

function salvarMonitoramento(p: { data: string; valorAvaliado: number; observacao: string }) {
  estoque.addMonitoramento(props.imovelId, p);
  monitorando.value = false;
  success('Monitoramento registrado.');
}

function confirmarBaixa(p: { valor: number; data: string }) {
  if (!baixando.value) return;
  const numero = baixando.value.numero;
  estoque.baixarParcela(props.imovelId, baixando.value.id, p.valor, p.data);
  baixando.value = null;
  success(`Baixa de ${brl(p.valor)} lançada na parcela ${numero}.`);
}

function excluir() {
  const nome = imovel.value?.nome;
  estoque.remove(props.imovelId);
  excluindo.value = false;
  success(`Imóvel “${nome}” removido do estoque.`);
  emit('back');
}

function variacao(valor: number, idx: number): number | null {
  const anterior = monitoramentos.value[idx + 1]?.valorAvaliado ?? imovel.value?.valorMercado;
  if (anterior == null || anterior === 0) return null;
  return ((valor - anterior) / anterior) * 100;
}

const COLS_PARCELA = 'minmax(48px, 0.4fr) minmax(110px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(130px, 1fr) 96px';
const COLS_MON = 'minmax(110px, 0.8fr) minmax(140px, 1fr) minmax(90px, 0.6fr) minmax(220px, 2.6fr)';

const cardStyle =
  'background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden';
const thStyle = {
  padding: '14px 20px',
  background: 'var(--surface-sunken)',
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.12em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
} as const;
</script>

<template>
  <div v-if="imovel && resumo" class="flex flex-col" :style="{ gap: '24px', padding: embedded ? '20px' : undefined }">
    <!-- Header + barra de ações -->
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar para o estoque"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Estoque · {{ imovel.veiculoTipo }} · {{ imovel.veiculoNome }}
        </div>
        <h2 class="flex items-center flex-wrap" style="gap: 10px; font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ imovel.nome }}
          <EstoqueChip :label="IMOVEL_STATUS_LABEL[imovel.status]" :tone="IMOVEL_STATUS_TONE[imovel.status]" />
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ imovel.localizacao || '—' }} · Matrícula {{ imovel.matricula || '—' }}
        </p>
      </div>

      <!-- Ação primária + menu overflow (ações críticas ficam no menu) -->
      <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
        <AdminButton size="large" :icon="ClipboardCheck" type="button" @click="monitorando = true">Registrar monitoramento</AdminButton>
        <OverflowMenu :items="menuItems" @select="onMenu" />
      </div>
    </div>

    <SegmentedToggle :model-value="tab" :options="TABS" variant="brand" @update:model-value="tab = $event as Tab" />

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
    <div v-if="tab === 'gerais'" class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px">
      <EstoqueKpi
        :icon="Home"
        label="Valor atual"
        :value="brl(valorAtual(imovel))"
        :hint="`Cadastro: ${brl(imovel.valorMercado)}`"
        :tone="{ bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' }"
      />
      <EstoqueKpi
        :icon="Landmark"
        label="Venda forçada"
        :value="brl(imovel.valorVendaForcada)"
        hint="Piso aceito numa venda forçada"
        :tone="{ bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' }"
      />
      <EstoqueKpi
        :icon="Wallet"
        label="Recebido no contrato"
        :value="imovel.contrato ? brl(resumo.recebido) : '—'"
        :hint="imovel.contrato ? `de ${brl(resumo.totalContrato)}` : 'Sem contrato lançado'"
        :tone="{ bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' }"
      />
      <EstoqueKpi
        :icon="AlertTriangle"
        label="Em atraso"
        :value="brl(resumo.vencido)"
        :hint="`${resumo.parcelasVencidas} parcela${resumo.parcelasVencidas === 1 ? '' : 's'} vencida${resumo.parcelasVencidas === 1 ? '' : 's'}`"
        :tone="resumo.parcelasVencidas ? { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' } : { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' }"
      />
    </div>

    <Alert
      v-if="resumo.parcelasVencidas"
      type="error"
      :dismissible="false"
      :title="`${resumo.parcelasVencidas} parcela${resumo.parcelasVencidas === 1 ? ' vencida' : 's vencidas'} (${brl(resumo.vencido)})`"
      :message="`Cobre ${imovel.contrato ? CONTRAPARTE_LABEL[imovel.contrato.tipo].toLowerCase() : 'o responsável'} e registre a baixa quando o valor entrar.`"
    />

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px">
      <div :style="cardStyle">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default); font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
          Dados do imóvel
        </div>
        <dl class="grid" style="grid-template-columns: 160px minmax(0, 1fr); gap: 12px 16px; padding: 20px; margin: 0; font-size: var(--text-sm)">
          <dt style="color: var(--text-muted)">Cedente original</dt>
          <dd style="margin: 0; color: var(--text-strong); font-weight: var(--weight-semibold)">{{ imovel.cedenteOriginal }}</dd>
          <dt style="color: var(--text-muted)">Origem</dt>
          <dd style="margin: 0; color: var(--text-strong)">{{ ORIGEM_LABEL[imovel.origem] }}</dd>
          <template v-if="imovel.garantiaOrigem">
            <dt style="color: var(--text-muted)">Garantia executada</dt>
            <dd style="margin: 0; color: var(--text-strong)">
              {{ imovel.garantiaOrigem.tipoGarantia }} {{ imovel.garantiaOrigem.garantiaNumero }}
              <span style="color: var(--text-muted)">· {{ imovel.garantiaOrigem.operacaoNome }}</span>
            </dd>
          </template>
          <dt style="color: var(--text-muted)">Cadastrado em</dt>
          <dd style="margin: 0; color: var(--text-strong)">{{ formatDate(imovel.criadoEm) }}</dd>
        </dl>
      </div>

      <div :style="cardStyle">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default); font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
          Documentos
        </div>
        <div class="flex flex-col" style="gap: 12px; padding: 20px">
          <div class="flex items-center" style="gap: 12px">
            <FileText :size="18" style="color: var(--gci-base); flex-shrink: 0" />
            <div style="min-width: 0">
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">Instrumento de dação</div>
              <div style="font-size: var(--text-sm); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
                {{ imovel.instrumentoDacao || 'Não anexado' }}
              </div>
            </div>
          </div>
          <div class="flex items-center" style="gap: 12px">
            <ReceiptText :size="18" style="color: var(--gci-base); flex-shrink: 0" />
            <div style="min-width: 0">
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
                Contrato de {{ imovel.contrato ? CONTRATO_LABEL[imovel.contrato.tipo].toLowerCase() : 'venda ou locação' }}
              </div>
              <div style="font-size: var(--text-sm); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
                {{ imovel.contrato?.arquivo || 'Não anexado' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div v-else-if="tab === 'contrato'" :style="cardStyle">
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <div style="flex: 1; min-width: 200px">
          <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">Contrato e parcelas</div>
          <div v-if="imovel.contrato" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ CONTRATO_LABEL[imovel.contrato.tipo] }} · {{ CONTRAPARTE_LABEL[imovel.contrato.tipo] }}: {{ imovel.contrato.contraparte }}
          </div>
          <div v-else style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Lance o contrato de venda, locação ou arrendamento para acompanhar os recebimentos.
          </div>
        </div>
        <AdminButton v-if="imovel.contrato" variant="secondary" :icon="Pencil" type="button" @click="contratoAberto = true">Editar contrato</AdminButton>
        <AdminButton v-else variant="agro" :icon="ReceiptText" type="button" @click="contratoAberto = true">Lançar contrato</AdminButton>
      </div>

      <div v-if="!imovel.contrato" style="padding: 48px 20px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
        Nenhuma parcela lançada para este imóvel.
      </div>
      <div v-else style="overflow-x: auto">
        <div style="min-width: 900px">
          <div class="grid" :style="{ ...thStyle, gridTemplateColumns: COLS_PARCELA, columnGap: '16px' }">
            <div>Nº</div>
            <div>Vencimento</div>
            <div style="text-align: right">Valor</div>
            <div style="text-align: right">Pago</div>
            <div style="text-align: right">Saldo</div>
            <div>Status</div>
            <div>Último recebimento</div>
            <div style="text-align: right">Ação</div>
          </div>
          <div
            v-for="p in parc.pageItems.value"
            :key="p.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: COLS_PARCELA,
              columnGap: '16px',
              padding: '14px 20px',
              borderTop: '1px solid var(--border-default)',
              fontSize: 'var(--text-sm)',
              background: 'var(--surface-card)',
              fontVariantNumeric: 'tabular-nums',
            }"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ p.numero }}</div>
            <div style="color: var(--text-default)">{{ formatDate(p.vencimento) }}</div>
            <div style="text-align: right; color: var(--text-strong)">{{ brl(p.valor) }}</div>
            <div style="text-align: right; color: var(--text-default)">{{ brl(p.valorPago) }}</div>
            <div
              :style="{
                textAlign: 'right',
                fontWeight: 'var(--weight-bold)',
                color: parcelaStatus(p) === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)',
              }"
            >
              {{ brl(parcelaSaldo(p)) }}
            </div>
            <div><EstoqueChip :label="PARCELA_STATUS_LABEL[parcelaStatus(p)]" :tone="PARCELA_STATUS_TONE[parcelaStatus(p)]" /></div>
            <div style="color: var(--text-muted)">
              {{ p.baixas.length ? formatDate(p.baixas[p.baixas.length - 1].data) : '—' }}
            </div>
            <div style="text-align: right">
              <AdminButton v-if="parcelaSaldo(p) > 0" size="compact" variant="secondary" type="button" @click="baixando = p">Baixar</AdminButton>
            </div>
          </div>
          <TablePagination
            :total="parc.total.value"
            :page="parc.page.value"
            :page-size="parc.pageSize.value"
            @update:page="parc.setPage"
            @update:page-size="parc.setPageSize"
          />
        </div>
      </div>
    </div>

    <div v-else :style="cardStyle">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">Monitoramento</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
          Histórico de avaliações do imóvel ao longo da vida no estoque.
        </div>
      </div>
      <div v-if="!monitoramentos.length" style="padding: 40px 20px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
        Nenhum monitoramento registrado.
      </div>
      <div v-else style="overflow-x: auto">
        <div style="min-width: 720px">
          <div class="grid" :style="{ ...thStyle, gridTemplateColumns: COLS_MON, columnGap: '16px' }">
            <div>Data</div>
            <div style="text-align: right">Valor avaliado</div>
            <div style="text-align: right">Variação</div>
            <div>Observação</div>
          </div>
          <div
            v-for="(m, idx) in mon.pageItems.value"
            :key="m.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: COLS_MON,
              columnGap: '16px',
              padding: '14px 20px',
              borderTop: '1px solid var(--border-default)',
              fontSize: 'var(--text-sm)',
              background: 'var(--surface-card)',
            }"
          >
            <div style="color: var(--text-default)">{{ formatDate(m.data) }}</div>
            <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(m.valorAvaliado) }}</div>
            <div
              class="flex items-center"
              :style="{
                justifyContent: 'flex-end',
                gap: '4px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'var(--weight-bold)',
                color:
                  (variacao(m.valorAvaliado, (mon.page.value - 1) * mon.pageSize.value + idx) ?? 0) < 0
                    ? 'var(--danger-base)'
                    : 'var(--success-base)',
              }"
            >
              <template v-if="variacao(m.valorAvaliado, (mon.page.value - 1) * mon.pageSize.value + idx) !== null">
                <TrendingDown v-if="(variacao(m.valorAvaliado, (mon.page.value - 1) * mon.pageSize.value + idx) ?? 0) < 0" :size="14" />
                <TrendingUp v-else :size="14" />
                {{ variacao(m.valorAvaliado, (mon.page.value - 1) * mon.pageSize.value + idx)!.toFixed(1).replace('.', ',') }}%
              </template>
              <span v-else style="color: var(--text-muted)">—</span>
            </div>
            <div style="color: var(--text-default)">{{ m.observacao || '—' }}</div>
          </div>
          <TablePagination
            :total="mon.total.value"
            :page="mon.page.value"
            :page-size="mon.pageSize.value"
            @update:page="mon.setPage"
            @update:page-size="mon.setPageSize"
          />
        </div>
      </div>
    </div>
    </div>

    <ImovelFormModal v-if="editando" :imovel="imovel" @close="editando = false" @save="salvarEdicao" />
    <ContratoParcelasModal v-if="contratoAberto" :imovel="imovel" @close="contratoAberto = false" @save="salvarContrato" />
    <MonitoramentoModal v-if="monitorando" :imovel="imovel" @close="monitorando = false" @save="salvarMonitoramento" />
    <BaixaParcelaModal
      v-if="baixando"
      :parcela="baixando"
      :imovel-nome="imovel.nome"
      @close="baixando = null"
      @confirm="confirmarBaixa"
    />
    <ConfirmDeleteModal
      v-if="excluindo"
      title="Excluir imóvel do estoque?"
      description="O imóvel, o contrato, as parcelas e os monitoramentos deixam de aparecer no estoque do veículo."
      @close="excluindo = false"
      @confirm="excluir"
    />
  </div>
</template>
