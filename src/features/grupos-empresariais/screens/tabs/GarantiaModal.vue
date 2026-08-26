<script setup lang="ts">
import { reactive } from 'vue';
import { X } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import { parseCurrencyInput } from '@/features/solicitacao-operacao/utils/currencyMask';
import { brl } from '@/features/risco/data/riscoData';
import {
  GARANTIA_STATUS_OPTS,
  GARANTIA_TIPO_OPTS,
  type GarantiaGrupo,
} from '../../data/gruposCadastroData';

const props = defineProps<{ garantia: GarantiaGrupo | null }>();
const emit = defineEmits<{
  close: [];
  save: [item: GarantiaGrupo];
}>();

const draft = reactive({
  tipo: props.garantia?.tipo ?? GARANTIA_TIPO_OPTS[0] ?? '',
  dataAquisicao: props.garantia?.dataAquisicao ?? '',
  valorMasked: brl(props.garantia?.valor ?? 0),
  pctUsado: String(props.garantia?.pctUsado ?? 0),
  qtdOperacoes: String(props.garantia?.qtdOperacoes ?? 0),
  status: props.garantia?.status ?? GARANTIA_STATUS_OPTS[0] ?? 'Vigente',
});

function salvar() {
  if (!draft.tipo) return;
  emit('save', {
    id: props.garantia?.id ?? `gar-${Date.now()}`,
    tipo: draft.tipo,
    dataAquisicao: draft.dataAquisicao,
    valor: parseCurrencyInput(draft.valorMasked),
    pctUsado: Number(draft.pctUsado.replace(',', '.')) || 0,
    qtdOperacoes: Number(draft.qtdOperacoes) || 0,
    status: draft.status,
  });
}
</script>

<template>
  <div
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 32px"
    @click.self="emit('close')"
  >
    <div
      style="width: 100%; max-width: 640px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ garantia ? 'Editar garantia' : 'Cadastrar garantia' }}
        </h2>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>
      <div style="padding: 24px 28px">
        <StepGrid>
          <SelectField v-model="draft.tipo" label="Tipo" :options="[...GARANTIA_TIPO_OPTS]" :span="6" />
          <FormField v-model="draft.dataAquisicao" label="Data de aquisição" placeholder="DD/MM/AAAA" :span="6" />
          <FormField v-model="draft.valorMasked" label="Valor" currency :span="4" />
          <FormField v-model="draft.pctUsado" label="% usado" :span="4" />
          <FormField v-model="draft.qtdOperacoes" label="Qtde operações" :span="4" />
          <SelectField v-model="draft.status" label="Status" :options="[...GARANTIA_STATUS_OPTS]" :span="12" />
        </StepGrid>
      </div>
      <div class="flex items-center justify-end" style="gap: 10px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button type="button" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          type="button"
          style="height: 44px; padding: 0 22px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="salvar"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
