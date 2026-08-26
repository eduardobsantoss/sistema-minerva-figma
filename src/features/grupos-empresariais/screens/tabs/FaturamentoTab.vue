<script setup lang="ts">
import { ref } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import { parseCurrencyInput } from '@/features/solicitacao-operacao/utils/currencyMask';
import { brl } from '@/features/risco/data/riscoData';
import type { FaturamentoGrupo } from '../../data/gruposCadastroData';

defineProps<{ faturamentos: FaturamentoGrupo[] }>();
const emit = defineEmits<{
  add: [item: FaturamentoGrupo];
  remove: [id: string];
}>();

const valorMasked = ref('R$ 0,00');
const anoFiscal = ref('');

function cadastrar() {
  const valor = parseCurrencyInput(valorMasked.value);
  const ano = anoFiscal.value.trim();
  if (!valor || !/^\d{4}$/.test(ano)) return;
  emit('add', { id: `fat-${Date.now()}`, valor, anoFiscal: ano });
  valorMasked.value = 'R$ 0,00';
  anoFiscal.value = '';
}

function excluir(id: string) {
  if (!window.confirm('Excluir este faturamento?')) return;
  emit('remove', id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
      <StepGrid>
        <FormField v-model="valorMasked" label="Faturamento" currency :span="5" />
        <FormField v-model="anoFiscal" label="Ano fiscal" placeholder="2026" :span="3" />
        <div style="grid-column: span 4; display: flex; align-items: flex-end">
          <button
            type="button"
            style="height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
            @click="cadastrar"
          >
            CADASTRAR
          </button>
        </div>
      </StepGrid>
    </div>

    <div
      v-if="faturamentos.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhum faturamento cadastrado.
    </div>
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div class="grid items-center" style="grid-template-columns: 1.4fr 1fr auto; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Valor</div>
        <div>Ano fiscal</div>
        <div style="text-align: right">Ação</div>
      </div>
      <div
        v-for="f in faturamentos"
        :key="f.id"
        class="grid items-center"
        style="grid-template-columns: 1.4fr 1fr auto; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(f.valor) }}</div>
        <div style="color: var(--text-default)">{{ f.anoFiscal }}</div>
        <div class="flex justify-end">
          <button type="button" aria-label="Excluir faturamento" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)" @click="excluir(f.id)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
