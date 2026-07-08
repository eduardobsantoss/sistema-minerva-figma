<script setup lang="ts">
import { ref } from 'vue';
import { Trash2, Plus } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

const props = defineProps<{
  title: string;
  subtitle: string;
  inputLabel: string;
  intervals: number[];
  mode: 'avencer' | 'vencidos';
}>();
const emit = defineEmits<{ 'update:intervals': [v: number[]] }>();

const listRef = ref<HTMLDivElement | null>(null);
const removeHover = ref<number | null>(null);
const addHover = ref(false);

function addRow() {
  const last = props.intervals[props.intervals.length - 1] ?? (props.mode === 'avencer' ? 31 : 0);
  const next = props.mode === 'avencer' ? Math.max(last - 1, 1) : last + 1;
  emit('update:intervals', [...props.intervals, next]);
  setTimeout(() => {
    listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' });
  }, 30);
}

function removeRow(idx: number) {
  emit('update:intervals', props.intervals.filter((_, i) => i !== idx));
}

function updateRow(idx: number, val: string) {
  const n = parseInt(val, 10);
  const clamped = Math.max(1, isNaN(n) ? 1 : n);
  emit('update:intervals', props.intervals.map((v, i) => (i === idx ? clamped : v)));
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <div>
      <div style="font-size: var(--text-lg); font-weight: 700; color: var(--text-strong); margin-bottom: 6px">{{ title }}</div>
      <div style="font-size: var(--text-sm); color: var(--text-muted)">{{ subtitle }}</div>
    </div>

    <div ref="listRef" style="display: flex; flex-direction: column; gap: 8px; max-height: 340px; overflow-y: auto">
      <div v-for="(val, idx) in intervals" :key="idx" class="flex items-center" style="gap: 12px">
        <div
          style="
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            background: var(--surface-sunken);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            flex-shrink: 0;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ idx + 1 }}
        </div>
        <div style="flex: 1">
          <FieldLabel>{{ inputLabel }}</FieldLabel>
          <input
            type="number"
            :min="1"
            :value="val"
            style="
              height: 40px;
              padding: 0 14px;
              width: 100%;
              background: var(--surface-card);
              border-width: 1px;
              border-style: solid;
              border-color: var(--border-default);
              border-radius: var(--radius-md);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              font-variant-numeric: tabular-nums;
            "
            @input="updateRow(idx, ($event.target as HTMLInputElement).value)"
          />
        </div>
        <button
          title="Remover intervalo"
          :style="{
            marginTop: '20px',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: removeHover === idx ? 'var(--danger-light)' : 'transparent',
            cursor: 'pointer',
            color: removeHover === idx ? 'var(--action-danger-text-only)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'color var(--duration-fast), background var(--duration-fast)',
          }"
          @click="removeRow(idx)"
          @mouseenter="removeHover = idx"
          @mouseleave="removeHover = null"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <button
      class="flex items-center"
      :style="{
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-link)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        padding: '4px 0',
        alignSelf: 'flex-start',
        opacity: addHover ? 0.75 : 1,
      }"
      @click="addRow"
      @mouseenter="addHover = true"
      @mouseleave="addHover = false"
    >
      <Plus :size="15" /> Adicionar intervalo
    </button>
  </div>
</template>
