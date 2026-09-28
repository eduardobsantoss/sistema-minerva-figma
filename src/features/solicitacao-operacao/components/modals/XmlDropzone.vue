<script setup lang="ts">
import { computed, ref } from 'vue';
import { CloudUpload } from 'lucide-vue-next';

const XML_EXT = ['.xml', '.xsl', '.xbl', '.xslt'] as const;

const props = withDefaults(
  defineProps<{
    /** Extensões com ponto. Omitido: XML. `['*']` aceita qualquer arquivo. */
    extensions?: string[];
    multiple?: boolean;
    heading?: string;
    actionLabel?: string;
    hint?: string;
  }>(),
  {
    multiple: true,
    heading: 'Solte os arquivos aqui',
    actionLabel: 'clique para procurar no computador',
  },
);

const emit = defineEmits<{
  files: [files: File[]];
  rejected: [names: string[]];
}>();

const dragging = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const allowed = computed(() => props.extensions ?? [...XML_EXT]);
const allowAll = computed(() => allowed.value.includes('*'));
const acceptAttr = computed(() => (allowAll.value ? undefined : allowed.value.join(',')));
const hintText = computed(() => {
  if (props.hint) return props.hint;
  if (allowAll.value) return '';
  const list = allowed.value;
  if (list.length <= 1) return list[0] ?? '';
  return `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
});

function extensionOf(name: string) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

function splitFiles(list: FileList | File[]) {
  const accepted: File[] = [];
  const rejected: string[] = [];
  for (const file of list) {
    if (allowAll.value || allowed.value.includes(extensionOf(file.name))) accepted.push(file);
    else rejected.push(file.name);
  }
  if (accepted.length) emit('files', accepted);
  if (rejected.length) emit('rejected', rejected);
}

function onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) splitFiles(input.files);
  input.value = '';
}

function onDrop(e: DragEvent) {
  dragging.value = false;
  if (e.dataTransfer?.files?.length) splitFiles(e.dataTransfer.files);
}
</script>

<template>
  <button
    type="button"
    class="flex flex-col items-center justify-center"
    :style="{
      width: '100%',
      gap: '8px',
      padding: '40px 24px',
      background: dragging ? 'var(--accent-bg)' : 'var(--surface-sunken)',
      border: `1px dashed ${dragging ? 'var(--accent)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-xl)',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      transition: 'border-color var(--duration-base), background var(--duration-base)',
    }"
    @click="inputRef?.click()"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <div
      class="flex items-center justify-center"
      style="
        width: 56px;
        height: 56px;
        border-radius: 9999px;
        background: var(--gci-light);
        color: var(--gci-base);
        margin-bottom: 4px;
      "
    >
      <CloudUpload :size="26" />
    </div>
    <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
      {{ heading }}
    </div>
    <div style="font-size: var(--text-sm); color: var(--text-muted)">ou</div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--gci-base)">
      {{ actionLabel }}
    </div>
    <div v-if="hintText" style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
      {{ hintText }}
    </div>
    <input
      ref="inputRef"
      type="file"
      :multiple="multiple"
      :accept="acceptAttr"
      style="display: none"
      @change="onInput"
    />
  </button>
</template>
