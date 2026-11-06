<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { CLASSE_LABEL, type NovaCotaInput, type SerieClasse } from '../../data/passivoNovoData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ defaultDateIso: string }>();
const emit = defineEmits<{ close: []; confirm: [input: NovaCotaInput] }>();

const classe = ref<SerieClasse>('SR');
const ifCodigo = ref('');
const tipo = ref('');
const dataInicioIso = ref(props.defaultDateIso);
const vencimentoIso = ref('');
const valorNominalInicial = ref('1000');
const quantidade = ref('0');
const principalResidual = ref('1000');
const puValue = ref('1000');
const valorTotal = ref('0');
const remuneracao = ref('');
const proximoPagamento = ref('0');

const CLASSES = (Object.keys(CLASSE_LABEL) as SerieClasse[]).map((key) => ({
  key,
  label: CLASSE_LABEL[key],
}));

watch([puValue, quantidade], () => {
  const pu = Number(puValue.value) || 0;
  const qty = Number(quantidade.value) || 0;
  valorTotal.value = String(pu * qty);
});

watch(valorNominalInicial, (vnu) => {
  if (!principalResidual.value || principalResidual.value === '1000') {
    principalResidual.value = vnu;
  }
  if (!puValue.value || puValue.value === '1000') {
    puValue.value = vnu;
  }
});

const canSave = computed(
  () => Boolean(tipo.value.trim() && dataInicioIso.value && vencimentoIso.value),
);

function submit() {
  if (!canSave.value) return;
  const pu = Number(puValue.value) || 0;
  const qty = Number(quantidade.value) || 0;
  emit('confirm', {
    classe: classe.value,
    ifCodigo: ifCodigo.value,
    tipo: tipo.value,
    dataInicioIso: dataInicioIso.value,
    vencimentoIso: vencimentoIso.value,
    valorNominalInicial: Number(valorNominalInicial.value) || 0,
    quantidade: qty,
    principalResidual: Number(principalResidual.value) || 0,
    pu,
    valorTotal: Number(valorTotal.value) || pu * qty,
    remuneracao: remuneracao.value || tipo.value,
    proximoPagamentoValor: Number(proximoPagamento.value) || 0,
  });
}

const fieldStyle =
  'width: 100%; height: 40px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)';
</script>

<template>
  <Teleport to="body">
    <AdminModal size="md" eyebrow="Passivo" title="Nova Cota" @close="emit('close')">
      <div class="flex flex-col" style="gap: 16px">
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Classe</span>
          <AdminSelect v-model="classe" :options="[...CLASSES.map((c) => ({ value: c.key, label: c.label }))]" />
        </label>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">IF</span>
            <input v-model="ifCodigo" type="text" placeholder="Código IF" :style="fieldStyle" />
          </label>
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Tipo</span>
            <input v-model="tipo" type="text" placeholder="Ex.: 110% DI" :style="fieldStyle" />
          </label>
        </div>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Data inicial</span>
            <AdminDateField v-model="dataInicioIso" />
          </label>
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Vencimento</span>
            <AdminDateField v-model="vencimentoIso" />
          </label>
        </div>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">VNU inicial</span>
            <input v-model="valorNominalInicial" type="number" min="0" step="0.0001" :style="fieldStyle" />
          </label>
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Quantidade</span>
            <input v-model="quantidade" type="number" min="0" step="1" :style="fieldStyle" />
          </label>
        </div>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Principal residual</span>
            <input v-model="principalResidual" type="number" min="0" step="0.0001" :style="fieldStyle" />
          </label>
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">PU</span>
            <input v-model="puValue" type="number" min="0" step="0.000001" :style="fieldStyle" />
          </label>
        </div>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Valor total</span>
            <input v-model="valorTotal" type="number" min="0" step="0.01" :style="fieldStyle" />
          </label>
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Remuneração</span>
            <input v-model="remuneracao" type="text" placeholder="Ex.: 110,00% DI" :style="fieldStyle" />
          </label>
        </div>
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Próx. pagamento</span>
          <input v-model="proximoPagamento" type="number" min="0" step="0.01" :style="fieldStyle" />
        </label>
      </div>

      <template #footer>
        <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
        <AdminButton variant="primary" size="large" :disabled="!canSave" @click="submit" type="button">Criar cota</AdminButton>
      </template>
    </AdminModal>
  </Teleport>
</template>
