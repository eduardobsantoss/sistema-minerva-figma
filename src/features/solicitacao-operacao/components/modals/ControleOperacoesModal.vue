<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { ItemValidacao, ValidacaoOperacaoApto } from '../../data/operacaoData';
import {
  VEICULOS_FIDC_SEED,
  VEICULOS_CRA_SEED,
  VEICULOS_GARANTIAS_SEED,
} from '../../data/taxasVeiculosData';
import { SelectField, StepGrid } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="md" eyebrow="Solicitação" title="Controle de operações" :subtitle="`${validacao.titulo}`" footer-align="end" @close="emit('close')">
    <template #subheader>
      <div
        class="flex items-center justify-between"
        style="padding: 14px 28px; background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)"
      >
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--text-muted);
          "
        >
          Operações
        </span>
        <AdminButton variant="secondary" size="compact" :icon="Plus" @click="showAdd = !showAdd">Novo</AdminButton>
      </div>
    </template>

    <div class="flex flex-col" :style="{ gap: '16px' }">
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
              height: '40px',
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

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')" type="button">Fechar</AdminButton>
    </template>
  </AdminModal>
</template>
