<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Zap, Trash2 } from 'lucide-vue-next';
import {
  VEICULO_OPERACAO_OPTS,
  type ParametrizacaoAutoatendimento,
  type VeiculoOperacao,
} from '../../data/riscoData';
import { TabCard, FieldLabel, EmptyState, AddButton } from './shared';

interface Props {
  data: ParametrizacaoAutoatendimento;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoAutoatendimento] }>();
const form = reactive<ParametrizacaoAutoatendimento>({
  ...props.data,
  veiculosOperacao: props.data.veiculosOperacao.map((v) => ({ ...v })),
});

const novoVeiculo = ref('');
const novaTaxaCessao = ref('');

const TABLE_GRID = '1fr 1.4fr 110px 40px';

const veiculosDisponiveis = computed(() =>
  VEICULO_OPERACAO_OPTS.filter(
    (opt) => !form.veiculosOperacao.some((v) => v.veiculo === opt),
  ),
);

function parsePct(value: string): number {
  return Number(value.replace('%', '').replace(',', '.')) || 0;
}

function formatPct(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

function handleMoneyInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.limiteOperacoesAutomaticas = Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handlePctInput(field: 'taxaFee' | 'taxaRisco', e: Event) {
  const target = e.target as HTMLInputElement;
  form[field] = Number(target.value.replace('%', '').replace(',', '.')) || 0;
}

function resetForm() {
  novoVeiculo.value = '';
  novaTaxaCessao.value = '';
}

function addVeiculo() {
  if (!novoVeiculo.value) return;
  const nova: VeiculoOperacao = {
    id: `vo-${Date.now()}`,
    veiculo: novoVeiculo.value,
    taxaCessaoPadrao: parsePct(novaTaxaCessao.value),
    preferencial: form.veiculosOperacao.length === 0,
  };
  form.veiculosOperacao = [...form.veiculosOperacao, nova];
  resetForm();
}

function removeVeiculo(id: string) {
  const removed = form.veiculosOperacao.find((v) => v.id === id);
  form.veiculosOperacao = form.veiculosOperacao.filter((v) => v.id !== id);
  if (removed?.preferencial && form.veiculosOperacao.length > 0) {
    form.veiculosOperacao = form.veiculosOperacao.map((v, i) => ({
      ...v,
      preferencial: i === 0,
    }));
  }
}

function setPreferencial(id: string) {
  form.veiculosOperacao = form.veiculosOperacao.map((v) => ({
    ...v,
    preferencial: v.id === id,
  }));
}

function handleSave() {
  emit('save', {
    limiteOperacoesAutomaticas: form.limiteOperacoesAutomaticas,
    taxaFee: form.taxaFee,
    taxaRisco: form.taxaRisco,
    veiculosOperacao: form.veiculosOperacao.map((v) => ({ ...v })),
  });
}
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
          <FieldLabel>Taxa de risco</FieldLabel>
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
        <div class="flex flex-col" style="gap: 16px">
          <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr auto; gap: 10px">
            <div>
              <FieldLabel>Taxa de cessão padrão</FieldLabel>
              <input
                v-model="novaTaxaCessao"
                placeholder="0,00%"
                style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
              />
            </div>
            <div>
              <FieldLabel>* Veículo</FieldLabel>
              <select
                v-model="novoVeiculo"
                style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); background: var(--surface-card); color: var(--text-strong)"
              >
                <option value="">Selecione</option>
                <option v-for="opt in veiculosDisponiveis" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <AddButton @click="addVeiculo" />
          </div>

          <EmptyState
            v-if="form.veiculosOperacao.length === 0"
            :icon="Zap"
            title="Nenhum veículo cadastrado"
            hint="Cadastre veículos de operação e marque o preferencial."
          />
          <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
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
              v-for="v in form.veiculosOperacao"
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
              <div class="flex justify-end">
                <button
                  aria-label="Remover"
                  class="flex items-center justify-center"
                  style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)"
                  @click="removeVeiculo(v.id)"
                >
                  <Trash2 :size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabCard>
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
</style>
