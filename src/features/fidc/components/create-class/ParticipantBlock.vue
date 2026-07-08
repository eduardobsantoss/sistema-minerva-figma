<script setup lang="ts">
import { computed } from 'vue';
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';

const props = defineProps<{
  title: string;
  nameLabel: string;
  docLabel: string;
  dateLabel: string;
  required?: boolean;
  toggleLabel?: string;
  toggleEnabled?: boolean;
}>();

const emit = defineEmits<{ toggle: [] }>();

const disabled = computed(() => (props.toggleLabel ? !props.toggleEnabled : false));
</script>

<template>
  <div
    :style="{
      padding: '20px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: disabled ? 'var(--border-default)' : 'var(--border-strong, var(--border-default))',
      borderRadius: 'var(--radius-lg)',
    }"
  >
    <div class="flex items-center" style="gap: 12px; margin-bottom: 16px">
      <div
        :style="{
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.18em',
          color: required || toggleEnabled ? 'var(--accent)' : 'var(--text-muted)',
          textTransform: 'uppercase',
          flex: 1,
        }"
      >
        {{ title }}
      </div>
      <span
        v-if="required"
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: var(--danger-light);
          color: var(--danger-dark);
        "
      >
        OBRIGATÓRIO
      </span>
      <button
        v-if="toggleLabel"
        class="flex items-center"
        style="gap: 10px; background: none; border: none; cursor: pointer"
        @click="emit('toggle')"
      >
        <span
          :style="{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: toggleEnabled ? 'var(--gci-base)' : 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          {{ toggleLabel }}
        </span>
        <span
          :style="{
            width: '36px',
            height: '20px',
            borderRadius: '9999px',
            background: toggleEnabled ? 'var(--gci-base)' : 'var(--neutral-300, #d4d4d8)',
            position: 'relative',
            transition: 'background var(--duration-base)',
          }"
        >
          <span
            :style="{
              position: 'absolute',
              top: '2px',
              left: toggleEnabled ? '18px' : '2px',
              width: '16px',
              height: '16px',
              background: '#fff',
              borderRadius: '9999px',
              transition: 'left var(--duration-base)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }"
          />
        </span>
      </button>
    </div>
    <div v-if="!disabled" class="flex flex-col" style="gap: 12px">
      <div>
        <FieldLabel>{{ nameLabel }}</FieldLabel>
        <Input placeholder="Razão social / nome comercial" />
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
        <div>
          <FieldLabel>{{ docLabel }}</FieldLabel>
          <Input placeholder="00.000.000/0000-00" />
        </div>
        <div>
          <FieldLabel>{{ dateLabel }}</FieldLabel>
          <Input type="date" />
        </div>
      </div>
    </div>
  </div>
</template>
