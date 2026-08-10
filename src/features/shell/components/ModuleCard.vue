<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/features/dashboard/components/ModuleCard.vue
 */
import { computed } from 'vue';
import ModuleCard from '@/features/dashboard/components/ModuleCard.vue';
import { modules, type ModuleItem } from '@/features/dashboard';

const props = defineProps<{
  item?: ModuleItem;
}>();

const resolved = computed(() => props.item ?? modules[0]!);
</script>

<template>
  <div style="max-width: 320px">
    <ModuleCard :item="resolved" />
  </div>
</template>
