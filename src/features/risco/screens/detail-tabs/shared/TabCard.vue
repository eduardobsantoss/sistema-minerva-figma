<script setup lang="ts">
import type { Component } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';

defineProps<{ title: string; icon?: Component; hasSave?: boolean; saveDisabled?: boolean }>();
const emit = defineEmits<{ save: [] }>();
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
    <div class="flex items-center justify-between" style="gap: 10px; padding: 16px 22px; border-bottom: 1px solid var(--border-default); border-radius: var(--radius-xl) var(--radius-xl) 0 0">
      <div class="flex items-center" style="gap: 10px; min-width: 0">
        <component :is="icon" v-if="icon" :size="16" style="color: var(--text-muted)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ title }}</h3>
      </div>
      <slot name="action" />
    </div>
    <div style="padding: 22px; overflow: visible">
      <slot />
    </div>
    <div v-if="hasSave" class="flex items-center justify-end" style="padding: 14px 22px; border-top: 1px solid var(--border-default); border-radius: 0 0 var(--radius-xl) var(--radius-xl)">
      <AdminButton :disabled="saveDisabled" @click="emit('save')">Salvar</AdminButton>
    </div>
  </div>
</template>
