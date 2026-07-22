<script setup lang="ts">
import { computed } from 'vue';
import { CloudUpload, Download, Link2, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { ContratoAtivo } from '../../data/operacaoData';
import { brl } from '../../data/operacaoData';
import {
  AGRUPAMENTO_DUPLICATA_KPI,
  formatTituloValor,
  type TituloExtraidoDuplicata,
  type XmlUploadItem,
} from '../../data/novoPedidoDuplicataData';
import IconAction from './IconAction.vue';

const props = defineProps<{
  phase: 'upload' | 'extracted';
  xmlFiles: XmlUploadItem[];
  titulosExtraidos: TituloExtraidoDuplicata[];
  ativosVinculados: ContratoAtivo[];
}>();

const emit = defineEmits<{
  addXml: [];
  removeXml: [id: string];
  openVincular: [];
}>();

const kpi = AGRUPAMENTO_DUPLICATA_KPI;

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.titulosExtraidos,
  { defaultPageSize: 10 },
);

const hasVinculados = computed(() => props.ativosVinculados.length > 0);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="flex items-center"
        style="
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.06em;
        "
        @click="emit('openVincular')"
      >
        <Link2 :size="15" /> Vincular ativos
      </button>
    </div>

    <!-- Fase upload: dropzone + arquivos -->
    <template v-if="phase === 'upload'">
      <button
        type="button"
        class="flex flex-col items-center justify-center"
        style="
          width: 100%;
          gap: 8px;
          padding: 48px 24px;
          background: var(--surface-sunken);
          border: 1px dashed var(--border-default);
          border-radius: var(--radius-xl);
          cursor: pointer;
          color: var(--text-muted);
          transition: border-color var(--duration-base), background var(--duration-base);
        "
        @click="emit('addXml')"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 56px;
            height: 56px;
            border-radius: 9999px;
            background: var(--gci-light);
            color: var(--gci-base);
            margin-bottom: 4px;
          "
        >
          <CloudUpload :size="26" />
        </div>
        <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
          Solte seu arquivo
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-muted)">ou</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--gci-base)">
          clique aqui para procurar
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
          XML de NF-e · mock de upload
        </div>
      </button>

      <div v-if="xmlFiles.length > 0" class="flex flex-col" style="gap: 10px">
        <div
          v-for="f in xmlFiles"
          :key="f.id"
          class="flex items-center"
          style="
            gap: 14px;
            padding: 12px 16px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          "
        >
          <div class="flex items-center" style="gap: 6px">
            <IconAction :icon="Trash2" label="Excluir" danger @click="emit('removeXml', f.id)" />
            <IconAction :icon="Download" label="Baixar" />
          </div>
          <div style="flex: 1; min-width: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ f.nome }}
          </div>
        </div>
      </div>
    </template>

    <!-- Fase extracted: KPIs + tabela -->
    <template v-else>
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
        "
      >
        <div
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Agrupamento</div>
          <div>Limite</div>
          <div>Risco</div>
          <div>Risco com Solicitação</div>
        </div>
        <div
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 12px 14px;
            font-size: var(--text-sm);
            font-variant-numeric: tabular-nums;
          "
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ kpi.agrupamento }}</div>
          <div style="color: var(--text-default)">{{ kpi.limite }}</div>
          <div style="color: var(--text-default)">{{ kpi.risco }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--success-base)">{{ kpi.riscoComSolicitacao }}</div>
        </div>
      </div>

      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
        "
      >
        <div
          class="grid"
          style="
            grid-template-columns: 120px 100px 1.2fr 1.2fr 120px 110px;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Entrega</div>
          <div>Título</div>
          <div>Cedente</div>
          <div>Sacado</div>
          <div>Valor</div>
          <div>Vencimento</div>
        </div>
        <div
          v-for="t in pageItems"
          :key="t.id"
          class="grid items-center"
          style="
            grid-template-columns: 120px 100px 1.2fr 1.2fr 120px 110px;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <div>
            <span
              style="
                display: inline-block;
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 3px 8px;
                border-radius: var(--radius-sm);
                background: var(--status-success-bg);
                color: var(--status-success-text);
                border: 1px solid color-mix(in srgb, var(--success-base) 35%, transparent);
              "
            >
              {{ t.entrega }}
            </span>
          </div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ t.titulo }}</div>
          <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.cedente">
            {{ t.cedente }}
          </div>
          <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.sacado">
            {{ t.sacado }}
          </div>
          <div style="font-variant-numeric: tabular-nums">{{ formatTituloValor(t.valor) }}</div>
          <div>{{ t.vencimento }}</div>
        </div>
        <TablePagination
          v-if="titulosExtraidos.length > 0"
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </template>

    <!-- Ativos vinculados via modal -->
    <div v-if="hasVinculados" class="flex flex-col" style="gap: 10px">
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
        "
      >
        Ativos vinculados ({{ ativosVinculados.length }})
      </div>
      <div
        v-for="a in ativosVinculados"
        :key="a.id"
        class="flex items-center justify-between"
        style="
          padding: 12px 16px;
          background: var(--surface-sunken);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
        "
      >
        <div>
          <span style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ a.numero }}</span>
          <span style="color: var(--text-muted)"> · {{ a.sacadoNome }}</span>
        </div>
        <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">
          {{ brl(a.valorTotal) }}
        </div>
      </div>
    </div>
  </div>
</template>
