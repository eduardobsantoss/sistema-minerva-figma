<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ClipboardCheck, Users, Truck, ShieldCheck, UserCheck, Trash2 } from 'lucide-vue-next';
import { type ParametrizacaoGeral, type ExcecaoConcentracao, type ParteRelacionada } from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, PctInput, DiasInput, EmptyState, AddButton } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  data: ParametrizacaoGeral;
  partesRelacionadas: ParteRelacionada[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  save: [data: ParametrizacaoGeral];
  'update:partes-relacionadas': [data: ParteRelacionada[]];
}>();

const form = reactive<ParametrizacaoGeral>({ ...props.data });
const partes = reactive<ParteRelacionada[]>(props.partesRelacionadas.map((p) => ({ ...p })));
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

function toggleConjugeAnuente(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) partes[idx] = { ...partes[idx], conjugeAnuente: !partes[idx].conjugeAnuente };
}

function toggleAssinaturaObrigatoria(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) partes[idx] = { ...partes[idx], assinaturaObrigatoria: !partes[idx].assinaturaObrigatoria };
}

function toggleAceitaRestritivo(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const next = !partes[idx].aceitaRestritivo;
    partes[idx] = { ...partes[idx], aceitaRestritivo: next, valorRestritivoAceito: next ? partes[idx].valorRestritivoAceito : 0 };
  }
}

function handleRestritivoInput(id: string, e: Event) {
  const target = e.target as HTMLInputElement;
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) {
    partes[idx] = {
      ...partes[idx],
      valorRestritivoAceito: Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0,
    };
  }
}

function handleSaveGeral() {
  emit('save', form);
}

function handleSavePartes() {
  emit('update:partes-relacionadas', partes.map((p) => ({ ...p })));
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Confirmações" :icon="ClipboardCheck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 3">
          <PctInput label="* Percentual de confirmação pré-desembolso" :value="form.confirmacaoPreDesembolsoPct" @change="form.confirmacaoPreDesembolsoPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <PctInput label="* Percentual de confirmação pós-desembolso (Clientes Novos)" :value="form.confirmacaoClientesNovosPct" @change="form.confirmacaoClientesNovosPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <PctInput label="* Percentual de confirmação pós-desembolso (Clientes Antigos)" :value="form.confirmacaoClientesAntigosPct" @change="form.confirmacaoClientesAntigosPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <DiasInput label="* Dias para confirmação dos ativos (Dias)" :value="form.prazoConfirmacaoTitulosDias" @change="form.prazoConfirmacaoTitulosDias = $event" />
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

    <TabCard title="Concentração de Sacados" :icon="UserCheck">
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

    <TabCard title="Partes Relacionadas" :icon="Users" has-save @save="handleSavePartes">
      <EmptyState v-if="partes.length === 0" :icon="Users" title="Nenhuma parte relacionada cadastrada" hint="Partes relacionadas são herdadas do cadastro do grupo." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; overflow-x: auto">
        <div class="grid items-center" style="grid-template-columns: 1.2fr 1.2fr 0.9fr 80px 80px 80px 120px; min-width: 900px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Nome + Documento</div><div>E-mail + Telefone</div><div>Estado Civil</div><div>Cônjuge anuente</div><div>Assin. obrig.</div><div>Aceita restritivo</div><div>Valor restritivo</div>
        </div>
        <div v-for="p in partes" :key="p.id" class="grid items-center" style="grid-template-columns: 1.2fr 1.2fr 0.9fr 80px 80px 80px 120px; min-width: 900px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.documento }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ p.papel }}</div>
          </div>
          <div>
            <div style="color: var(--text-default)">{{ p.email }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.telefone }}</div>
          </div>
          <div style="color: var(--text-default)">{{ p.estadoCivil }}</div>
          <div>
            <Checkbox :checked="p.conjugeAnuente" @change="toggleConjugeAnuente(p.id)" />
          </div>
          <div>
            <Checkbox :checked="p.assinaturaObrigatoria" @change="toggleAssinaturaObrigatoria(p.id)" />
          </div>
          <div>
            <Checkbox :checked="p.aceitaRestritivo" @change="toggleAceitaRestritivo(p.id)" />
          </div>
          <div>
            <input
              v-if="p.aceitaRestritivo"
              type="text"
              :value="p.valorRestritivoAceito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
              style="width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs)"
              @input="handleRestritivoInput(p.id, $event)"
            />
            <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
          </div>
        </div>
      </div>
    </TabCard>

    <TabCard title="Ativos Não Performados" :icon="Truck">
      <div class="grid geral-toggle-grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px; align-items: end">
        <div class="geral-toggle-cell" style="grid-column: span 4">
          <ToggleRow compact label="Pode operar NFe de Entrega Futura" :on="form.nfEntregaFuturaPodeOperar" @toggle="form.nfEntregaFuturaPodeOperar = !form.nfEntregaFuturaPodeOperar" />
        </div>
        <div style="grid-column: span 5">
          <PctInput label="Percentual máximo para NFe Entrega Futura" :value="form.nfEntregaFuturaOperacaoMaximaPct" :disabled="!form.nfEntregaFuturaPodeOperar" @change="form.nfEntregaFuturaOperacaoMaximaPct = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Crédito e Serasa" :icon="ShieldCheck" has-save @save="handleSaveGeral">
      <div class="grid geral-toggle-grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px; align-items: end">
        <div class="geral-toggle-cell" style="grid-column: span 6">
          <ToggleRow compact label="Indicativo se exige aprovação do sacado pelo setor de Crédito" :on="form.creditoPreAprovacaoSacado" @toggle="form.creditoPreAprovacaoSacado = !form.creditoPreAprovacaoSacado" />
        </div>
        <div style="grid-column: span 3">
          <DiasInput label="Validade da consulta Serasa do sacado (Dias)" :value="form.validadeSerasaSacadoDias" @change="form.validadeSerasaSacadoDias = $event" />
        </div>
        <div style="grid-column: span 3">
          <DiasInput label="Validade da consulta Serasa do Avalista (Dias)" :value="form.validadeSerasaAvalistaDias" @change="form.validadeSerasaAvalistaDias = $event" />
        </div>
        <div style="grid-column: span 3">
          <DiasInput label="Validade da consulta Serasa do Cedente (Dias)" :value="form.validadeSerasaCedenteDias" @change="form.validadeSerasaCedenteDias = $event" />
        </div>
      </div>
    </TabCard>
  </div>
</template>

<style scoped>
@media (max-width: 960px) {
  .geral-toggle-grid > [style*='grid-column: span 4'],
  .geral-toggle-grid > [style*='grid-column: span 5'],
  .geral-toggle-grid > [style*='grid-column: span 6'],
  .geral-toggle-grid > [style*='grid-column: span 3'] {
    grid-column: span 12 !important;
  }
}

.geral-toggle-cell {
  min-height: 40px;
}
</style>
