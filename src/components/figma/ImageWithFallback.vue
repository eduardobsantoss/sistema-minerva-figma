<script setup lang="ts">
import { ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ src?: string; alt?: string }>();
const attrs = useAttrs();

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

const didError = ref(false);

function handleError() {
  didError.value = true;
}
</script>

<template>
  <div
    v-if="didError"
    class="inline-block bg-gray-100 text-center align-middle"
    v-bind="attrs"
  >
    <div class="flex items-center justify-center w-full h-full">
      <img :src="ERROR_IMG_SRC" alt="Error loading image" :data-original-url="props.src" />
    </div>
  </div>
  <img v-else :src="props.src" :alt="props.alt" v-bind="attrs" @error="handleError" />
</template>
