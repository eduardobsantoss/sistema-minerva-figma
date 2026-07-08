<script setup lang="ts">
import { Download, FileText, Paperclip, Plus, Trash2 } from 'lucide-vue-next';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section, GhostButton } from './shared';

defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();
</script>

<template>
  <Section title="Documentos Anexados">
    <template #action>
      <GhostButton :icon="Download">Baixar todos</GhostButton>
    </template>

    <!-- Linha de upload -->
    <div class="flex items-center" style="gap: 12px; margin-bottom: 18px; flex-wrap: wrap">
      <div
        class="flex items-center"
        style="
          gap: 8px;
          flex: 1;
          min-width: 220px;
          height: 42px;
          padding: 0 14px;
          background: var(--surface-sunken);
          border: 1px dashed var(--border-default);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          font-size: var(--text-sm);
        "
      >
        <Paperclip :size="15" /> Selecionar arquivo...
      </div>
      <div
        style="
          min-width: 180px;
          height: 42px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          font-size: var(--text-sm);
        "
      >
        Tipo
      </div>
      <button
        class="flex items-center"
        style="
          gap: 8px;
          height: 42px;
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
        <Plus :size="15" /> Inserir
      </button>
    </div>

    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="a in det.anexos"
        :key="a.arquivo"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-md);
            background: var(--gci-light);
            color: var(--gci-base);
            flex-shrink: 0;
          "
        >
          <FileText :size="18" />
        </div>
        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              a.nome
            }}</span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
                background: a.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
                color: a.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
                textTransform: 'uppercase',
              }"
            >
              {{ a.obrigatorio ? 'Obrigatório' : 'Opcional' }}
            </span>
          </div>
          <div
            style="
              font-size: var(--text-xs);
              color: var(--text-muted);
              margin-top: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ a.arquivo }}
          </div>
        </div>
        <button
          aria-label="Baixar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-md);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--gci-base);
          "
        >
          <Download :size="15" />
        </button>
        <button
          aria-label="Excluir"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-md);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-muted);
          "
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>
  </Section>
</template>
