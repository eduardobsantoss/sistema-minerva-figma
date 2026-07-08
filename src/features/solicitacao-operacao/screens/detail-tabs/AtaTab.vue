<script setup lang="ts">
import { MessageSquare, Paperclip, Send, User } from 'lucide-vue-next';
import { Section, EmptyState } from './shared';
</script>

<template>
  <Section title="Ata de Deliberação">
    <div class="flex" style="gap: 14px">
      <div
        class="flex items-center justify-center"
        style="
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: var(--gci-light);
          color: var(--gci-base);
          flex-shrink: 0;
          font-weight: var(--weight-bold);
        "
      >
        <User :size="20" />
      </div>
      <div style="flex: 1">
        <textarea
          placeholder="Escreva uma mensagem para a ata de deliberação..."
          rows="3"
          style="
            width: 100%;
            padding: 14px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            resize: vertical;
            font-size: var(--text-sm);
            color: var(--text-strong);
            font-family: inherit;
          "
        />
        <div class="flex items-center justify-between" style="margin-top: 12px">
          <button
            class="flex items-center"
            style="
              gap: 8px;
              background: none;
              border: none;
              cursor: pointer;
              color: var(--text-muted);
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
            "
          >
            <Paperclip :size="15" /> ANEXAR
          </button>
          <button
            class="flex items-center"
            style="
              gap: 8px;
              height: 40px;
              padding: 0 18px;
              background: var(--action-primary-bg);
              color: var(--action-primary-text);
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.06em;
            "
          >
            <Send :size="14" /> Postar
          </button>
        </div>
      </div>
    </div>
    <div style="margin-top: 28px">
      <EmptyState
        :icon="MessageSquare"
        title="Nenhuma mensagem ainda"
        hint="As deliberações e comentários do time aparecerão aqui em ordem cronológica."
      />
    </div>
  </Section>
</template>
