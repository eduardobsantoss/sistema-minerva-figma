<script setup lang="ts">
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import type { FundoNotificacaoGrupo } from '../../data/gruposCadastroData';

defineProps<{ fundos: FundoNotificacaoGrupo[] }>();
</script>

<template>
  <div
    v-if="fundos.length === 0"
    style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
  >
    Nenhum fundo vinculado a este grupo.
  </div>
  <div
    v-else
    style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
  >
    <div class="grid items-center" style="grid-template-columns: 1.8fr 1fr; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
      <div>Nome</div>
      <div>Status de notificação</div>
    </div>
    <div
      v-for="f in fundos"
      :key="f.id"
      class="grid items-center"
      style="grid-template-columns: 1.8fr 1fr; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.nome }}</div>
      <div class="flex items-center" style="gap: 8px">
        <CheckCircle2 v-if="f.notifiable" :size="18" style="color: var(--success-base)" />
        <XCircle v-else :size="18" style="color: var(--danger-base)" />
        <span :style="{ color: f.notifiable ? 'var(--success-base)' : 'var(--danger-base)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-xs)' }">
          {{ f.notifiable ? 'Notificável' : 'Não notificável' }}
        </span>
      </div>
    </div>
  </div>
</template>
