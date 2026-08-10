<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { X, Trash2, User, Mail, MapPin } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  ToggleRow,
  AddButton,
} from '../adicionar-contrato';
import {
  ESTADO_CIVIL_GARANTIA_OPTS,
  NACIONALIDADE_OPTS,
  FIDUCIARIA_PADRAO_OPTS,
  CESSAO_VINCULADA_OPTS,
  MOCK_CLIENTES_MINUTA,
  cessaoVinculadaPorLabel,
  emptyConstituicaoGarantia,
  emptyTestemunhaConstituicao,
  emptyPessoaMinuta,
  type ConstitucaoGarantiaConfig,
  type GarantiaMinuta,
} from '../../../data/minutaData';

const props = defineProps<{
  open: boolean;
  garantia: GarantiaMinuta | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [config: ConstitucaoGarantiaConfig];
}>();

const form = reactive<ConstituicaoGarantiaConfig>(emptyConstituicaoGarantia());

const DDI_LABELS = PAISES_DDI.map((p) => `${p.pais} (${p.ddi})`);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);

const cedenteOpts = computed(() =>
  MOCK_CLIENTES_MINUTA.map((c) => `${c.documento} - ${c.nome || c.razaoSocial || ''}`),
);

const contatoOpts = computed(() => {
  if (!form.cedenteDoc) return [] as string[];
  return ['E-mail principal', 'E-mail financeiro', 'Telefone comercial'];
});

const enderecoOpts = computed(() => {
  if (!form.cedenteDoc) return [] as string[];
  return ['Endereço principal', 'Endereço de cobrança'];
});

const representanteGrupoOpts = computed(() =>
  MOCK_CLIENTES_MINUTA.filter((c) => c.tipoPessoa === 'FISICA').map(
    (c) => `${c.documento} - ${c.nome}`,
  ),
);

const cessaoResumo = computed(() =>
  form.cessaoVinculada ? cessaoVinculadaPorLabel(form.cessaoVinculada) : undefined,
);

const ddiModel = computed({
  get: () => {
    const ddi = form.fiduciaria.ddi || '+55';
    const hit = PAISES_DDI.find((p) => p.ddi === ddi);
    return hit ? `${hit.pais} (${hit.ddi})` : `Brasil (${ddi})`;
  },
  set: (v: string) => {
    const m = v.match(/\(([^)]+)\)/);
    form.fiduciaria.ddi = m?.[1] || '+55';
  },
});

watch(
  () => [props.open, props.garantia] as const,
  ([open, g]) => {
    if (!open || !g) return;
    const base = emptyConstituicaoGarantia();
    const raw = g.constituicao ? JSON.parse(JSON.stringify(g.constituicao)) : {};
    Object.assign(form, base, raw, {
      instrumentoParticular: g.constituicao?.instrumentoParticular ?? g.instrumentoParticular ?? false,
      constituirGarantia: g.constituicao?.constituirGarantia ?? g.constituirGarantia ?? false,
      fiduciaria: {
        ...emptyPessoaMinuta('JURIDICA'),
        ...(raw.fiduciaria ?? {}),
        representante: {
          ...emptyPessoaMinuta('JURIDICA').representante!,
          ...(raw.fiduciaria?.representante ?? {}),
        },
      },
      testemunhas: Array.isArray(raw.testemunhas) ? raw.testemunhas : [],
      obrigacao: { ...base.obrigacao, ...(raw.obrigacao ?? {}) },
    });
  },
  { immediate: true },
);

function addTestemunha() {
  form.testemunhas.push(emptyTestemunhaConstituicao());
}

function removeTestemunha(i: number) {
  form.testemunhas.splice(i, 1);
}

function salvar() {
  emit('save', JSON.parse(JSON.stringify(form)) as ConstitucaoGarantiaConfig);
}
</script>

<template>
  <div
    v-if="open"
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 560;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
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
            Configurar constituição da garantia
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Instrumento particular, constituição, cessão vinculada e testemunhas
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
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div class="flex flex-col" style="gap: 20px">
          <ToggleRow
            :label="`Instrumento Particular: ${form.instrumentoParticular ? 'Sim' : 'Não'}`"
            :on="form.instrumentoParticular"
            @toggle="form.instrumentoParticular = !form.instrumentoParticular"
          />
          <ToggleRow
            :label="`Constituir garantia: ${form.constituirGarantia ? 'Sim' : 'Não'}`"
            :on="form.constituirGarantia"
            @toggle="form.constituirGarantia = !form.constituirGarantia"
          />

          <!-- Instrumento particular OFF → Cessão vinculada -->
          <template v-if="!form.instrumentoParticular">
            <BentoBox title="Cessão vinculada">
              <div class="flex flex-col" style="gap: 14px">
                <StepGrid>
                  <SelectField
                    label="Cessão"
                    :options="CESSAO_VINCULADA_OPTS"
                    placeholder="Selecione"
                    :span="12"
                    v-model="form.cessaoVinculada"
                  />
                </StepGrid>
                <div
                  v-if="cessaoResumo"
                  class="grid"
                  style="
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 16px;
                    padding: 14px 16px;
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg);
                    background: var(--surface-sunken);
                  "
                >
                  <div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px">Total valor de compra</div>
                    <div
                      style="
                        font-size: var(--text-sm);
                        font-weight: var(--weight-bold);
                        color: var(--text-strong);
                        font-variant-numeric: tabular-nums;
                      "
                    >
                      {{ cessaoResumo.totalValorCompra }}
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px">Total valor nominal</div>
                    <div
                      style="
                        font-size: var(--text-sm);
                        font-weight: var(--weight-bold);
                        color: var(--text-strong);
                        font-variant-numeric: tabular-nums;
                      "
                    >
                      {{ cessaoResumo.totalValorNominal }}
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px">Quantidade</div>
                    <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                      {{ cessaoResumo.quantidadeTitulos }} título(s)
                    </div>
                  </div>
                </div>
              </div>
            </BentoBox>
          </template>

          <!-- Instrumento particular ON → Dados do cedente -->
          <template v-else>
            <BentoBox title="Dados do cedente" :icon="User">
              <StepGrid>
                <SelectField
                  label="Cedente"
                  :options="cedenteOpts"
                  placeholder="Selecione"
                  :span="6"
                  v-model="form.cedenteDoc"
                />
                <SelectField
                  label="Representante legal do grupo"
                  :options="representanteGrupoOpts"
                  placeholder="Selecione"
                  :span="6"
                  v-model="form.representanteLegalGrupo"
                />
                <SelectField
                  v-if="form.cedenteDoc"
                  label="Contato do cedente"
                  :options="contatoOpts"
                  placeholder="Selecione"
                  :span="6"
                  v-model="form.contatoCedente"
                />
                <SelectField
                  v-if="form.cedenteDoc"
                  label="Endereço do cedente"
                  :options="enderecoOpts"
                  placeholder="Selecione"
                  :span="6"
                  v-model="form.enderecoCedente"
                />
              </StepGrid>
            </BentoBox>
          </template>

          <!-- Constituir garantia ON → Fiduciária + obrigação -->
          <template v-if="form.constituirGarantia">
            <BentoBox title="Fiduciária">
              <StepGrid>
                <SelectField
                  label="Selecione a fiduciária padrão"
                  :options="FIDUCIARIA_PADRAO_OPTS"
                  placeholder="Selecione"
                  :span="12"
                  v-model="form.fiduciariaPadrao"
                />
                <FormField label="CNPJ" placeholder="—" :span="4" v-model="form.fiduciaria.cnpj!" />
                <FormField label="Razão social" placeholder="—" :span="5" v-model="form.fiduciaria.razaoSocial!" />
                <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.fiduciaria.nomeFantasia!" />
                <FormField label="Data de abertura" placeholder="dd/mm/aaaa" :span="4" v-model="form.fiduciaria.dataAbertura!" />
                <FormField label="Tipo" placeholder="—" :span="4" v-model="form.fiduciaria.tipoEmpresa!" />
                <FormField label="Porte" placeholder="—" :span="4" v-model="form.fiduciaria.porte!" />
                <FormField label="Atividade principal" placeholder="—" :span="4" v-model="form.fiduciaria.atividadePrincipal!" />
                <FormField label="Natureza jurídica" placeholder="—" :span="4" v-model="form.fiduciaria.naturezaJuridica!" />
                <FormField label="Inscrição municipal" placeholder="—" :span="4" v-model="form.fiduciaria.inscricaoMunicipal!" />
                <FormField label="Inscrição estadual" placeholder="—" :span="4" v-model="form.fiduciaria.inscricaoEstadual!" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Representante Legal" :icon="User">
              <StepGrid>
                <FormField label="CPF" placeholder="—" :span="3" v-model="form.fiduciaria.representante!.cpf" />
                <FormField label="Nome" placeholder="—" :span="5" v-model="form.fiduciaria.representante!.nome" />
                <SelectField
                  label="Nacionalidade"
                  :options="NACIONALIDADE_OPTS"
                  placeholder="Selecione"
                  :span="4"
                  v-model="form.fiduciaria.representante!.nacionalidade"
                />
                <FormField label="Profissão" placeholder="—" :span="4" v-model="form.fiduciaria.representante!.profissao" />
                <SelectField
                  label="Estado Civil"
                  :options="ESTADO_CIVIL_GARANTIA_OPTS"
                  placeholder="Selecione"
                  :span="4"
                  v-model="form.fiduciaria.representante!.estadoCivil"
                />
                <FormField label="E-mail" placeholder="—" :span="4" v-model="form.fiduciaria.representante!.email" />
                <FormField label="Telefone" placeholder="—" :span="4" v-model="form.fiduciaria.representante!.telefone" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Contato" :icon="Mail">
              <StepGrid>
                <FormField label="E-mail" placeholder="—" :span="5" v-model="form.fiduciaria.email!" />
                <SelectField label="DDI" :options="DDI_LABELS" :span="3" v-model="ddiModel" />
                <FormField label="Telefone" placeholder="—" :span="4" v-model="form.fiduciaria.telefone!" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Endereço" :icon="MapPin">
              <StepGrid>
                <FormField label="CEP" placeholder="—" :span="4" v-model="form.fiduciaria.cep!" />
                <FormField label="Localidade" placeholder="—" :span="8" v-model="form.fiduciaria.localidade!" />
                <FormField label="Número" placeholder="—" :span="4" v-model="form.fiduciaria.numero!" />
                <FormField label="Bairro" placeholder="—" :span="8" v-model="form.fiduciaria.bairro!" />
                <FormField label="Informações adicionais" placeholder="—" :span="12" v-model="form.fiduciaria.infoAdicionais!" />
                <FormField label="Cidade" placeholder="—" :span="12" v-model="form.fiduciaria.cidade!" />
                <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="6" v-model="form.fiduciaria.estado!" />
                <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="6" v-model="form.fiduciaria.pais!" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Obrigação garantida">
              <StepGrid>
                <FormField label="Instrumento (Nome)" placeholder="—" :span="6" v-model="form.obrigacao.instrumentoNome" />
                <FormField
                  label="Documento do instrumento (CNPJ)"
                  placeholder="—"
                  :span="6"
                  v-model="form.obrigacao.documentoInstrumento"
                />
                <FormField label="Compradora" placeholder="—" :span="4" v-model="form.obrigacao.compradora" />
                <FormField label="Vendedora" placeholder="—" :span="4" v-model="form.obrigacao.vendedora" />
                <FormField label="Fiador(es)" placeholder="—" :span="4" v-model="form.obrigacao.fiadores" />
                <FormField label="Local" placeholder="—" :span="3" v-model="form.obrigacao.local" />
                <FormField label="Data" placeholder="dd/mm/aaaa" required :span="3" v-model="form.obrigacao.data" />
                <FormField label="Produto" placeholder="—" :span="3" v-model="form.obrigacao.produto" />
                <FormField label="Quantidade" placeholder="—" :span="3" v-model="form.obrigacao.quantidade" />
                <FormField
                  label="Valor da obrigação garantida"
                  placeholder="R$ 0,00"
                  currency
                  :span="6"
                  v-model="form.obrigacao.valor"
                />
              </StepGrid>
            </BentoBox>
          </template>

          <!-- Testemunhas: quando instrumento particular ou constituir -->
          <template v-if="form.instrumentoParticular || form.constituirGarantia">
            <ToggleRow
              label="Possui testemunhas"
              :on="form.possuiTestemunhas"
              @toggle="form.possuiTestemunhas = !form.possuiTestemunhas"
            />

            <BentoBox v-if="form.possuiTestemunhas" title="Testemunhas" :icon="User">
              <div class="flex flex-col" style="gap: 14px">
                <div class="flex justify-end">
                  <AddButton @click="addTestemunha">Adicionar testemunha</AddButton>
                </div>

                <div
                  v-if="form.testemunhas.length === 0"
                  style="padding: 12px 0; font-size: var(--text-sm); color: var(--text-muted); text-align: center"
                >
                  Nenhuma testemunha adicionada.
                </div>

                <div
                  v-for="(t, i) in form.testemunhas"
                  :key="i"
                  class="grid items-end"
                  style="grid-template-columns: 1fr 1.2fr 1.2fr auto; gap: 12px"
                >
                  <FormField label="CPF" placeholder="—" :span="12" v-model="t.cpf" />
                  <FormField label="Nome" placeholder="—" required :span="12" v-model="t.nome" />
                  <FormField label="E-mail" placeholder="—" required :span="12" v-model="t.email" />
                  <button
                    aria-label="Remover testemunha"
                    style="width: 36px; height: 36px; border: none; background: none; cursor: pointer; color: var(--danger-base); margin-bottom: 2px"
                    @click="removeTestemunha(i)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </BentoBox>
          </template>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default)">
        <button
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            border: none;
            border-radius: var(--radius-lg);
            background: var(--action-primary-bg);
            color: #fff;
            font-size: var(--text-xs);
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            cursor: pointer;
          "
          @click="salvar"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
