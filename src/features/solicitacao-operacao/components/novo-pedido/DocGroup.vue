<script setup lang="ts">
import { CheckCircle2, Download, FileText, Trash2, Upload } from 'lucide-vue-next';
import IconAction from './IconAction.vue';

defineProps<{
  title: string;
  docs: { id: string; nome: string; obrigatorio: boolean }[];
  docFiles: Record<string, boolean>;
}>();
const emit = defineEmits<{ toggleDoc: [id: string] }>();
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 12px;
      "
    >
      {{ title }}
    </div>
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="doc in docs"
        :key="doc.id"
        class="flex items-center"
        :style="{
          gap: '14px',
          padding: '12px 16px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderLeft:
            doc.obrigatorio && !docFiles[doc.id] ? '3px solid var(--warning-base)' : '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '38px',
            height: '38px',
            flexShrink: 0,
            borderRadius: 'var(--radius-md)',
            background: docFiles[doc.id] ? 'var(--success-light)' : 'var(--surface-sunken)',
            color: docFiles[doc.id] ? 'var(--success-base)' : 'var(--text-muted)',
          }"
        >
          <CheckCircle2 v-if="docFiles[doc.id]" :size="18" />
          <FileText v-else :size="18" />
        </div>

        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              doc.nome
            }}</span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                padding: '2px 7px',
                borderRadius: '9999px',
                background: doc.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
                color: doc.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
                textTransform: 'uppercase',
              }"
            >
              {{ doc.obrigatorio ? 'Obrigatório' : 'Opcional' }}
            </span>
          </div>
          <div
            :style="{
              fontSize: '11px',
              color: docFiles[doc.id] ? 'var(--success-dark)' : 'var(--text-muted)',
              marginTop: '2px',
            }"
          >
            {{ docFiles[doc.id] ? 'Arquivo anexado · documento.pdf' : 'Nenhum arquivo anexado' }}
          </div>
        </div>

        <div class="flex items-center" style="gap: 6px">
          <template v-if="docFiles[doc.id]">
            <IconAction :icon="Download" label="Baixar" />
            <IconAction :icon="Trash2" label="Excluir" danger @click="emit('toggleDoc', doc.id)" />
          </template>
          <button
            v-else
            class="flex items-center"
            style="
              gap: 6px;
              padding: 8px 14px;
              border-radius: var(--radius-md);
              cursor: pointer;
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              color: var(--text-strong);
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
            "
            @click="emit('toggleDoc', doc.id)"
          >
            <Upload :size="14" /> Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
