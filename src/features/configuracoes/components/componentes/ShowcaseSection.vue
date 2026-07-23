<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  token?: string;
}>();
</script>

<template>
  <section
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    "
  >
    <header class="flex flex-col" style="gap: 6px">
      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <h3
          style="
            font-size: var(--text-sm);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            margin: 0;
          "
        >
          {{ title }}
        </h3>
        <code
          v-if="token"
          style="
            font-size: var(--text-micro);
            font-weight: var(--weight-medium);
            color: var(--gci-base);
            background: var(--gci-light);
            padding: 3px 8px;
            border-radius: var(--radius-full);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          "
        >
          {{ token }}
        </code>
      </div>
      <p
        v-if="description"
        style="
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        "
      >
        {{ description }}
      </p>
    </header>
    <div>
      <slot />
    </div>
  </section>
</template>
