<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Building2, ChevronRight } from 'lucide-vue-next';
import {
  CRAS,
  brl,
  TONE_CRA_STATUS,
  toneAtraso,
  type CraComposicao,
  type CraStatus,
} from '../../data/passivoData';

const emit = defineEmits<{ openCra: [cra: CraComposicao] }>();

const filter = ref('');
const statusFilter = ref<'Tudo' | CraStatus>('Tudo');
const statusOptions = ['Tudo', 'Em carteira', 'Liquidado'] as const;

const filtered = computed(() =>
  CRAS.filter((cra) => {
    const q = filter.value.toLowerCase();
    const matchesSearch =
      !q ||
      cra.cedente.toLowerCase().includes(q) ||
      cra.sacado.toLowerCase().includes(q);
    const matchesStatus = statusFilter.value === 'Tudo' || cra.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  }),
);

const cols = '1.6fr 1fr 1.1fr 1fr 0.9fr 0.9fr';
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex flex-col md:flex-row md:items-center justify-between"
      style="padding: 20px; border-bottom: 1px solid var(--border-default); gap: 16px"
    >
      <div class="flex items-center" style="gap: 16px">
        <div
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            color: var(--gci-base);
          "
        >
          <Building2 :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Composição da Carteira (CRAs)
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
            {{ filtered.length }} títulos na carteira
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center" style="gap: 12px">
        <div class="relative">
          <Search
            :size="14"
            style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
          />
          <input
            v-model="filter"
            type="text"
            placeholder="Buscar CRA..."
            style="
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 8px 14px 8px 34px;
              font-size: var(--text-xs);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
              width: 180px;
            "
          />
        </div>

        <div
          class="flex"
          style="
            background: var(--surface-sunken);
            padding: 4px;
            border-radius: var(--radius-lg);
            gap: 2px;
          "
        >
          <button
            v-for="s in statusOptions"
            :key="s"
            type="button"
            :style="{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              background: statusFilter === s ? 'var(--surface-card)' : 'transparent',
              color: statusFilter === s ? 'var(--gci-base)' : 'var(--text-muted)',
              boxShadow: statusFilter === s ? 'var(--shadow-xs)' : 'none',
            }"
            @click="statusFilter = s"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>

    <div style="overflow-x: auto">
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          minWidth: '700px',
        }"
      >
        <div>Cedente / Sacado</div>
        <div style="text-align: right">Vencimento</div>
        <div style="text-align: right">Valor Face</div>
        <div style="text-align: center">Status</div>
        <div style="text-align: center">Atraso</div>
        <div style="text-align: right">Ação</div>
      </div>

      <template v-if="filtered.length">
        <div
          v-for="cra in filtered"
          :key="cra.id"
          class="cra-row grid items-center"
          :style="{
            gridTemplateColumns: cols,
            padding: '18px 20px',
            borderTop: '1px solid var(--border-default)',
            cursor: 'pointer',
            minWidth: '700px',
            transition: 'background var(--duration-fast)',
          }"
          @click="emit('openCra', cra)"
        >
          <div>
            <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
              {{ cra.cedente }}
            </p>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              {{ cra.sacado }}
            </p>
          </div>
          <div style="text-align: right; font-size: var(--text-xs); color: var(--text-muted)">
            {{ cra.dataVencimento }}
          </div>
          <div
            style="
              text-align: right;
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              font-variant-numeric: tabular-nums;
            "
          >
            {{ brl(cra.valorFace) }}
          </div>
          <div style="text-align: center">
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: '9999px',
                background: TONE_CRA_STATUS[cra.status].bg,
                color: TONE_CRA_STATUS[cra.status].fg,
              }"
            >
              {{ cra.status }}
            </span>
          </div>
          <div style="text-align: center">
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: '9999px',
                background: toneAtraso(cra.faixaAtraso).bg,
                color: toneAtraso(cra.faixaAtraso).fg,
              }"
            >
              {{ cra.faixaAtraso }}
            </span>
          </div>
          <div class="flex items-center justify-end" style="gap: 8px">
            <span
              class="analisar-label"
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.10em;
                text-transform: uppercase;
                color: var(--gci-base);
                opacity: 0;
                transition: opacity var(--duration-fast);
              "
            >
              Analisar
            </span>
            <ChevronRight :size="16" style="color: var(--neutral-300)" />
          </div>
        </div>
      </template>

      <div
        v-else
        style="padding: 60px 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
      >
        Nenhum CRA encontrado.
      </div>
    </div>
  </div>
</template>

<style scoped>
.cra-row:hover {
  background: var(--surface-sunken);
}
.cra-row:hover .analisar-label {
  opacity: 1;
}
</style>
