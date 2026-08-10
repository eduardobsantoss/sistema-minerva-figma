import { modules } from '@/features/dashboard';
import type { PreviewConfig } from './solicitacaoPreviewProps';

function exampleBlock(setup: string, template: string): string {
  return `<script setup lang="ts">
${setup}
</script>

<template>
${template}
</template>`;
}

export function resolvePreview(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');

  if (/LoginScreen\.vue$/i.test(path)) {
    return {
      frame: 'wide',
      example: exampleBlock(
        `import LoginScreen from '@/features/auth/screens/LoginScreen.vue';`,
        `  <div style="height: 100vh">\n    <LoginScreen @submit="/* entrar */" />\n  </div>`,
      ),
    };
  }

  if (/DashboardView\.vue$/i.test(path)) {
    return {
      frame: 'wide',
      example: exampleBlock(
        `import DashboardView from '@/app/DashboardView.vue';`,
        `  <DashboardView @module-click="(title) => {/* navegar */}" />`,
      ),
    };
  }

  if (/Topbar\.vue$/i.test(path)) {
    return {
      props: { title: 'Bem-vindo(a) ao Minerva Gestão' },
      frame: 'wide',
      example: exampleBlock(
        `import Topbar from '@/components/layout/Topbar.vue';`,
        `  <Topbar title="Bem-vindo(a) ao Minerva Gestão" />`,
      ),
    };
  }

  if (/Sidebar\.vue$/i.test(path)) {
    return {
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport Sidebar from '@/components/layout/Sidebar.vue';\n\nconst collapsed = ref(false);\nconst openMenu = ref<string | null>('risco');\nconst active = ref('risco-dashboard');`,
        `  <div style="height: 100vh; display: flex">\n    <Sidebar\n      :active="active"\n      :collapsed="collapsed"\n      :open-menu="openMenu"\n      @navigate="active = $event"\n      @toggle="collapsed = !collapsed"\n      @toggle-menu="(k) => (openMenu = openMenu === k ? null : k)"\n    />\n  </div>`,
      ),
    };
  }

  if (/ModuleCard\.vue$/i.test(path)) {
    return {
      props: { item: modules[0] },
      frame: 'card',
      example: exampleBlock(
        `import ModuleCard from '@/features/dashboard/components/ModuleCard.vue';\nimport { modules } from '@/features/dashboard';`,
        `  <ModuleCard :item="modules[0]" />`,
      ),
    };
  }

  return {
    frame: 'wide',
    example: exampleBlock(
      `import ${name} from './${name}.vue';`,
      `  <${name} />`,
    ),
  };
}
