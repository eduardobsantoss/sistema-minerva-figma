<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { ShieldCheck, Trash2, MoreVertical, Pencil } from 'lucide-vue-next';
import {
  FREQUENCIA_LAUDO_OPTS, TIPO_GARANTIA_OPTS,
  type ParametrizacaoGarantia, type GarantiaRow, type FrequenciaLaudo, type TipoGarantia,
} from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, SelectField, AddButton, EmptyState } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';
import EditarGarantiaModal from '../../components/modals/EditarGarantiaModal.vue';

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
const editingGarantia = ref<GarantiaRow | null>(null);
const openMenuId = ref<string | null>(null);

const GARANTIA_TABLE_GRID = 'minmax(120px, 1.2fr) minmax(72px, 0.7fr) minmax(72px, 0.7fr) minmax(100px, 1fr) minmax(80px, 0.7fr) minmax(80px, 0.7fr) 40px';

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
  emit('save', { ...form, garantias: [...form.garantias] });
}

function removeGarantia(id: string) {
  form.garantias = form.garantias.filter((g) => g.id !== id);
  openMenuId.value = null;
  emit('save', { ...form, garantias: [...form.garantias] });
}

function openEditModal(row: GarantiaRow) {
  editingGarantia.value = row;
  openMenuId.value = null;
}

function handleEditConfirm(updated: GarantiaRow) {
  form.garantias = form.garantias.map((g) => (g.id === updated.id ? updated : g));
  editingGarantia.value = null;
  emit('save', { ...form, garantias: [...form.garantias] });
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-garantia-action-menu]')) {
    openMenuId.value = null;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
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
      <div v-if="form.requerConfirmacaoTitulos" style="max-width: 240px">
        <FieldLabel>Percentual mínimo de garantia</FieldLabel>
        <input
          type="text"
          :value="`${form.percentualGarantia.toFixed(0)}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePercentualInput"
        />
      </div>
      <ToggleRow
        label="Indicativo se cliente tem garantias obrigatórias para operação"
        :on="form.garantiasObrigatorias"
        @toggle="form.garantiasObrigatorias = !form.garantiasObrigatorias"
      />

      <div style="border-top: 1px solid var(--border-default); padding-top: 16px">
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">Lista de garantias obrigatórias para operação</div>
        <div class="grid items-end" style="grid-template-columns: 1.2fr 0.7fr 0.7fr 1fr 0.7fr 0.7fr auto; gap: 10px; margin-bottom: 12px">
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
            <FieldLabel>Exige Escritura</FieldLabel>
            <Checkbox :checked="garEscritura" @change="garEscritura = !garEscritura" />
          </div>
          <div class="flex flex-col items-center" style="gap: 4px">
            <FieldLabel>Exige Protocolo</FieldLabel>
            <Checkbox :checked="garProtocolo" @change="garProtocolo = !garProtocolo" />
          </div>
          <AddButton @click="addGarantia" />
        </div>

        <EmptyState v-if="form.garantias.length === 0" :icon="ShieldCheck" title="Nenhuma garantia cadastrada" hint="Use o formulário acima para adicionar garantias." />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid items-center garantia-table-row garantia-table-header" :style="{ gridTemplateColumns: GARANTIA_TABLE_GRID }">
            <div>Tipo</div><div class="garantia-col-num">Percentual</div><div class="garantia-col-num">Prazo</div><div class="garantia-col-freq">Frequência</div><div>Exige Escritura</div><div>Exige Protocolo</div><div />
          </div>
          <div v-for="g in form.garantias" :key="g.id" class="grid items-center garantia-table-row" :style="{ gridTemplateColumns: GARANTIA_TABLE_GRID }">
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
            <div class="garantia-col-num">{{ g.percentualExigido }}%</div>
            <div class="garantia-col-num">{{ g.prazoLaudoDias }}d</div>
            <div class="garantia-col-freq">{{ g.frequenciaLaudo }}</div>
            <div>{{ g.exigeEscrituraPublica ? 'Sim' : 'Não' }}</div>
            <div>{{ g.exigeProtocolo ? 'Sim' : 'Não' }}</div>
            <div class="flex justify-end" style="position: relative" data-garantia-action-menu>
              <button
                aria-label="Ações"
                class="flex items-center justify-center"
                style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                @click="toggleMenu(g.id)"
              >
                <MoreVertical :size="14" />
              </button>
              <div
                v-if="openMenuId === g.id"
                class="flex flex-col"
                style="position: absolute; top: 28px; right: 0; z-index: 50; min-width: 140px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
              >
                <button
                  class="flex items-center garantia-action-item"
                  style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                  @click="openEditModal(g)"
                >
                  <Pencil :size="14" style="color: var(--text-muted)" />
                  Editar
                </button>
                <button
                  class="flex items-center garantia-action-item"
                  style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
                  @click="removeGarantia(g.id)"
                >
                  <Trash2 :size="14" />
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabCard>

  <EditarGarantiaModal
    v-if="editingGarantia"
    :garantia="editingGarantia"
    @close="editingGarantia = null"
    @confirm="handleEditConfirm"
  />
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

.garantia-action-item:hover {
  background: var(--surface-sunken);
}
</style>
