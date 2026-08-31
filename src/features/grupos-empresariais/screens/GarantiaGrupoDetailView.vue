<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MoreVertical,
  Pencil,
  RefreshCw,
  Scale,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-vue-next';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import GarantiaMinutaStep from '@/features/solicitacao-operacao/components/modals/minuta/GarantiaMinutaStep.vue';
import { BentoBox, StepGrid } from '@/features/solicitacao-operacao/components/modals/adicionar-contrato';
import {
  isDocumentoGarantiaVigente,
  isGarantiaCessaoContrato,
  isGarantiaCessaoDuplicatas,
  isGarantiaComFormaProduto,
  isGarantiaEstoque,
  isGarantiaFormularioEspecifico,
  isGarantiaImovel,
  type EstoqueItem,
} from '@/features/solicitacao-operacao/data/minutaData';
import type { GrupoCadastro, GarantiaGrupo } from '../data/gruposCadastroData';
import DetailField from './garantia-detail/DetailField.vue';
import EstoqueListPanel from './garantia-detail/EstoqueListPanel.vue';

const props = defineProps<{
  grupo: GrupoCadastro;
  garantia: GarantiaGrupo;
}>();

const emit = defineEmits<{ close: []; update: [garantia: GarantiaGrupo]; delete: [garantia: GarantiaGrupo] }>();

const tab = ref<'dados' | 'documentos'>('dados');
const editorRef = ref<InstanceType<typeof GarantiaMinutaStep> | null>(null);
const menuOpen = ref(false);
const toDelete = ref(false);
const localGarantias = ref<GarantiaGrupo[]>([{ ...props.garantia }]);

watch(
  () => props.garantia,
  (next) => {
    localGarantias.value = [{ ...next }];
  },
);

const g = computed(() => localGarantias.value[0] ?? props.garantia);

const showCamposPadrao = computed(() => !!g.value.tipo && !isGarantiaFormularioEspecifico(g.value.tipo));
const showFormaProduto = computed(() => isGarantiaComFormaProduto(g.value.tipo) && showCamposPadrao.value);
const hideCabecalhoExtra = computed(
  () =>
    isGarantiaEstoque(g.value.tipo) ||
    isGarantiaImovel(g.value.tipo) ||
    isGarantiaCessaoDuplicatas(g.value.tipo) ||
    isGarantiaCessaoContrato(g.value.tipo),
);
const podeExcluir = computed(() => g.value.qtdOperacoes === 0);

function simNao(v: boolean) {
  return v ? 'Sim' : 'Não';
}

function display(value: string | number | undefined | null) {
  const raw = value == null ? '' : String(value).trim();
  return raw || '—';
}

function openEdit() {
  menuOpen.value = false;
  editorRef.value?.openEdit(0);
}

function askDelete() {
  if (!podeExcluir.value) return;
  menuOpen.value = false;
  toDelete.value = true;
}

function confirmDelete() {
  emit('delete', g.value);
  toDelete.value = false;
}

function onClickOutsideMenu(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (t?.closest('[data-garantia-detail-menu]')) return;
  menuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', onClickOutsideMenu));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutsideMenu));

const garantiasModel = computed({
  get: () => localGarantias.value,
  set: (items) => {
    const next = items[0] as GarantiaGrupo | undefined;
    if (!next) return;
    localGarantias.value = [{ ...props.garantia, ...next }];
    emit('update', localGarantias.value[0]!);
  },
});

function updateEstoques(items: EstoqueItem[]) {
  const updated = { ...g.value, estoques: items };
  localGarantias.value = [updated];
  emit('update', updated);
}

const TABS = [
  { key: 'dados', label: 'Dados', icon: Scale },
  { key: 'documentos', label: 'Documentos', icon: FileText },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('close')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          {{ grupo.nome }} · Garantia
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.25">
          {{ g.tipo }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ g.valor || '—' }}
        </p>
      </div>
      <div class="flex justify-end" style="position: relative; flex-shrink: 0" data-garantia-detail-menu>
        <button
          type="button"
          aria-label="Ações"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click.stop="menuOpen = !menuOpen"
        >
          <MoreVertical :size="18" />
        </button>
        <div
          v-if="menuOpen"
          class="flex flex-col"
          style="position: absolute; top: 44px; right: 0; z-index: 50; min-width: 220px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
        >
          <button
            type="button"
            class="flex items-center garantia-detail-action-item"
            style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
            @click="openEdit"
          >
            <Pencil :size="14" style="color: var(--text-muted); flex-shrink: 0" />
            Editar Garantia
          </button>
          <button
            type="button"
            class="flex items-center garantia-detail-action-item"
            :disabled="!podeExcluir"
            :style="{
              gap: '8px',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              cursor: podeExcluir ? 'pointer' : 'not-allowed',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)',
              color: podeExcluir ? 'var(--action-danger-text-only)' : 'var(--text-disabled)',
              width: '100%',
              opacity: podeExcluir ? 1 : 0.55,
            }"
            @click="askDelete"
          >
            <Trash2 :size="14" style="flex-shrink: 0" />
            Excluir
          </button>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px">
      <div style="padding: 16px 18px; border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Aquisição</div>
        <div class="flex items-center" style="gap: 8px; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          <CalendarDays :size="16" style="color: var(--text-muted)" />
          {{ g.dataAquisicao }}
        </div>
      </div>
      <div style="padding: 16px 18px; border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Uso</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ g.percentualUsado ?? 0 }}%</div>
      </div>
      <div style="padding: 16px 18px; border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Operações</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ g.qtdOperacoes }}</div>
      </div>
      <div style="padding: 16px 18px; border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Situação</div>
        <div class="flex items-center" style="gap: 8px; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          <ShieldCheck :size="16" :style="{ color: g.situacaoGarantia === 'em_uso' ? 'var(--gci-base)' : 'var(--success-base)' }" />
          {{ g.situacaoGarantia === 'em_uso' ? 'Em uso' : 'Disponível' }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="width: fit-content"
      @update:model-value="tab = $event as 'dados' | 'documentos'"
    />

    <div v-if="tab === 'dados'" class="flex flex-col" style="gap: 16px">
      <BentoBox title="Dados da garantia" :icon="Scale">
        <StepGrid>
          <DetailField label="Tipo de garantia" :span="6">{{ display(g.tipo) }}</DetailField>
          <DetailField label="Valor da garantia" :span="6">{{ display(g.valor) }}</DetailField>
          <DetailField v-if="showCamposPadrao" label="Nº de testemunhas" :span="4">{{ display(g.numeroTestemunhas) }}</DetailField>
          <DetailField v-if="!hideCabecalhoExtra" label="Descrição" :span="12">{{ display(g.descricao) }}</DetailField>
          <DetailField v-if="showCamposPadrao" label="Obrigação garantida / vínculo com o título" :span="8">
            {{ display(g.obrigacaoGarantida) }}
          </DetailField>
          <DetailField v-if="showFormaProduto" label="Forma do produto" :span="4">{{ display(g.formaProduto) }}</DetailField>
          <DetailField v-if="!hideCabecalhoExtra" label="É instrumento particular" :span="4">{{ simNao(g.instrumentoParticular) }}</DetailField>
          <DetailField v-if="showCamposPadrao" label="Vai constituir garantia" :span="4">{{ simNao(g.constituirGarantia) }}</DetailField>
        </StepGrid>
      </BentoBox>

      <BentoBox v-if="showCamposPadrao && g.constituirGarantia" title="Constituição da garantia" :icon="Scale">
        <StepGrid>
          <DetailField label="Órgão / cartório de registro" :span="6">{{ display(g.cartorioConstituicao) }}</DetailField>
          <DetailField label="Data prevista de constituição" :span="6">{{ display(g.dataPrevistaConstituicao) }}</DetailField>
          <DetailField label="Observações" :span="12">{{ display(g.observacoesConstituicao) }}</DetailField>
        </StepGrid>
      </BentoBox>

      <BentoBox v-if="isGarantiaEstoque(g.tipo)" title="Informações do estoque de formação" :icon="Scale">
        <StepGrid>
          <DetailField label="Número do contrato de estoque (terceiro)" :span="12">{{ display(g.numeroContratoEstoque) }}</DetailField>
          <DetailField label="Nome do imóvel" :span="3">{{ display(g.nomeImovel) }}</DetailField>
          <DetailField label="Matrícula" :span="3">{{ display(g.matricula) }}</DetailField>
          <DetailField label="Zona" :span="3">{{ display(g.zona) }}</DetailField>
          <DetailField label="Tipo" :span="3">{{ display(g.tipoImovel) }}</DetailField>
          <DetailField label="Área total afetada" :span="3">{{ display(g.areaTotal) }}</DetailField>
          <DetailField label="Unidade de medida" :span="3">{{ display(g.unidadeMedidaArea) }}</DetailField>
          <DetailField label="Cartório de registro" :span="3">{{ display(g.cartorioRegistro) }}</DetailField>
          <DetailField label="UF de registro" :span="3">{{ display(g.ufRegistro) }}</DetailField>
          <DetailField label="Cidade de registro" :span="3">{{ display(g.cidadeRegistro) }}</DetailField>
          <DetailField label="Imóvel locado" :span="3">{{ simNao(g.imovelLocado) }}</DetailField>
        </StepGrid>
      </BentoBox>

      <BentoBox v-if="isGarantiaEstoque(g.tipo)" title="Listagem de Estoque" :icon="Scale">
        <EstoqueListPanel :items="g.estoques ?? []" @update="updateEstoques" />
      </BentoBox>

      <BentoBox v-if="isGarantiaImovel(g.tipo)" title="AF. Imóvel" :icon="Scale">
        <StepGrid>
          <DetailField label="Nome do imóvel" :span="4">{{ display(g.nomeImovel) }}</DetailField>
          <DetailField label="Matrícula" :span="4">{{ display(g.matricula) }}</DetailField>
          <DetailField label="Cartório de registro" :span="4">{{ display(g.cartorioRegistro) }}</DetailField>
          <DetailField label="UF de registro" :span="4">{{ display(g.ufRegistro) }}</DetailField>
          <DetailField label="Cidade de registro" :span="4">{{ display(g.cidadeRegistro) }}</DetailField>
          <DetailField label="Área total" :span="4">{{ display(g.areaTotal) }}</DetailField>
        </StepGrid>
      </BentoBox>

      <BentoBox v-if="isGarantiaCessaoDuplicatas(g.tipo) || isGarantiaCessaoContrato(g.tipo)" title="Cessão fiduciária" :icon="Scale">
        <StepGrid>
          <DetailField label="Descrição do contrato" :span="12">{{ display(g.descricaoContrato) }}</DetailField>
          <DetailField label="Sacado" :span="6">{{ display(g.sacadoNome) }}</DetailField>
          <DetailField label="Documento do sacado" :span="6">{{ display(g.sacadoDocumento) }}</DetailField>
        </StepGrid>
      </BentoBox>

      <BentoBox title="Situação operacional" :icon="ShieldCheck">
        <StepGrid>
          <DetailField label="Registro no cartório" :span="4">
            <span class="flex items-center" style="gap: 6px">
              <Clock v-if="g.situacaoRegistroCartorio === 'pendente'" :size="14" />
              <XCircle v-else-if="g.situacaoRegistroCartorio === 'nao'" :size="14" style="color: var(--action-danger-text-only)" />
              <CheckCircle2 v-else :size="14" style="color: var(--success-base)" />
              {{
                g.situacaoRegistroCartorio === 'pendente'
                  ? 'Pendente'
                  : g.situacaoRegistroCartorio === 'ok'
                    ? 'Registrado'
                    : 'Não registrado'
              }}
            </span>
          </DetailField>
          <DetailField label="Registro em registradora" :span="4">
            <span class="flex items-center" style="gap: 6px">
              <XCircle v-if="g.situacaoRegistroRegistradora === 'nao'" :size="14" style="color: var(--action-danger-text-only)" />
              <CheckCircle2 v-else :size="14" style="color: var(--success-base)" />
              {{ g.situacaoRegistroRegistradora === 'ok' ? 'Registrado' : 'Não registrado' }}
            </span>
          </DetailField>
        </StepGrid>
      </BentoBox>
    </div>

    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div
        v-if="!g.documentos?.length"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum documento vinculado a esta garantia.
      </div>
      <template v-else>
        <div
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1fr 120px; padding: 12px 18px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Arquivo</div>
          <div>Tipo</div>
          <div>Validade</div>
        </div>
        <div
          v-for="doc in g.documentos"
          :key="doc.id"
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1fr 120px; padding: 14px 18px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ doc.nome }}</div>
          <div style="color: var(--text-default)">{{ doc.tipo }}</div>
          <div :style="{ color: isDocumentoGarantiaVigente(doc.validade) ? 'var(--text-default)' : 'var(--action-danger-text-only)' }">
            {{ doc.validade || '—' }}
          </div>
        </div>
      </template>
    </div>

    <GarantiaMinutaStep
      ref="editorRef"
      v-model:garantias="garantiasModel"
      hide-table
      hide-header
      :edit-on-row-click="false"
      :show-possui-toggle="false"
    />

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Excluir a garantia «${g.tipo}»?`"
      description="Esta ação remove a garantia deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.garantia-detail-action-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
</style>
