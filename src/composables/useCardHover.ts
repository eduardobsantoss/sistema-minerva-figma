import { ref } from 'vue';

/** Shared hover state for interactive cards (lift, CTA reveal, etc.). */
export function useCardHover() {
  const hover = ref(false);

  function onMouseenter() {
    hover.value = true;
  }

  function onMouseleave() {
    hover.value = false;
  }

  return { hover, onMouseenter, onMouseleave };
}
