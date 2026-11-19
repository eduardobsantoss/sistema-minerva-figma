<script setup lang="ts">
import { ref } from 'vue';
import { FileText, Paperclip, X } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';

/** Anexo do protótipo: só guarda o nome do arquivo escolhido. */
const model = defineModel<string>({ default: '' });
const input = ref<HTMLInputElement | null>(null);

function pick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) model.value = file.name;
  (e.target as HTMLInputElement).value = '';
}
</script>

<template>
  <div class="flex items-center" style="gap: 8px; min-height: 40px">
    <div
      v-if="model"
      class="flex items-center"
      style="gap: 8px; flex: 1; min-width: 0; height: 40px; padding: 0 8px 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
    >
      <FileText :size="16" style="color: var(--gci-base); flex-shrink: 0" />
      <span style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--text-sm); color: var(--text-strong)">
        {{ model }}
      </span>
      <button
        type="button"
        aria-label="Remover arquivo"
        class="flex items-center justify-center"
        style="width: 24px; height: 24px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; border-radius: var(--radius-md)"
        @click="model = ''"
      >
        <X :size="14" />
      </button>
    </div>
    <AdminButton v-else variant="secondary" :icon="Paperclip" type="button" @click="input?.click()">Anexar arquivo</AdminButton>
    <input ref="input" type="file" style="display: none" @change="pick" />
  </div>
</template>
