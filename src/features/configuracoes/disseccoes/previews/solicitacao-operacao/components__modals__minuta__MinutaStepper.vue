<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default); overflow-x: auto">
    <button
      v-for="(s, i) in steps"
      :key="s.key"
      type="button"
      class="flex flex-col items-center justify-center"
      :style="{
        flex: 1,
        gap: '6px',
        minWidth: '88px',
        padding: '14px 8px 11px',
        background: 'transparent',
        border: 'none',
        borderBottom: i === current ? '3px solid var(--agro-base)' : '3px solid transparent',
        cursor: 'pointer',
        color: i === current ? 'var(--agro-base)' : i < current ? 'var(--gci-base)' : 'var(--text-muted)',
        opacity: i !== current && i >= current ? 0.6 : 1,
        transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
      }"
     
    >
      <component :is="s.icon" :size="18" :stroke-width="i === current ? 2.25 : 1.5" />
      <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
        {{ s.label }}
      </span>
    </button>
  </div>
</template>
