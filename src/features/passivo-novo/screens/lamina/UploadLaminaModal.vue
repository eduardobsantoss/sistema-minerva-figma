<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { LAMINA_UPLOAD_KINDS, type LaminaUploadKind } from '../../data/passivoNovoData';

const emit = defineEmits<{
  close: [];
  confirm: [payload: { kind: LaminaUploadKind; fileName: string }];
}>();

const kind = ref<LaminaUploadKind>('cota-subordinada');
const fileName = ref('');

const canSave = computed(() => Boolean(kind.value && fileName.value));

function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  fileName.value = input.files?.[0]?.name ?? '';
}

function submit() {
  if (!canSave.value) return;
  emit('confirm', { kind: kind.value, fileName: fileName.value });
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
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Subir arquivo
        </h3>
        <button type="button" aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Tipo do arquivo</span>
          <select v-model="kind" :style="fieldStyle">
            <option v-for="k in LAMINA_UPLOAD_KINDS" :key="k.id" :value="k.id">{{ k.label }}</option>
          </select>
        </label>
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Arquivo</span>
          <input type="file" @change="onFile" />
          <span v-if="fileName" style="font-size: var(--text-xs); color: var(--text-muted)">{{ fileName }}</span>
        </label>
        <p style="font-size: var(--text-xs); color: var(--text-muted)">
          O tipo descreve o conteúdo (cota ou caixa), não a extensão. Protótipo: preenche os dados sem ler a planilha.
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
          Preencher dados
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>
