<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import {
  brl,
  situacaoTituloLabel,
  statusPagamentoLabel,
  statusNotificacaoLabel,
  statusConfirmacaoLabel,
  type Titulo,
} from '../../data/titulosData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ titulo: Titulo }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ titulo.numero }}<CopyButton :value="titulo.numero" /></span>
        </Field>
        <Field label="Lastro">
          <span
            style="
              display: inline-block;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
            "
          >
            {{ titulo.lastro }}
          </span>
        </Field>
        <Field label="Tipo de Ativo">{{ titulo.tipo }}</Field>
        <Field label="Veículo">{{ titulo.veiculoNome }}</Field>
        <Field label="Classe / Operação">{{ titulo.classeOuOperacao ?? '—' }}</Field>
        <Field label="Gerente">{{ titulo.gerente }}</Field>
        <Field label="Situação do Título">{{ situacaoTituloLabel(titulo.situacaoTitulo) }}</Field>
        <Field label="Status de Pagamento">{{ statusPagamentoLabel(titulo.statusPagamento) }}</Field>
        <Field label="Status de Notificação">{{ statusNotificacaoLabel(titulo.statusNotificacao) }}</Field>
        <Field label="Status de Confirmação">{{ statusConfirmacaoLabel(titulo.statusConfirmacao) }}</Field>
        <Field label="Dias em atraso">{{ titulo.diasAtraso }}</Field>
        <Field label="Boleto">{{ titulo.boletoGeradoEm ? `Gerado em ${titulo.boletoGeradoEm}` : 'Não gerado' }}</Field>
      </div>
    </Section>

    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(titulo.vrNominal) }}</Field>
        <Field label="Valor de Aquisição">{{ titulo.vrAquisicao != null ? brl(titulo.vrAquisicao) : '—' }}</Field>
        <Field label="Valor Presente">{{ titulo.vrPresente != null ? brl(titulo.vrPresente) : '—' }}</Field>
        <Field label="Valor em Aberto">{{ brl(titulo.vrAberto) }}</Field>
        <Field label="Valor de Juros">{{ brl(titulo.vrJuros) }}</Field>
        <Field label="Valor de Multa">{{ brl(titulo.vrMulta) }}</Field>
      </div>
    </Section>

    <Section title="Datas e Prazos">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Data de Emissão">{{ titulo.emissao }}</Field>
        <Field label="Data de Vencimento">{{ titulo.vencimento }}</Field>
        <Field label="Última Notificação">{{ titulo.ultimaNotificacaoEm ?? '—' }}</Field>
        <Field label="Boleto Gerado em">{{ titulo.boletoGeradoEm ?? '—' }}</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="titulo.cedente" :cnpj="titulo.cedenteCnpj" :icon="Building2" />
        <Participant role="Sacado" :name="titulo.sacado" :cnpj="titulo.sacadoCnpj" :icon="User" />
      </div>
    </Section>
  </div>
</template>
