<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X, Trash2, Shield, Home, Scale, User, Settings2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  ToggleRow,
  AddButton,
  EmptyState,
  FieldLabel,
} from '../adicionar-contrato';
import {
  TIPO_GARANTIA_MINUTA_OPTS,
  FORMA_PRODUTO_GARANTIA_OPTS,
  ZONA_OPTS,
  TIPO_IMOVEL_OPTS,
  TIPO_LOCACAO_OPTS,
  UNIDADE_MEDIDA_OPTS,
  UNIDADE_PESO_ANIMAL_OPTS,
  CATEGORIA_ANIMAL_OPTS,
  PRODUTO_TIPO_OPTS,
  TIPO_CONTRATO_CESSAO_OPTS,
  TIPO_TITULO_CESSAO_OPTS,
  BANCO_OPTS,
  PERIODICIDADE_RELATORIO_OPTS,
  cidadesDaUf,
  emptyGarantiaMinuta,
  emptyPessoaMinuta,
  emptyEnderecoLocacaoItem,
  emptyBemMovelDraft,
  isGarantiaEstoque,
  isGarantiaAtivosBiologicos,
  isGarantiaLavoura,
  isGarantiaImovel,
  isGarantiaBensMoveis,
  isGarantiaCessaoDuplicatas,
  isGarantiaCessaoContrato,
  isGarantiaFormularioEspecifico,
  isGarantiaComFormaProduto,
  type GarantiaMinuta,
  type PessoaMinuta,
  type EstoqueItem,
  type EnderecoLocacaoItem,
  type BemMovelItem,
  type ConstitucaoGarantiaConfig,
  emptyConstituicaoGarantia,
} from '../../../data/minutaData';
import PessoaNaturezaFields from './PessoaNaturezaFields.vue';
import EnderecosLocacaoFields from './EnderecosLocacaoFields.vue';
import ConfigurarConstituicaoGarantiaModal from './ConfigurarConstituicaoGarantiaModal.vue';

const garantias = defineModel<GarantiaMinuta[]>('garantias', { default: () => [] });

const possuiGarantias = ref(true);
const showNova = ref(false);
const editingIndex = ref<number | null>(null);
const showConstituicao = ref(false);
const constituicaoIndex = ref<number | null>(null);
const form = reactive<GarantiaMinuta>(emptyGarantiaMinuta());
const estoqueDraft = reactive({ propriedade: '', proprietario: '' });
const enderecoDraft = reactive<EnderecoLocacaoItem>(emptyEnderecoLocacaoItem());
const representanteDraft = ref('');
const bemDraft = reactive(emptyBemMovelDraft());
const documentosBemLen = computed(() => bemDraft.documentos?.length ?? 0);

const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const ufOpts = computed(() => ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)));
const cidadeRegistroOpts = computed(() => cidadesDaUf(form.ufRegistro));
const cidadeSacadoOpts = computed(() => cidadesDaUf(form.sacadoEstado));
const cidadeBemRegistroOpts = computed(() => cidadesDaUf(bemDraft.ufRegistro));
const showEstoque = computed(() => isGarantiaEstoque(form.tipo));
const showAtivosBiologicos = computed(() => isGarantiaAtivosBiologicos(form.tipo));
const showLavoura = computed(() => isGarantiaLavoura(form.tipo));
const showImovel = computed(() => isGarantiaImovel(form.tipo));
const showBensMoveis = computed(() => isGarantiaBensMoveis(form.tipo));
const showCessaoDuplicatas = computed(() => isGarantiaCessaoDuplicatas(form.tipo));
const showCessaoContrato = computed(() => isGarantiaCessaoContrato(form.tipo));
const hideCamposGerais = computed(() => isGarantiaFormularioEspecifico(form.tipo));
/** Campos genéricos (testemunhas, obrigação…) só com tipo padrão selecionado */
const showCamposPadraoGarantia = computed(() => !!form.tipo && !hideCamposGerais.value);
/** Tipos específicos: cabeçalho só tipo + valor (sem descrição / instrumento) */
const hideCabecalhoExtra = computed(
  () =>
    showEstoque.value ||
    showAtivosBiologicos.value ||
    showLavoura.value ||
    showImovel.value ||
    showBensMoveis.value ||
    showCessaoDuplicatas.value ||
    showCessaoContrato.value,
);
const showFormaProduto = computed(() => isGarantiaComFormaProduto(form.tipo) && showCamposPadraoGarantia.value);
const descricaoContratoLen = computed(() => form.descricaoContrato?.length ?? 0);

function nomePessoa(p: PessoaMinuta) {
  return p.tipoPessoa === 'FISICA' ? p.nome : p.razaoSocial || p.nomeFantasia || '';
}

function hydratePessoa(raw: Partial<PessoaMinuta> | undefined, fallbackTipo: 'FISICA' | 'JURIDICA' = 'FISICA'): PessoaMinuta {
  const base = emptyPessoaMinuta(raw?.tipoPessoa ?? fallbackTipo);
  if (!raw) return base;
  return {
    ...base,
    ...JSON.parse(JSON.stringify(raw)),
    representante: {
      ...base.representante!,
      ...(raw.representante ?? {}),
    },
    conjuge: {
      ...base.conjuge!,
      ...(raw.conjuge ?? {}),
    },
  };
}

function hydrateGarantia(g: GarantiaMinuta) {
  const base = emptyGarantiaMinuta();
  const raw = g as GarantiaMinuta & {
    tipoPessoaLocado?: string;
    tipoPessoaProprietario?: string;
    proprietarioLocado?: PessoaMinuta;
    proprietarioGarantia?: PessoaMinuta;
  };
  Object.assign(form, base, JSON.parse(JSON.stringify(g)));
  form.proprietarioLocado = hydratePessoa(
    raw.proprietarioLocado,
    raw.tipoPessoaLocado === 'JURIDICA' ? 'JURIDICA' : 'FISICA',
  );
  form.proprietarioGarantia = hydratePessoa(
    raw.proprietarioGarantia,
    raw.tipoPessoaProprietario === 'JURIDICA' ? 'JURIDICA' : 'FISICA',
  );
  form.estoques = Array.isArray(g.estoques) ? JSON.parse(JSON.stringify(g.estoques)) : [];
  form.enderecosLocacao = Array.isArray(g.enderecosLocacao)
    ? JSON.parse(JSON.stringify(g.enderecosLocacao))
    : [];
  form.representantes = Array.isArray(g.representantes) ? JSON.parse(JSON.stringify(g.representantes)) : [];
  form.bensMoveis = Array.isArray(g.bensMoveis)
    ? JSON.parse(JSON.stringify(g.bensMoveis)).map((b: BemMovelItem & { documentos?: string | string[] }) => ({
        ...b,
        documentos: Array.isArray(b.documentos) ? b.documentos.join('\n') : b.documentos || '',
      }))
    : [];
  form.percentualUsado = (g.percentualUsado === 50 || g.percentualUsado === 100 ? g.percentualUsado : 0) as 0 | 50 | 100;
  form.constituicao = g.constituicao
    ? { ...emptyConstituicaoGarantia(), ...JSON.parse(JSON.stringify(g.constituicao)) }
    : emptyConstituicaoGarantia();
  // Migra endereço único legado → lista
  if (
    form.enderecosLocacao.length === 0 &&
    (g.cep || g.localidade || g.cidade || g.numero || g.bairro)
  ) {
    form.enderecosLocacao = [
      {
        cep: g.cep || '',
        localidade: g.localidade || '',
        numero: g.numero || '',
        bairro: g.bairro || '',
        infoAdicionais: g.infoAdicionais || '',
        cidade: g.cidade || '',
        estado: g.estado || '',
        pais: g.pais || 'Brasil',
      },
    ];
  }
}

function resetEnderecoDraft() {
  Object.assign(enderecoDraft, emptyEnderecoLocacaoItem());
}

function resetBemDraft() {
  Object.assign(bemDraft, emptyBemMovelDraft());
}

function addRepresentante() {
  const nome = representanteDraft.value.trim();
  if (!nome) return;
  form.representantes.push(nome);
  representanteDraft.value = '';
}

function removeRepresentante(i: number) {
  form.representantes.splice(i, 1);
}

function addBemMovel() {
  if (!bemDraft.descricao.trim()) return;
  const item: BemMovelItem = {
    ...JSON.parse(JSON.stringify(bemDraft)),
    proprietario: nomePessoa(form.proprietarioGarantia) || '—',
  };
  form.bensMoveis.push(item);
  resetBemDraft();
}

function removeBemMovel(i: number) {
  form.bensMoveis.splice(i, 1);
}

watch(
  () => form.ufRegistro,
  () => {
    if (form.cidadeRegistro && !cidadeRegistroOpts.value.includes(form.cidadeRegistro)) {
      form.cidadeRegistro = '';
    }
  },
);
watch(
  () => form.sacadoEstado,
  () => {
    if (form.sacadoCidade && !cidadeSacadoOpts.value.includes(form.sacadoCidade)) {
      form.sacadoCidade = '';
    }
  },
);
watch(
  () => bemDraft.ufRegistro,
  () => {
    if (bemDraft.cidadeRegistro && !cidadeBemRegistroOpts.value.includes(bemDraft.cidadeRegistro)) {
      bemDraft.cidadeRegistro = '';
    }
  },
);

function openNova() {
  editingIndex.value = null;
  hydrateGarantia(emptyGarantiaMinuta());
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
  representanteDraft.value = '';
  resetEnderecoDraft();
  resetBemDraft();
  showNova.value = true;
}

function openEdit(i: number) {
  editingIndex.value = i;
  hydrateGarantia(garantias.value[i]);
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
  representanteDraft.value = '';
  resetEnderecoDraft();
  resetBemDraft();
  showNova.value = true;
}

function addEstoque() {
  if (!estoqueDraft.propriedade && !form.nomeImovel) return;
  const item: EstoqueItem = {
    propriedade: estoqueDraft.propriedade || form.nomeImovel,
    proprietario:
      estoqueDraft.proprietario ||
      nomePessoa(form.proprietarioGarantia) ||
      form.nomeContratante ||
      '—',
  };
  form.estoques.push(item);
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
}

function removeEstoque(i: number) {
  form.estoques.splice(i, 1);
}

function cadastrar() {
  if (!form.tipo || !form.valor) return;
  const payload = JSON.parse(JSON.stringify(form)) as GarantiaMinuta;
  if (editingIndex.value != null) {
    const next = [...garantias.value];
    next[editingIndex.value] = payload;
    garantias.value = next;
  } else {
    garantias.value = [...garantias.value, payload];
  }
  showNova.value = false;
  editingIndex.value = null;
}

function openConstituicao(i: number) {
  constituicaoIndex.value = i;
  showConstituicao.value = true;
}

function saveConstituicao(config: ConstitucaoGarantiaConfig) {
  if (constituicaoIndex.value == null) return;
  const next = [...garantias.value];
  const g = { ...next[constituicaoIndex.value] };
  g.constituicao = config;
  g.instrumentoParticular = config.instrumentoParticular;
  g.constituirGarantia = config.constituirGarantia;
  g.numeroTestemunhas = config.possuiTestemunhas
    ? String(config.testemunhas.length || 0)
    : g.numeroTestemunhas;
  next[constituicaoIndex.value] = g;
  garantias.value = next;
  showConstituicao.value = false;
  constituicaoIndex.value = null;
}

const garantiaConstituicao = computed(() =>
  constituicaoIndex.value != null ? garantias.value[constituicaoIndex.value] ?? null : null,
);

function usoBarColor(pct: number) {
  if (pct >= 100) return 'var(--success-base, #16a34a)';
  if (pct >= 50) return 'var(--warning-base, #f59e0b)';
  return 'var(--neutral-300, #cbd5e1)';
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => garantias.value,
  { defaultPageSize: 10 },
);

function globalIndex(pageIdx: number) {
  return (page.value - 1) * pageSize.value + pageIdx;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 240px">
        <ToggleRow label="Possui garantias" :on="possuiGarantias" @toggle="possuiGarantias = !possuiGarantias" />
      </div>
      <AddButton v-if="possuiGarantias" @click="openNova">Adicionar garantia</AddButton>
    </div>

    <template v-if="possuiGarantias">
      <EmptyState
        v-if="garantias.length === 0"
        :icon="Shield"
        title="Nenhuma garantia adicionada"
        hint="Clique em Adicionar garantia para cadastrar AF. Estoque, Lavoura, Imóvel e demais tipos disponíveis."
      />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: minmax(120px, 1.1fr) minmax(96px, 0.7fr) 96px minmax(90px, 0.75fr) minmax(80px, 0.65fr) minmax(72px, 0.55fr) 40px;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            column-gap: 12px;
            align-items: center;
          "
        >
          <div>Tipo</div>
          <div>Valor</div>
          <div>Uso</div>
          <div>Instr. particular</div>
          <div>Constituir</div>
          <div>Testemunhas</div>
          <div />
        </div>
        <div
          v-for="(g, pageIdx) in pageItems"
          :key="pageIdx"
          class="grid items-center"
          style="
            grid-template-columns: minmax(120px, 1.1fr) minmax(96px, 0.7fr) 96px minmax(90px, 0.75fr) minmax(80px, 0.65fr) minmax(72px, 0.55fr) 40px;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
            column-gap: 12px;
          "
          @click="openEdit(globalIndex(pageIdx))"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); min-width: 0">{{ g.tipo }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ g.valor || '—' }}</div>
          <div class="flex items-center" style="gap: 6px">
            <div
              style="
                width: 40px;
                height: 6px;
                border-radius: 999px;
                background: var(--neutral-200);
                overflow: hidden;
                flex-shrink: 0;
              "
              :title="`${g.percentualUsado ?? 0}% usado`"
            >
              <div
                :style="{
                  width: `${g.percentualUsado ?? 0}%`,
                  height: '100%',
                  background: usoBarColor(g.percentualUsado ?? 0),
                }"
              />
            </div>
            <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ g.percentualUsado ?? 0 }}%
            </span>
          </div>
          <div>{{ g.instrumentoParticular ? 'Sim' : 'Não' }}</div>
          <div>{{ g.constituirGarantia ? 'Sim' : 'Não' }}</div>
          <div>{{ g.numeroTestemunhas || '—' }}</div>
          <button
            aria-label="Configurar constituição"
            title="Configurar constituição da garantia"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click.stop="openConstituicao(globalIndex(pageIdx))"
          >
            <Settings2 :size="15" />
          </button>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </template>

    <!-- Sub-modal Nova / Editar Garantia -->
    <div
      v-if="showNova"
      style="
        position: fixed;
        inset: 0;
        background: rgba(8, 60, 74, 0.55);
        backdrop-filter: blur(8px);
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
      "
    >
      <div
        style="
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 860px;
          height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        "
        @click.stop
      >
        <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
          <div>
            <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ editingIndex != null ? 'Editar Garantia' : 'Nova Garantia' }}
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
              Catálogo completo · constituição e vínculo com o título
            </p>
          </div>
          <button
            aria-label="Fechar"
            class="flex items-center justify-center"
            style="
              width: 36px;
              height: 36px;
              border-radius: var(--radius-lg);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click="showNova = false"
          >
            <X :size="18" />
          </button>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 20px">
            <BentoBox title="Dados da garantia" :icon="Scale">
              <div class="flex flex-col" style="gap: 14px">
                <StepGrid>
                  <SelectField
                    label="Tipo de garantia"
                    :options="TIPO_GARANTIA_MINUTA_OPTS"
                    placeholder="Selecione"
                    required
                    :span="showCamposPadraoGarantia ? 5 : 7"
                    v-model="form.tipo"
                  />
                  <FormField
                    label="Valor da garantia"
                    placeholder="R$ 0,00"
                    required
                    currency
                    :span="showCamposPadraoGarantia ? 3 : 5"
                    v-model="form.valor"
                  />
                  <FormField
                    v-if="showCamposPadraoGarantia"
                    label="Nº de testemunhas"
                    placeholder="—"
                    :span="4"
                    v-model="form.numeroTestemunhas"
                  />
                  <FormField v-if="!hideCabecalhoExtra" label="Descrição" placeholder="—" :span="12" v-model="form.descricao" />
                  <FormField
                    v-if="showCamposPadraoGarantia"
                    label="Obrigação garantida / vínculo com o título"
                    placeholder="—"
                    required
                    :span="8"
                    v-model="form.obrigacaoGarantida"
                  />
                  <SelectField
                    v-if="showFormaProduto"
                    label="Forma do produto"
                    :options="FORMA_PRODUTO_GARANTIA_OPTS"
                    placeholder="Selecione"
                    :span="4"
                    v-model="form.formaProduto"
                  />
                </StepGrid>
                <ToggleRow
                  v-if="!hideCabecalhoExtra"
                  label="É instrumento particular"
                  :on="form.instrumentoParticular"
                  @toggle="form.instrumentoParticular = !form.instrumentoParticular"
                />
                <ToggleRow
                  v-if="showCamposPadraoGarantia"
                  label="Vai constituir garantia"
                  :on="form.constituirGarantia"
                  @toggle="form.constituirGarantia = !form.constituirGarantia"
                />
              </div>
            </BentoBox>

            <BentoBox v-if="showCamposPadraoGarantia && form.constituirGarantia" title="Constituição da garantia" :icon="Scale">
              <StepGrid>
                <FormField label="Órgão / cartório de registro" placeholder="—" required :span="6" v-model="form.cartorioConstituicao" />
                <FormField label="Data prevista de constituição" placeholder="dd/mm/aaaa" required :span="6" v-model="form.dataPrevistaConstituicao" />
                <FormField label="Observações" placeholder="—" :span="12" v-model="form.observacoesConstituicao" />
              </StepGrid>
            </BentoBox>

            <template v-if="showEstoque">
              <StepGrid>
                <FormField
                  label="Número do contrato de estoque (terceiro)"
                  placeholder="—"
                  :span="12"
                  v-model="form.numeroContratoEstoque"
                />
              </StepGrid>

              <BentoBox title="Informações do estoque de formação" :icon="Home">
                <div class="flex flex-col" style="gap: 14px">
                  <StepGrid>
                    <FormField label="Nome do imóvel" placeholder="—" :span="3" v-model="form.nomeImovel" />
                    <FormField label="Matrícula" placeholder="—" :span="3" v-model="form.matricula" />
                    <SelectField label="Zona" :options="ZONA_OPTS" placeholder="Selecione" :span="3" v-model="form.zona" />
                    <SelectField label="Tipo" :options="TIPO_IMOVEL_OPTS" placeholder="Selecione" :span="3" v-model="form.tipoImovel" />
                    <FormField label="Área total afetada" placeholder="—" :span="3" v-model="form.areaTotal" />
                    <SelectField
                      label="Unidade de medida"
                      :options="UNIDADE_MEDIDA_OPTS"
                      placeholder="Selecione"
                      :span="3"
                      v-model="form.unidadeMedidaArea"
                    />
                    <FormField label="Cartório de registro" placeholder="—" :span="3" v-model="form.cartorioRegistro" />
                    <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="3" v-model="form.ufRegistro" />
                    <SelectField
                      label="Cidade de registro"
                      :options="cidadeRegistroOpts"
                      placeholder="Selecione"
                      :span="3"
                      :disabled="!form.ufRegistro"
                      v-model="form.cidadeRegistro"
                    />
                  </StepGrid>

                  <ToggleRow label="Imóvel locado" :on="form.imovelLocado" @toggle="form.imovelLocado = !form.imovelLocado" />

                  <template v-if="form.imovelLocado">
                    <BentoBox title="Informações da locação">
                      <div class="flex flex-col" style="gap: 14px">
                        <StepGrid>
                          <SelectField
                            label="Tipo de Locação"
                            :options="TIPO_LOCACAO_OPTS"
                            placeholder="Selecione"
                            required
                            :span="6"
                            v-model="form.tipoLocacao"
                          />
                          <FormField label="Data de início" placeholder="dd/mm/aaaa" required :span="6" v-model="form.dataInicio" />
                        </StepGrid>
                        <ToggleRow
                          label="Prazo indeterminado"
                          :on="form.prazoIndeterminado"
                          @toggle="form.prazoIndeterminado = !form.prazoIndeterminado"
                        />
                        <StepGrid v-if="!form.prazoIndeterminado">
                          <FormField
                            label="Data de término"
                            placeholder="dd/mm/aaaa"
                            required
                            :span="6"
                            v-model="form.dataTermino"
                          />
                        </StepGrid>
                      </div>
                    </BentoBox>

                    <BentoBox title="Proprietário do imóvel locado">
                      <PessoaNaturezaFields v-model="form.proprietarioLocado" />
                    </BentoBox>

                    <BentoBox title="Partes">
                      <StepGrid>
                        <FormField label="Nome do contratante" placeholder="—" :span="6" v-model="form.nomeContratante" />
                        <FormField label="Nome do contratado" placeholder="—" :span="6" v-model="form.nomeContratado" />
                      </StepGrid>
                    </BentoBox>
                  </template>
                </div>
              </BentoBox>

              <BentoBox title="Informações do endereço da locação" :icon="Home">
                <StepGrid>
                  <FormField label="CEP" placeholder="—" :span="4" v-model="form.cep" />
                  <FormField label="Localidade" placeholder="—" :span="8" v-model="form.localidade" />
                  <FormField label="Número" placeholder="—" :span="4" v-model="form.numero" />
                  <FormField label="Bairro" placeholder="—" :span="8" v-model="form.bairro" />
                  <FormField label="Informações adicionais" placeholder="—" :span="12" v-model="form.infoAdicionais" />
                  <FormField label="Cidade" placeholder="—" :span="12" v-model="form.cidade" />
                  <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="6" v-model="form.estado" />
                  <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="6" v-model="form.pais" />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Informações do proprietário da garantia" :icon="User">
                <PessoaNaturezaFields v-model="form.proprietarioGarantia" />
              </BentoBox>

              <div class="flex justify-end">
                <AddButton @click="addEstoque">Adicionar dados do estoque</AddButton>
              </div>

              <BentoBox title="Estoques">
                <div
                  v-if="form.estoques.length === 0"
                  style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
                >
                  Não foi encontrado nenhum resultado.
                </div>
                <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                  <div
                    class="grid"
                    style="
                      grid-template-columns: 1fr 1fr auto;
                      padding: 10px 14px;
                      background: var(--surface-sunken);
                      font-size: 10px;
                      font-weight: var(--weight-bold);
                      letter-spacing: 0.12em;
                      color: var(--text-muted);
                      text-transform: uppercase;
                    "
                  >
                    <div>Propriedade</div>
                    <div>Proprietário</div>
                    <div />
                  </div>
                  <div
                    v-for="(e, i) in form.estoques"
                    :key="i"
                    class="grid items-center"
                    style="
                      grid-template-columns: 1fr 1fr auto;
                      padding: 10px 14px;
                      border-top: 1px solid var(--border-default);
                      font-size: var(--text-sm);
                    "
                  >
                    <div>{{ e.propriedade }}</div>
                    <div>{{ e.proprietario }}</div>
                    <button
                      aria-label="Remover"
                      style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
                      @click="removeEstoque(i)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
              </BentoBox>

              <BentoBox title="Informações do relatório">
                <StepGrid>
                  <FormField label="Data do relatório" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataRelatorio" />
                  <SelectField
                    label="Periodicidade do relatório"
                    :options="PERIODICIDADE_RELATORIO_OPTS"
                    placeholder="Selecione"
                    :span="4"
                    v-model="form.periodicidadeRelatorio"
                  />
                  <FormField
                    label="Data da primeira atualização"
                    placeholder="dd/mm/aaaa"
                    required
                    :span="4"
                    v-model="form.dataPrimeiraAtualizacao"
                  />
                </StepGrid>
              </BentoBox>
            </template>

            <template v-if="showAtivosBiologicos">
              <StepGrid>
                <FormField label="Quantidade de animais" placeholder="—" :span="3" v-model="form.quantidadeAnimais" />
                <SelectField
                  label="Categoria"
                  :options="CATEGORIA_ANIMAL_OPTS"
                  placeholder="Selecione"
                  :span="3"
                  v-model="form.categoriaAnimal"
                />
                <FormField label="Peso médio" placeholder="—" :span="3" v-model="form.pesoMedio" />
                <SelectField
                  label="Unidade de medida"
                  :options="UNIDADE_PESO_ANIMAL_OPTS"
                  placeholder="Selecione"
                  :span="3"
                  v-model="form.unidadeMedidaPeso"
                />
              </StepGrid>

              <BentoBox title="Informações do local de formação" :icon="Home">
                <div class="flex flex-col" style="gap: 14px">
                  <StepGrid>
                    <FormField label="Nome do imóvel" placeholder="—" :span="6" v-model="form.nomeImovel" />
                    <FormField label="Matrícula" placeholder="—" :span="6" v-model="form.matricula" />
                    <SelectField label="Zona" :options="ZONA_OPTS" placeholder="Selecione" :span="3" v-model="form.zona" />
                    <SelectField label="Tipo" :options="TIPO_IMOVEL_OPTS" placeholder="Selecione" :span="3" v-model="form.tipoImovel" />
                    <FormField label="Área total afetada" placeholder="—" :span="3" v-model="form.areaTotal" />
                    <SelectField
                      label="Unidade de medida"
                      :options="UNIDADE_MEDIDA_OPTS"
                      placeholder="Selecione"
                      :span="3"
                      v-model="form.unidadeMedidaArea"
                    />
                    <FormField label="Cartório de registro" placeholder="—" :span="4" v-model="form.cartorioRegistro" />
                    <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
                    <SelectField
                      label="Cidade de registro"
                      :options="cidadeRegistroOpts"
                      placeholder="Selecione"
                      :span="4"
                      :disabled="!form.ufRegistro"
                      v-model="form.cidadeRegistro"
                    />
                  </StepGrid>

                  <ToggleRow
                    label="Imóvel arrendado"
                    :on="form.imovelLocado"
                    @toggle="form.imovelLocado = !form.imovelLocado"
                  />

                  <template v-if="form.imovelLocado">
                    <BentoBox title="Informações da locação">
                      <div class="flex flex-col" style="gap: 14px">
                        <StepGrid>
                          <SelectField
                            label="Tipo de Locação"
                            :options="TIPO_LOCACAO_OPTS"
                            placeholder="Selecione"
                            required
                            :span="6"
                            v-model="form.tipoLocacao"
                          />
                          <FormField label="Data de início" placeholder="dd/mm/aaaa" required :span="6" v-model="form.dataInicio" />
                        </StepGrid>
                        <ToggleRow
                          label="Prazo indeterminado"
                          :on="form.prazoIndeterminado"
                          @toggle="form.prazoIndeterminado = !form.prazoIndeterminado"
                        />
                        <StepGrid v-if="!form.prazoIndeterminado">
                          <FormField
                            label="Data de término"
                            placeholder="dd/mm/aaaa"
                            required
                            :span="6"
                            v-model="form.dataTermino"
                          />
                        </StepGrid>
                      </div>
                    </BentoBox>

                    <BentoBox title="Proprietário do imóvel arrendado">
                      <PessoaNaturezaFields v-model="form.proprietarioLocado" />
                    </BentoBox>

                    <BentoBox title="Partes">
                      <StepGrid>
                        <FormField label="Nome do contratante" placeholder="—" :span="6" v-model="form.nomeContratante" />
                        <FormField label="Nome do contratado" placeholder="—" :span="6" v-model="form.nomeContratado" />
                      </StepGrid>
                    </BentoBox>
                  </template>
                </div>
              </BentoBox>

              <BentoBox title="Endereços da locação" :icon="Home">
                <EnderecosLocacaoFields v-model:lista="form.enderecosLocacao" v-model:draft="enderecoDraft" />
              </BentoBox>

              <BentoBox title="Informações do proprietário da garantia">
                <PessoaNaturezaFields v-model="form.proprietarioGarantia" />
              </BentoBox>
            </template>

            <template v-if="showLavoura">
              <StepGrid>
                <FormField label="Tamanho de área" placeholder="—" :span="4" v-model="form.tamanhoArea" />
                <SelectField
                  label="Unidade de medida"
                  :options="UNIDADE_MEDIDA_OPTS"
                  placeholder="Selecione"
                  :span="4"
                  v-model="form.unidadeMedidaTamanhoArea"
                />
                <FormField label="Ano da safra" placeholder="—" :span="4" v-model="form.anoSafra" />
              </StepGrid>

              <BentoBox title="Informações do produto" :icon="Scale">
                <StepGrid>
                  <SelectField
                    label="Produto"
                    :options="PRODUTO_TIPO_OPTS"
                    placeholder="Selecione"
                    :span="3"
                    v-model="form.produto"
                  />
                  <FormField label="Quantidade" placeholder="—" :span="3" v-model="form.quantidadeProduto" />
                  <SelectField
                    label="Unidade de medida"
                    :options="UNIDADE_MEDIDA_OPTS"
                    placeholder="Selecione"
                    :span="3"
                    v-model="form.unidadeMedidaProduto"
                  />
                  <FormField
                    label="Preço unitário"
                    placeholder="R$ 0,00"
                    currency
                    :span="3"
                    v-model="form.precoUnitario"
                  />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Informações do local de formação" :icon="Home">
                <div class="flex flex-col" style="gap: 14px">
                  <StepGrid>
                    <FormField label="Nome da fazenda" placeholder="—" :span="6" v-model="form.nomeImovel" />
                    <FormField label="Matrícula" placeholder="—" :span="6" v-model="form.matricula" />
                    <SelectField label="Zona" :options="ZONA_OPTS" placeholder="Selecione" :span="3" v-model="form.zona" />
                    <SelectField label="Tipo" :options="TIPO_IMOVEL_OPTS" placeholder="Selecione" :span="3" v-model="form.tipoImovel" />
                    <FormField label="Área total afetada" placeholder="—" :span="3" v-model="form.areaTotal" />
                    <SelectField
                      label="Unidade de medida"
                      :options="UNIDADE_MEDIDA_OPTS"
                      placeholder="Selecione"
                      :span="3"
                      v-model="form.unidadeMedidaArea"
                    />
                    <FormField label="Cartório de registro" placeholder="—" :span="4" v-model="form.cartorioRegistro" />
                    <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
                    <SelectField
                      label="Cidade de registro"
                      :options="cidadeRegistroOpts"
                      placeholder="Selecione"
                      :span="4"
                      :disabled="!form.ufRegistro"
                      v-model="form.cidadeRegistro"
                    />
                  </StepGrid>

                  <ToggleRow
                    label="Imóvel arrendado"
                    :on="form.imovelLocado"
                    @toggle="form.imovelLocado = !form.imovelLocado"
                  />

                  <template v-if="form.imovelLocado">
                    <BentoBox title="Informações da locação">
                      <div class="flex flex-col" style="gap: 14px">
                        <StepGrid>
                          <SelectField
                            label="Tipo de Locação"
                            :options="TIPO_LOCACAO_OPTS"
                            placeholder="Selecione"
                            required
                            :span="6"
                            v-model="form.tipoLocacao"
                          />
                          <FormField label="Data de início" placeholder="dd/mm/aaaa" required :span="6" v-model="form.dataInicio" />
                        </StepGrid>
                        <ToggleRow
                          label="Prazo indeterminado"
                          :on="form.prazoIndeterminado"
                          @toggle="form.prazoIndeterminado = !form.prazoIndeterminado"
                        />
                        <StepGrid v-if="!form.prazoIndeterminado">
                          <FormField
                            label="Data de término"
                            placeholder="dd/mm/aaaa"
                            required
                            :span="6"
                            v-model="form.dataTermino"
                          />
                        </StepGrid>
                      </div>
                    </BentoBox>

                    <BentoBox title="Proprietário do imóvel arrendado">
                      <PessoaNaturezaFields v-model="form.proprietarioLocado" />
                    </BentoBox>

                    <BentoBox title="Partes">
                      <StepGrid>
                        <FormField label="Nome do contratante" placeholder="—" :span="6" v-model="form.nomeContratante" />
                        <FormField label="Nome do contratado" placeholder="—" :span="6" v-model="form.nomeContratado" />
                      </StepGrid>
                    </BentoBox>
                  </template>
                </div>
              </BentoBox>

              <BentoBox title="Endereços da locação" :icon="Home">
                <EnderecosLocacaoFields v-model:lista="form.enderecosLocacao" v-model:draft="enderecoDraft" />
              </BentoBox>

              <BentoBox title="Informações do proprietário da garantia">
                <PessoaNaturezaFields v-model="form.proprietarioGarantia" />
              </BentoBox>
            </template>

            <template v-if="showImovel">
              <BentoBox title="Informações do imóvel" :icon="Home">
                <div class="flex flex-col" style="gap: 14px">
                  <StepGrid>
                    <FormField label="Nome do imóvel" placeholder="—" :span="6" v-model="form.nomeImovel" />
                    <FormField label="Matrícula" placeholder="—" :span="6" v-model="form.matricula" />
                    <SelectField label="Zona" :options="ZONA_OPTS" placeholder="Selecione" :span="3" v-model="form.zona" />
                    <SelectField label="Tipo" :options="TIPO_IMOVEL_OPTS" placeholder="Selecione" :span="3" v-model="form.tipoImovel" />
                    <FormField label="Área total afetada" placeholder="—" :span="3" v-model="form.areaTotal" />
                    <SelectField
                      label="Unidade de medida"
                      :options="UNIDADE_MEDIDA_OPTS"
                      placeholder="Selecione"
                      :span="3"
                      v-model="form.unidadeMedidaArea"
                    />
                    <FormField label="Cartório de registro" placeholder="—" :span="4" v-model="form.cartorioRegistro" />
                    <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
                    <SelectField
                      label="Cidade de registro"
                      :options="cidadeRegistroOpts"
                      placeholder="Selecione"
                      :span="4"
                      :disabled="!form.ufRegistro"
                      v-model="form.cidadeRegistro"
                    />
                    <FormField label="CAR (Cadastro Ambiental Rural)" placeholder="—" :span="4" v-model="form.car" />
                    <FormField label="NIRF (Número do Imóvel na Receita Federal)" placeholder="—" :span="4" v-model="form.nirf" />
                    <FormField label="CCIR (Certificado de Cadastro de Imóvel Rural)" placeholder="—" :span="4" v-model="form.ccir" />
                    <FormField label="CCIR Ano" placeholder="—" :span="3" v-model="form.ccirAno" />
                    <FormField label="SIGEF/INCRA" placeholder="—" :span="5" v-model="form.sigefIncra" />
                  </StepGrid>

                  <ToggleRow
                    label="Possui seguro"
                    :on="form.possuiSeguro"
                    @toggle="form.possuiSeguro = !form.possuiSeguro"
                  />

                  <ToggleRow
                    label="Imóvel arrendado"
                    :on="form.imovelLocado"
                    @toggle="form.imovelLocado = !form.imovelLocado"
                  />

                  <template v-if="form.imovelLocado">
                    <BentoBox title="Informações da locação">
                      <div class="flex flex-col" style="gap: 14px">
                        <StepGrid>
                          <SelectField
                            label="Tipo de Locação"
                            :options="TIPO_LOCACAO_OPTS"
                            placeholder="Selecione"
                            required
                            :span="6"
                            v-model="form.tipoLocacao"
                          />
                          <FormField label="Data de início" placeholder="dd/mm/aaaa" required :span="6" v-model="form.dataInicio" />
                        </StepGrid>
                        <ToggleRow
                          label="Prazo indeterminado"
                          :on="form.prazoIndeterminado"
                          @toggle="form.prazoIndeterminado = !form.prazoIndeterminado"
                        />
                        <StepGrid v-if="!form.prazoIndeterminado">
                          <FormField
                            label="Data de término"
                            placeholder="dd/mm/aaaa"
                            required
                            :span="6"
                            v-model="form.dataTermino"
                          />
                        </StepGrid>
                      </div>
                    </BentoBox>

                    <BentoBox title="Proprietário do imóvel arrendado">
                      <PessoaNaturezaFields v-model="form.proprietarioLocado" />
                    </BentoBox>

                    <BentoBox title="Partes">
                      <StepGrid>
                        <FormField label="Nome do contratante" placeholder="—" :span="6" v-model="form.nomeContratante" />
                        <FormField label="Nome do contratado" placeholder="—" :span="6" v-model="form.nomeContratado" />
                      </StepGrid>
                    </BentoBox>
                  </template>
                </div>
              </BentoBox>

              <BentoBox title="Endereços da locação" :icon="Home">
                <EnderecosLocacaoFields v-model:lista="form.enderecosLocacao" v-model:draft="enderecoDraft" />
              </BentoBox>

              <BentoBox title="Informações do proprietário da garantia">
                <PessoaNaturezaFields v-model="form.proprietarioGarantia" />
              </BentoBox>
            </template>

            <template v-if="showBensMoveis">
              <BentoBox title="Dados do bem" :icon="Scale">
                <StepGrid>
                  <FormField label="Descrição" placeholder="—" :span="6" v-model="bemDraft.descricao" />
                  <FormField label="Preço unitário" placeholder="R$ 0,00" :span="3" v-model="bemDraft.precoUnitario" />
                  <FormField label="Quantidade" placeholder="—" :span="3" v-model="bemDraft.quantidade" />
                  <FormField label="Marca" placeholder="—" :span="3" v-model="bemDraft.marca" />
                  <FormField label="Modelo" placeholder="—" :span="3" v-model="bemDraft.modelo" />
                  <FormField label="Ano de fabricação" placeholder="—" :span="3" v-model="bemDraft.anoFabricacao" />
                  <FormField label="Número de série" placeholder="—" :span="3" v-model="bemDraft.numeroSerie" />
                  <FormField label="Matrícula" placeholder="—" :span="3" v-model="bemDraft.matricula" />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Local de armazenamento" :icon="Home">
                <StepGrid>
                  <FormField label="CEP" placeholder="—" :span="4" v-model="bemDraft.cep" />
                  <FormField label="Localidade" placeholder="—" :span="8" v-model="bemDraft.localidade" />
                  <FormField label="Número" placeholder="—" :span="4" v-model="bemDraft.numero" />
                  <FormField label="Bairro" placeholder="—" :span="8" v-model="bemDraft.bairro" />
                  <FormField label="Informações adicionais" placeholder="—" :span="12" v-model="bemDraft.infoAdicionais" />
                  <FormField label="Cidade" placeholder="—" :span="12" v-model="bemDraft.cidade" />
                  <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="6" v-model="bemDraft.estado" />
                  <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="6" v-model="bemDraft.pais" />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Dados de registro" :icon="Scale">
                <StepGrid>
                  <FormField label="Cartório de registro" placeholder="—" :span="4" v-model="bemDraft.cartorioRegistro" />
                  <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="bemDraft.ufRegistro" />
                  <SelectField
                    label="Cidade de registro"
                    :options="cidadeBemRegistroOpts"
                    placeholder="Selecione"
                    :span="4"
                    :disabled="!bemDraft.ufRegistro"
                    v-model="bemDraft.cidadeRegistro"
                  />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Informações do proprietário da garantia" :icon="User">
                <PessoaNaturezaFields v-model="form.proprietarioGarantia" />
              </BentoBox>

              <BentoBox title="Documentos" :icon="Shield">
                <div>
                  <FieldLabel>Documentos</FieldLabel>
                  <div style="position: relative">
                    <textarea
                      v-model="bemDraft.documentos"
                      placeholder="Descreva o documento…"
                      rows="3"
                      :style="{
                        width: '100%',
                        padding: '12px 14px',
                        paddingBottom: '28px',
                        background: 'var(--surface-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        outline: 'none',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-strong)',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }"
                    />
                    <span
                      style="
                        position: absolute;
                        right: 12px;
                        bottom: 12px;
                        font-size: 11px;
                        color: var(--text-muted);
                      "
                    >{{ documentosBemLen }}</span>
                  </div>
                </div>
              </BentoBox>

              <div class="flex justify-end">
                <AddButton @click="addBemMovel">Adicionar bem</AddButton>
              </div>

              <BentoBox title="Bens adicionados" :icon="Scale">
                <div
                  v-if="form.bensMoveis.length === 0"
                  style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
                >
                  Não foi encontrado nenhum resultado.
                </div>
                <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                  <div
                    class="grid"
                    style="
                      grid-template-columns: 1.4fr 1fr 0.6fr 1fr auto;
                      padding: 10px 14px;
                      background: var(--surface-sunken);
                      font-size: 10px;
                      font-weight: var(--weight-bold);
                      letter-spacing: 0.12em;
                      color: var(--text-muted);
                      text-transform: uppercase;
                    "
                  >
                    <div>Descrição</div>
                    <div>Marca / Modelo</div>
                    <div>Ano</div>
                    <div>Proprietário</div>
                    <div />
                  </div>
                  <div
                    v-for="(b, i) in form.bensMoveis"
                    :key="i"
                    class="grid items-center"
                    style="
                      grid-template-columns: 1.4fr 1fr 0.6fr 1fr auto;
                      padding: 10px 14px;
                      border-top: 1px solid var(--border-default);
                      font-size: var(--text-sm);
                    "
                  >
                    <div>{{ b.descricao || '—' }}</div>
                    <div>{{ [b.marca, b.modelo].filter(Boolean).join(' / ') || '—' }}</div>
                    <div>{{ b.anoFabricacao || '—' }}</div>
                    <div>{{ b.proprietario || '—' }}</div>
                    <button
                      aria-label="Remover"
                      style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
                      @click="removeBemMovel(i)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
              </BentoBox>
            </template>

            <template v-if="showCessaoDuplicatas">
              <StepGrid>
                <SelectField
                  label="Tipo de contrato"
                  :options="TIPO_CONTRATO_CESSAO_OPTS"
                  placeholder="Selecione"
                  required
                  :span="4"
                  v-model="form.tipoContrato"
                />
                <FormField
                  label="Data de emissão"
                  placeholder="dd/mm/aaaa"
                  required
                  :span="4"
                  v-model="form.dataEmissaoContrato"
                />
                <FormField
                  label="Data de vencimento"
                  placeholder="dd/mm/aaaa"
                  required
                  :span="4"
                  v-model="form.dataVencimentoContrato"
                />
              </StepGrid>

              <div>
                <FieldLabel>Descrição do contrato</FieldLabel>
                <div style="position: relative">
                  <textarea
                    v-model="form.descricaoContrato"
                    placeholder="—"
                    rows="4"
                    :style="{
                      width: '100%',
                      padding: '12px 14px',
                      paddingBottom: '28px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-lg)',
                      outline: 'none',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-strong)',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }"
                  />
                  <span
                    style="
                      position: absolute;
                      right: 12px;
                      bottom: 12px;
                      font-size: 11px;
                      color: var(--text-muted);
                    "
                  >{{ descricaoContratoLen }}</span>
                </div>
              </div>

              <BentoBox title="Cedente" :icon="User">
                <StepGrid>
                  <FormField label="CPF/CNPJ" placeholder="—" required :span="6" v-model="form.cedenteDocumento" />
                  <FormField label="Nome/Razão social" placeholder="—" required :span="6" v-model="form.cedenteNome" />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Sacado" :icon="User">
                <StepGrid>
                  <FormField label="CPF/CNPJ" placeholder="—" required :span="6" v-model="form.sacadoDocumento" />
                  <FormField label="Nome/Razão social" placeholder="—" required :span="6" v-model="form.sacadoNome" />
                </StepGrid>
              </BentoBox>

              <ToggleRow
                label="Cadastrar campos opcionais"
                :on="form.cadastrarCamposOpcionais"
                @toggle="form.cadastrarCamposOpcionais = !form.cadastrarCamposOpcionais"
              />

              <template v-if="form.cadastrarCamposOpcionais">
                <BentoBox title="Informações adicionais">
                  <StepGrid>
                    <FormField
                      label="Porcentagem equivalente sobre a CPRF %"
                      placeholder="—"
                      :span="6"
                      v-model="form.pctEquivalenteCprf"
                    />
                  </StepGrid>
                </BentoBox>

                <BentoBox title="Informações bancárias">
                  <StepGrid>
                    <SelectField
                      label="Banco"
                      :options="BANCO_OPTS"
                      placeholder="Selecione"
                      :span="6"
                      v-model="form.bancoEscrow"
                    />
                    <FormField label="Conta Escrow" placeholder="—" :span="3" v-model="form.contaEscrow" />
                    <FormField label="Agência Escrow" placeholder="—" :span="3" v-model="form.agenciaEscrow" />
                    <FormField label="Titular" placeholder="—" :span="12" v-model="form.titularEscrow" />
                  </StepGrid>
                </BentoBox>
              </template>
            </template>

            <template v-if="showCessaoContrato">
              <StepGrid>
                <SelectField
                  label="Tipo de título"
                  :options="TIPO_TITULO_CESSAO_OPTS"
                  placeholder="Selecione"
                  required
                  :span="3"
                  v-model="form.tipoTitulo"
                />
                <SelectField
                  label="Tipo de contrato"
                  :options="TIPO_CONTRATO_CESSAO_OPTS"
                  placeholder="Selecione"
                  required
                  :span="3"
                  v-model="form.tipoContrato"
                />
                <FormField
                  label="Data de emissão"
                  placeholder="dd/mm/aaaa"
                  required
                  :span="3"
                  v-model="form.dataEmissaoContrato"
                />
                <FormField
                  label="Data de vencimento"
                  placeholder="dd/mm/aaaa"
                  required
                  :span="3"
                  v-model="form.dataVencimentoContrato"
                />
              </StepGrid>

              <div>
                <FieldLabel>Descrição do contrato</FieldLabel>
                <div style="position: relative">
                  <textarea
                    v-model="form.descricaoContrato"
                    placeholder="—"
                    rows="4"
                    :style="{
                      width: '100%',
                      padding: '12px 14px',
                      paddingBottom: '28px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-lg)',
                      outline: 'none',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-strong)',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }"
                  />
                  <span
                    style="
                      position: absolute;
                      right: 12px;
                      bottom: 12px;
                      font-size: 11px;
                      color: var(--text-muted);
                    "
                  >{{ descricaoContratoLen }}</span>
                </div>
              </div>

              <BentoBox title="Cedente" :icon="User">
                <StepGrid>
                  <FormField label="CPF/CNPJ" placeholder="—" required :span="6" v-model="form.cedenteDocumento" />
                  <FormField label="Nome/Razão social" placeholder="—" required :span="6" v-model="form.cedenteNome" />
                </StepGrid>
              </BentoBox>

              <BentoBox title="Sacado" :icon="User">
                <StepGrid>
                  <FormField label="CPF/CNPJ" placeholder="—" required :span="6" v-model="form.sacadoDocumento" />
                  <FormField label="Nome/Razão social" placeholder="—" required :span="6" v-model="form.sacadoNome" />
                  <FormField label="CEP" placeholder="—" :span="3" v-model="form.sacadoCep" />
                  <FormField label="Localidade" placeholder="—" :span="6" v-model="form.sacadoLocalidade" />
                  <FormField label="Número" placeholder="—" :span="3" v-model="form.sacadoNumero" />
                  <FormField label="Bairro" placeholder="—" :span="4" v-model="form.sacadoBairro" />
                  <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.sacadoInfoAdicionais" />
                  <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.sacadoEstado" />
                  <SelectField
                    label="Cidade"
                    :options="cidadeSacadoOpts"
                    placeholder="Selecione"
                    :span="5"
                    :disabled="!form.sacadoEstado"
                    v-model="form.sacadoCidade"
                  />
                  <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.sacadoPais" />
                </StepGrid>
              </BentoBox>

              <ToggleRow
                label="Cadastrar campos opcionais"
                :on="form.cadastrarCamposOpcionais"
                @toggle="form.cadastrarCamposOpcionais = !form.cadastrarCamposOpcionais"
              />

              <template v-if="form.cadastrarCamposOpcionais">
                <BentoBox title="Informações adicionais">
                  <StepGrid>
                    <FormField label="Data da assinatura" placeholder="dd/mm/aaaa" :span="4" v-model="form.dataAssinatura" />
                  </StepGrid>
                </BentoBox>

                <BentoBox title="Representantes" :icon="User">
                  <div class="flex flex-col" style="gap: 14px">
                    <div class="flex items-end" style="gap: 12px">
                      <div style="flex: 1">
                        <FormField label="Nome" placeholder="—" :span="12" v-model="representanteDraft" />
                      </div>
                      <AddButton @click="addRepresentante">Cadastrar representante</AddButton>
                    </div>
                    <div
                      v-if="form.representantes.length === 0"
                      style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
                    >
                      Nenhum representante adicionado.
                    </div>
                    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                      <div
                        class="grid"
                        style="
                          grid-template-columns: 1fr auto;
                          padding: 10px 14px;
                          background: var(--surface-sunken);
                          font-size: 10px;
                          font-weight: var(--weight-bold);
                          letter-spacing: 0.12em;
                          color: var(--text-muted);
                          text-transform: uppercase;
                        "
                      >
                        <div>Representante</div>
                        <div />
                      </div>
                      <div
                        v-for="(nome, i) in form.representantes"
                        :key="i"
                        class="grid items-center"
                        style="
                          grid-template-columns: 1fr auto;
                          padding: 10px 14px;
                          border-top: 1px solid var(--border-default);
                          font-size: var(--text-sm);
                        "
                      >
                        <div>{{ nome }}</div>
                        <button
                          aria-label="Remover"
                          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
                          @click="removeRepresentante(i)"
                        >
                          <Trash2 :size="14" />
                        </button>
                      </div>
                    </div>
                  </div>
                </BentoBox>

                <BentoBox title="Informações bancárias">
                  <StepGrid>
                    <SelectField
                      label="Banco"
                      :options="BANCO_OPTS"
                      placeholder="Selecione"
                      :span="3"
                      v-model="form.bancoEscrow"
                    />
                    <FormField label="Conta Escrow" placeholder="—" :span="3" v-model="form.contaEscrow" />
                    <FormField label="Agência Escrow" placeholder="—" :span="3" v-model="form.agenciaEscrow" />
                    <FormField label="Titular" placeholder="—" :span="3" v-model="form.titularEscrow" />
                  </StepGrid>
                </BentoBox>
              </template>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default)">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="showNova = false"
          >
            Cancelar
          </button>
          <button
            class="flex items-center"
            :style="{
              height: '44px',
              padding: '0 24px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: form.tipo && form.valor ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: form.tipo && form.valor ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: form.tipo && form.valor ? '#fff' : 'var(--text-disabled)',
            }"
            :disabled="!form.tipo || !form.valor"
            @click="cadastrar"
          >
            {{ editingIndex != null ? 'SALVAR' : 'CADASTRAR' }}
          </button>
        </div>
      </div>
    </div>

    <ConfigurarConstituicaoGarantiaModal
      :open="showConstituicao"
      :garantia="garantiaConstituicao"
      @close="showConstituicao = false; constituicaoIndex = null"
      @save="saveConstituicao"
    />
  </div>
</template>
