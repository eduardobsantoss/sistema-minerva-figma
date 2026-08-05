<script setup lang="ts">
import { computed } from 'vue';
import { X, AlertTriangle, FileCode2 } from 'lucide-vue-next';
import type { LoteProcessamento } from '../../data/lotesProcessamentoData';

const props = defineProps<{ lote: LoteProcessamento }>();
const emit = defineEmits<{ close: [] }>();

/** Arquivos com falha — até 3 erros por arquivo para ilustração. */
const arquivosComErro = computed(() =>
  props.lote.arquivos
    .filter((a) => a.status === 'FALHA' && a.erros.length > 0)
    .map((a) => ({ ...a, erros: a.erros.slice(0, 3) })),
);
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Erros do lote
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ lote.nome }} · {{ arquivosComErro.length }} arquivo{{ arquivosComErro.length === 1 ? '' : 's' }} com falha
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="flex: 1; overflow-y: auto; padding: 24px 28px; gap: 16px">
        <div
          v-if="arquivosComErro.length === 0"
          style="
            padding: 32px 24px;
            text-align: center;
            background: var(--surface-sunken);
            border-radius: var(--radius-lg);
            border: 1px dashed var(--border-default);
            color: var(--text-muted);
            font-size: var(--text-sm);
          "
        >
          Nenhum erro encontrado neste lote.
        </div>

        <div
          v-for="arq in arquivosComErro"
          :key="arq.id"
          style="
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            overflow: hidden;
            background: var(--surface-card);
          "
        >
          <div
            class="flex items-center"
            style="
              gap: 10px;
              padding: 14px 16px;
              background: var(--surface-sunken);
              border-bottom: 1px solid var(--border-default);
            "
          >
            <FileCode2 :size="16" style="color: var(--text-muted); flex-shrink: 0" />
            <div style="min-width: 0; flex: 1">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                {{ arq.nome }}
              </div>
              <div v-if="arq.processadoEm" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                Processado em {{ arq.processadoEm }}
              </div>
            </div>
            <span
              style="
                display: inline-flex;
                align-items: center;
                gap: 4px;
                height: 22px;
                padding: 0 8px;
                border-radius: var(--radius-sm);
                background: var(--status-danger-bg);
                color: var(--status-danger-text);
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                text-transform: uppercase;
                flex-shrink: 0;
              "
            >
              <AlertTriangle :size="11" /> Falha
            </span>
          </div>

          <div class="flex flex-col" style="padding: 12px 16px; gap: 8px">
            <div
              v-for="(erro, i) in arq.erros"
              :key="i"
              style="
                padding: 10px 12px;
                background: var(--status-danger-bg);
                border-radius: var(--radius-md);
                font-size: var(--text-sm);
                color: var(--status-danger-text);
                line-height: 1.45;
              "
            >
              {{ erro }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
