<script setup lang="ts">
import { ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import {
  FREQUENCIA_LAUDO_OPTS, TIPO_GARANTIA_OPTS,
  type FrequenciaLaudo, type TipoGarantia, type GarantiaRow,
} from '../../data/riscoData';
import Checkbox from '@/components/ui/Checkbox.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

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
  <AdminModal :width="520" eyebrow="Risco · Grupos" title="Editar Garantia" subtitle="Altere os dados da garantia obrigatória." @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo da garantia</div>
        <AdminSelect v-model="tipo" :options="[...TIPO_GARANTIA_OPTS.map((t) => ({ value: t, label: t }))]" />
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Percentual exigido</div>
          <input v-model="percentual" placeholder="0%" style="background: var(--surface-card); width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Prazo laudos (dias)</div>
          <input v-model="prazo" type="number" placeholder="15" style="background: var(--surface-card); width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Frequência laudos</div>
        <AdminSelect v-model="frequencia" :options="[...FREQUENCIA_LAUDO_OPTS.map((f) => ({ value: f, label: f }))]" />
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

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canConfirm()" @click="handleConfirm">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
