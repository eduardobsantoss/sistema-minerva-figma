<script setup lang="ts">
import { ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{ grupoNome: string }>();
const emit = defineEmits<{
  close: [];
  confirm: [config: { vencimentoLimite: boolean; parecerCredito: boolean; novoEventoHistorico: boolean }];
}>();

const vencimentoLimite = ref(true);
const parecerCredito = ref(true);
const novoEventoHistorico = ref(false);

function handleConfirm() {
  emit('confirm', { vencimentoLimite: vencimentoLimite.value, parecerCredito: parecerCredito.value, novoEventoHistorico: novoEventoHistorico.value });
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Risco · Grupos" title="Configurar notificações" :subtitle="grupoNome" @close="emit('close')">
    <div class="flex flex-col" style="gap: 10px">
      <div
        class="flex items-center justify-between"
        :style="{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderWidth: '1px', borderStyle: 'solid', borderColor: vencimentoLimite ? 'var(--success-base)' : 'var(--border-default)', background: vencimentoLimite ? 'var(--success-light)' : 'var(--surface-card)', transition: 'all var(--duration-base)' }"
        @click="vencimentoLimite = !vencimentoLimite"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">Vencimento do limite</span>
        <div :style="{ position: 'relative', width: '44px', height: '24px', borderRadius: '9999px', background: vencimentoLimite ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
          <span :style="{ position: 'absolute', top: '3px', left: vencimentoLimite ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
        </div>
      </div>
      <div
        class="flex items-center justify-between"
        :style="{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderWidth: '1px', borderStyle: 'solid', borderColor: parecerCredito ? 'var(--success-base)' : 'var(--border-default)', background: parecerCredito ? 'var(--success-light)' : 'var(--surface-card)', transition: 'all var(--duration-base)' }"
        @click="parecerCredito = !parecerCredito"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">Alteração no parecer de crédito</span>
        <div :style="{ position: 'relative', width: '44px', height: '24px', borderRadius: '9999px', background: parecerCredito ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
          <span :style="{ position: 'absolute', top: '3px', left: parecerCredito ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
        </div>
      </div>
      <div
        class="flex items-center justify-between"
        :style="{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderWidth: '1px', borderStyle: 'solid', borderColor: novoEventoHistorico ? 'var(--success-base)' : 'var(--border-default)', background: novoEventoHistorico ? 'var(--success-light)' : 'var(--surface-card)', transition: 'all var(--duration-base)' }"
        @click="novoEventoHistorico = !novoEventoHistorico"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">Novo evento no histórico</span>
        <div :style="{ position: 'relative', width: '44px', height: '24px', borderRadius: '9999px', background: novoEventoHistorico ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
          <span :style="{ position: 'absolute', top: '3px', left: novoEventoHistorico ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" @click="handleConfirm">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
