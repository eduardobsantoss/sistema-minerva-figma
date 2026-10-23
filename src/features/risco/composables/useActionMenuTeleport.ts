import { onMounted, onUnmounted, ref, type CSSProperties } from 'vue';

const MENU_MIN_WIDTH = 168;

export function useActionMenuTeleport() {
  const openId = ref<string | null>(null);
  const menuStyle = ref<CSSProperties>({
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 9999,
    minWidth: `${MENU_MIN_WIDTH}px`,
  });

  function toggle(id: string, anchor: HTMLElement) {
    if (openId.value === id) {
      openId.value = null;
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const left = Math.max(8, rect.right - MENU_MIN_WIDTH);
    menuStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${left}px`,
      zIndex: 9999,
      minWidth: `${MENU_MIN_WIDTH}px`,
    };
    openId.value = id;
  }

  function close() {
    openId.value = null;
  }

  function handleClickOutside(e: MouseEvent) {
    const el = e.target as Element;
    if (el.closest?.('[data-action-menu-anchor]') || el.closest?.('[data-action-menu-floating]')) return;
    close();
  }

  onMounted(() => document.addEventListener('mousedown', handleClickOutside));
  onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

  return { openId, menuStyle, toggle, close };
}
