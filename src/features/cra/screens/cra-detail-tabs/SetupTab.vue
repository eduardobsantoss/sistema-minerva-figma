<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import {
  Settings, SlidersHorizontal, FileCheck, Wallet, Receipt, ListChecks,
} from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import FormField from '../../components/create-cra-operacao-modal/FormField.vue';
import SelectField from '../../components/create-cra-operacao-modal/SelectField.vue';
import ToggleRow from '../../components/create-cra-operacao-modal/ToggleRow.vue';
import SectionGroup from '../../components/create-cra-operacao-modal/SectionGroup.vue';
import StepGrid from '../../components/create-cra-operacao-modal/StepGrid.vue';
import type { CraSetup } from '../../data/craData';

const props = defineProps<{ setup: CraSetup }>();
const emit = defineEmits<{ update: [CraSetup] }>();

const SUB_TABS = ['Dados gerais', 'Limites', 'Tipos de título', 'Carteira', 'Cobrança', 'Elegibilidade'] as const;
type SubTab = (typeof SUB_TABS)[number];

function cloneSetup(s: CraSetup): CraSetup {
  return JSON.parse(JSON.stringify(toRaw(s))) as CraSetup;
}

const subTab = ref<SubTab>('Dados gerais');
const local = ref<CraSetup>(cloneSetup(props.setup));

watch(
  () => props.setup,
  (s) => {
    local.value = cloneSetup(s);
  },
  { deep: true },
);

function save() {
  emit('update', cloneSetup(local.value));
}

function toggleBond(id: string) {
  const bt = local.value.bondTypes.find((b) => b.id === id);
  if (bt) bt.ativo = !bt.ativo;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding: 20px 20px 0">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Setup</div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; margin-bottom: 24px">
        Configurações da operação
      </div>
      <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap; padding-top: 4px">
        <button
          v-for="t in SUB_TABS"
          :key="t"
          type="button"
          :style="{
            padding: '10px 4px',
            marginRight: '22px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            color: subTab === t ? 'var(--text-strong)' : 'var(--text-muted)',
            borderBottom: subTab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px',
            whiteSpace: 'nowrap',
          }"
          @click="subTab = t"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div style="padding: 0 20px 20px; display: flex; flex-direction: column; gap: 16px">
      <template v-if="subTab === 'Dados gerais'">
        <SectionGroup :icon="Settings" title="Dados gerais">
          <StepGrid>
            <FormField v-model="local.nome" label="Nome" :span="6" />
            <FormField v-model="local.custodiante" label="Custodiante" :span="3" />
            <FormField v-model="local.cessionaria" label="Cessionária" :span="3" />
            <FormField v-model="local.prestadorServico" label="Prestador de serviço" :span="4" />
            <FormField v-model="local.beneficiarioFinal" label="Beneficiário final" :span="4" />
            <FormField v-model="local.grupoOperacao" label="Grupo de operação" :span="4" />
          </StepGrid>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Limites'">
        <SectionGroup :icon="SlidersHorizontal" title="Definições / Limites">
          <StepGrid>
            <SelectField
              v-model="local.tipoCalculoElegibilidade"
              label="Tipo de cálculo elegibilidade"
              :options="['Valor presente', 'Valor nominal', 'Deságio']"
              :span="6"
            />
            <FormField v-model="local.limiteConcentracaoPct" label="Limite concentração (%)" :span="3" />
            <FormField v-model="local.limiteVencimentoMin" label="Vencimento mín. (dias)" :span="3" />
            <FormField v-model="local.limiteVencimentoMax" label="Vencimento máx. (dias)" :span="4" />
          </StepGrid>
          <div class="flex flex-col" style="gap: 12px; margin-top: 16px">
            <ToggleRow label="Accrual" :on="local.accrual" @toggle="local.accrual = !local.accrual" />
            <ToggleRow label="Exigir IE" :on="local.exigirIe" @toggle="local.exigirIe = !local.exigirIe" />
            <ToggleRow label="Top sacados" :on="local.topSacados" @toggle="local.topSacados = !local.topSacados" />
            <ToggleRow label="Top cedentes" :on="local.topCedentes" @toggle="local.topCedentes = !local.topCedentes" />
            <ToggleRow label="Tipos título ativos" :on="local.tiposTituloAtivos" @toggle="local.tiposTituloAtivos = !local.tiposTituloAtivos" />
            <ToggleRow label="Entrega futura" :on="local.entregaFutura" @toggle="local.entregaFutura = !local.entregaFutura" />
          </div>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Tipos de título'">
        <SectionGroup :icon="FileCheck" title="Tipos de título">
          <div class="flex flex-col" style="gap: 10px">
            <div
              v-for="bt in local.bondTypes"
              :key="bt.id"
              class="flex items-center"
              style="gap: 12px; padding: 12px 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer"
              @click="toggleBond(bt.id)"
            >
              <Checkbox :checked="bt.ativo" @change="toggleBond(bt.id)" />
              <div style="flex: 1">
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ bt.abreviacao }}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ bt.descricao }}</div>
              </div>
            </div>
          </div>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Carteira'">
        <SectionGroup :icon="Wallet" title="Carteira">
          <StepGrid>
            <FormField v-model="local.carteiraNome" label="Nome da carteira" :span="6" />
            <FormField v-model="local.carteiraBanco" label="Banco" :span="6" />
            <FormField v-model="local.carteiraSlug" label="Slug" :span="4" />
            <FormField v-model="local.carteiraCnab" label="CNAB" :span="4" />
            <FormField v-model="local.carteiraAgencia" label="Agência" :span="2" />
            <FormField v-model="local.carteiraConta" label="Conta" :span="2" />
          </StepGrid>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Cobrança'">
        <SectionGroup :icon="Receipt" title="Cobrança">
          <StepGrid>
            <FormField v-model="local.beneficiarioNome" label="Beneficiário" :span="6" />
            <FormField v-model="local.beneficiarioCep" label="CEP" :span="2" />
            <FormField v-model="local.beneficiarioCidade" label="Cidade" :span="3" />
            <FormField v-model="local.beneficiarioUf" label="UF" :span="1" />
            <FormField v-model="local.jurosBoleto" label="Juros boleto (%)" :span="3" />
            <FormField v-model="local.multaBoleto" label="Multa boleto (%)" :span="3" />
          </StepGrid>
          <div style="margin-top: 16px">
            <ToggleRow label="Vencimento em fim de semana" :on="local.vencimentoFimSemana" @toggle="local.vencimentoFimSemana = !local.vencimentoFimSemana" />
          </div>
        </SectionGroup>
      </template>

      <template v-else>
        <SectionGroup :icon="ListChecks" title="Elegibilidade">
          <div class="flex flex-col" style="gap: 12px">
            <div
              v-for="top in local.eligibilityTops"
              :key="top.id"
              class="grid items-center"
              style="grid-template-columns: 1fr 1fr 1fr; gap: 12px; padding: 12px 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card)"
            >
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Tipo</div>
                <select
                  v-model="top.tipo"
                  style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm)"
                >
                  <option value="CEDENTE">CEDENTE</option>
                  <option value="SACADO">SACADO</option>
                </select>
              </div>
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Quantidade</div>
                <input
                  v-model.number="top.quantidade"
                  type="number"
                  style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm)"
                />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Concentração (%)</div>
                <input
                  v-model.number="top.concentracaoPct"
                  type="number"
                  style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm)"
                />
              </div>
            </div>
            <button
              type="button"
              style="background: none; border: none; cursor: default; font-size: var(--text-sm); color: var(--text-muted); text-align: left; padding: 4px 0"
            >
              Ver ranking (em breve)
            </button>
          </div>
        </SectionGroup>
      </template>

      <div class="flex justify-end">
        <button
          type="button"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="save"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
