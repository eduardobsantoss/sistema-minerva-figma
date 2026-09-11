<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { CLASSE_LABEL, type NovaCotaInput, type SerieClasse } from '../../data/passivoNovoData';

const props = defineProps<{ defaultDateIso: string }>();
const emit = defineEmits<{ close: []; confirm: [input: NovaCotaInput] }>();

const classe = ref<SerieClasse>('SR');
const ifCodigo = ref('');
const tipo = ref('');
const dataInicioIso = ref(props.defaultDateIso);
const vencimentoIso = ref('');

const CLASSES = (Object.keys(CLASSE_LABEL) as SerieClasse[]).map((key) => ({
  key,
  label: CLASSE_LABEL[key],
}));

const canSave = computed(
  () => Boolean(tipo.value.trim() && dataInicioIso.value && vencimentoIso.value),
);

function submit() {
  if (!canSave.value) return;
  emit('confirm', {
    classe: classe.value,
    ifCodigo: ifCodigo.value,
    tipo: tipo.value,
    dataInicioIso: dataInicioIso.value,
    vencimentoIso: vencimentoIso.value,
  });
}

const fieldStyle =
  'width: 100%; height: 40px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)';
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: var(--z-modal);
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
        max-width: 520px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
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
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">IF</span>
          <input v-model="ifCodigo" type="text" placeholder="Código IF" :style="fieldStyle" />
        </label>
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Tipo</span>
          <input v-model="tipo" type="text" placeholder="Ex.: 110% DI" :style="fieldStyle" />
        </label>
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
        <p style="font-size: var(--text-xs); color: var(--text-muted)">
          A cota entra com estoque 0. Use Integralização para informar a quantidade de cotas.
        </p>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)">
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
</template>
