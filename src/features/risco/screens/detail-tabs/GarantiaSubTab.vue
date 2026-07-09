<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ShieldCheck, Trash2 } from 'lucide-vue-next';
import { FREQUENCIA_LAUDO_OPTS, type ParametrizacaoGarantia, type GarantiaRow, type FrequenciaLaudo } from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, SelectField, AddButton, EmptyState } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  data: ParametrizacaoGarantia;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoGarantia] }>();
const form = reactive<ParametrizacaoGarantia>({ ...props.data, garantias: [...props.data.garantias] });

const garTipo = ref('');
const garPct = ref('');
const garPrazo = ref('');
const garFreq = ref<FrequenciaLaudo>('Semestral');
const garEscritura = ref(false);
const garProtocolo = ref(false);

function handlePercentualInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.percentualGarantia = Number(target.value.replace('%', '')) || 0;
}

function addGarantia() {
  if (!garTipo.value.trim()) return;
  const nova: GarantiaRow = {
    id: `gar-${Date.now()}`,
    tipo: garTipo.value,
    percentualExigido: Number(garPct.value.replace(',', '.')) || 0,
    prazoLaudoDias: Number(garPrazo.value) || 0,
    frequenciaLaudo: garFreq.value,
    exigeEscrituraPublica: garEscritura.value,
    exigeProtocolo: garProtocolo.value,
  };
  form.garantias = [...form.garantias, nova];
  garTipo.value = '';
  garPct.value = '';
  garPrazo.value = '';
  garEscritura.value = false;
  garProtocolo.value = false;
}

function removeGarantia(id: string) {
  form.garantias = form.garantias.filter((g) => g.id !== id);
}
</script>

<template>
  <TabCard title="Garantias" :icon="ShieldCheck" has-save @save="emit('save', { ...form, garantias: [...form.garantias] })">
    <div class="flex flex-col" style="gap: 16px">
      <ToggleRow
        label="Títulos cedidos em garantia necessitam de confirmação"
        hint="Exige confirmação formal dos títulos oferecidos como garantia antes da liberação da operação."
        :on="form.requerConfirmacaoTitulos"
        @toggle="form.requerConfirmacaoTitulos = !form.requerConfirmacaoTitulos"
      />
      <ToggleRow
        label="Garantias são obrigatórias"
        :on="form.garantiasObrigatorias"
        @toggle="form.garantiasObrigatorias = !form.garantiasObrigatorias"
      />
      <div v-if="form.requerConfirmacaoTitulos" style="max-width: 240px">
        <FieldLabel>Percentual mínimo de garantia</FieldLabel>
        <input
          type="text"
          :value="`${form.percentualGarantia.toFixed(0)}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePercentualInput"
        />
      </div>

      <div style="border-top: 1px solid var(--border-default); padding-top: 16px">
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">Listagem de Garantias</div>
        <div class="grid items-end" style="grid-template-columns: 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.6fr auto; gap: 10px; margin-bottom: 12px">
          <div>
            <FieldLabel>Tipo da garantia</FieldLabel>
            <input v-model="garTipo" placeholder="Ex: Imóvel Rural" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>Percentual exigido</FieldLabel>
            <input v-model="garPct" placeholder="0%" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>Prazo laudos (dias)</FieldLabel>
            <input v-model="garPrazo" type="number" placeholder="15" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <SelectField label="Frequência laudos" :options="FREQUENCIA_LAUDO_OPTS" :value="garFreq" @change="garFreq = ($event.target as HTMLSelectElement).value as FrequenciaLaudo" />
          </div>
          <div class="flex flex-col items-center" style="gap: 4px">
            <FieldLabel>Escritura</FieldLabel>
            <Checkbox :checked="garEscritura" @change="garEscritura = !garEscritura" />
          </div>
          <div class="flex flex-col items-center" style="gap: 4px">
            <FieldLabel>Protocolo</FieldLabel>
            <Checkbox :checked="garProtocolo" @change="garProtocolo = !garProtocolo" />
          </div>
          <AddButton @click="addGarantia" />
        </div>

        <EmptyState v-if="form.garantias.length === 0" :icon="ShieldCheck" title="Nenhuma garantia cadastrada" hint="Use o formulário acima para adicionar garantias." />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid items-center" style="grid-template-columns: 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.6fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
            <div>Tipo</div><div style="text-align: right">Percentual</div><div style="text-align: right">Prazo</div><div>Frequência</div><div>Escritura</div><div>Protocolo</div><div />
          </div>
          <div v-for="g in form.garantias" :key="g.id" class="grid items-center" style="grid-template-columns: 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.6fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums">{{ g.percentualExigido }}%</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums">{{ g.prazoLaudoDias }}d</div>
            <div style="color: var(--text-muted)">{{ g.frequenciaLaudo }}</div>
            <div>{{ g.exigeEscrituraPublica ? 'Sim' : 'Não' }}</div>
            <div>{{ g.exigeProtocolo ? 'Sim' : 'Não' }}</div>
            <div class="flex justify-end">
              <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="removeGarantia(g.id)">
                <Trash2 :size="13" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabCard>
</template>
