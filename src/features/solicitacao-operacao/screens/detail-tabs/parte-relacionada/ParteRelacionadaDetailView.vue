<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { ArrowLeft, User, MapPin, Phone } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { ParteRelacionada, ParteTipo } from '../../../data/operacaoData';
import {
  parteAnexoTabs,
  PARTE_TIPO_LABEL,
  TIPOS_PARTE_OPTS,
} from '../../../data/parteRelacionadaFields';
import {
  emptyConjugeMinuta,
  estadoCivilExigeConjuge,
  parteExigeFormularioConjuge,
  type ConjugeMinuta,
} from '../../../data/minutaData';
import { CopyButton, Section, EmptyState } from '../shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import SpouseFields from '../../../components/modals/minuta/SpouseFields.vue';
import DynamicFieldGrid from './DynamicFieldGrid.vue';

const props = defineProps<{
  parte: ParteRelacionada;
  solicitacaoId: string;
}>();
const emit = defineEmits<{ back: [] }>();

type AnexoTab = 'anexo-1' | 'anexo-2' | 'anexo-3';

const tab = ref<AnexoTab>('anexo-1');
const savedBanner = ref(false);
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const TAB_ICONS: Record<AnexoTab, Component> = {
  'anexo-1': User,
  'anexo-2': MapPin,
  'anexo-3': Phone,
};

function cloneParte(src: ParteRelacionada): ParteRelacionada {
  return {
    ...src,
    tipos: [...src.tipos],
    contatosRelacionados: src.contatosRelacionados ? src.contatosRelacionados.map((c) => ({ ...c })) : [],
    conjuge: src.conjuge ? { ...src.conjuge } : undefined,
    representante: src.representante ? { ...src.representante } : undefined,
  };
}

const draft = reactive<ParteRelacionada>(cloneParte(props.parte));
const conjugeDraft = reactive<ConjugeMinuta>(
  props.parte.conjuge ? { ...props.parte.conjuge } : emptyConjugeMinuta(),
);

watch(
  () => props.parte,
  (p) => {
    Object.assign(draft, cloneParte(p));
    Object.assign(conjugeDraft, p.conjuge ? { ...p.conjuge } : emptyConjugeMinuta());
  },
);

const tabs = computed(() => parteAnexoTabs(draft));
const activeTab = computed(() => tabs.value.find((t) => t.key === tab.value) ?? tabs.value[0]);
const tabOptions = computed(() =>
  tabs.value.map((t) => ({ key: t.key, label: t.label, icon: TAB_ICONS[t.key] })),
);

const showSpouseForm = computed(() =>
  draft.tipoPessoa === 'FISICA' && parteExigeFormularioConjuge(draft.estadoCivil, draft.regime),
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
} = useTablePagination(() => draft.contatosRelacionados ?? [], { defaultPageSize: 10 });

function flashSaved() {
  savedBanner.value = true;
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    savedBanner.value = false;
  }, 2200);
}

function applyDraftToParte(keys?: (keyof ParteRelacionada)[]) {
  if (keys) {
    const target = props.parte as unknown as Record<string, unknown>;
    for (const k of keys) {
      target[k as string] = draft[k] as unknown;
    }
  } else {
    Object.assign(props.parte, cloneParte(draft));
  }
}

function saveIdentificacao() {
  const pfKeys: (keyof ParteRelacionada)[] = [
    'nome',
    'rg',
    'inscricaoProdutorRural',
    'nacionalidade',
    'dataNascimento',
    'profissao',
    'estadoCivil',
    'regime',
    'dataCasamento',
  ];
  const pjKeys: (keyof ParteRelacionada)[] = [
    'razaoSocial',
    'nomeFantasia',
    'dataAbertura',
    'tipoEmpresa',
    'porte',
    'atividadePrincipal',
    'naturezaJuridica',
    'inscricaoMunicipal',
    'inscricaoEstadual',
  ];

  if (draft.tipoPessoa === 'FISICA') {
    applyDraftToParte(pfKeys);
    props.parte.nome = draft.nome;
    if (!estadoCivilExigeConjuge(draft.estadoCivil)) {
      draft.regime = undefined;
      draft.dataCasamento = undefined;
      props.parte.regime = undefined;
      props.parte.dataCasamento = undefined;
    }
    const exige = parteExigeFormularioConjuge(draft.estadoCivil, draft.regime);
    props.parte.possuiConjuge = exige;
    if (!exige) {
      props.parte.conjuge = undefined;
      Object.assign(conjugeDraft, emptyConjugeMinuta());
    }
  } else {
    applyDraftToParte(pjKeys);
    if (draft.razaoSocial) props.parte.nome = draft.razaoSocial;
  }
  flashSaved();
}

function saveEndereco() {
  applyDraftToParte([
    'cep',
    'localidade',
    'numero',
    'bairro',
    'infoAdicionais',
    'cidade',
    'estado',
    'pais',
  ]);
  flashSaved();
}

function saveContatoTipos() {
  applyDraftToParte(['nomeContato', 'email', 'ddi', 'telefone']);
  props.parte.tipos = [...draft.tipos];
  flashSaved();
}

function saveConjuge() {
  props.parte.conjuge = { ...conjugeDraft };
  props.parte.possuiConjuge = true;
  draft.conjuge = { ...conjugeDraft };
  draft.possuiConjuge = true;
  flashSaved();
}

function toggleTipo(codigo: string) {
  const c = codigo as ParteTipo;
  const idx = draft.tipos.indexOf(c);
  if (idx >= 0) draft.tipos.splice(idx, 1);
  else draft.tipos.push(c);
}

watch(
  () => draft.estadoCivil,
  (ec) => {
    if (!estadoCivilExigeConjuge(ec)) {
      draft.regime = undefined;
      draft.dataCasamento = undefined;
    }
  },
);

/** Primary save — mesmo padrão de VehicleRateDetailView / OperationFundRankEditor. */
const saveBtnStyle = {
  height: '44px',
  padding: '0 22px',
  background: 'var(--action-primary-bg)',
  color: 'var(--action-primary-text)',
  borderRadius: 'var(--radius-lg)',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'var(--weight-bold)',
  fontSize: 'var(--text-sm)',
} as const;
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
          {{ draft.nome }}
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
          {{ parte.documento }} · {{ draft.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
        </p>
      </div>
    </div>

    <div
      v-if="savedBanner"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, #16a34a 12%, transparent);
        border: 1px solid color-mix(in srgb, #16a34a 35%, transparent);
        font-size: var(--text-sm);
        color: var(--text-default);
      "
    >
      Alterações salvas com sucesso.
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabOptions"
      variant="brand"
      @update:model-value="tab = $event as AnexoTab"
    />

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
        :draft="draft"
        :fields="activeTab.fields"
        :cols="activeTab.cols"
      />

      <!-- Contatos relacionados + cônjuge (Anexo 1) -->
      <div v-if="tab === 'anexo-1'" style="margin-top: 32px">
        <div class="flex items-center justify-end" style="margin-bottom: 24px">
          <button
            type="button"
            class="btn-animated btn-primary"
            :style="saveBtnStyle"
            @click="saveIdentificacao"
          >
            Salvar identificação
          </button>
        </div>

        <Section title="Contatos Relacionados">
          <EmptyState
            v-if="!draft.contatosRelacionados?.length"
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

        <div v-if="showSpouseForm" style="margin-top: 24px">
          <SpouseFields v-model="conjugeDraft" />
          <div class="flex items-center justify-end" style="margin-top: 16px">
            <button
              type="button"
              class="btn-animated btn-primary"
              :style="saveBtnStyle"
              @click="saveConjuge"
            >
              {{ parte.conjuge?.nome ? 'Salvar cônjuge' : 'Adicionar cônjuge' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Endereço — salvar -->
      <div v-if="tab === 'anexo-2'" class="flex items-center justify-end" style="margin-top: 24px">
        <button
          type="button"
          class="btn-animated btn-primary"
          :style="saveBtnStyle"
          @click="saveEndereco"
        >
          Salvar endereço
        </button>
      </div>

      <!-- Contato e Tipos -->
      <div v-if="tab === 'anexo-3'" style="margin-top: 32px">
        <Section title="Tipos">
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
            <label
              v-for="t in TIPOS_PARTE_OPTS"
              :key="t.codigo"
              class="flex items-center"
              style="gap: 10px; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"
            >
              <Checkbox
                :checked="draft.tipos.includes(t.codigo as ParteTipo)"
                @change="toggleTipo(t.codigo)"
              />
              {{ t.label }}
            </label>
          </div>
          <div v-if="draft.tipos.length" class="flex items-center" style="gap: 8px; margin-top: 16px; flex-wrap: wrap">
            <span
              v-for="t in draft.tipos"
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

        <div class="flex items-center justify-end" style="margin-top: 24px">
          <button
            type="button"
            class="btn-animated btn-primary"
            :style="saveBtnStyle"
            @click="saveContatoTipos"
          >
            Salvar contato e tipos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
