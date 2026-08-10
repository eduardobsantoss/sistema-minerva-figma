<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/components/layout/Sidebar.vue
 */
import { ref } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const collapsed = ref(false);
const openMenu = ref<string | null>('risco');
const active = ref('risco-dashboard');

function onToggleMenu(key: string) {
  openMenu.value = openMenu.value === key ? null : key;
}
</script>

<template>
  <div style="height: 720px; display: flex; background: var(--surface-page)">
    <Sidebar
      :active="active"
      :collapsed="collapsed"
      :open-menu="openMenu"
      @navigate="active = $event"
      @toggle="collapsed = !collapsed"
      @toggle-menu="onToggleMenu"
    />
  </div>
</template>
