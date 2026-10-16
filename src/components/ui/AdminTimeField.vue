<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { Clock } from 'lucide-vue-next';
import { useAnchoredMenu } from './useAnchoredMenu';
import './admin-fields.css';

const props = withDefaults(defineProps<{
  modelValue: string;
  disabled?: boolean;
}>(), { disabled: false });

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

const anchor = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const { open, style, toggle } = useAnchoredMenu(anchor, menu, 220);

const text = ref(props.modelValue);
const hour = computed(() => props.modelValue.slice(0, 2));
const minute = computed(() => props.modelValue.slice(3, 5));

watch(() => props.modelValue, (value) => {
  if (value === text.value) return;
  if (!value && text.value && !/^([01]\d|2[0-3]):[0-5]\d$/.test(text.value)) return;
  text.value = value;
});

watch(open, (active) => {
  if (!active) return;
  nextTick(() => {
    menu.value?.querySelectorAll('[data-selected="true"]').forEach((node) => {
      node.scrollIntoView({ block: 'nearest' });
    });
  });
});

function onInput(event: Event) {
  const masked = maskTime((event.target as HTMLInputElement).value);
  text.value = masked;
  emit('update:modelValue', /^([01]\d|2[0-3]):[0-5]\d$/.test(masked) ? masked : '');
}

function choose(part: 'hour' | 'minute', value: string) {
  const nextHour = part === 'hour' ? value : (hour.value || '00');
  const nextMinute = part === 'minute' ? value : (minute.value || '00');
  const next = `${nextHour}:${nextMinute}`;
  text.value = next;
  emit('update:modelValue', next);
  if (part === 'minute') open.value = false;
}

function onToggle() {
  if (props.disabled) return;
  toggle();
}

function maskTime(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}
</script>

<template>
  <div ref="anchor" class="admin-field">
    <input
      class="admin-field__input admin-field__input--text"
      :value="text"
      inputmode="numeric"
      autocomplete="off"
      placeholder="HH:MM"
      :disabled="disabled"
      :data-empty="!text"
      @input="onInput"
    />
    <button type="button" class="admin-field__icon" aria-label="Abrir horário" :disabled="disabled" @click="onToggle">
      <Clock :size="16" />
    </button>
    <Teleport to="body">
      <div v-if="open" ref="menu" class="admin-menu admin-time-menu" :style="style">
        <div class="admin-time-menu__col" aria-label="Hora">
          <div class="admin-time-menu__head">Hora</div>
          <button
            v-for="item in HOURS"
            :key="`h-${item}`"
            type="button"
            class="admin-menu__item admin-time-menu__item"
            :class="{ 'admin-time-menu__item--selected': item === hour }"
            :data-selected="item === hour"
            @click="choose('hour', item)"
          >
            {{ item }}
          </button>
        </div>
        <div class="admin-time-menu__col" aria-label="Minuto">
          <div class="admin-time-menu__head">Min</div>
          <button
            v-for="item in MINUTES"
            :key="`m-${item}`"
            type="button"
            class="admin-menu__item admin-time-menu__item"
            :class="{ 'admin-time-menu__item--selected': item === minute }"
            :data-selected="item === minute"
            @click="choose('minute', item)"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
