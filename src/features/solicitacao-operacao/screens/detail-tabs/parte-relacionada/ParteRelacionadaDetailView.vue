<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, User, MapPin, Phone } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { ParteRelacionada, ParteTipo } from '../../../data/operacaoData';
import {
  parteAnexoTabs,
  PARTE_TIPO_LABEL,
  TIPOS_PARTE_OPTS,
} from '../../../data/parteRelacionadaFields';
import { CopyButton, Section, EmptyState } from '../shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import DynamicFieldGrid from './DynamicFieldGrid.vue';

const props = defineProps<{
  parte: ParteRelacionada;
  solicitacaoId: string;
}>();
const emit = defineEmits<{ back: [] }>();

type AnexoTab = 'anexo-1' | 'anexo-2' | 'anexo-3';

const tab = ref<AnexoTab>('anexo-1');

const TAB_ICONS: Record<AnexoTab, Component> = {
  'anexo-1': User,
  'anexo-2': MapPin,
  'anexo-3': Phone,
};

const tabs = computed(() => parteAnexoTabs(props.parte));
const activeTab = computed(() => tabs.value.find((t) => t.key === tab.value) ?? tabs.value[0]);
const tabOptions = computed(() =>
  tabs.value.map((t) => ({ key: t.key, label: t.label, icon: TAB_ICONS[t.key] })),
);

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CON: { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
};

const {
  page: contatosPage,
  pageSize: contatosPageSize,
  total: contatosTotal,
  pageItems: contatosPageItems,
  setPage: setContatosPage,
  setPageSize: setContatosPageSize,
} = useTablePagination(() => props.parte.contatosRelacionados ?? [], { defaultPageSize: 10 });
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
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
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ solicitacaoId }} · Parte Relacionada
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 8px;
            flex-wrap: wrap;
          "
        >
          {{ parte.nome }}
          <CopyButton :value="parte.documento" />
        </h2>
        <p
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            margin-top: 4px;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ parte.documento }} · {{ parte.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabOptions"
      variant="brand"
      @update:model-value="tab = $event as AnexoTab"
    />

    <!-- Conteúdo do anexo ativo -->
    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <DynamicFieldGrid
        v-if="activeTab"
        :parte="parte"
        :fields="activeTab.fields"
        :cols="activeTab.cols"
      />

      <!-- Tabela de contatos relacionados (Anexo 1) -->
      <div v-if="tab === 'anexo-1'" style="margin-top: 32px">
        <Section title="Contatos Relacionados">
          <EmptyState
            v-if="!parte.contatosRelacionados?.length"
            :icon="User"
            title="Nenhum contato relacionado"
            hint="Contatos vinculados a esta parte aparecerão aqui quando cadastrados."
          />
          <div
            v-else
            style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
          >
            <div
              class="grid"
              style="
                grid-template-columns: 1.1fr 1.6fr 1.4fr 1fr;
                padding: 12px 16px;
                background: var(--surface-sunken);
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
              "
            >
              <div>Documento</div>
              <div>Nome</div>
              <div>E-mail</div>
              <div>Telefone</div>
            </div>
            <div
              v-for="(c, i) in contatosPageItems"
              :key="`${c.documento}-${i}`"
              class="grid items-center"
              style="
                grid-template-columns: 1.1fr 1.6fr 1.4fr 1fr;
                padding: 12px 16px;
                border-top: 1px solid var(--border-default);
                font-size: var(--text-sm);
              "
            >
              <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.documento }}</div>
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
              <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ c.email }}
              </div>
              <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ c.telefone }}</div>
            </div>
            <TablePagination
              sunken
              compact
              :total="contatosTotal"
              :page="contatosPage"
              :page-size="contatosPageSize"
              @update:page="setContatosPage"
              @update:page-size="setContatosPageSize"
            />
          </div>
        </Section>
      </div>

      <!-- Tipos (Anexo 3) -->
      <div v-if="tab === 'anexo-3'" style="margin-top: 32px">
        <Section title="Tipos">
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
            <div
              v-for="t in TIPOS_PARTE_OPTS"
              :key="t.codigo"
              class="flex items-center"
              :style="{
                gap: '10px',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                color: parte.tipos.includes(t.codigo as ParteTipo) ? 'var(--text-strong)' : 'var(--text-muted)',
              }"
            >
              <span
                :style="{
                  width: '18px',
                  height: '18px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${parte.tipos.includes(t.codigo as ParteTipo) ? 'var(--gci-base)' : 'var(--border-strong)'}`,
                  background: parte.tipos.includes(t.codigo as ParteTipo) ? 'var(--gci-base)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }"
              >
                <span
                  v-if="parte.tipos.includes(t.codigo as ParteTipo)"
                  style="width: 8px; height: 5px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(-45deg) translateY(-1px)"
                />
              </span>
              {{ t.label }}
            </div>
          </div>
          <div class="flex items-center" style="gap: 8px; margin-top: 16px; flex-wrap: wrap">
            <span
              v-for="t in parte.tipos"
              :key="t"
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '3px 7px',
                borderRadius: 'var(--radius-sm)',
                background: parteTone[t].bg,
                color: parteTone[t].fg,
              }"
            >
              {{ PARTE_TIPO_LABEL[t] }}
            </span>
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>
