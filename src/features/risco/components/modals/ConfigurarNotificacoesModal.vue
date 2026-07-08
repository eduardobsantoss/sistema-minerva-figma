<script setup lang="ts">
import { ref } from 'vue';
import { X, BellRing } from 'lucide-vue-next';

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
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 480px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <BellRing :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Configurar notificações</h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ grupoNome }}</p>
          </div>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 28px; gap: 10px">
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

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 22px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
          @click="handleConfirm"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
