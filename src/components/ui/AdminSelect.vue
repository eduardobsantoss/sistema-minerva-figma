<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { useAnchoredMenu } from './useAnchoredMenu';
import './admin-fields.css';

export type AdminOption = string | { value: string | number; label: string };

const props = withDefaults(defineProps<{
  modelValue: string | number;
  options: AdminOption[];
  placeholder?: string;
  disabled?: boolean;
}>(), {
  placeholder: 'Selecione',
  disabled: false,
});

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>();

const anchor = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const { open, style, toggle } = useAnchoredMenu(anchor, menu, 'anchor');

const items = computed(() =>
  props.options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option)),
);

const current = computed(() => items.value.find((item) => item.value === props.modelValue));

function choose(value: string | number) {
  emit('update:modelValue', value);
  open.value = false;
}

function onToggle() {
  if (props.disabled) return;
  toggle();
}
</script>

<template>
  <div ref="anchor" class="admin-field">
    <button
      type="button"
      class="admin-field__input"
      :data-empty="!current"
      :disabled="disabled"
      :aria-expanded="open"
      @click="onToggle"
    >
      {{ current?.label ?? placeholder }}
    </button>
    <span class="admin-field__icon" aria-hidden="true" style="pointer-events: none">
      <ChevronDown :size="16" />
    </span>
    <Teleport to="body">
      <div v-if="open" ref="menu" class="admin-menu" role="listbox" :style="style">
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          class="admin-menu__item"
          :class="{ 'admin-menu__item--active': item.value === modelValue }"
          role="option"
          :aria-selected="item.value === modelValue"
          @click="choose(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>
