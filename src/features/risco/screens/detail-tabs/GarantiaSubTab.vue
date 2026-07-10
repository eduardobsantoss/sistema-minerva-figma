<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ShieldCheck, FileSearch, Trash2 } from 'lucide-vue-next';
import {
  FREQUENCIA_LAUDO_OPTS, TIPO_GARANTIA_OPTS,
  type ParametrizacaoGarantia, type GarantiaRow, type FrequenciaLaudo, type TipoGarantia,
} from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, SelectField, DiasInput, AddButton, EmptyState } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  data: ParametrizacaoGarantia;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoGarantia] }>();
const form = reactive<ParametrizacaoGarantia>({ ...props.data, garantias: [...props.data.garantias] });

const garTipo = ref<TipoGarantia | ''>('');
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
  if (!garTipo.value) return;
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

function handleSave() {
  emit('save', { ...form, garantias: [...form.garantias] });
}

const GARANTIA_TABLE_GRID = 'minmax(120px, 1.2fr) minmax(72px, 0.7fr) minmax(72px, 0.7fr) minmax(100px, 1fr) minmax(64px, 0.6fr) minmax(64px, 0.6fr) 40px';
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Garantias" :icon="ShieldCheck">
      <div class="flex flex-col" style="gap: 16px">
        <ToggleRow
          label="Títulos cedidos em garantia necessitam de confirmação"
          hint="Exige confirmação formal dos títulos oferecidos como garantia antes da liberação da operação."
          :on="form.requerConfirmacaoTitulos"
          @toggle="form.requerConfirmacaoTitulos = !form.requerConfirmacaoTitulos"
        />
        <ToggleRow
          label="Indicativo se cliente tem garantias obrigatórias para operação"
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
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">Lista de garantias obrigatórias para operação</div>
          <div class="grid items-end" style="grid-template-columns: 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.6fr auto; gap: 10px; margin-bottom: 12px">
            <div>
              <FieldLabel>Tipo da garantia</FieldLabel>
              <select
                v-model="garTipo"
                style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
              >
                <option value="">Selecione</option>
                <option v-for="t in TIPO_GARANTIA_OPTS" :key="t" :value="t">{{ t }}</option>
              </select>
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
            <div class="grid items-center garantia-table-row garantia-table-header" :style="{ gridTemplateColumns: GARANTIA_TABLE_GRID }">
              <div>Tipo</div><div class="garantia-col-num">Percentual</div><div class="garantia-col-num">Prazo</div><div class="garantia-col-freq">Frequência</div><div>Escritura</div><div>Protocolo</div><div />
            </div>
            <div v-for="g in form.garantias" :key="g.id" class="grid items-center garantia-table-row" :style="{ gridTemplateColumns: GARANTIA_TABLE_GRID }">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
              <div class="garantia-col-num">{{ g.percentualExigido }}%</div>
              <div class="garantia-col-num">{{ g.prazoLaudoDias }}d</div>
              <div class="garantia-col-freq">{{ g.frequenciaLaudo }}</div>
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

    <TabCard title="Laudos e Protocolos" :icon="FileSearch" has-save @save="handleSave">
      <div class="flex flex-col" style="gap: 16px">
        <div class="grid laudos-protocolos-grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px; align-items: end">
          <div class="laudos-protocolos-toggle" style="grid-column: span 6">
            <ToggleRow compact label="Indicativo se exige laudo de imóvel para desembolso" :on="form.exigeLaudoImovelDesembolso" @toggle="form.exigeLaudoImovelDesembolso = !form.exigeLaudoImovelDesembolso" />
          </div>
          <div style="grid-column: span 3">
            <SelectField label="Frequência de atualização do laudo de imóvel" :options="FREQUENCIA_LAUDO_OPTS" :value="form.frequenciaLaudoImovel" @change="form.frequenciaLaudoImovel = ($event.target as HTMLSelectElement).value as FrequenciaLaudo" />
          </div>
          <div style="grid-column: span 3">
            <DiasInput label="Prazo para apresentação do laudo pós comitê (Dias)" :value="form.prazoLaudoPosComiteDias" @change="form.prazoLaudoPosComiteDias = $event" />
          </div>
        </div>
        <div class="grid laudos-protocolos-grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px; align-items: end">
          <div class="laudos-protocolos-toggle" style="grid-column: span 6">
            <ToggleRow compact label="Indicativo se exige escritura pública da AF para desembolso" :on="form.exigeEscrituraPublicaDesembolso" @toggle="form.exigeEscrituraPublicaDesembolso = !form.exigeEscrituraPublicaDesembolso" />
          </div>
          <div class="laudos-protocolos-toggle" style="grid-column: span 6">
            <ToggleRow compact label="Indicativo se exige protocolo para desembolso" :on="form.exigeProtocoloDesembolso" @toggle="form.exigeProtocoloDesembolso = !form.exigeProtocoloDesembolso" />
          </div>
        </div>
      </div>
    </TabCard>
  </div>
</template>

<style scoped>
.garantia-table-row {
  column-gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.garantia-table-header {
  border-top: none;
  padding: 10px 16px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.garantia-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.garantia-col-freq {
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}

@media (max-width: 960px) {
  .laudos-protocolos-grid > [style*='grid-column: span 6'],
  .laudos-protocolos-grid > [style*='grid-column: span 3'] {
    grid-column: span 12 !important;
  }
}

.laudos-protocolos-toggle {
  min-height: 40px;
}
</style>
