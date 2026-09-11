<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { CLASSE_LABEL, type NovaCotaInput, type SerieClasse } from '../../data/passivoNovoData';

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
    <div
      class="minerva-modal-overlay"
      style="
        background: rgba(8, 60, 74, 0.55);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      "
      @click.self="emit('close')"
    >
      <div
        style="
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow: auto;
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-default);
          box-shadow: var(--shadow-lg);
        "
        @click.stop
      >
        <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default); position: sticky; top: 0; background: var(--surface-card); z-index: 1">
          <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Nova Cota
          </h3>
          <button type="button" aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>

        <div class="flex flex-col" style="padding: 24px; gap: 16px">
          <label class="flex flex-col" style="gap: 6px">
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Classe</span>
            <select v-model="classe" :style="fieldStyle">
              <option v-for="c in CLASSES" :key="c.key" :value="c.key">{{ c.label }}</option>
            </select>
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
              <input v-model="dataInicioIso" type="date" :style="fieldStyle" />
            </label>
            <label class="flex flex-col" style="gap: 6px">
              <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Vencimento</span>
              <input v-model="vencimentoIso" type="date" :style="fieldStyle" />
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

        <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default); position: sticky; bottom: 0; background: var(--surface-card)">
          <button type="button" style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
            Cancelar
          </button>
          <button
            type="button"
            :disabled="!canSave"
            :style="{
              height: '44px',
              padding: '0 24px',
              background: canSave ? 'var(--action-primary-bg)' : 'var(--surface-sunken)',
              color: canSave ? 'var(--action-primary-text)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: canSave ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }"
            @click="submit"
          >
            Criar cota
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
