<script setup lang="ts">
import { ref } from "vue";
import {
  Plus,
  ShieldCheck,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-vue-next";
import {
  detalheSolicitacao,
  formatValorGarantia,
  type GarantiaOperacao,
} from "../../data/operacaoData";
import { Section, EmptyState, GhostButton } from "./shared";
import SegmentedToggle from "@/components/ui/SegmentedToggle.vue";
import CadastrarGarantiaModal from "../../components/modals/CadastrarGarantiaModal.vue";
import ExcluirGarantiaModal from "../../components/modals/ExcluirGarantiaModal.vue";

const props = defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();

const view = ref<"table" | "cards">("table");
const showModal = ref(false);
const editing = ref<GarantiaOperacao | null>(null);
const toDelete = ref<GarantiaOperacao | null>(null);
const hoveredId = ref<string | null>(null);

const VIEW_OPTS = [
  { key: "table", icon: List, label: "Tabela" },
  { key: "cards", icon: LayoutGrid, label: "Cards" },
];

function openNova() {
  editing.value = null;
  showModal.value = true;
}

function openEdit(g: GarantiaOperacao) {
  editing.value = g;
  showModal.value = true;
}

function askRemove(g: GarantiaOperacao) {
  toDelete.value = g;
}

function confirmRemove() {
  if (!toDelete.value) return;
  props.det.garantias = props.det.garantias.filter(
    (g) => g.id !== toDelete.value!.id,
  );
  toDelete.value = null;
}

function onSave(g: GarantiaOperacao) {
  const idx = props.det.garantias.findIndex((x) => x.id === g.id);
  if (idx >= 0) {
    props.det.garantias[idx] = g;
  } else {
    props.det.garantias.push(g);
  }
  showModal.value = false;
  editing.value = null;
}
</script>

<template>
  <Section title="Garantias">
    <template #action>
      <div class="flex items-center" style="gap: 10px">
        <SegmentedToggle
          v-if="det.garantias.length > 0"
          :model-value="view"
          :options="VIEW_OPTS"
          icon-only
          @update:model-value="view = $event as 'table' | 'cards'"
        />
        <GhostButton :icon="Plus" @click="openNova"
          >Adicionar garantia</GhostButton
        >
      </div>
    </template>

    <EmptyState
      v-if="det.garantias.length === 0"
      :icon="ShieldCheck"
      title="Nenhuma garantia cadastrada"
      hint="Adicione garantias reais ou fidejussórias para fortalecer a operação."
    />

    <!-- Tabela (preferencial) -->
    <div
      v-else-if="view === 'table'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        overflow: hidden;
      "
    >
      <div
        class="grid"
        style="
          grid-template-columns: 1.2fr 1.6fr 1fr 100px;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Tipo</div>
        <div>Nome</div>
        <div>Valor</div>
        <div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="g in det.garantias"
        :key="g.id"
        class="grid items-center"
        style="
          grid-template-columns: 1.2fr 1.6fr 1fr 100px;
          padding: 12px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ g.tipo }}
        </div>
        <div style="color: var(--text-default)">{{ g.nome }}</div>
        <div
          style="color: var(--text-default); font-variant-numeric: tabular-nums"
        >
          {{ formatValorGarantia(g.valor) }}
        </div>
        <div class="flex items-center justify-end" style="gap: 6px">
          <button
            aria-label="Editar"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--gci-base);
            "
            @click="openEdit(g)"
          >
            <Pencil :size="14" />
          </button>
          <button
            aria-label="Excluir"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--action-danger-text-only);
            "
            @click="askRemove(g)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div
      v-else
      class="grid"
      style="
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      "
    >
      <div
        v-for="g in det.garantias"
        :key="g.id"
        class="flex flex-col"
        :style="{
          gap: '14px',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredId === g.id ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          boxShadow:
            hoveredId === g.id
              ? '0 20px 40px -16px rgba(8,60,74,0.10)'
              : 'none',
          transform: hoveredId === g.id ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @mouseenter="hoveredId = g.id"
        @mouseleave="hoveredId = null"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <ShieldCheck :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            {{ g.tipo }}
          </div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 4px;
            "
          >
            {{ g.nome }}
          </div>
          <div
            style="
              font-size: var(--text-xs);
              color: var(--text-muted);
              line-height: 1.5;
            "
          >
            {{ g.anexos.filter((a) => a.enviado).length }}/{{
              g.anexos.length
            }}
            anexos ·
            {{ g.anexos.filter((a) => a.obrigatorio && a.enviado).length }}/{{
              g.anexos.filter((a) => a.obrigatorio).length
            }}
            obrigatórios
          </div>
        </div>
        <div
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
            letter-spacing: -0.02em;
          "
        >
          {{ formatValorGarantia(g.valor) }}
        </div>
        <div style="flex: 1" />
        <div class="flex items-center justify-between" style="gap: 8px">
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 34px;
              padding: 0 12px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--action-danger-text-only);
            "
            @click="askRemove(g)"
          >
            <Trash2 :size="13" /> Excluir
          </button>
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 34px;
              padding: 0 12px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
            "
            @click="openEdit(g)"
          >
            <Pencil :size="13" /> Editar
          </button>
        </div>
      </div>
    </div>
  </Section>

  <CadastrarGarantiaModal
    v-if="showModal"
    :garantia="editing"
    @close="
      showModal = false;
      editing = null;
    "
    @save="onSave"
  />

  <ExcluirGarantiaModal
    v-if="toDelete"
    :garantia="toDelete"
    @close="toDelete = null"
    @confirm="confirmRemove"
  />
</template>
