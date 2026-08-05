<script setup lang="ts">
import { ref } from 'vue';
import { X, ArrowLeft, FileCode2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  ARQUIVO_STATUS_LABEL,
  ARQUIVO_STATUS_TONE,
  type ArquivoLote,
  type LoteProcessamento,
} from '../../data/lotesProcessamentoData';

const props = defineProps<{ lote: LoteProcessamento }>();
const emit = defineEmits<{ close: [] }>();

const selected = ref<ArquivoLote | null>(null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.lote.arquivos,
  { defaultPageSize: 10 },
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
        max-width: 820px;
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
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default); gap: 16px">
        <div class="flex items-start" style="gap: 16px; min-width: 0; flex: 1">
          <button
            v-if="selected"
            type="button"
            aria-label="Voltar"
            class="flex items-center justify-center"
            style="
              width: 48px;
              height: 48px;
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-strong);
              flex-shrink: 0;
            "
            @click="selected = null"
          >
            <ArrowLeft :size="20" />
          </button>
          <div style="min-width: 0">
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
              {{ selected ? 'Detalhes do arquivo' : 'Arquivos do lote' }}
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
              {{ selected ? selected.nome : lote.nome }}
            </p>
          </div>
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

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <!-- Lista em tabela -->
        <div
          v-if="!selected"
          style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
        >
          <div
            class="grid"
            style="
              grid-template-columns: 1.6fr 0.7fr 1fr;
              padding: 12px 16px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Nome do arquivo</div>
            <div>Status</div>
            <div>Processado em</div>
          </div>
          <button
            v-for="arq in pageItems"
            :key="arq.id"
            type="button"
            class="grid items-center row-btn"
            style="
              width: 100%;
              grid-template-columns: 1.6fr 0.7fr 1fr;
              padding: 14px 16px;
              border: none;
              border-top: 1px solid var(--border-default);
              background: transparent;
              cursor: pointer;
              text-align: left;
              font-size: var(--text-sm);
              color: var(--text-default);
            "
            @click="selected = arq"
          >
            <div class="flex items-center" style="gap: 10px; min-width: 0">
              <FileCode2 :size="16" style="color: var(--text-muted); flex-shrink: 0" />
              <span style="font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                {{ arq.nome }}
              </span>
            </div>
            <div>
              <span
                class="badge"
                :style="{
                  background: ARQUIVO_STATUS_TONE[arq.status].bg,
                  color: ARQUIVO_STATUS_TONE[arq.status].fg,
                }"
              >
                {{ ARQUIVO_STATUS_LABEL[arq.status] }}
              </span>
            </div>
            <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ arq.processadoEm ?? '—' }}
            </div>
          </button>
          <TablePagination
            v-if="lote.arquivos.length > 0"
            sunken
            compact
            :total="total"
            :page="page"
            :page-size="pageSize"
            @update:page="setPage"
            @update:page-size="setPageSize"
          />
        </div>

        <!-- Detalhe do arquivo -->
        <div v-else class="flex flex-col" style="gap: 16px">
          <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
            <span
              class="badge"
              :style="{
                background: ARQUIVO_STATUS_TONE[selected.status].bg,
                color: ARQUIVO_STATUS_TONE[selected.status].fg,
              }"
            >
              {{ ARQUIVO_STATUS_LABEL[selected.status] }}
            </span>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">
              {{ selected.processadoEm ? `Processado em ${selected.processadoEm}` : 'Ainda não processado' }}
            </span>
          </div>

          <div
            class="grid"
            style="
              grid-template-columns: 1fr 1fr;
              gap: 14px;
              padding: 18px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
              border: 1px solid var(--border-default);
            "
          >
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Arquivo</div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); word-break: break-all">{{ selected.nome }}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Tamanho</div>
              <div style="font-size: var(--text-sm); color: var(--text-default)">{{ selected.tamanho }}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Nº NF</div>
              <div style="font-size: var(--text-sm); color: var(--text-default)">{{ selected.numeroNf }}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Valor</div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ selected.valor }}</div>
            </div>
            <div style="grid-column: 1 / -1">
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Chave NFe</div>
              <div style="font-size: var(--text-xs); color: var(--text-default); font-family: ui-monospace, monospace; word-break: break-all">{{ selected.chaveNfe }}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Emitente</div>
              <div style="font-size: var(--text-sm); color: var(--text-default)">{{ selected.emitente }}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Destinatário</div>
              <div style="font-size: var(--text-sm); color: var(--text-default)">{{ selected.destinatario }}</div>
            </div>
          </div>

          <div v-if="selected.erros.length > 0" class="flex flex-col" style="gap: 8px">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--status-danger-text); text-transform: uppercase">
              Erros ({{ selected.erros.length }})
            </div>
            <div
              v-for="(erro, i) in selected.erros"
              :key="i"
              style="
                padding: 12px 14px;
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

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.row-btn {
  transition: background var(--duration-fast);
}

.row-btn:hover {
  background: var(--surface-sunken);
}
</style>
