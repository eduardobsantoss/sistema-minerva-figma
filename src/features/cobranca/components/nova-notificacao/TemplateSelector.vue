<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';
import { TEMPLATES, type TemplateTom } from './templates';

const props = defineProps<{
  label: string;
  modelValue: TemplateTom;
  textKey: 'avencer' | 'vencidos';
}>();
const emit = defineEmits<{ 'update:modelValue': [v: TemplateTom] }>();

const open = ref(false);

function select(key: TemplateTom) {
  emit('update:modelValue', key);
  open.value = false;
}

const templateEntries = Object.entries(TEMPLATES) as [TemplateTom, (typeof TEMPLATES)['amigavel']][];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <FieldLabel>{{ label }}</FieldLabel>

    <!-- Selector trigger -->
    <div style="position: relative">
      <button
        type="button"
        :style="{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: open ? 'var(--border-focus)' : 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }"
        @click="open = !open"
      >
        <div style="flex: 1; min-width: 0">
          <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-strong)">
            {{ TEMPLATES[modelValue].label }}
          </div>
          <div
            style="
              font-size: 11px;
              color: var(--text-muted);
              margin-top: 2px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ TEMPLATES[modelValue][textKey].slice(0, 90) }}…
          </div>
        </div>
        <ChevronDown
          :size="15"
          :style="{
            color: 'var(--text-muted)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--duration-base)',
          }"
        />
      </button>

      <div
        v-if="open"
        style="
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: var(--surface-card);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 30;
          overflow: hidden;
        "
      >
        <button
          v-for="[key, t] in templateEntries"
          :key="key"
          type="button"
          class="template-option"
          :class="{ 'template-option--selected': modelValue === key }"
          :style="{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            borderBottom: key !== 'cobranca' ? '1px solid var(--border-default)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }"
          @click="select(key)"
        >
          <div style="display: flex; align-items: center; gap: 8px">
            <Check v-if="modelValue === key" :size="13" style="color: var(--success-base); flex-shrink: 0" />
            <span style="font-size: var(--text-sm); font-weight: 600; color: var(--text-strong)">{{ t.label }}</span>
          </div>
          <span :style="{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: modelValue === key ? '21px' : '0' }">
            {{ t[textKey].slice(0, 80) }}…
          </span>
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div>
      <div
        style="
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        "
      >
        Pré-visualização do template
      </div>
      <div
        style="
          padding: 14px;
          background: var(--surface-sunken);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-default);
          line-height: var(--leading-relaxed);
        "
      >
        {{ TEMPLATES[modelValue][textKey] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-option {
  background: transparent;
}
.template-option:hover {
  background: var(--surface-sunken);
}
.template-option--selected,
.template-option--selected:hover {
  background: var(--surface-sunken);
}
</style>
