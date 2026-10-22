import { onBeforeUnmount, ref, watch, type CSSProperties, type Ref } from 'vue';

/** Menu fixo ancorado no controle. O overlay do Vuetify no front usa o mesmo z-index (2500). */
export function useAnchoredMenu(
  anchor: Ref<HTMLElement | null>,
  menu: Ref<HTMLElement | null>,
  width: number | 'anchor' = 'anchor',
) {
  const open = ref(false);
  const style = ref<CSSProperties>({});

  function place() {
    const el = anchor.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const menuWidth = width === 'anchor' ? Math.max(rect.width, 180) : width;
    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 8) left = Math.max(8, window.innerWidth - menuWidth - 8);
    const estimated = 340;
    const openUp = window.innerHeight - rect.bottom < estimated && rect.top > estimated;
    style.value = {
      position: 'fixed',
      top: openUp ? `${rect.top - 8}px` : `${rect.bottom + 8}px`,
      left: `${left}px`,
      width: `${menuWidth}px`,
      zIndex: 'var(--z-popover)',
      transform: openUp ? 'translateY(-100%)' : undefined,
    };
  }

  function onDoc(event: PointerEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    if (anchor.value?.contains(target) || menu.value?.contains(target)) return;
    open.value = false;
  }

  function onKey(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    // Esc fecha só o menu; o AdminModal ignora eventos já tratados.
    event.preventDefault();
    open.value = false;
  }

  function bind(active: boolean) {
    const method = active ? 'addEventListener' : 'removeEventListener';
    window[method]('pointerdown', onDoc, true);
    window[method]('keydown', onKey, true);
    window[method]('resize', place);
    window[method]('scroll', place, true);
  }

  watch(open, (active) => {
    if (active) place();
    bind(active);
  });

  onBeforeUnmount(() => bind(false));

  function toggle() {
    open.value = !open.value;
  }

  return { open, style, place, toggle };
}
