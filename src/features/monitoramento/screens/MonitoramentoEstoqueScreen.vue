<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ChevronRight, Landmark, Layers, Search, Warehouse } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  imovelResumo,
  listVeiculos,
  useEstoque,
  valorAtual,
  type VeiculoRef,
  type VeiculoTipo,
} from '@/features/estoque';
import EstoqueChip from '@/features/estoque/components/EstoqueChip.vue';
import EstoqueVeiculoDetailScreen from './EstoqueVeiculoDetailScreen.vue';

const estoque = useEstoque();

const tipo = ref<VeiculoTipo>('CRA');
const busca = ref('');
const aberto = ref<VeiculoRef | null>(null);
const rowHover = ref<string | null>(null);

const veiculos = listVeiculos();

interface Linha {
  veiculo: VeiculoRef;
  imoveis: number;
  valor: number;
  aReceber: number;
  parcelasVencidas: number;
  vencido: number;
}

const linhas = computed<Linha[]>(() =>
  veiculos.map((veiculo) => {
    const lista = estoque.doVeiculo(veiculo);
    const linha: Linha = { veiculo, imoveis: lista.length, valor: 0, aReceber: 0, parcelasVencidas: 0, vencido: 0 };
    for (const i of lista) {
      const r = imovelResumo(i);
      linha.valor += valorAtual(i);
      linha.aReceber += r.aReceber;
      linha.parcelasVencidas += r.parcelasVencidas;
      linha.vencido += r.vencido;
    }
    return linha;
  }),
);

const doTipo = computed(() => linhas.value.filter((l) => l.veiculo.tipo === tipo.value));

const filtradas = computed(() => {
  const q = busca.value.trim().toLowerCase();
  if (!q) return doTipo.value;
  return doTipo.value.filter((l) => `${l.veiculo.nome} ${l.veiculo.cnpj ?? ''}`.toLowerCase().includes(q));
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => filtradas.value, {
  defaultPageSize: 10,
});
watch([tipo, busca], () => setPage(1));

const options = computed(() => [
  { key: 'CRA', label: `CRA (${linhas.value.filter((l) => l.veiculo.tipo === 'CRA').length})`, icon: Layers },
  { key: 'FIDC', label: `FIDC (${linhas.value.filter((l) => l.veiculo.tipo === 'FIDC').length})`, icon: Landmark },
]);

const totalImoveis = computed(() => doTipo.value.reduce((s, l) => s + l.imoveis, 0));

const COLS = 'minmax(260px, 2.2fr) minmax(90px, 0.6fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(170px, 1.1fr) 32px';
</script>

<template>
  <EstoqueVeiculoDetailScreen v-if="aberto" :veiculo="aberto" @back="aberto = null" />

  <div v-else class="flex flex-col" style="gap: 20px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Monitoramento
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Estoque
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtradas.length }} {{ filtradas.length === 1 ? 'veículo' : 'veículos' }} · {{ totalImoveis }}
        {{ totalImoveis === 1 ? 'imóvel em estoque' : 'imóveis em estoque' }}
      </p>
    </div>

    <div class="flex items-center justify-between flex-wrap" style="gap: 12px">
      <SegmentedToggle :model-value="tipo" :options="options" variant="brand" @update:model-value="tipo = $event as VeiculoTipo" />
      <div style="position: relative; flex: 1; min-width: 240px; max-width: 420px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="busca"
          placeholder="Buscar por nome ou CNPJ do veículo"
          style="width: 100%; height: 40px; padding: 0 12px 0 36px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="min-width: 960px">
          <div
            class="grid"
            :style="{
              gridTemplateColumns: COLS,
              columnGap: '16px',
              padding: '12px 20px',
              background: 'var(--surface-sunken)',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }"
          >
            <div>Veículo</div>
            <div style="text-align: right">Imóveis</div>
            <div style="text-align: right">Valor atual</div>
            <div style="text-align: right">A receber</div>
            <div>Parcelas</div>
            <div />
          </div>

          <div v-if="!pageItems.length" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center">
            <Warehouse :size="30" :stroke-width="1.5" style="color: var(--text-muted)" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum veículo encontrado</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Ajuste a busca ou troque o tipo de veículo.</div>
          </div>

          <div
            v-for="l in pageItems"
            :key="l.veiculo.id"
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
              background: rowHover === l.veiculo.id ? 'var(--surface-sunken)' : 'var(--surface-card)',
              transition: 'background var(--duration-fast)',
            }"
            @click="aberto = l.veiculo"
            @keydown.enter="aberto = l.veiculo"
            @mouseenter="rowHover = l.veiculo.id"
            @mouseleave="rowHover = null"
          >
            <div style="min-width: 0">
              <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ l.veiculo.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ l.veiculo.cnpj ?? '—' }}</div>
            </div>
            <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ l.imoveis }}
            </div>
            <div style="text-align: right; color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ l.imoveis ? brl(l.valor, true) : '—' }}
            </div>
            <div style="text-align: right; color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ l.aReceber ? brl(l.aReceber, true) : '—' }}
            </div>
            <div>
              <EstoqueChip
                v-if="l.parcelasVencidas"
                :label="`${l.parcelasVencidas} vencida${l.parcelasVencidas === 1 ? '' : 's'} · ${brl(l.vencido, true)}`"
                :tone="{ bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' }"
              />
              <EstoqueChip
                v-else-if="l.aReceber"
                label="Em dia"
                :tone="{ bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' }"
              />
              <span v-else style="color: var(--text-muted)">Sem parcelas</span>
            </div>
            <ChevronRight :size="16" style="color: var(--text-muted)" />
          </div>
        </div>
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
</template>
