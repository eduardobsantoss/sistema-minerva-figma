<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/features/errors/screens/ErrorScreen.vue
 */
import { computed, ref } from 'vue';
import ErrorScreen from '@/features/errors/screens/ErrorScreen.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { ERROR_PRESETS } from '@/features/errors';

const code = ref('404');
const options = Object.keys(ERROR_PRESETS).map((key) => ({ key, label: key }));
const preset = computed(() => ERROR_PRESETS[code.value]!);
</script>

<template>
  <div class="flex flex-col" style="gap: 12px">
    <SegmentedToggle v-model="code" :options="options" variant="brand" />
    <div
      style="
        height: 640px;
        overflow: hidden;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-default);
      "
    >
      <ErrorScreen
        :code="code"
        :title="preset.title"
        :description="preset.description"
        :primary-label="preset.primaryLabel"
      />
    </div>
  </div>
</template>
