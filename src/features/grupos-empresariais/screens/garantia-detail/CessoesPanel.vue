<script setup lang="ts">
import { computed } from 'vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { cessaoVinculadaPorLabel } from '@/features/solicitacao-operacao/data/minutaData';
import type { CessaoGarantiaGrupo } from '../../data/gruposCadastroData';

const props = defineProps<{
  cessoes: CessaoGarantiaGrupo[];
  cessaoVinculada?: string;
}>();

const cessaoConstituicao = computed(() =>
  props.cessaoVinculada ? cessaoVinculadaPorLabel(props.cessaoVinculada) : undefined,
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.cessoes,
  { defaultPageSize: 5 },
);

const COLS =
  'minmax(200px, 1.5fr) minmax(96px, 0.85fr) minmax(72px, 0.65fr) minmax(128px, 1fr) minmax(128px, 1fr) minmax(72px, 0.55fr) minmax(88px, 0.7fr)';

const totalValorCompra = computed(() =>
  props.cessoes.reduce((sum, c) => sum + parseBrl(c.totalValorCompra), 0),
);

const totalValorNominal = computed(() =>
  props.cessoes.reduce((sum, c) => sum + parseBrl(c.totalValorNominal), 0),
);

const totalTitulos = computed(() =>
  props.cessoes.reduce((sum, c) => sum + c.quantidadeTitulos, 0),
);

function parseBrl(value: string): number {
  const digits = value.replace(/[^\d,]/g, '').replace(',', '.');
  return Number(digits) || 0;
}

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--surface-card);
    "
  >
    <div
      class="flex items-center flex-wrap"
      style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div style="flex: 1; min-width: 200px">
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
          Cessões vinculadas
        </div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: 4px;
          "
        >
          {{ cessoes.length }} cessão(ões) nesta garantia
        </div>
      </div>
    </div>

    <div
      v-if="cessaoConstituicao"
      style="
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-default);
        background: var(--surface-sunken);
      "
    >
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
        "
      >
        Cessão vinculada na constituição
      </div>
      <div
        style="
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          margin-bottom: 14px;
        "
      >
        {{ cessaoConstituicao.label }}
      </div>
      <div class="grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Total valor de compra
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ cessaoConstituicao.totalValorCompra }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Total valor nominal
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ cessaoConstituicao.totalValorNominal }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Quantidade
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ cessaoConstituicao.quantidadeTitulos }} título(s)
          </div>
        </div>
      </div>
    </div>

    <div v-if="!cessoes.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhuma cessão vinculada a esta garantia.
    </div>

    <div v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          columnGap: '16px',
        }"
      >
        <div>Cessão</div>
        <div>Data</div>
        <div>Veículo</div>
        <div>Valor compra</div>
        <div>Valor nominal</div>
        <div>Títulos</div>
        <div>Taxa</div>
      </div>

      <div
        v-for="c in pageItems"
        :key="c.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          columnGap: '16px',
        }"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong); min-width: 0">
          {{ c.label }}
        </div>
        <div style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums">
          {{ c.data }}
        </div>
        <div>
          <span
            v-if="c.veiculo"
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 4px 6px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
            "
          >
            {{ c.veiculo }}
          </span>
          <span v-else style="color: var(--text-muted)">—</span>
        </div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ c.totalValorCompra }}
        </div>
        <div style="color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ c.totalValorNominal }}
        </div>
        <div style="color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ c.quantidadeTitulos }}
        </div>
        <div style="color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ c.taxa || '—' }}
        </div>
      </div>

      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--surface-sunken)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-semibold)',
          columnGap: '16px',
        }"
      >
        <div style="color: var(--text-muted)">Total ({{ cessoes.length }})</div>
        <div />
        <div />
        <div style="color: var(--text-strong); font-variant-numeric: tabular-nums">{{ formatBrl(totalValorCompra) }}</div>
        <div style="color: var(--text-strong); font-variant-numeric: tabular-nums">{{ formatBrl(totalValorNominal) }}</div>
        <div style="color: var(--text-strong); font-variant-numeric: tabular-nums">{{ totalTitulos }}</div>
        <div />
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
