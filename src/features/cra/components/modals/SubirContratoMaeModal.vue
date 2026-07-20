<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Upload } from 'lucide-vue-next';

const props = defineProps<{ initialDate?: string }>();
const emit = defineEmits<{
  close: [];
  save: [{ date: string; fileName: string }];
}>();

const dataFirma = ref('');
const fileName = ref('');

watch(
  () => props.initialDate,
  (d) => {
    dataFirma.value = d ?? new Date().toISOString().slice(0, 10);
  },
  { immediate: true },
);

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  fileName.value = file?.name ?? '';
}

function handleSave() {
  if (!fileName.value) return;
  emit('save', { date: dataFirma.value, fileName: fileName.value });
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 520px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 6px">
            CRA · Grupo Empresarial
          </div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Subir Contrato Mãe
          </h3>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px"
          @click="emit('close')"
        >
          <X :size="22" />
        </button>
      </div>

      <div style="padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; background: var(--surface-sunken)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
            Data firma
          </div>
          <input
            v-model="dataFirma"
            type="date"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--text-strong); outline: none"
          />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
            Contrato Mãe (PDF)
          </div>
          <label
            class="flex items-center"
            style="gap: 12px; padding: 16px; border: 2px dashed var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer"
          >
            <Upload :size="20" style="color: var(--gci-base); flex-shrink: 0" />
            <div style="flex: 1; min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ fileName || 'Selecionar arquivo PDF' }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                Apenas arquivos .pdf
              </div>
            </div>
            <input type="file" accept=".pdf" style="display: none" @change="onFileChange" />
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!fileName"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40); opacity: 1"
          :style="{ opacity: fileName ? 1 : 0.5, cursor: fileName ? 'pointer' : 'not-allowed' }"
          @click="handleSave"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
