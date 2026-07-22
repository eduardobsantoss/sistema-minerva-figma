<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import {
  brl,
  situacaoLabel,
  statusTituloLabel,
  statusRegistroLabel,
  statusEntregaLabel,
  statusConfirmacaoLabel,
  statusNotificacaoLabel,
  type TituloAtivoGlobal,
} from '../../data/ativosData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ titulo: TituloAtivoGlobal }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ titulo.numero }}<CopyButton :value="titulo.numero" /></span>
        </Field>
        <Field label="Contrato">{{ titulo.contratoNumero }}</Field>
        <Field label="Lastro">
          <span style="display: inline-block; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 3px 8px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            {{ titulo.lastro }}
          </span>
        </Field>
        <Field label="Tipo de Ativo">{{ titulo.tipoAtivo }}</Field>
        <Field label="Veículo">{{ titulo.veiculoNome }}</Field>
        <Field label="Gerente">{{ titulo.gerente }}</Field>
        <Field label="Situação">{{ situacaoLabel(titulo.situacao) }}</Field>
        <Field label="Status do Título">{{ statusTituloLabel(titulo.statusTitulo) }}</Field>
        <Field label="Status de Registro">{{ statusRegistroLabel(titulo.statusRegistro) }}</Field>
        <Field label="Status de Entrega">{{ statusEntregaLabel(titulo.statusEntrega) }}</Field>
        <Field label="Status Confirmação">{{ statusConfirmacaoLabel(titulo.statusConfirmacao) }}</Field>
        <Field label="Prazo Confirmação">{{ titulo.prazoConfirmacao }}</Field>
        <Field label="Status Notificação">{{ statusNotificacaoLabel(titulo.statusNotificacao) }}</Field>
        <Field label="Cessão">{{ titulo.cessao }}</Field>
        <Field label="Data Cessão">{{ titulo.dataCessao ?? '—' }}</Field>
        <Field label="Chave NF">
          <span class="flex items-center" style="gap: 6px; word-break: break-all">
            {{ titulo.chaveNotaFiscal }}
            <CopyButton v-if="titulo.chaveNotaFiscal !== '—'" :value="titulo.chaveNotaFiscal" />
          </span>
        </Field>
      </div>
    </Section>

    <Section title="Taxas">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Taxa Cessão">{{ titulo.taxaCessao != null ? `${titulo.taxaCessao.toFixed(2)}%` : '—' }}</Field>
        <Field label="Taxa Efetiva">{{ titulo.taxaEfetiva != null ? `${titulo.taxaEfetiva.toFixed(2)}%` : '—' }}</Field>
        <Field label="Indicador">{{ titulo.indicadorTaxa ?? '—' }}</Field>
        <Field label="% Indicador">{{ titulo.percentualIndicador != null ? `${titulo.percentualIndicador}%` : '—' }}</Field>
      </div>
    </Section>

    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(titulo.valorNominal) }}</Field>
        <Field label="Valor Emissão">{{ brl(titulo.valorEmissao) }}</Field>
        <Field label="Valor Aquisição">{{ brl(titulo.valorAquisicao) }}</Field>
        <Field label="Valor Presente">{{ brl(titulo.valorPresente) }}</Field>
        <Field label="Valor Aberto">{{ brl(titulo.valorAberto) }}</Field>
        <Field label="Valor Vencido">{{ brl(titulo.valorVencido) }}</Field>
      </div>
    </Section>

    <Section title="Datas">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Criação">{{ titulo.dataCriacao }}</Field>
        <Field label="Emissão">{{ titulo.dataEmissao }}</Field>
        <Field label="Entrada">{{ titulo.dataEntrada }}</Field>
        <Field label="Vencimento">{{ titulo.vencimento }}</Field>
        <Field label="Último Pagamento">{{ titulo.ultimoPagamento ?? '—' }}</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="titulo.cedenteNome" :cnpj="titulo.cedenteDocumento" :icon="Building2" />
        <Participant role="Sacado" :name="titulo.sacadoNome" :cnpj="titulo.sacadoDocumento" :icon="User" />
      </div>
    </Section>
  </div>
</template>
