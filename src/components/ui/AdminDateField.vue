<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useAnchoredMenu } from './useAnchoredMenu';
import './admin-fields.css';

const props = withDefaults(defineProps<{
  modelValue: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}>(), { disabled: false });

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const anchor = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const { open, style, toggle } = useAnchoredMenu(anchor, menu, 300);

const text = ref(isoToDisplay(props.modelValue));
const view = ref(startOfMonth(props.modelValue));

watch(() => props.modelValue, (value) => {
  if (value === displayToIso(text.value)) return;
  if (!value && text.value && !displayToIso(text.value)) return;
  text.value = isoToDisplay(value);
  if (value) view.value = startOfMonth(value);
});

const title = computed(() => {
  const label = view.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
});

const cells = computed(() => {
  const year = view.value.getFullYear();
  const month = view.value.getMonth();
  const startPad = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const list: { iso: string; day: number; outside: boolean }[] = [];
  for (let i = 0; i < startPad; i += 1) {
    const date = new Date(year, month, 1 - (startPad - i));
    list.push({ iso: toIso(date), day: date.getDate(), outside: true });
  }
  for (let day = 1; day <= days; day += 1) {
    list.push({ iso: toIso(new Date(year, month, day)), day, outside: false });
  }
  while (list.length % 7 !== 0) {
    const [y, m, d] = list[list.length - 1].iso.split('-').map(Number);
    const date = new Date(y, m - 1, d + 1);
    list.push({ iso: toIso(date), day: date.getDate(), outside: true });
  }
  return list;
});

function inRange(iso: string) {
  if (props.min && iso < props.min) return false;
  if (props.max && iso > props.max) return false;
  return true;
}

function onInput(event: Event) {
  const masked = maskDate((event.target as HTMLInputElement).value);
  text.value = masked;
  const iso = displayToIso(masked);
  emit('update:modelValue', iso && inRange(iso) ? iso : '');
}

function pick(iso: string) {
  if (!inRange(iso)) return;
  emit('update:modelValue', iso);
  text.value = isoToDisplay(iso);
  view.value = startOfMonth(iso);
  open.value = false;
}

function shiftMonth(delta: number) {
  const next = new Date(view.value);
  next.setMonth(next.getMonth() + delta);
  view.value = next;
}

function onToggle() {
  if (props.disabled) return;
  if (props.modelValue) view.value = startOfMonth(props.modelValue);
  toggle();
}

function maskDate(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('/');
}

function displayToIso(display: string): string | null {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return toIso(date);
}

function isoToDisplay(iso: string) {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
}

function startOfMonth(iso: string) {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  return new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

function toIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
</script>

<template>
  <div ref="anchor" class="admin-field">
    <input
      class="admin-field__input admin-field__input--text"
      :value="text"
      inputmode="numeric"
      autocomplete="off"
      placeholder="DD/MM/AAAA"
      :disabled="disabled"
      :data-empty="!text"
      @input="onInput"
    />
    <button type="button" class="admin-field__icon" aria-label="Abrir calendário" :disabled="disabled" @click="onToggle">
      <Calendar :size="16" />
    </button>
    <Teleport to="body">
      <div v-if="open" ref="menu" class="admin-menu admin-date-menu" :style="style">
        <div class="admin-date-menu__bar">
          <button type="button" class="admin-date-menu__nav" aria-label="Mês anterior" @click="shiftMonth(-1)">
            <ChevronLeft :size="16" />
          </button>
          <div class="admin-date-menu__title">{{ title }}</div>
          <button type="button" class="admin-date-menu__nav" aria-label="Próximo mês" @click="shiftMonth(1)">
            <ChevronRight :size="16" />
          </button>
        </div>
        <div class="admin-date-menu__grid">
          <div v-for="(label, index) in WEEKDAYS" :key="`${label}-${index}`" class="admin-date-menu__weekday">{{ label }}</div>
          <button
            v-for="cell in cells"
            :key="cell.iso + (cell.outside ? '-out' : '')"
            type="button"
            class="admin-date-menu__day"
            :class="{
              'admin-date-menu__day--outside': cell.outside,
              'admin-date-menu__day--selected': cell.iso === modelValue,
            }"
            :disabled="!inRange(cell.iso)"
            @click="pick(cell.iso)"
          >
            {{ cell.day }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
