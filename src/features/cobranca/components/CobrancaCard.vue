<script setup lang="ts">
import { ref, computed } from 'vue';
import { Mail, MessageCircle, Smartphone, Building2, MoreVertical, Pencil, EyeOff, Eye, Trash2 } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Notificacao, Metodo } from '../data/cobrancaData';

const props = defineProps<{
  notificacao: Notificacao;
}>();

const emit = defineEmits<{
  edit: [id: string];
  toggleStatus: [id: string];
  delete: [id: string];
}>();

const METODOS: Metodo[] = ['Email', 'WhatsApp', 'SMS'];
const METODO_ICONS: Record<Metodo, Component> = {
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: Smartphone,
};

function formatDias(dias: number[], max = 4) {
  if (dias.length === 0) return '—';
  const shown = dias.slice(0, max);
  const rest = dias.length - max;
  const base = shown.map((d) => `${d}d`).join(', ');
  return rest > 0 ? `${base} +${rest}` : base;
}

const hover = ref(false);
const menuOpen = ref(false);
const isAtiva = computed(() => props.notificacao.status === 'Ativa');

function onMouseLeaveCard() {
  hover.value = false;
  menuOpen.value = false;
}

function handleEdit() {
  menuOpen.value = false;
  emit('edit', props.notificacao.id);
}

function handleToggleStatus() {
  menuOpen.value = false;
  emit('toggleStatus', props.notificacao.id);
}

function handleDelete() {
  menuOpen.value = false;
  emit('delete', props.notificacao.id);
}
</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.20)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '14px',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
      opacity: isAtiva ? 1 : 0.75,
    }"
    @mouseenter="hover = true"
    @mouseleave="onMouseLeaveCard"
  >
    <!-- Header: name + status + menu -->
    <div class="flex items-start justify-between" style="gap: 8px">
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            line-height: 1.25;
            letter-spacing: -0.01em;
            margin-bottom: 6px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ notificacao.nome }}
        </div>
        <span
          :style="{
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: isAtiva ? 'var(--status-success-bg)' : 'var(--status-neutral-bg)',
            color: isAtiva ? 'var(--status-success-text)' : 'var(--status-neutral-text)',
          }"
        >
          {{ notificacao.status }}
        </span>
      </div>

      <!-- Three-dot menu -->
      <div style="position: relative; flex-shrink: 0">
        <button
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: menuOpen ? 'var(--surface-sunken)' : 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--duration-fast)',
          }"
          @click.stop="menuOpen = !menuOpen"
        >
          <MoreVertical :size="16" />
        </button>
        <div
          v-if="menuOpen"
          style="
            position: absolute;
            top: 36px;
            right: 0;
            background: var(--surface-card);
            border-width: 1px;
            border-style: solid;
            border-color: var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            z-index: 20;
            overflow: hidden;
            min-width: 172px;
          "
        >
          <button
            class="cobranca-menu-item flex items-center"
            style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left"
            @click.stop="handleEdit"
          >
            <Pencil :size="14" />
            Editar régua
          </button>

          <button
            class="cobranca-menu-item flex items-center"
            :style="{
              gap: '10px', width: '100%', padding: '10px 14px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              color: isAtiva ? 'var(--text-default)' : 'var(--success-dark)',
              textAlign: 'left',
            }"
            @click.stop="handleToggleStatus"
          >
            <EyeOff v-if="isAtiva" :size="14" />
            <Eye v-else :size="14" />
            {{ isAtiva ? 'Pausar envios' : 'Reativar régua' }}
          </button>

          <div style="height: 1px; background: var(--border-default); margin: 2px 0" />

          <button
            class="cobranca-menu-item flex items-center"
            style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--action-danger-text-only); text-align: left"
            @click.stop="handleDelete"
          >
            <Trash2 :size="14" />
            Deletar notificação
          </button>
        </div>
      </div>
    </div>

    <!-- Methods -->
    <div class="flex flex-wrap" style="gap: 6px">
      <span
        v-for="m in METODOS"
        :key="m"
        class="flex items-center"
        :style="{
          gap: '4px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          background: notificacao.metodos.includes(m) ? 'var(--status-active-bg)' : 'var(--status-neutral-bg)',
          color: notificacao.metodos.includes(m) ? 'var(--status-active-text)' : 'var(--status-neutral-text)',
        }"
      >
        <component :is="METODO_ICONS[m]" :size="10" :stroke-width="2.5" />
        {{ m }}
      </span>
    </div>

    <!-- Interval counts + day breakdown -->
    <div class="flex" style="gap: 1px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-default)">
      <!-- A Vencer -->
      <div style="flex: 1; padding: 10px 12px; background: var(--surface-sunken); display: flex; flex-direction: column; gap: 4px">
        <div style="font-size: 9px; font-weight: 800; letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          A Vencer
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px">
          <span style="font-size: var(--text-xl); font-weight: 700; color: var(--text-strong); font-variant-numeric: tabular-nums; line-height: 1">
            {{ notificacao.intervalosAVencer.length }}
          </span>
          <span style="font-size: 11px; font-weight: 500; color: var(--text-muted)">
            {{ notificacao.intervalosAVencer.length === 1 ? 'envio' : 'envios' }}
          </span>
        </div>
        <div
          style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          :title="notificacao.intervalosAVencer.map((d) => `${d}d antes`).join(', ')"
        >
          {{ formatDias(notificacao.intervalosAVencer) }} antes
        </div>
      </div>

      <div style="width: 1px; background: var(--border-default); flex-shrink: 0" />

      <!-- Vencidos -->
      <div style="flex: 1; padding: 10px 12px; background: var(--surface-sunken); display: flex; flex-direction: column; gap: 4px">
        <div style="font-size: 9px; font-weight: 800; letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          Vencidos
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px">
          <span style="font-size: var(--text-xl); font-weight: 700; color: var(--danger-base); font-variant-numeric: tabular-nums; line-height: 1">
            {{ notificacao.intervalosVencidos.length }}
          </span>
          <span style="font-size: 11px; font-weight: 500; color: var(--text-muted)">
            {{ notificacao.intervalosVencidos.length === 1 ? 'envio' : 'envios' }}
          </span>
        </div>
        <div
          style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          :title="notificacao.intervalosVencidos.map((d) => `${d}d depois`).join(', ')"
        >
          {{ formatDias(notificacao.intervalosVencidos) }} depois
        </div>
      </div>
    </div>

    <!-- Vehicles -->
    <div class="flex items-center" style="gap: 6px">
      <Building2 :size="13" style="color: var(--text-muted); flex-shrink: 0" />
      <span style="font-size: var(--text-xs); color: var(--text-muted)">
        <strong style="color: var(--text-default)">{{ notificacao.veiculos.length }}</strong>
        {{ notificacao.veiculos.length === 1 ? 'veículo associado' : 'veículos associados' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.cobranca-menu-item:hover {
  background: var(--surface-sunken) !important;
}
</style>
