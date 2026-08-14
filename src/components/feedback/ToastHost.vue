<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import ToastStack from './ToastStack.vue';

const { toasts, dismiss, dismissAll } = useToast();
</script>

<template>
  <ToastStack :toasts="toasts" @dismiss="dismiss" @dismiss-all="dismissAll" />
</template>
