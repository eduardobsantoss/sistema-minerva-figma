<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Option {
  key: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    label: string;
    options: Option[];
    modelValue: string[];
    placeholder?: string;
    panelWidth?: number;
  }>(),
  { placeholder: 'Todos', panelWidth: 300 },
);
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

const open = ref(false);

const resumo = computed(() => {
  const n = props.modelValue.length;
  if (n === 0) return props.placeholder;
  if (n === 1) return props.options.find((o) => o.key === props.modelValue[0])?.label ?? '1 selecionado';
  return `${n} selecionados`;
});

function toggle(key: string) {
  const next = new Set(props.modelValue);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  emit('update:modelValue', props.options.filter((o) => next.has(o.key)).map((o) => o.key));
}

function limpar() {
  emit('update:modelValue', []);
}
</script>

<template>
  <div style="position: relative; min-width: 0">
    <span class="mc-label">{{ label }}</span>
    <button type="button" class="mc-trigger" :aria-expanded="open" @click="open = !open">
      <span
        :style="{
          flex: 1,
          minWidth: 0,
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: modelValue.length ? 'var(--text-strong)' : 'var(--text-muted)',
        }"
      >
        {{ resumo }}
      </span>
      <span
        v-if="modelValue.length > 1"
        style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: 9999px; background: var(--accent-bg); color: var(--accent); flex-shrink: 0"
      >
        {{ modelValue.length }}
      </span>
      <ChevronDown
        :size="14"
        :style="{
          color: 'var(--text-muted)',
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base)',
        }"
      />
    </button>

    <template v-if="open">
      <div style="position: fixed; inset: 0; z-index: 30" @click="open = false" />
      <div
        class="flex flex-col"
        :style="{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 31,
          width: panelWidth + 'px',
          maxWidth: 'calc(100vw - 48px)',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          padding: '8px',
        }"
      >
        <div style="max-height: 280px; overflow-y: auto">
          <div
            v-for="o in options"
            :key="o.key"
            class="mc-item"
            @click="toggle(o.key)"
          >
            <div @click.stop>
              <Checkbox :checked="modelValue.includes(o.key)" @change="toggle(o.key)" />
            </div>
            <span>{{ o.label }}</span>
          </div>
        </div>
        <div
          v-if="modelValue.length"
          style="border-top: 1px solid var(--border-default); margin-top: 6px; padding-top: 6px"
        >
          <button type="button" class="mc-clear" @click="limpar">Limpar seleção</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mc-label {
  display: block;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.mc-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--text-sm);
}
.mc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.mc-item:hover {
  background: var(--surface-sunken);
}
.mc-clear {
  width: 100%;
  padding: 8px 10px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
}
.mc-clear:hover {
  background: var(--surface-sunken);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
