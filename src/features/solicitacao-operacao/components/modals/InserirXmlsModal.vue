<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import IconAction from '../novo-pedido/IconAction.vue';
import XmlDropzone from './XmlDropzone.vue';
import {
  formatTituloValor,
  mockTitulosExtraidos,
  type TituloExtraidoDuplicata,
  type XmlUploadItem,
} from '../../data/novoPedidoDuplicataData';

const emit = defineEmits<{
  close: [];
  confirm: [files: File[]];
}>();

const files = ref<File[]>([]);
const items = ref<XmlUploadItem[]>([]);
const rejected = ref<string[]>([]);
const phase = ref<'upload' | 'extracted'>('upload');
const titulos = ref<TituloExtraidoDuplicata[]>([]);

const canExtract = computed(() => phase.value === 'upload' && items.value.length > 0);
const canInsert = computed(() => phase.value === 'extracted' && titulos.value.length > 0);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => titulos.value,
  { defaultPageSize: 10 },
);

function addFiles(next: File[]) {
  const known = new Set(items.value.map((f) => f.nome));
  const fresh = next.filter((f) => !known.has(f.name));
  if (!fresh.length) return;
  files.value = [...files.value, ...fresh];
  items.value = [
    ...items.value,
    ...fresh.map((f, i) => ({ id: `xml-${Date.now()}-${i}-${f.name}`, nome: f.name })),
  ];
  phase.value = 'upload';
  titulos.value = [];
}

function onRejected(names: string[]) {
  rejected.value = names;
}

function removeFile(id: string) {
  const item = items.value.find((f) => f.id === id);
  items.value = items.value.filter((f) => f.id !== id);
  if (item) files.value = files.value.filter((f) => f.name !== item.nome);
  if (!items.value.length) {
    phase.value = 'upload';
    titulos.value = [];
  }
}

function extrair() {
  if (!canExtract.value) return;
  titulos.value = mockTitulosExtraidos(items.value);
  phase.value = 'extracted';
}

function inserir() {
  if (!canInsert.value) return;
  emit('confirm', files.value);
}
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
        max-width: 860px;
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
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Inserir Novos XMLs
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Arraste os arquivos ou clique no campo. Depois extraia os dados e insira o lote.
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px; overflow: auto">
        <XmlDropzone @files="addFiles" @rejected="onRejected" />

        <div
          v-if="rejected.length"
          style="
            padding: 10px 12px;
            border-radius: var(--radius-md);
            background: var(--status-danger-bg);
            color: var(--status-danger-text);
            font-size: var(--text-xs);
            font-weight: var(--weight-semibold);
          "
        >
          Arquivos ignorados. Aceitos apenas .xml, .xsl, .xbl e .xslt: {{ rejected.join(', ') }}
        </div>

        <div v-if="items.length" class="flex flex-col" style="gap: 10px">
          <div
            v-for="f in items"
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
            <IconAction :icon="Trash2" label="Excluir" danger @click="removeFile(f.id)" />
            <div style="flex: 1; min-width: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ f.nome }}
            </div>
          </div>
        </div>

        <div v-if="items.length" class="flex justify-end">
          <button
            type="button"
            :disabled="!canExtract"
            :style="{
              height: '44px',
              padding: '0 20px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: canExtract ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: canExtract ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canExtract ? '#fff' : 'var(--text-disabled)',
            }"
            @click="extrair"
          >
            EXTRAIR DADOS
          </button>
        </div>

        <div
          v-if="items.length"
          style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
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
            v-if="titulos.length === 0"
            style="padding: 16px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); color: var(--text-muted)"
          >
            Nenhum título extraído. Use “Extrair dados” depois de incluir os arquivos.
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
            v-if="titulos.length > 0"
            :total="total"
            :page="page"
            :page-size="pageSize"
            @update:page="setPage"
            @update:page-size="setPageSize"
          />
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!canInsert"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canInsert ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canInsert ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canInsert ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="inserir"
        >
          INSERIR
        </button>
      </div>
    </div>
  </div>
</template>
