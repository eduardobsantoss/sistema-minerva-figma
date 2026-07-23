<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Check, Copy } from 'lucide-vue-next';
import { copyText, componentMarkdown } from '../utils/copyText';
import { resolvePreview } from '../data/solicitacaoPreviewProps';
import DisseccaoPreviewPane from '../components/DisseccaoPreviewPane.vue';

export interface DisseccaoComponent {
  id: string;
  name: string;
  path: string;
  source: string;
}

export interface DisseccaoSection {
  title: string;
  components: DisseccaoComponent[];
}

export interface DisseccaoCatalog {
  title: string;
  sections: DisseccaoSection[];
}

const props = defineProps<{
  catalog: DisseccaoCatalog;
}>();

const emit = defineEmits<{ back: [] }>();

const firstComponent = props.catalog.sections.flatMap((s) => s.components)[0] ?? null;
const selectedId = ref<string | null>(firstComponent?.id ?? null);
const copied = ref(false);
const copyError = ref(false);

const selected = computed(() => {
  for (const section of props.catalog.sections) {
    const found = section.components.find((c) => c.id === selectedId.value);
    if (found) return { section: section.title, component: found };
  }
  return null;
});

function selectComponent(id: string) {
  selectedId.value = id;
  copied.value = false;
  copyError.value = false;
}

async function copySelected() {
  if (!selected.value) return;
  const { name, path, source } = selected.value.component;
  const { example } = resolvePreview(path, name);
  const md = componentMarkdown(name, source, example);
  const ok = await copyText(md);
  if (ok) {
    copied.value = true;
    copyError.value = false;
    window.setTimeout(() => {
      copied.value = false;
    }, 1800);
  } else {
    copyError.value = true;
  }
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px; min-height: 0">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Telas · Dissecção
        </div>
        <h1
          style="
            font-size: 26px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.15;
            margin: 0;
          "
        >
          {{ catalog.title }}
        </h1>
      </div>
      <button
        class="btn-animated btn-agro flex items-center"
        :disabled="!selected"
        :style="{
          gap: '8px',
          height: '38px',
          padding: '0 16px',
          borderRadius: 'var(--radius-lg)',
          border: 'none',
          cursor: selected ? 'pointer' : 'not-allowed',
          background: copied ? 'var(--success-base)' : copyError ? 'var(--danger-base)' : 'var(--agro-base)',
          color: 'var(--text-on-brand)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          flexShrink: 0,
          opacity: selected ? 1 : 0.5,
        }"
        @click="copySelected"
      >
        <Check v-if="copied" :size="16" />
        <Copy v-else :size="16" />
        {{ copied ? 'Copiado' : copyError ? 'Falha ao copiar' : 'Copiar MD' }}
      </button>
    </div>

    <div class="flex" style="gap: 16px; align-items: stretch; min-height: 0">
      <nav
        style="
          width: 260px;
          flex-shrink: 0;
          max-height: calc(100vh - 200px);
          overflow: auto;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          padding: 10px;
        "
      >
        <div v-for="section in catalog.sections" :key="section.title" style="margin-bottom: 12px">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.10em;
              text-transform: uppercase;
              color: var(--text-muted);
              padding: 8px 8px 6px;
            "
          >
            {{ section.title }}
          </div>
          <button
            v-for="comp in section.components"
            :key="comp.id"
            type="button"
            :aria-current="selectedId === comp.id ? 'true' : undefined"
            :style="{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              border: selectedId === comp.id ? '1px solid rgba(8,60,74,0.25)' : '1px solid transparent',
              cursor: 'pointer',
              padding: '8px 10px',
              marginBottom: '2px',
              fontSize: 'var(--text-xs)',
              fontWeight: selectedId === comp.id ? 'var(--weight-bold)' : 'var(--weight-medium)',
              color: selectedId === comp.id ? 'var(--gci-base)' : 'var(--text-default)',
              background: selectedId === comp.id ? 'var(--gci-light)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              lineHeight: 1.35,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }"
            @click="selectComponent(comp.id)"
          >
            {{ comp.name }}
          </button>
        </div>
      </nav>

      <div
        style="
          flex: 1;
          min-width: 0;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 200px);
          overflow: hidden;
        "
      >
        <div
          v-if="selected"
          class="flex items-center justify-between"
          style="
            padding: 14px 18px;
            border-bottom: 1px solid var(--border-default);
            gap: 12px;
            flex-shrink: 0;
          "
        >
          <div style="min-width: 0">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.10em;
                text-transform: uppercase;
                color: var(--text-muted);
                margin-bottom: 4px;
              "
            >
              {{ selected.section }}
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              "
            >
              {{ selected.component.name }}
            </div>
          </div>
          <button
            class="btn-animated flex items-center"
            :style="{
              gap: '6px',
              height: '34px',
              padding: '0 12px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              background: copied ? 'var(--success-light)' : 'var(--surface-card)',
              color: copied ? 'var(--success-dark)' : 'var(--text-default)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              flexShrink: 0,
            }"
            @click="copySelected"
          >
            <Check v-if="copied" :size="14" />
            <Copy v-else :size="14" />
            {{ copied ? 'Copiado' : 'Copiar MD deste componente' }}
          </button>
        </div>

        <div style="flex: 1; overflow: auto; padding: 18px">
          <DisseccaoPreviewPane
            v-if="selected"
            :key="selected.component.id"
            :component-path="selected.component.path"
            :component-name="selected.component.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>
