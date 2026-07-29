<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { X, Plus } from 'lucide-vue-next';
import type { ItemValidacao, ValidacaoOperacaoApto } from '../../data/operacaoData';
import {
  VEICULOS_FIDC_SEED,
  VEICULOS_CRA_SEED,
  VEICULOS_GARANTIAS_SEED,
} from '../../data/taxasVeiculosData';
import { SelectField, StepGrid } from './adicionar-contrato';

const props = defineProps<{ validacao: ItemValidacao }>();
const emit = defineEmits<{ close: [] }>();

const operacoes = reactive<ValidacaoOperacaoApto[]>(
  (props.validacao.operacoes ?? []).map((o) => ({ ...o })),
);

const showAdd = ref(false);
const novoVeiculo = ref('');

const veiculoOpts = computed(() => {
  const usados = new Set(operacoes.map((o) => o.veiculo));
  return [
    ...new Set([
      ...VEICULOS_FIDC_SEED.map((v) => v.vehicleName),
      ...VEICULOS_CRA_SEED.map((v) => v.vehicleName),
      ...VEICULOS_GARANTIAS_SEED.map((v) => v.vehicleName),
      '38ª CRA URA AGRO (18)',
      'CDCA Cultura Agronegócios',
      '16ª - CRA Ura Agro (6)',
      '18ª - CRA Ura Agro (7)',
      '19ª - CRA Ura Agro (8)',
      'URA AGRO 2',
      '42º CRA Ceres',
    ]),
  ].filter((v) => !usados.has(v));
});

function toggleApto(id: string) {
  const row = operacoes.find((o) => o.id === id);
  if (row) row.apto = !row.apto;
  // sync back to source item for prototype persistence
  if (props.validacao.operacoes) {
    const src = props.validacao.operacoes.find((o) => o.id === id);
    if (src) src.apto = row?.apto ?? false;
  }
}

function adicionar() {
  if (!novoVeiculo.value.trim()) return;
  const item: ValidacaoOperacaoApto = {
    id: `op-${Date.now()}`,
    veiculo: novoVeiculo.value,
    apto: false,
  };
  operacoes.push(item);
  if (!props.validacao.operacoes) props.validacao.operacoes = [];
  props.validacao.operacoes.push({ ...item });
  novoVeiculo.value = '';
  showAdd.value = false;
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Controle de operações
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ validacao.titulo }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 14px 28px; background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)"
      >
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--text-muted);
          "
        >
          Operações
        </span>
        <button
          type="button"
          class="flex items-center"
          style="
            gap: 6px;
            height: 34px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.06em;
            color: var(--gci-base);
          "
          @click="showAdd = !showAdd"
        >
          <Plus :size="14" /> NOVO
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 20px 28px" class="flex flex-col" :style="{ gap: '16px' }">
        <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); margin: 0">
          Caso seja inapto, não será possível iniciar cessões;
        </p>

        <div
          v-if="showAdd"
          style="
            padding: 16px;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
          "
        >
          <StepGrid>
            <SelectField
              label="Veículo"
              :options="veiculoOpts"
              placeholder="Selecione"
              :span="12"
              v-model="novoVeiculo"
            />
          </StepGrid>
          <div class="flex justify-end" style="margin-top: 12px; gap: 8px">
            <button
              type="button"
              style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: var(--text-sm); font-weight: var(--weight-semibold)"
              @click="showAdd = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn-animated btn-primary"
              :disabled="!novoVeiculo"
              :style="{
                height: '38px',
                padding: '0 16px',
                background: novoVeiculo ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: novoVeiculo ? 'var(--action-primary-text)' : 'var(--text-disabled)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: novoVeiculo ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.06em',
              }"
              @click="adicionar"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div
            class="grid"
            style="
              grid-template-columns: 1fr 140px;
              padding: 12px 16px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Veículo</div>
            <div style="text-align: center">Apto</div>
          </div>
          <div
            v-for="(op, i) in operacoes"
            :key="op.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: '1fr 140px',
              padding: '10px 16px',
              borderTop: '1px solid var(--border-default)',
              background: i % 2 === 0 ? 'var(--surface-card)' : 'color-mix(in srgb, var(--gci-base) 4%, transparent)',
            }"
          >
            <div style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold)">
              {{ op.veiculo }}
            </div>
            <div class="flex justify-center">
              <button
                type="button"
                :aria-checked="op.apto"
                role="switch"
                :title="op.apto ? 'Apto' : 'Inapto'"
                :style="{
                  position: 'relative',
                  width: '44px',
                  height: '24px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  background: op.apto ? 'var(--success-base)' : 'var(--border-strong)',
                  transition: 'background var(--duration-base)',
                  padding: 0,
                }"
                @click="toggleApto(op.id)"
              >
                <span
                  :style="{
                    position: 'absolute',
                    top: '3px',
                    left: op.apto ? '23px' : '3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '9999px',
                    background: '#fff',
                    transition: 'left var(--duration-base)',
                    boxShadow: 'var(--shadow-xs)',
                  }"
                />
              </button>
            </div>
          </div>
          <div
            v-if="operacoes.length === 0"
            style="padding: 28px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
          >
            Nenhuma operação cadastrada. Use + NOVO para vincular um veículo.
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          class="btn-animated btn-primary"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="emit('close')"
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
