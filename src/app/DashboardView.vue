<script setup lang="ts">
import { ModuleCard, modules } from '@/features/dashboard';

defineEmits<{ moduleClick: [title: string] }>();
</script>

<template>
  <div
    style="
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--accent);
      font-weight: var(--weight-bold);
      margin-bottom: 12px;
    "
  >
    Visão Geral
  </div>
  <h1
    style="
      font-size: 28px;
      font-weight: var(--weight-bold);
      color: var(--text-strong);
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    "
  >
    Módulos do Sistema
  </h1>
  <p
    style="font-size: var(--text-base); color: var(--text-muted); margin-bottom: 40px"
  >
    Selecione um módulo para começar seu fluxo de trabalho.
  </p>

  <div
    class="grid"
    style="grid-template-columns: repeat(auto-fit, minmax(var(--dashboard-grid-min), 1fr)); gap: 24px"
  >
    <div v-for="m in modules" :key="m.title" @click="$emit('moduleClick', m.title)">
      <ModuleCard :item="m" />
    </div>
  </div>
</template>
