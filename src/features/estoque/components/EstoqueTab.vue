<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AlertTriangle, ChevronRight, Home, Landmark, Plus, Wallet, Warehouse } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminFormField from '@/components/ui/AdminFormField.vue';
import AdminTextField from '@/components/ui/AdminTextField.vue';
import ToggleRow from '@/components/ui/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { Alert } from '@/components/feedback';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import { useEstoque } from '../composables/useEstoque';
import {
  IMOVEL_STATUSES,
  IMOVEL_STATUS_LABEL,
  IMOVEL_STATUS_TONE,
  ORIGEM_LABEL,
  brl,
  formatDate,
  imovelResumo,
  listVeiculos,
  valorAtual,
  veiculoKey,
  type NovoImovelInput,
  type VeiculoRef,
} from '../data/estoqueData';
import EstoqueChip from './EstoqueChip.vue';
import EstoqueKpi from './EstoqueKpi.vue';
import ImovelDetalhe from './ImovelDetalhe.vue';
import ImovelFormModal from './ImovelFormModal.vue';

/**
 * Estoque de imóveis. Com `veiculo`, é a aba do fundo (CRA/FIDC).
 * Sem `veiculo`, é a visão consolidada entre veículos (relatório).
 */
const props = defineProps<{ veiculo?: VeiculoRef }>();

const { success } = useToast();
const estoque = useEstoque();

const consolidado = computed(() => !props.veiculo);

const base = computed(() =>
  props.veiculo ? estoque.doVeiculo(props.veiculo) : estoque.imoveis.value,
);

const fBusca = ref('');
const fStatus = ref('');
const fCedente = ref('');
const fVeiculo = ref('');
const fVencidas = ref(false);

const veiculoOptions = computed(() => [
  { value: '', label: 'Todos' },
  ...listVeiculos().map((v) => ({ value: veiculoKey(v), label: `${v.tipo} · ${v.nome}` })),
]);

const filtrados = computed(() => {
  const busca = fBusca.value.trim().toLowerCase();
  const cedente = fCedente.value.trim().toLowerCase();
  return base.value.filter((i) => {
    if (busca && !`${i.nome} ${i.matricula} ${i.localizacao}`.toLowerCase().includes(busca)) return false;
    if (cedente && !i.cedenteOriginal.toLowerCase().includes(cedente)) return false;
    if (fStatus.value && i.status !== fStatus.value) return false;
    if (fVeiculo.value && veiculoKey({ tipo: i.veiculoTipo, id: i.veiculoId }) !== fVeiculo.value) return false;
    if (fVencidas.value && imovelResumo(i).parcelasVencidas === 0) return false;
    return true;
  });
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => filtrados.value, {
  defaultPageSize: 10,
});
watch([fBusca, fStatus, fCedente, fVeiculo, fVencidas], () => setPage(1));

const totais = computed(() => {
  let mercado = 0;
  let aReceber = 0;
  let vencido = 0;
  let parcelasVencidas = 0;
  for (const i of base.value) {
    const r = imovelResumo(i);
    mercado += valorAtual(i);
    aReceber += r.aReceber;
    vencido += r.vencido;
    parcelasVencidas += r.parcelasVencidas;
  }
  const disponiveis = base.value.filter((i) => i.status === 'DISPONIVEL').length;
  return { mercado, aReceber, vencido, parcelasVencidas, disponiveis };
});

const selecionadoId = ref<string | null>(null);
const selecionado = computed(() => (selecionadoId.value ? estoque.get(selecionadoId.value) : undefined));
const criando = ref(false);

function salvarNovo(input: NovoImovelInput) {
  const novo = estoque.add(input);
  criando.value = false;
  success(`Imóvel “${novo.nome}” cadastrado no estoque.`);
  selecionadoId.value = novo.id;
}

const COLS = computed(() =>
  consolidado.value
    ? 'minmax(200px, 1.6fr) minmax(160px, 1.2fr) minmax(130px, 1fr) minmax(120px, 0.9fr) minmax(110px, 0.8fr) minmax(150px, 1.1fr) 32px'
    : 'minmax(220px, 1.8fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(120px, 0.9fr) minmax(110px, 0.8fr) minmax(150px, 1.1fr) 32px',
);
const rowHover = ref<string | null>(null);
</script>

<template>
  <ImovelDetalhe v-if="selecionado" :imovel-id="selecionado.id" @back="selecionadoId = null" />

  <div v-else>
    <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
        <Warehouse :size="20" />
      </div>
      <div style="flex: 1; min-width: 200px">
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ consolidado ? 'Imóveis em estoque' : 'Estoque do fundo' }}
        </div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
          {{ base.length }} {{ base.length === 1 ? 'imóvel' : 'imóveis' }}{{ consolidado ? ' em todos os veículos' : ' pertencentes ao veículo' }}
        </div>
      </div>
      <AdminButton variant="agro" :icon="Plus" type="button" @click="criando = true">Novo imóvel</AdminButton>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <EstoqueKpi
        :icon="Home"
        label="Valor atual do estoque"
        :value="brl(totais.mercado, true)"
        :hint="`${totais.disponiveis} disponíve${totais.disponiveis === 1 ? 'l' : 'is'} para venda`"
        :tone="{ bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' }"
      />
      <EstoqueKpi
        :icon="Wallet"
        label="A receber"
        :value="brl(totais.aReceber, true)"
        hint="Saldo das parcelas dos contratos"
        :tone="{ bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' }"
      />
      <EstoqueKpi
        :icon="AlertTriangle"
        label="Em atraso"
        :value="brl(totais.vencido, true)"
        :hint="`${totais.parcelasVencidas} parcela${totais.parcelasVencidas === 1 ? '' : 's'} vencida${totais.parcelasVencidas === 1 ? '' : 's'}`"
        :tone="totais.parcelasVencidas ? { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' } : { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' }"
      />
      <EstoqueKpi
        :icon="Landmark"
        label="Venda forçada"
        :value="brl(base.reduce((s, i) => s + i.valorVendaForcada, 0), true)"
        hint="Piso somado dos imóveis"
        :tone="{ bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' }"
      />
    </div>

    <div v-if="totais.parcelasVencidas" style="padding: 16px 20px 0">
      <Alert
        type="warning"
        :title="`${totais.parcelasVencidas} parcela${totais.parcelasVencidas === 1 ? ' vencida' : 's vencidas'} sem baixa`"
        message="Abra o imóvel para cobrar o comprador ou locatário e registrar a baixa quando o valor entrar."
        :dismissible="false"
        action-label="Filtrar imóveis em atraso"
        @action="fVencidas = true"
      />
    </div>

    <div
      class="grid"
      :style="{
        gridTemplateColumns: consolidado ? 'repeat(5, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
        gap: '12px',
        padding: '16px 20px',
        alignItems: 'end',
        borderBottom: '1px solid var(--border-default)',
      }"
    >
      <AdminFormField label="Imóvel">
        <AdminTextField v-model="fBusca" placeholder="Nome, matrícula ou local" />
      </AdminFormField>
      <AdminFormField label="Cedente original">
        <AdminTextField v-model="fCedente" placeholder="Filtrar..." />
      </AdminFormField>
      <AdminFormField label="Status">
        <AdminSelect
          v-model="fStatus"
          :options="[{ value: '', label: 'Todos' }, ...IMOVEL_STATUSES.map((s) => ({ value: s, label: IMOVEL_STATUS_LABEL[s] }))]"
        />
      </AdminFormField>
      <AdminFormField v-if="consolidado" label="Veículo">
        <AdminSelect v-model="fVeiculo" :options="veiculoOptions" />
      </AdminFormField>
      <ToggleRow compact label="Só com parcela vencida" :on="fVencidas" @toggle="fVencidas = !fVencidas" />
    </div>

    <div v-if="!filtrados.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      {{ base.length ? 'Nenhum imóvel encontrado para os filtros.' : 'Nenhum imóvel em estoque. Cadastre um imóvel recebido em dação ou execute uma garantia.' }}
    </div>

    <div v-else style="overflow-x: auto">
      <div style="min-width: 980px">
        <div
          class="grid"
          :style="{
            gridTemplateColumns: COLS,
            columnGap: '16px',
            padding: '14px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div>Imóvel</div>
          <div>{{ consolidado ? 'Veículo' : 'Cedente original' }}</div>
          <div>{{ consolidado ? 'Cedente original' : 'Origem' }}</div>
          <div style="text-align: right">Valor atual</div>
          <div>Status</div>
          <div>Contrato e parcelas</div>
          <div />
        </div>

        <div
          v-for="i in pageItems"
          :key="i.id"
          class="grid items-center"
          role="button"
          tabindex="0"
          :style="{
            gridTemplateColumns: COLS,
            columnGap: '16px',
            padding: '16px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            background: rowHover === i.id ? 'var(--surface-sunken)' : 'var(--surface-card)',
            transition: 'background var(--duration-fast)',
          }"
          @click="selecionadoId = i.id"
          @keydown.enter="selecionadoId = i.id"
          @mouseenter="rowHover = i.id"
          @mouseleave="rowHover = null"
        >
          <div style="min-width: 0">
            <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ i.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              {{ i.localizacao || '—' }} · Mat. {{ i.matricula || '—' }}
            </div>
          </div>
          <div v-if="consolidado" style="min-width: 0">
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ i.veiculoNome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ i.veiculoTipo }}</div>
          </div>
          <div v-else style="color: var(--text-default)">{{ i.cedenteOriginal }}</div>
          <div v-if="consolidado" style="color: var(--text-default)">{{ i.cedenteOriginal }}</div>
          <div v-else style="color: var(--text-muted)">{{ ORIGEM_LABEL[i.origem] }}</div>
          <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(valorAtual(i)) }}
            <div style="font-size: var(--text-xs); font-weight: var(--weight-regular); color: var(--text-muted)">
              Forçada {{ brl(i.valorVendaForcada, true) }}
            </div>
          </div>
          <div><EstoqueChip :label="IMOVEL_STATUS_LABEL[i.status]" :tone="IMOVEL_STATUS_TONE[i.status]" /></div>
          <div>
            <template v-if="i.contrato">
              <div style="color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ imovelResumo(i).parcelasPagas }}/{{ imovelResumo(i).parcelasTotal }} pagas
              </div>
              <div
                v-if="imovelResumo(i).parcelasVencidas"
                style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--danger-base); margin-top: 2px"
              >
                {{ imovelResumo(i).parcelasVencidas }} vencida{{ imovelResumo(i).parcelasVencidas === 1 ? '' : 's' }}
              </div>
              <div v-else-if="imovelResumo(i).proximoVencimento" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                Próxima em {{ formatDate(imovelResumo(i).proximoVencimento!) }}
              </div>
              <div v-else style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">Contrato quitado</div>
            </template>
            <span v-else style="color: var(--text-muted)">Sem contrato</span>
          </div>
          <ChevronRight :size="16" style="color: var(--text-muted)" />
        </div>

        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </div>

    <ImovelFormModal
      v-if="criando"
      :veiculo-fixo="veiculo"
      @close="criando = false"
      @save="salvarNovo"
    />
  </div>
</template>
