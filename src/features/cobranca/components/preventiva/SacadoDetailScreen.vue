<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, BadgeCheck, Clock, FileText, Wallet } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  situacaoColor,
  type SacadoPreventivo,
  type TentativaRegistro,
  type TituloPreventivo,
} from '../../data/cobrancaPreventivaData';
import RegistrarTentativaModal from './RegistrarTentativaModal.vue';

const props = defineProps<{ sacado: SacadoPreventivo; titulos: TituloPreventivo[] }>();
const emit = defineEmits<{
  back: [];
  registrar: [payload: { ids: string[]; tentativas: TentativaRegistro[]; observacoes: string }];
}>();

const selected = ref<string[]>([]);
const tentativaAberta = ref(false);

const allSelected = computed(
  () => props.titulos.length > 0 && props.titulos.every((t) => selected.value.includes(t.id)),
);
const someSelected = computed(
  () => props.titulos.some((t) => selected.value.includes(t.id)) && !allSelected.value,
);

const valor = computed(() => props.titulos.reduce((acc, t) => acc + t.valor, 0));
const confirmados = computed(() => props.titulos.filter((t) => t.status === 'CONFIRMADO').length);
const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => props.titulos, {
  defaultPageSize: 10,
});

const kpis = computed(() => [
  {
    label: 'Valor a vencer',
    value: brl(valor.value),
    icon: Wallet,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Títulos',
    value: String(props.titulos.length),
    icon: FileText,
    tone: { bg: 'color-mix(in srgb, var(--agro-base) 14%, transparent)', fg: 'var(--agro-base)' },
  },
  {
    label: 'Confirmados',
    value: String(confirmados.value),
    icon: BadgeCheck,
    tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  },
  {
    label: 'Pendentes',
    value: String(props.titulos.length - confirmados.value),
    icon: Clock,
    tone: { bg: 'color-mix(in srgb, var(--warning-base) 14%, transparent)', fg: 'var(--warning-base)' },
  },
]);

function toggleAll() {
  selected.value = allSelected.value ? [] : props.titulos.map((t) => t.id);
}

function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = [...next];
}

function salvar(payload: { observacoes: string; tentativas: TentativaRegistro[] }) {
  emit('registrar', { ids: [...selected.value], tentativas: payload.tentativas, observacoes: payload.observacoes });
  selected.value = [];
  tentativaAberta.value = false;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button type="button" aria-label="Voltar" class="back" @click="emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div class="eyebrow">Cobrança · Sacado</div>
        <h2 class="flex items-center" style="gap: 10px; flex-wrap: wrap; margin-top: 4px">
          {{ sacado.nome }}
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${situacaoColor(sacado.situacao)} 14%, transparent)`,
              color: situacaoColor(sacado.situacao),
            }"
          >
            {{ sacado.situacao }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
          {{ sacado.documento }} · {{ sacado.telefone }}
        </p>
      </div>
    </div>

    <div class="grid kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi">
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: kpi.tone.bg, color: kpi.tone.fg, flexShrink: 0 }"
        >
          <component :is="kpi.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </div>
      </div>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div class="flex items-center justify-between" style="padding: 16px 20px">
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Títulos a vencer</h3>
        <span style="font-size: var(--text-sm); color: var(--text-muted)">
          {{ selected.length === 0 ? 'Nenhum título selecionado' : selected.length === 1 ? '1 título selecionado' : `${selected.length} títulos selecionados` }}
        </span>
      </div>
      <div style="overflow-x: auto">
        <div class="grid items-center sacado-row sacado-header" style="grid-template-columns: 36px 90px minmax(140px, 1.1fr) minmax(140px, 1.2fr) 70px 120px minmax(140px, 1.2fr) minmax(140px, 1.3fr) 110px">
          <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="toggleAll" />
          <div>Lastro</div>
          <div>Número</div>
          <div>Cedente</div>
          <div>Tipo</div>
          <div>Situação</div>
          <div>Veículo</div>
          <div>Cessão</div>
          <div style="text-align: right">Valor</div>
        </div>
        <div
          v-for="t in pageItems"
          :key="t.id"
          class="grid items-center sacado-row"
          style="grid-template-columns: 36px 90px minmax(140px, 1.1fr) minmax(140px, 1.2fr) 70px 120px minmax(140px, 1.2fr) minmax(140px, 1.3fr) 110px"
        >
          <Checkbox :checked="selected.includes(t.id)" @change="toggle(t.id)" />
          <div style="font-variant-numeric: tabular-nums">{{ t.lastro }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.numero }}</div>
          <div>{{ t.cedente }}</div>
          <div>{{ t.tipoTitulo }}</div>
          <div>
            <span
              class="inline-flex items-center"
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.04em',
                padding: '4px 9px',
                borderRadius: '9999px',
                background: `color-mix(in srgb, ${situacaoColor(t.situacaoCedente)} 14%, transparent)`,
                color: situacaoColor(t.situacaoCedente),
              }"
            >
              {{ t.situacaoCedente }}
            </span>
          </div>
          <div>{{ t.veiculo }}</div>
          <div>{{ t.cessao }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ brl(t.valor) }}
          </div>
        </div>
      </div>
      <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        class="primary"
        :disabled="selected.length === 0"
        :title="selected.length === 0 ? 'Selecione ao menos um título' : undefined"
        @click="tentativaAberta = true"
      >
        Registrar tentativa
      </button>
    </div>

    <RegistrarTentativaModal
      v-if="tentativaAberta"
      :quantidade-titulos="selected.length"
      @close="tentativaAberta = false"
      @save="salvar"
    />
  </div>
</template>

<style scoped>
.back {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  cursor: pointer;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.eyebrow {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.18em;
  color: var(--accent);
  text-transform: uppercase;
}
h2 {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.kpi-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.kpi {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 20px;
}
.kpi-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.kpi-value {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}
.sacado-row {
  column-gap: 16px;
  padding: 14px 20px;
  font-size: var(--text-sm);
  color: var(--text-default);
  min-width: 980px;
}
.sacado-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.sacado-row:not(.sacado-header) {
  border-top: 1px solid var(--border-default);
}
.primary {
  height: 48px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
.primary:hover:not(:disabled) {
  background: var(--action-primary-bg-hover);
}
.primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
