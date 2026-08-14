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

  if (/ErrorScreen\.vue$/i.test(path)) {
    return {
      frame: 'wide',
      example: exampleBlock(
        `import ErrorScreen from '@/features/errors/screens/ErrorScreen.vue';`,
        `  <ErrorScreen\n    code="404"\n    title="Página não encontrada"\n    description="O endereço não existe ou foi movido."\n    primary-label="Voltar"\n    @primary="/* voltar */"\n    @home="/* início */"\n  />`,
      ),
    };
  }

  if (/ToastCard\.vue$/i.test(path)) {
    return {
      frame: 'card',
      example: exampleBlock(
        `import ToastCard from '@/components/feedback/ToastCard.vue';\n\nconst toast = {\n  id: '1',\n  type: 'error',\n  message: 'Incorrect password. Please try again.',\n  action: { label: 'Try again' },\n  count: 1,\n  createdAt: Date.now(),\n};`,
        `  <ToastCard :toast="toast" @dismiss="/* fechar */" />`,
      ),
    };
  }

  if (/ToastStack\.vue$/i.test(path)) {
    return {
      frame: 'wide',
      example: exampleBlock(
        `import { useToast } from '@/composables/useToast';\nimport { ToastHost } from '@/components/feedback';\n\nconst toast = useToast();\ntoast.error({ message: 'Unauthorized' });\ntoast.warn({ message: 'Session is about to expire in 10 minutes.', action: { label: 'Renew session' } });\ntoast.success('Validação concluída.');`,
        `  <ToastHost />`,
      ),
    };
  }

  if (/Alert\.vue$/i.test(path)) {
    return {
      frame: 'wide',
      example: exampleBlock(
        `import Alert from '@/components/feedback/Alert.vue';`,
        `  <Alert\n    type="error"\n    title="Não foi possível salvar"\n    message="Corrija os campos destacados antes de continuar."\n    action-label="Revisar campos"\n    @dismiss="/* fechar */"\n    @action="/* revisar */"\n  />`,
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
