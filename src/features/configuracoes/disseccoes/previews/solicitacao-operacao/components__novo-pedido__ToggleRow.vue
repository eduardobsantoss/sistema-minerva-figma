<script setup lang="ts">
withDefaults(defineProps<{ label: string; on: boolean }>(), {
  label: 'Label',
  on: true
});
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      padding: '14px 18px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
   
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{
      label
    }}</span>
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#fff',
          transition: 'left var(--duration-base)',
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>
