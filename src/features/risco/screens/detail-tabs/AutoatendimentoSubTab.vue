<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { Zap, MoreVertical, Percent, X } from 'lucide-vue-next';
import {
  type ParametrizacaoAutoatendimento,
  type VeiculoOperacao,
} from '../../data/riscoData';
import { rememberVeiculosMeta } from '../../data/vinculosStore';
import { TabCard, FieldLabel, EmptyState } from './shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  data: ParametrizacaoAutoatendimento;
  grupoId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoAutoatendimento] }>();

const form = reactive<ParametrizacaoAutoatendimento>({
  ...props.data,
  veiculosOperacao: props.data.veiculosOperacao.map((v) => ({ ...v })),
});

watch(
  () => props.data,
  (data) => {
    form.limiteOperacoesAutomaticas = data.limiteOperacoesAutomaticas;
    form.taxaFee = data.taxaFee;
    form.taxaRisco = data.taxaRisco;
    form.veiculosOperacao = data.veiculosOperacao.map((v) => ({ ...v }));
  },
  { deep: true },
);

const TABLE_GRID = '1fr 1.4fr 110px 44px';

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => form.veiculosOperacao,
  { defaultPageSize: 5 },
);

const menuOpenId = ref<string | null>(null);
const editandoTaxa = ref<VeiculoOperacao | null>(null);
const taxaDraft = ref('');

function formatPct(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

function parsePct(value: string): number {
  return Number(value.replace('%', '').replace(',', '.')) || 0;
}

function handleMoneyInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.limiteOperacoesAutomaticas = Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handlePctInput(field: 'taxaFee' | 'taxaRisco', e: Event) {
  const target = e.target as HTMLInputElement;
  form[field] = Number(target.value.replace('%', '').replace(',', '.')) || 0;
}

function setPreferencial(id: string) {
  form.veiculosOperacao = form.veiculosOperacao.map((v) => ({
    ...v,
    preferencial: v.id === id ? !v.preferencial : false,
  }));
}

function openAlterarTaxa(v: VeiculoOperacao) {
  menuOpenId.value = null;
  editandoTaxa.value = v;
  taxaDraft.value = formatPct(v.taxaCessaoPadrao);
}

function confirmarTaxa() {
  if (!editandoTaxa.value) return;
  const id = editandoTaxa.value.id;
  const taxa = parsePct(taxaDraft.value);
  form.veiculosOperacao = form.veiculosOperacao.map((v) =>
    v.id === id ? { ...v, taxaCessaoPadrao: taxa } : v,
  );
  editandoTaxa.value = null;
}

function handleSave() {
  rememberVeiculosMeta(props.grupoId, form.veiculosOperacao);
  emit('save', {
    limiteOperacoesAutomaticas: form.limiteOperacoesAutomaticas,
    taxaFee: form.taxaFee,
    taxaRisco: form.taxaRisco,
    veiculosOperacao: form.veiculosOperacao.map((v) => ({ ...v })),
  });
}

function handleClickOutside(e: MouseEvent) {
  const el = e.target as HTMLElement | null;
  if (el?.closest?.('[data-veiculo-menu]')) return;
  menuOpenId.value = null;
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

const emptyHint = computed(() =>
  'Vincule veículos ao grupo pela ação “Vincular a um veículo” para listá-los aqui.',
);
</script>

<template>
  <TabCard title="Autoatendimento" :icon="Zap" has-save @save="handleSave">
    <div class="flex flex-col" style="gap: 20px">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <div>
          <FieldLabel>Limite p/ operações automáticas</FieldLabel>
          <input
            type="text"
            :value="form.limiteOperacoesAutomaticas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @input="handleMoneyInput"
          />
        </div>
        <div>
          <FieldLabel>Taxa fee padrão</FieldLabel>
          <input
            type="text"
            :value="`${form.taxaFee.toFixed(2).replace('.', ',')}%`"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @input="handlePctInput('taxaFee', $event)"
          />
        </div>
        <div>
          <FieldLabel>Taxa de risco padrão</FieldLabel>
          <input
            type="text"
            :value="`${form.taxaRisco.toFixed(2).replace('.', ',')}%`"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @input="handlePctInput('taxaRisco', $event)"
          />
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-default); padding-top: 16px">
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
          Veículos de Operação Preferencial
        </div>
        <EmptyState
          v-if="form.veiculosOperacao.length === 0"
          :icon="Zap"
          title="Nenhum veículo vinculado"
          :hint="emptyHint"
        />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: visible">
          <div
            class="grid items-center autoatendimento-table-row autoatendimento-table-header"
            :style="{ gridTemplateColumns: TABLE_GRID }"
          >
            <div class="col-num">Taxa cessão</div>
            <div class="col-veiculo">Veículo</div>
            <div class="col-preferencial">Preferencial</div>
            <div />
          </div>
          <div
            v-for="v in pageItems"
            :key="v.id"
            class="grid items-center autoatendimento-table-row"
            :style="{ gridTemplateColumns: TABLE_GRID }"
          >
            <div class="col-num">{{ formatPct(v.taxaCessaoPadrao) }}</div>
            <div class="col-veiculo">{{ v.veiculo }}</div>
            <div class="col-preferencial">
              <button
                type="button"
                role="switch"
                :aria-checked="v.preferencial"
                :aria-label="`Marcar ${v.veiculo} como preferencial`"
                class="preferencial-toggle"
                :class="{ 'preferencial-toggle--on': v.preferencial }"
                @click="setPreferencial(v.id)"
              >
                <span class="preferencial-toggle__knob" />
              </button>
            </div>
            <div class="flex justify-end" style="position: relative" data-veiculo-menu>
              <button
                aria-label="Ações do veículo"
                class="flex items-center justify-center"
                style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                @click.stop="menuOpenId = menuOpenId === v.id ? null : v.id"
              >
                <MoreVertical :size="15" />
              </button>
              <div
                v-if="menuOpenId === v.id"
                class="flex flex-col"
                style="position: absolute; top: 32px; right: 0; z-index: 40; min-width: 200px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
              >
                <button
                  class="flex items-center veiculo-action-item"
                  style="gap: 10px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                  @click="openAlterarTaxa(v)"
                >
                  <Percent :size="15" style="color: var(--text-muted)" />
                  Alterar Taxa de Cessão
                </button>
              </div>
            </div>
          </div>
          <TablePagination
            sunken
            compact
            :total="total"
            :page="page"
            :page-size="pageSize"
            :page-size-options="[5, 10, 25]"
            @update:page="setPage"
            @update:page-size="setPageSize"
          />
        </div>
      </div>
    </div>
  </TabCard>

  <div
    v-if="editandoTaxa"
    style="
      position: fixed; inset: 0; z-index: 450;
      background: rgba(8,60,74,0.45); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 24px;
    "
    @click.self="editandoTaxa = null"
  >
    <div
      style="
        width: 100%; max-width: 420px;
        background: var(--surface-card); border-radius: var(--radius-xl);
        border: 1px solid var(--border-default); box-shadow: var(--shadow-lg); overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 18px 20px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">Alterar Taxa de Cessão</h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">{{ editandoTaxa.veiculo }}</p>
        </div>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="editandoTaxa = null">
          <X :size="18" />
        </button>
      </div>
      <div style="padding: 20px">
        <FieldLabel>Taxa de cessão padrão</FieldLabel>
        <input
          v-model="taxaDraft"
          placeholder="0,00%"
          style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>
      <div class="flex justify-end" style="gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border-default)">
        <button
          style="height: 40px; padding: 0 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="editandoTaxa = null"
        >
          Cancelar
        </button>
        <button
          style="height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="confirmarTaxa"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autoatendimento-table-row {
  width: 100%;
  column-gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.autoatendimento-table-header {
  border-top: none;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.col-num {
  text-align: left;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.col-veiculo {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.autoatendimento-table-header .col-veiculo {
  font-weight: var(--weight-bold);
  color: var(--text-muted);
}

.col-preferencial {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
}

.preferencial-toggle {
  position: relative;
  width: 34px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 9999px;
  background: var(--border-strong);
  cursor: pointer;
  transition: background var(--duration-base);
  flex-shrink: 0;
}

.preferencial-toggle--on {
  background: var(--success-base);
}

.preferencial-toggle__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: #fff;
  transition: left var(--duration-base);
  box-shadow: var(--shadow-xs);
}

.preferencial-toggle--on .preferencial-toggle__knob {
  left: 16px;
}

.veiculo-action-item:hover {
  background: var(--surface-sunken);
}
</style>
