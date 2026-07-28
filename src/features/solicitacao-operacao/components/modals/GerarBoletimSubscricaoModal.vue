<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { X, Building2, Tag, FileText, User, Mail, MapPin, Landmark, CalendarCheck } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI, type Solicitacao } from '../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField, ToggleRow } from './adicionar-contrato';
import {
  SERIE_EMISSAO_OPTS,
  MEIO_INTEGRALIZACAO_OPTS,
  CONTAS_BANCARIAS_MOCK,
  BANCO_OPTS,
  labelContaBancaria,
  CREDORAS_PADRAO,
  emptyPessoaMinuta,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../data/minutaData';

const props = defineProps<{ solicitacao: Solicitacao }>();
const emit = defineEmits<{ close: []; confirm: [] }>();

const DDI_OPTS = PAISES_DDI.map((p) => `${p.pais} (${p.ddi})`);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const CONTA_OPTS = CONTAS_BANCARIAS_MOCK.map(labelContaBancaria);

const CONTATO_EMISSOR_OPTS = [
  'Financeiro · financeiro@fazendao.com.br',
  'Jurídico · juridico@fazendao.com.br',
  'Operações · operacoes@fazendao.com.br',
];
const ENDERECO_EMISSOR_OPTS = [
  'Sede · Uberaba/MG',
  'Filial · São Paulo/SP',
];
const REPRESENTANTE_EMISSOR_OPTS = [
  'CARLOS EDUARDO BENITEZ · 165.833.928-28',
  'MARCELO TARTARO · 144.112.938-38',
];

const form = reactive({
  nomeEmissor: props.solicitacao.cedente || 'FAZENDAO INDUSTRIA E COMERCIO DE PRODUTOS AGROPECUARIOS LT',
  contatoEmissor: CONTATO_EMISSOR_OPTS[0] ?? '',
  enderecoEmissor: ENDERECO_EMISSOR_OPTS[0] ?? '',
  representanteEmissor: REPRESENTANTE_EMISSOR_OPTS[0] ?? '',
  contaBancariaEmissor: CONTA_OPTS[0] ?? '',
  uf: 'MG',
  cidade: '',
  numeroEmissao: '',
  serie: 'ÚNICA',
  valorNominalUnitario: '',
  quantidade: '',
  precoTotalUnitario: '',
  precoSubscricao: '',
  subscritorPadrao: false,
  subscritor: emptyPessoaMinuta('JURIDICA') as PessoaMinuta,
  banco: '',
  agencia: '',
  conta: '',
  titularidade: '',
  meioIntegralizacao: '',
});

const cidadeOpts = computed(() => cidadesDaUf(form.uf));
const cidadeSubOpts = computed(() => cidadesDaUf(form.subscritor.estado ?? ''));

watch(
  () => form.uf,
  () => {
    if (form.cidade && !cidadeOpts.value.includes(form.cidade)) form.cidade = '';
  },
);

watch(
  () => form.subscritor.estado,
  () => {
    if (form.subscritor.cidade && !cidadeSubOpts.value.includes(form.subscritor.cidade)) {
      form.subscritor.cidade = '';
    }
  },
);

watch(
  () => form.subscritorPadrao,
  (on) => {
    if (on) {
      const data = CREDORAS_PADRAO['Ceres Securitizadora'];
      if (data) Object.assign(form.subscritor, JSON.parse(JSON.stringify(data)));
      form.banco = '341 - Itaú';
      form.agencia = '1475';
      form.conta = '43810-5';
      form.titularidade = data?.razaoSocial ?? 'CERES SECURITIZADORA S.A.';
    } else {
      form.subscritor = emptyPessoaMinuta('JURIDICA');
      form.banco = '';
      form.agencia = '';
      form.conta = '';
      form.titularidade = '';
    }
  },
);

const ddiLabel = computed({
  get: () => {
    const ddi = form.subscritor.ddi || '+55';
    const match = PAISES_DDI.find((p) => p.ddi === ddi);
    return match ? `${match.pais} (${match.ddi})` : DDI_OPTS[0] ?? '';
  },
  set: (v: string) => {
    const m = v.match(/\(([^)]+)\)/);
    form.subscritor.ddi = m?.[1] ?? '+55';
  },
});

function gerar() {
  emit('confirm');
  emit('close');
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
        max-width: 960px;
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
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Gerar Boletim de Subscrição
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Nota Comercial · {{ solicitacao.id }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px" class="flex flex-col" :style="{ gap: '24px' }">
        <BentoBox title="Emissor" :icon="Building2">
          <StepGrid>
            <FormField label="Nome / Razão social" :span="12" v-model="form.nomeEmissor" />
            <SelectField label="Contato" :options="CONTATO_EMISSOR_OPTS" placeholder="Selecione" :span="3" v-model="form.contatoEmissor" />
            <SelectField label="Endereço" :options="ENDERECO_EMISSOR_OPTS" placeholder="Selecione" :span="3" v-model="form.enderecoEmissor" />
            <SelectField label="Representante legal" :options="REPRESENTANTE_EMISSOR_OPTS" placeholder="Selecione" :span="3" v-model="form.representanteEmissor" />
            <SelectField label="Conta bancária" :options="CONTA_OPTS" placeholder="Selecione" :span="3" v-model="form.contaBancariaEmissor" />
          </StepGrid>
        </BentoBox>

        <BentoBox title="Resumo da emissão" :icon="Tag">
          <StepGrid>
            <SelectField label="UF da emissão" :options="UF_OPTIONS" placeholder="UF" required :span="3" v-model="form.uf" />
            <SelectField
              label="Cidade da emissão"
              :options="cidadeOpts"
              placeholder="Selecione"
              required
              :span="3"
              :disabled="!form.uf"
              v-model="form.cidade"
            />
            <FormField label="Número de emissão" placeholder="—" required :span="3" v-model="form.numeroEmissao" />
            <SelectField label="Série" :options="SERIE_EMISSAO_OPTS" placeholder="Selecione" required :span="3" v-model="form.serie" />
            <FormField label="Valor nominal unitário" placeholder="R$ 0,00" required currency :span="4" v-model="form.valorNominalUnitario" />
          </StepGrid>
        </BentoBox>

        <BentoBox title="Notas comerciais subscritas" :icon="FileText">
          <StepGrid>
            <FormField label="Quantidade" placeholder="—" required :span="4" v-model="form.quantidade" />
            <FormField label="Preço total unitário" placeholder="R$ 0,00" required currency :span="4" v-model="form.precoTotalUnitario" />
            <FormField label="Preço de subscrição" placeholder="R$ 0,00" required currency :span="4" v-model="form.precoSubscricao" />
          </StepGrid>
        </BentoBox>

        <BentoBox title="Dados do subscritor" :icon="User">
          <div class="flex flex-col" style="gap: 16px">
            <ToggleRow
              label="Subscritor Ceres Securitizadora"
              :on="form.subscritorPadrao"
              compact
              @toggle="form.subscritorPadrao = !form.subscritorPadrao"
            />

            <StepGrid>
              <FormField label="CNPJ" placeholder="—" :span="4" :disabled="form.subscritorPadrao" v-model="form.subscritor.cnpj!" />
              <FormField label="Razão social" placeholder="—" :span="5" :disabled="form.subscritorPadrao" v-model="form.subscritor.razaoSocial!" />
              <FormField label="Nome Fantasia" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.nomeFantasia!" />
              <FormField label="Data de abertura" placeholder="dd/mm/aaaa" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.dataAbertura!" />
              <FormField label="Tipo" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.tipoEmpresa!" />
              <FormField label="Porte" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.porte!" />
              <FormField label="Atividade principal" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.atividadePrincipal!" />
              <FormField label="Natureza jurídica" placeholder="—" :span="6" :disabled="form.subscritorPadrao" v-model="form.subscritor.naturezaJuridica!" />
              <FormField label="Inscrição municipal" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.inscricaoMunicipal!" />
              <FormField label="Inscrição estadual" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.inscricaoEstadual!" />
            </StepGrid>

            <BentoBox title="Contato" :icon="Mail">
              <StepGrid>
                <FormField label="E-mail" placeholder="—" required :span="5" :disabled="form.subscritorPadrao" v-model="form.subscritor.email!" />
                <SelectField label="DDI" :options="DDI_OPTS" :span="3" :disabled="form.subscritorPadrao" v-model="ddiLabel" />
                <FormField label="Telefone" placeholder="—" required :span="4" :disabled="form.subscritorPadrao" v-model="form.subscritor.telefone!" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Endereço" :icon="MapPin">
              <StepGrid>
                <FormField label="CEP" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.cep!" />
                <FormField label="Localidade" placeholder="—" :span="6" :disabled="form.subscritorPadrao" v-model="form.subscritor.localidade!" />
                <FormField label="Número" placeholder="—" :span="3" :disabled="form.subscritorPadrao" v-model="form.subscritor.numero!" />
                <FormField label="Bairro" placeholder="—" :span="4" :disabled="form.subscritorPadrao" v-model="form.subscritor.bairro!" />
                <FormField label="Informações adicionais" placeholder="—" :span="8" :disabled="form.subscritorPadrao" v-model="form.subscritor.infoAdicionais!" />
                <FormField label="Cidade" placeholder="—" :span="4" :disabled="form.subscritorPadrao" v-model="form.subscritor.cidade!" />
                <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="4" :disabled="form.subscritorPadrao" v-model="form.subscritor.estado!" />
                <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" :disabled="form.subscritorPadrao" v-model="form.subscritor.pais!" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Dados bancários" :icon="Landmark">
              <StepGrid>
                <SelectField label="Banco" :options="BANCO_OPTS" placeholder="Selecione" :span="6" :disabled="form.subscritorPadrao" v-model="form.banco" />
                <FormField label="Agência" placeholder="—" :span="6" :disabled="form.subscritorPadrao" v-model="form.agencia" />
                <FormField label="Conta" placeholder="—" :span="6" :disabled="form.subscritorPadrao" v-model="form.conta" />
                <FormField label="Titularidade da conta bancária" placeholder="—" :span="6" :disabled="form.subscritorPadrao" v-model="form.titularidade" />
              </StepGrid>
            </BentoBox>

            <BentoBox title="Integralização" :icon="CalendarCheck">
              <StepGrid>
                <SelectField
                  label="Meio de integralização"
                  :options="MEIO_INTEGRALIZACAO_OPTS"
                  placeholder="Selecione"
                  required
                  :span="6"
                  v-model="form.meioIntegralizacao"
                />
              </StepGrid>
            </BentoBox>
          </div>
        </BentoBox>
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
          class="btn-animated btn-primary"
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
          "
          @click="gerar"
        >
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>
