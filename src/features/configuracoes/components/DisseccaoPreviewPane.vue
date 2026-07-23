<script setup lang="ts">
import { computed, onErrorCaptured, ref, shallowRef, watch, type Component } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import {
  frameStyle,
  isModalPath,
  resolvePreview,
} from '../data/solicitacaoPreviewProps';

const props = defineProps<{
  componentPath: string;
  componentName: string;
}>();

const loaders = import.meta.glob('@/features/solicitacao-operacao/**/*.vue');

const Comp = shallowRef<Component | null>(null);
const loadError = ref<string | null>(null);
const runtimeError = ref<string | null>(null);
const loading = ref(false);
const modalVisible = ref(true);
/** Incrementa a cada troca / reopen para forçar remount limpo. */
const mountKey = ref(0);

const isModal = computed(() => isModalPath(props.componentPath));
const config = computed(() => resolvePreview(props.componentPath, props.componentName));
const previewProps = computed(() => ({ ...(config.value.props ?? {}) }));

const emit = defineEmits<{ 'update:example': [example: string] }>();

watch(
  config,
  (c) => {
    emit('update:example', c.example);
  },
  { immediate: true },
);

async function load() {
  loading.value = true;
  loadError.value = null;
  runtimeError.value = null;
  Comp.value = null;
  modalVisible.value = true;
  mountKey.value += 1;

  const needle = `/solicitacao-operacao/${props.componentPath}`.replace(/\\/g, '/');
  const entry = Object.entries(loaders).find(([key]) => {
    const n = key.replace(/\\/g, '/');
    return n.endsWith(needle) || n.endsWith(props.componentPath);
  });

  if (!entry) {
    loadError.value = `Não encontrado: ${props.componentPath}`;
    loading.value = false;
    return;
  }

  try {
    const mod = (await entry[1]()) as { default: Component };
    Comp.value = mod.default;
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

function onModalDismiss() {
  modalVisible.value = false;
}

function reopenModal() {
  runtimeError.value = null;
  modalVisible.value = true;
  mountKey.value += 1;
}

watch(
  () => props.componentPath,
  () => {
    void load();
  },
  { immediate: true },
);

onErrorCaptured((err) => {
  runtimeError.value = err instanceof Error ? err.message : String(err);
  // Não desmonta o host — só para de renderizar o Comp (ver v-if abaixo)
  return false;
});

const showLivePreview = computed(
  () => !!Comp.value && !runtimeError.value && !loading.value && !loadError.value,
);
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.10em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 12px;
      "
    >
      Preview com dados de exemplo
    </div>

    <div
      v-if="loading"
      style="padding: 24px; color: var(--text-muted); font-size: var(--text-sm)"
    >
      Carregando preview…
    </div>

    <div
      v-else-if="loadError"
      style="padding: 24px; color: var(--text-muted); font-size: var(--text-sm)"
    >
      {{ loadError }}
    </div>

    <template v-else>
      <div
        v-if="runtimeError"
        class="flex items-start"
        style="
          gap: 10px;
          padding: 14px 16px;
          border-radius: var(--radius-lg);
          background: var(--warning-light);
          color: var(--warning-dark);
          font-size: var(--text-xs);
          line-height: 1.5;
          margin-bottom: 14px;
        "
      >
        <AlertTriangle :size="16" style="flex-shrink: 0; margin-top: 1px" />
        <div>
          Falha ao montar o preview. O exemplo mínimo abaixo e o MD copiado continuam válidos.
          <div style="margin-top: 4px; opacity: 0.85">{{ runtimeError }}</div>
        </div>
      </div>

      <!-- Só monta o componente se NÃO houver erro — evita travar o viewer -->
      <template v-if="showLivePreview">
        <template v-if="isModal">
          <div v-if="!modalVisible" style="padding: 28px; text-align: center">
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 14px">
              Modal fechado no preview.
            </p>
            <button
              type="button"
              class="btn-animated"
              style="
                height: 38px;
                padding: 0 16px;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-default);
                background: var(--surface-card);
                color: var(--text-strong);
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                cursor: pointer;
              "
              @click="reopenModal"
            >
              Mostrar visual do modal
            </button>
          </div>
          <div
            v-else
            class="disseccao-modal-sandbox"
            :style="frameStyle('modal')"
          >
            <component
              :is="Comp"
              :key="mountKey"
              v-bind="previewProps"
              @close="onModalDismiss"
              @cancel="onModalDismiss"
              @dismiss="onModalDismiss"
            >
              {{ config.slotText }}
            </component>
          </div>
        </template>

        <div
          v-else
          :key="mountKey"
          :style="frameStyle(config.frame)"
        >
          <component :is="Comp" v-bind="previewProps">
            {{ config.slotText }}
          </component>
        </div>
      </template>
    </template>

    <div style="margin-top: 18px">
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        "
      >
        Exemplo mínimo (vai no MD copiado)
      </div>
      <pre
        style="
          margin: 0;
          padding: 14px 16px;
          background: var(--surface-sunken);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          overflow: auto;
          font-size: 12px;
          line-height: 1.45;
          color: var(--text-default);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          white-space: pre;
          max-height: 220px;
        "
      ><code>{{ config.example }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.disseccao-modal-sandbox :deep(div[style*='position: fixed']),
.disseccao-modal-sandbox :deep(div[style*='position:fixed']) {
  position: absolute !important;
  z-index: 1 !important;
}
</style>
