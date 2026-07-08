<script setup lang="ts">
import { ref } from 'vue';
import { Search, Bell } from 'lucide-vue-next';

defineProps<{ title: string }>();

const searchFocus = ref(false);
</script>

<template>
  <header
    class="flex items-center"
    style="
      height: var(--topbar-height);
      background: var(--surface-card);
      border-bottom: 1px solid var(--border-default);
      padding: 0 var(--topbar-padding-x);
      gap: 24px;
      transition: height var(--duration-base), padding var(--duration-base);
    "
  >
    <h2
      style="
        font-size: var(--text-xl);
        font-weight: var(--weight-bold);
        color: var(--text-strong);
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      "
    >
      {{ title }}
    </h2>

    <div style="flex: 1; min-width: 8px" />

    <!-- Search -->
    <div class="topbar-search relative" style="width: 256px; flex-shrink: 1; min-width: 140px">
      <Search
        :size="16"
        style="
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
        "
      />
      <input
        type="text"
        placeholder="Buscar no sistema..."
        :style="{
          width: '100%',
          height: '40px',
          paddingLeft: '36px',
          paddingRight: '12px',
          background: 'var(--surface-sunken)',
          border: 'none',
          outline: 'none',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          boxShadow: searchFocus ? '0 0 0 3px rgba(8,60,74,0.20)' : 'none',
          transition: 'box-shadow var(--duration-base)',
        }"
        @focus="searchFocus = true"
        @blur="searchFocus = false"
      />
    </div>

    <!-- Bell -->
    <button
      aria-label="Notificações"
      class="relative flex items-center justify-center"
      style="
        width: 40px;
        height: 40px;
        border-radius: var(--radius-lg);
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--neutral-600);
      "
    >
      <Bell :size="18" />
      <span
        style="
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: var(--agro-base);
          border: 2px solid var(--surface-card);
        "
      />
    </button>

    <!-- Divisor -->
    <div
      class="topbar-user-meta"
      style="width: 1px; height: 32px; background: var(--border-default); flex-shrink: 0"
    />

    <!-- User chip -->
    <div class="flex items-center" style="gap: 12px; flex-shrink: 0">
      <div class="topbar-user-meta" style="text-align: right">
        <div
          style="
            font-size: var(--text-sm);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            line-height: 1.2;
          "
        >
          Eduardo Santos
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
          Administrador
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="
          width: 40px;
          height: 40px;
          border-radius: var(--radius-xl);
          background: var(--gci-base);
          color: #fff;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          letter-spacing: 0.02em;
        "
      >
        ES
      </div>
    </div>
  </header>
</template>
