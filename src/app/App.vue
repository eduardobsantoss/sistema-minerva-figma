<script setup lang="ts">
import { ref } from 'vue';
import { LoginScreen } from '@/features/auth';
import ModulesScreen from './ModulesScreen.vue';

// If a ?view= param is present, skip the login screen for capture purposes
const SKIP_LOGIN = new URLSearchParams(window.location.search).has('view');

const screen = ref<'login' | 'modules'>(SKIP_LOGIN ? 'modules' : 'login');
</script>

<template>
  <div class="size-full">
    <LoginScreen v-if="screen === 'login'" @submit="screen = 'modules'" />
    <ModulesScreen v-else />
  </div>
</template>
