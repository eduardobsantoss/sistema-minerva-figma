<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import {
  FREQUENCIA_LAUDO_OPTS, TIPO_GARANTIA_OPTS,
  type FrequenciaLaudo, type TipoGarantia, type GarantiaRow,
} from '../../data/riscoData';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  garantia: GarantiaRow;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: []; confirm: [garantia: GarantiaRow] }>();

const tipo = ref<TipoGarantia>(props.garantia.tipo);
const percentual = ref(String(props.garantia.percentualExigido));
const prazo = ref(String(props.garantia.prazoLaudoDias));
const frequencia = ref<FrequenciaLaudo>(props.garantia.frequenciaLaudo);
const exigeEscritura = ref(props.garantia.exigeEscrituraPublica);
const exigeProtocolo = ref(props.garantia.exigeProtocolo);

function canConfirm() {
  return percentual.value.trim() !== '';
}

function handleConfirm() {
  if (!canConfirm()) return;
  emit('confirm', {
    ...props.garantia,
    tipo: tipo.value,
    percentualExigido: Number(percentual.value.replace(',', '.')) || 0,
    prazoLaudoDias: Number(prazo.value) || 0,
    frequenciaLaudo: frequencia.value,
    exigeEscrituraPublica: exigeEscritura.value,
    exigeProtocolo: exigeProtocolo.value,
  });
}
</script>

<template>
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 520px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Editar Garantia</h2>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Altere os dados da garantia obrigatória.</p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px">
        <div class="flex flex-col" style="gap: 16px">
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo da garantia</div>
            <select v-model="tipo" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)">
              <option v-for="t in TIPO_GARANTIA_OPTS" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Percentual exigido</div>
              <input v-model="percentual" placeholder="0%" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Prazo laudos (dias)</div>
              <input v-model="prazo" type="number" placeholder="15" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
            </div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Frequência laudos</div>
            <select v-model="frequencia" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)">
              <option v-for="f in FREQUENCIA_LAUDO_OPTS" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
          <div class="flex items-center" style="gap: 24px">
            <label class="flex items-center" style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)">
              <Checkbox :checked="exigeEscritura" @change="exigeEscritura = !exigeEscritura" />
              Exige Escritura
            </label>
            <label class="flex items-center" style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)">
              <Checkbox :checked="exigeProtocolo" @change="exigeProtocolo = !exigeProtocolo" />
              Exige Protocolo
            </label>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          :disabled="!canConfirm()"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canConfirm() ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canConfirm() ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm() ? '#fff' : 'var(--text-disabled)',
          }"
          @click="handleConfirm"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
