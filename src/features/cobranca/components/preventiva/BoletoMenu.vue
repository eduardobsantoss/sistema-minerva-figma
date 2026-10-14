<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Download, FileX, MoreVertical } from 'lucide-vue-next';

defineProps<{ boleto: string }>();
const emit = defineEmits<{ baixar: [] }>();

// O menu é renderizado em um Teleport (position: fixed) para não ser cortado
// pelo overflow da tabela.
const MENU_WIDTH = 190;
const MENU_HEIGHT = 56;
const btnRef = ref<HTMLButtonElement | null>(null);
const pos = ref<{ top: number; left: number } | null>(null);

function toggle() {
  if (pos.value) {
    pos.value = null;
    return;
  }
  const rect = btnRef.value!.getBoundingClientRect();
  const cabeAbaixo = rect.bottom + 6 + MENU_HEIGHT < window.innerHeight;
  pos.value = {
    top: cabeAbaixo ? rect.bottom + 6 : rect.top - 6 - MENU_HEIGHT,
    left: Math.max(8, rect.right - MENU_WIDTH),
  };
}

function baixar() {
  pos.value = null;
  emit('baixar');
}

function onDocMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement | null;
  if (target?.closest('[data-boleto-menu]')) return;
  pos.value = null;
}
function close() {
  pos.value = null;
}

onMounted(() => {
  document.addEventListener('mousedown', onDocMouseDown);
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', onDocMouseDown);
  window.removeEventListener('scroll', close, true);
  window.removeEventListener('resize', close);
});
</script>

<template>
  <div style="text-align: right">
    <button
      ref="btnRef"
      type="button"
      aria-label="Ações"
      data-boleto-menu
      class="flex items-center justify-center"
      style="width: 36px; height: 36px; margin-left: auto; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
      @click.stop="toggle"
    >
      <MoreVertical :size="16" />
    </button>

    <Teleport to="body">
      <div
        v-if="pos"
        data-boleto-menu
        class="flex flex-col"
        :style="{
          position: 'fixed',
          top: pos.top + 'px',
          left: pos.left + 'px',
          width: MENU_WIDTH + 'px',
          zIndex: 400,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          padding: '6px',
        }"
      >
        <button
          v-if="boleto"
          type="button"
          class="flex items-center menu-item"
          @click="baixar"
        >
          <Download :size="14" /> Baixar boleto
        </button>
        <button v-else type="button" class="flex items-center menu-item" disabled>
          <FileX :size="14" /> Boleto: não tem
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.menu-item {
  gap: 8px;
  padding: 10px 12px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-default);
  width: 100%;
}
.menu-item:not(:disabled):hover {
  background: var(--surface-sunken);
}
.menu-item:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
