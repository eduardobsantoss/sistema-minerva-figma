<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <div ref="rootRef" style="position: relative">
    <button
      aria-label="Mais ações"
      class="flex items-center justify-center"
      style="
        width: 44px;
        height: 44px;
        border-radius: var(--radius-lg);
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        cursor: pointer;
        color: var(--text-strong);
      "
     
    >
      <MoreVertical :size="20" />
    </button>
    <div
      v-if="open"
      class="flex flex-col"
      style="
        position: absolute;
        top: 52px;
        right: 0;
        z-index: 50;
        min-width: 260px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
        padding: 6px;
      "
    >
      <button
        v-for="a in secondary"
        :key="a.label"
        class="flex items-center action-item"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-default);
          width: 100%;
          transition: background var(--duration-fast);
        "
       
      >
        <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
        {{ a.label }}
      </button>
      <div style="height: 1px; background: var(--border-default); margin: 6px 4px" />
      <button
        class="flex items-center action-item-danger"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--action-danger-text-only);
          width: 100%;
          transition: background var(--duration-fast);
        "
       
      >
        <XCircle :size="16" />
        Rejeitar solicitação
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-item:hover {
  background: var(--surface-sunken);
}
.action-item-danger:hover {
  background: var(--status-danger-bg);
}
</style>
