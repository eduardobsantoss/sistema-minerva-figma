<script setup lang="ts">
import { computed } from 'vue';

/**
 * Placeholder visual de QR Code (mock). Em produção, substituir pela imagem
 * gerada no backend / lib de TOTP a partir do otpauth URI.
 */
const props = withDefaults(
  defineProps<{
    seed: string;
    size?: number;
  }>(),
  { size: 180 },
);

const GRID = 29;

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function nextRand(state: { v: number }) {
  state.v = (Math.imul(state.v, 1664525) + 1013904223) >>> 0;
  return state.v / 0xffffffff;
}

const cells = computed(() => {
  const state = { v: hashSeed(props.seed) || 1 };
  const grid: boolean[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => false),
  );

  function paintFinder(ox: number, oy: number) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[oy + y]![ox + x] = edge || core;
      }
    }
  }

  paintFinder(0, 0);
  paintFinder(GRID - 7, 0);
  paintFinder(0, GRID - 7);

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const inFinder =
        (x < 8 && y < 8) ||
        (x >= GRID - 8 && y < 8) ||
        (x < 8 && y >= GRID - 8);
      if (inFinder) continue;
      grid[y]![x] = nextRand(state) > 0.45;
    }
  }

  return grid;
});

const cell = computed(() => props.size / GRID);
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    role="img"
    aria-label="QR Code do autenticador"
    style="display: block; background: #fff"
  >
    <rect :width="size" :height="size" fill="#fff" />
    <template v-for="(row, y) in cells" :key="`r-${y}`">
      <rect
        v-for="(on, x) in row"
        v-show="on"
        :key="`${y}-${x}`"
        :x="x * cell"
        :y="y * cell"
        :width="cell"
        :height="cell"
        fill="#083C4A"
      />
    </template>
  </svg>
</template>
