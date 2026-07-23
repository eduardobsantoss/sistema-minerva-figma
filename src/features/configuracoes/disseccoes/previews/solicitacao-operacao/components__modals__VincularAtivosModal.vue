<script setup lang="ts">
import { X } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
   
  >
    <div
      class="flex flex-col"
      style="
        width: 100%;
        max-width: 1100px;
        max-height: 90vh;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        overflow: hidden;
      "
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Vincular Ativos</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
          <X :size="20" />
        </button>
      </div>

      <div style="padding: 20px 24px; overflow-y: auto; flex: 1; min-height: 0">
        <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
        </div>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="vincular-ativos-scroll" style="overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch">
            <div :style="{ minWidth: TABLE_MIN_WIDTH }">
              <div
                class="grid items-center"
                :style="{
                  gridTemplateColumns: COLS,
                  columnGap: '12px',
                  padding: '12px 16px',
                  background: 'var(--surface-sunken)',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }"
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="allSelected" :indeterminate="someSelected" />
                </div>
                <div>Lastro</div>
                <div>Número</div>
                <div>Tipo</div>
                <div>Situação</div>
                <div>Confirmação</div>
                <div>Criação</div>
                <div>Emissão</div>
                <div>Valor nominal</div>
                <div>Cedente</div>
                <div>Sacado</div>
                <div>Vencimento</div>
                <div>Entrega</div>
              </div>
              <div
                v-if="titulos.length === 0"
                style="padding: 28px 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
              >
                Não foi encontrado nenhum título pendente.
              </div>
              <div
                v-for="t in pageItems"
                :key="t.id"
                class="grid items-center"
                :style="{
                  gridTemplateColumns: COLS,
                  columnGap: '12px',
                  padding: '14px 16px',
                  borderTop: '1px solid var(--border-default)',
                  fontSize: 'var(--text-sm)',
                }"
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="selectedIds.has(t.id)" />
                </div>
                <div style="white-space: nowrap">{{ t.lastro }}</div>
                <div style="font-weight: var(--weight-semibold); white-space: nowrap">{{ t.numero }}</div>
                <div style="white-space: nowrap">{{ t.tipoOperacao }}</div>
                <div style="white-space: nowrap">{{ t.situacao }}</div>
                <div style="white-space: nowrap">{{ t.confirmacao }}</div>
                <div style="white-space: nowrap">{{ t.dataCriacao }}</div>
                <div style="white-space: nowrap">{{ t.dataEmissao }}</div>
                <div style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ brl(t.valorNominal) }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.cedente">{{ t.cedente }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.sacado">{{ t.sacado }}</div>
                <div style="white-space: nowrap">{{ t.vencimento }}</div>
                <div>
                  <span
                    :style="{
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: 'var(--weight-bold)',
                      letterSpacing: '0.06em',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: t.entrega === 'FUT' ? 'var(--gci-light)' : 'var(--agro-light)',
                      color: t.entrega === 'FUT' ? 'var(--gci-base)' : 'var(--agro-base)',
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ t.entrega }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <TablePagination
            v-if="titulos.length > 0"
            :total="total"
            :page="page"
            :page-size="pageSize"
           
           
          />
        </div>
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 16px 24px; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 12px; flex-shrink: 0"
      >
        <div class="flex items-center" style="gap: 20px; flex-wrap: wrap">
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total selecionado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalSelecionado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total confirmado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalConfirmado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Percentual</span>
            <div style="font-weight: var(--weight-bold)">{{ percentual }}%</div>
          </div>
        </div>
        <button
          :disabled="selectedIds.size === 0"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
            opacity: selectedIds.size === 0 ? 0.5 : 1;
          "
         
        >
          VINCULAR
        </button>
      </div>
    </div>
  </div>
</template>
