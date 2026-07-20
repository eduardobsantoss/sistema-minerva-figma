<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import { Info, Settings2, FileType, Wallet, Receipt, Target, Save } from 'lucide-vue-next';
import type { FidcSetup } from '../../data/fidcsData';
import Checkbox from '@/components/ui/Checkbox.vue';
import SectionGroup from '../../components/create-class/SectionGroup.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';
import FormField from '../../components/create-class/FormField.vue';
import SelectField from '../../components/create-class/SelectField.vue';
import ToggleRow from '../../components/modals/ToggleRow.vue';

const props = defineProps<{ setup: FidcSetup }>();
const emit = defineEmits<{ update: [FidcSetup] }>();

const SUB_TABS = ['Informações', 'Configurações', 'Tipos de título', 'Carteira', 'Cobrança', 'Elegibilidade'] as const;
type SubTab = (typeof SUB_TABS)[number];

function cloneSetup(s: FidcSetup): FidcSetup {
  return JSON.parse(JSON.stringify(toRaw(s))) as FidcSetup;
}

const subTab = ref<SubTab>('Informações');
const local = ref<FidcSetup>(cloneSetup(props.setup));
const saved = ref(false);

watch(
  () => props.setup,
  (s) => {
    local.value = cloneSetup(s);
  },
  { deep: true },
);

function save() {
  emit('update', cloneSetup(local.value));
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
  }, 2000);
}

function toggleBondType(id: string) {
  local.value = {
    ...local.value,
    bondTypes: local.value.bondTypes.map((b) => (b.id === id ? { ...b, ativo: !b.ativo } : b)),
  };
}

function togglePosse() {
  local.value = { ...local.value, posseDocumentos: !local.value.posseDocumentos };
}

function toggleVencimentoFimSemana() {
  local.value = { ...local.value, vencimentoFimSemana: !local.value.vencimentoFimSemana };
}
</script>

<template>
  <div>
    <div style="padding: 20px 20px 0; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Setup da Operação</div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; margin-bottom: 24px">
        Configurações fund-scoped do FIDC
      </div>
    </div>

    <div style="padding: 16px 20px 0">
      <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
        <button
          v-for="t in SUB_TABS"
          :key="t"
          type="button"
          :style="{
            padding: '10px 4px', marginRight: '22px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
            color: subTab === t ? 'var(--text-strong)' : 'var(--text-muted)',
            borderBottom: subTab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px', whiteSpace: 'nowrap',
          }"
          @click="subTab = t"
        >{{ t }}</button>
      </div>
    </div>

    <div style="padding: 20px">
      <SectionGroup v-if="subTab === 'Informações'" title="Informações gerais" :icon="Info">
        <StepGrid>
          <FormField v-model="local.cnpj" label="CNPJ" :span="4" />
          <FormField v-model="local.razaoSocial" label="Razão social" :span="8" />
          <FormField v-model="local.identificacao" label="Identificação" :span="6" />
          <FormField v-model="local.website" label="Website" :span="6" />
          <FormField v-model="local.ddi" label="DDI" :span="3" />
          <FormField v-model="local.telefone" label="Telefone" :span="5" />
          <FormField v-model="local.dataRegistroCvm" label="Data registro CVM" type="date" :span="2" />
          <FormField v-model="local.valorInicial" label="Valor inicial" :span="2" />
        </StepGrid>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Configurações'" title="Configurações" :icon="Settings2">
        <StepGrid>
          <FormField v-model="local.singulareCompanyCode" label="Código Singulare" :span="4" />
          <FormField v-model="local.grupoOperacao" label="Grupo operação" :span="4" />
          <SelectField v-model="local.perfilTributario" label="Perfil tributário" :options="['Longo prazo', 'Curto prazo']" :span="4" />
          <SelectField v-model="local.tipoCondomino" label="Tipo condômino" :options="['Aberto', 'Fechado']" :span="4" />
          <SelectField v-model="local.perfilCota" label="Perfil cota" :options="['Sênior', 'Mezanino', 'Subordinada']" :span="4" />
          <FormField v-model="local.limiteVencimentoMin" label="Vencimento mín. (dias)" :span="2" />
          <FormField v-model="local.limiteVencimentoMax" label="Vencimento máx. (dias)" :span="2" />
        </StepGrid>
        <div style="margin-top: 16px">
          <ToggleRow label="Posse de documentos" :on="local.posseDocumentos" @toggle="togglePosse" />
        </div>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Tipos de título'" title="Tipos de título" :icon="FileType">
        <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid" style="grid-template-columns: 0.6fr 1.4fr 0.5fr; padding: 14px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
            <div>Abreviação</div>
            <div>Descrição</div>
            <div>Ativo</div>
          </div>
          <div v-for="bt in local.bondTypes" :key="bt.id" class="grid items-center" style="grid-template-columns: 0.6fr 1.4fr 0.5fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold)">{{ bt.abreviacao }}</div>
            <div style="color: var(--text-muted)">{{ bt.descricao }}</div>
            <div>
              <Checkbox :checked="bt.ativo" @change="toggleBondType(bt.id)" />
            </div>
          </div>
        </div>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Carteira'" title="Carteira de cobrança" :icon="Wallet">
        <StepGrid>
          <FormField v-model="local.carteiraNome" label="Nome da carteira" :span="6" />
          <FormField v-model="local.carteiraBanco" label="Banco" :span="6" />
          <FormField v-model="local.carteiraSlug" label="Slug" :span="4" />
          <FormField v-model="local.carteiraCnab" label="CNAB" :span="4" />
          <FormField v-model="local.carteiraAgencia" label="Agência" :span="2" />
          <FormField v-model="local.carteiraConta" label="Conta" :span="2" />
        </StepGrid>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Cobrança'" title="Cobrança" :icon="Receipt">
        <StepGrid>
          <FormField v-model="local.jurosBoleto" label="Juros boleto (%)" :span="3" />
          <FormField v-model="local.multaBoleto" label="Multa boleto (%)" :span="3" />
          <FormField v-model="local.beneficiarioNome" label="Beneficiário" :span="6" />
          <FormField v-model="local.beneficiarioCep" label="CEP" :span="2" />
          <FormField v-model="local.beneficiarioCidade" label="Cidade" :span="3" />
          <FormField v-model="local.beneficiarioUf" label="UF" :span="1" />
        </StepGrid>
        <div style="margin-top: 16px">
          <ToggleRow label="Vencimento em fim de semana" :on="local.vencimentoFimSemana" @toggle="toggleVencimentoFimSemana" />
        </div>
      </SectionGroup>

      <SectionGroup v-else title="Elegibilidade TOP" :icon="Target">
        <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid" style="grid-template-columns: 0.8fr 0.6fr 0.6fr; padding: 14px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
            <div>Tipo</div>
            <div>Quantidade</div>
            <div>Concentração %</div>
          </div>
          <div v-for="top in local.eligibilityTops" :key="top.id" class="grid items-center" style="grid-template-columns: 0.8fr 0.6fr 0.6fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold)">{{ top.tipo }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ top.quantidade }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ top.concentracaoPct }}%</div>
          </div>
        </div>
        <p style="font-size: var(--text-xs); color: var(--gci-base); margin-top: 12px; font-weight: var(--weight-semibold); cursor: pointer">
          Ver ranking de concentração →
        </p>
      </SectionGroup>

      <div class="flex items-center" style="gap: 12px; margin-top: 20px">
        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="save"
        >
          <Save :size="14" /> SALVAR
        </button>
        <span v-if="saved" style="font-size: var(--text-sm); color: var(--success-base); font-weight: var(--weight-semibold)">Alterações salvas</span>
      </div>
    </div>
  </div>
</template>
