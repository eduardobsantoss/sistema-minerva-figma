<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ClipboardCheck, Users, Truck, ShieldCheck, FileSearch, ScrollText, UserCheck, FileSignature, Trash2 } from 'lucide-vue-next';
import { FREQUENCIA_LAUDO_OPTS, type ParametrizacaoGeral, type ExcecaoConcentracao } from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField, ToggleRow, PctInput, DiasInput, EmptyState, AddButton } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  data: ParametrizacaoGeral;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoGeral] }>();

const form = reactive<ParametrizacaoGeral>({ ...props.data });
const excSacadoDoc = ref('');
const excSacadoNome = ref('');
const excPct = ref('');

function addExcecao() {
  if (!excSacadoNome.value.trim() || !excPct.value) return;
  const nova: ExcecaoConcentracao = {
    id: `exc-${Date.now()}`,
    sacadoDocumento: excSacadoDoc.value,
    sacadoNome: excSacadoNome.value,
    percentual: Number(excPct.value.replace(',', '.')) || 0,
  };
  form.excecoesConcentracao = [...form.excecoesConcentracao, nova];
  excSacadoDoc.value = '';
  excSacadoNome.value = '';
  excPct.value = '';
}

function removeExcecao(id: string) {
  form.excecoesConcentracao = form.excecoesConcentracao.filter((e) => e.id !== id);
}

function toggleAvalistaObrigatorio(id: string) {
  form.avalistas = form.avalistas.map((a) => (a.id === id ? { ...a, obrigatorio: !a.obrigatorio } : a));
}

function toggleConjugeAnuente(id: string) {
  form.avalistas = form.avalistas.map((a) => (a.id === id ? { ...a, conjugeAnuente: !a.conjugeAnuente } : a));
}

function removeAvalista(id: string) {
  form.avalistas = form.avalistas.filter((a) => a.id !== id);
}

function handleRestritivoInput(field: 'valorRestritivoAceitoCedente' | 'valorRestritivoSocios', e: Event) {
  const target = e.target as HTMLInputElement;
  form[field] = Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handleSave() {
  emit('save', form);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Confirmações" :icon="ClipboardCheck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 3">
          <PctInput label="* Confirmação pré-desembolso" :value="form.confirmacaoPreDesembolsoPct" @change="form.confirmacaoPreDesembolsoPct = $event" />
        </div>
        <div style="grid-column: span 4">
          <DiasInput label="* Prazo para confirmação dos títulos (dias)" :value="form.prazoConfirmacaoTitulosDias" @change="form.prazoConfirmacaoTitulosDias = $event" />
        </div>
        <div style="grid-column: span 5">
          <PctInput label="* Confirmação pós-desembolso (Clientes Novos)" :value="form.confirmacaoClientesNovosPct" @change="form.confirmacaoClientesNovosPct = $event" />
        </div>
        <div style="grid-column: span 5">
          <PctInput label="* Confirmação pós-desembolso (Clientes Antigos)" :value="form.confirmacaoClientesAntigosPct" @change="form.confirmacaoClientesAntigosPct = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Notificações" :icon="Users">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 4">
          <PctInput label="* Notificação de sacados" :value="form.notificacaoSacadosPct" @change="form.notificacaoSacadosPct = $event" />
        </div>
        <div style="grid-column: span 4">
          <DiasInput label="Prazo para confirmação dos sacados" :value="form.prazoConfirmacaoSacadosDias" @change="form.prazoConfirmacaoSacadosDias = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Sacados" :icon="UserCheck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px; margin-bottom: 16px">
        <div style="grid-column: span 5">
          <PctInput label="* Concentração de sacados" :value="form.concentracaoMaximaSacadoPct" @change="form.concentracaoMaximaSacadoPct = $event" />
        </div>
      </div>
      <div class="flex flex-col" style="gap: 16px">
        <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr 0.7fr auto; gap: 10px">
          <div>
            <FieldLabel>* CPF/CNPJ do sacado</FieldLabel>
            <input v-model="excSacadoDoc" placeholder="—" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>Nome do sacado</FieldLabel>
            <input v-model="excSacadoNome" placeholder="—" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>* Percentual de concentração</FieldLabel>
            <input v-model="excPct" placeholder="0,00%" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <AddButton @click="addExcecao" />
        </div>
        <EmptyState v-if="form.excecoesConcentracao.length === 0" :icon="UserCheck" title="Nenhuma exceção cadastrada" hint="Cadastre sacados com exceção de concentração." />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid items-center" style="grid-template-columns: 1.4fr 1fr 0.7fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
            <div>Nome</div><div>Documento</div><div style="text-align: right">Percentual</div><div />
          </div>
          <div v-for="e in form.excecoesConcentracao" :key="e.id" class="grid items-center" style="grid-template-columns: 1.4fr 1fr 0.7fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.sacadoNome }}</div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.sacadoDocumento || '—' }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums">{{ e.percentual.toFixed(2).replace('.', ',') }}%</div>
            <div class="flex justify-end">
              <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="removeExcecao(e.id)">
                <Trash2 :size="13" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TabCard>

    <TabCard title="Tipos de Ativos" :icon="Truck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 4">
          <ToggleRow label="Pode operar NFe de Entrega Futura" :on="form.nfEntregaFuturaPodeOperar" @toggle="form.nfEntregaFuturaPodeOperar = !form.nfEntregaFuturaPodeOperar" />
        </div>
        <div style="grid-column: span 5">
          <PctInput label="Percentual máximo para NFe Entrega Futura" :value="form.nfEntregaFuturaOperacaoMaximaPct" :disabled="!form.nfEntregaFuturaPodeOperar" @change="form.nfEntregaFuturaOperacaoMaximaPct = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Crédito e Serasa" :icon="ShieldCheck">
      <div class="flex flex-col" style="gap: 16px">
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 6">
            <ToggleRow label="Exige pré-aprovação do sacado pelo Crédito" :on="form.creditoPreAprovacaoSacado" @toggle="form.creditoPreAprovacaoSacado = !form.creditoPreAprovacaoSacado" />
          </div>
          <div style="grid-column: span 3">
            <DiasInput label="Validade Serasa do sacado (dias)" :value="form.validadeSerasaSacadoDias" @change="form.validadeSerasaSacadoDias = $event" />
          </div>
          <div style="grid-column: span 3">
            <DiasInput label="Validade Serasa do avalista (dias)" :value="form.validadeSerasaAvalistaDias" @change="form.validadeSerasaAvalistaDias = $event" />
          </div>
        </div>
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 3">
            <DiasInput label="Validade Serasa do cedente (dias)" :value="form.validadeSerasaCedenteDias" @change="form.validadeSerasaCedenteDias = $event" />
          </div>
          <div style="grid-column: span 4">
            <ToggleRow label="Exige aval do cônjuge" :on="form.necessitaAvalConjuge" @toggle="form.necessitaAvalConjuge = !form.necessitaAvalConjuge" />
          </div>
          <div style="grid-column: span 5">
            <ToggleRow label="Exige anuência do cônjuge" :on="form.exigeAnuenciaConjuge" @toggle="form.exigeAnuenciaConjuge = !form.exigeAnuenciaConjuge" />
          </div>
        </div>
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 5">
            <ToggleRow label="Aceita restritivo financeiro do cedente" :on="form.aceitaRestritivoFinanceiroCedente" @toggle="form.aceitaRestritivoFinanceiroCedente = !form.aceitaRestritivoFinanceiroCedente" />
          </div>
          <div v-if="form.aceitaRestritivoFinanceiroCedente" style="grid-column: span 3">
            <FieldLabel>Valor de restritivo aceito</FieldLabel>
            <input type="text" :value="form.valorRestritivoAceitoCedente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" @input="handleRestritivoInput('valorRestritivoAceitoCedente', $event)" />
          </div>
          <div style="grid-column: span 4">
            <ToggleRow label="Aceita restritivo dos sócios" :on="form.aceitaRestritivoSocios" @toggle="form.aceitaRestritivoSocios = !form.aceitaRestritivoSocios" />
          </div>
          <div v-if="form.aceitaRestritivoSocios" style="grid-column: span 3">
            <FieldLabel>Valor de restritivo</FieldLabel>
            <input type="text" :value="form.valorRestritivoSocios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" @input="handleRestritivoInput('valorRestritivoSocios', $event)" />
          </div>
        </div>
      </div>
    </TabCard>

    <TabCard title="Laudo de Ativo/Imóvel" :icon="FileSearch">
      <div class="flex flex-col" style="gap: 16px">
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 5">
            <ToggleRow label="Laudo do ativo antes do desembolso" :on="form.laudoAtivoAntesDesembolso" @toggle="form.laudoAtivoAntesDesembolso = !form.laudoAtivoAntesDesembolso" />
          </div>
          <div style="grid-column: span 3">
            <SelectField label="Frequência do laudo do ativo" :options="FREQUENCIA_LAUDO_OPTS" :value="form.laudoFrequencia" @change="form.laudoFrequencia = ($event.target as HTMLSelectElement).value as ParametrizacaoGeral['laudoFrequencia']" />
          </div>
          <div style="grid-column: span 4">
            <DiasInput label="(AF Imóvel) prazo do laudo pós comitê (dias)" :value="form.afImovelPrazoLaudoPosComiteDias" @change="form.afImovelPrazoLaudoPosComiteDias = $event" />
          </div>
        </div>
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 6">
            <ToggleRow label="(AF Imóvel) AF aprovado só com escritura pública" :on="form.afImovelAprovadoSoEscrituraPublica" @toggle="form.afImovelAprovadoSoEscrituraPublica = !form.afImovelAprovadoSoEscrituraPublica" />
          </div>
        </div>
      </div>
    </TabCard>

    <TabCard title="Protocolos por Produto" :icon="ScrollText">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 5">
          <ToggleRow label="(CPR) Desembolso só com protocolo" :on="form.protocoloCpr" @toggle="form.protocoloCpr = !form.protocoloCpr" />
        </div>
        <div style="grid-column: span 7">
          <ToggleRow label="(Garantia de Imóvel) Desembolso só com protocolo" :on="form.protocoloGarantiaImovel" @toggle="form.protocoloGarantiaImovel = !form.protocoloGarantiaImovel" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Lista de Avalistas" :icon="FileSignature" has-save @save="handleSave">
      <EmptyState v-if="form.avalistas.length === 0" :icon="FileSignature" title="Nenhum avalista cadastrado" hint="Avalistas são herdados do cadastro do grupo." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid items-center" style="grid-template-columns: 1.2fr 1.2fr 1fr 0.8fr 90px 90px 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Nome + Documento</div><div>E-mail + Telefone</div><div>Estado Civil</div><div>Cônjuge anuente</div><div>Assin. obrig.</div><div />
        </div>
        <div v-for="a in form.avalistas" :key="a.id" class="grid items-center" style="grid-template-columns: 1.2fr 1.2fr 1fr 0.8fr 90px 90px 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ a.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.documento }}</div>
          </div>
          <div>
            <div style="color: var(--text-default)">{{ a.email }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.telefone }}</div>
          </div>
          <div style="color: var(--text-default)">{{ a.estadoCivil }}</div>
          <div>
            <Checkbox :checked="a.conjugeAnuente" @change="toggleConjugeAnuente(a.id)" />
          </div>
          <div>
            <Checkbox :checked="a.obrigatorio" @change="toggleAvalistaObrigatorio(a.id)" />
          </div>
          <div class="flex justify-end">
            <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="removeAvalista(a.id)">
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </div>
    </TabCard>
  </div>
</template>
