<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import { brl, type ContratoAtivo } from '../../../../data/operacaoData';
import { Section, Field } from '../../shared';
import Participant from './Participant.vue';

defineProps<{ ativo: ContratoAtivo }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <Field label="Número">{{ ativo.numero }}</Field>
        <Field label="Tipo">{{ ativo.tipo }}</Field>
        <Field label="Lastro">{{ ativo.lastro }}</Field>
        <Field label="Registro">{{ ativo.registro }}</Field>
        <Field label="Entrega">{{ ativo.entrega }}</Field>
        <Field label="Confirmação">{{ ativo.confirmacao }}</Field>
      </div>
    </Section>
    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <Field label="Valor nominal">{{ brl(ativo.valorTotal) }}</Field>
        <Field label="Situação">{{ ativo.situacao }}</Field>
        <Field label="Situação de pagamento">{{ ativo.situacaoPagamento.replace('_', ' ') }}</Field>
      </div>
    </Section>
    <Section title="Datas">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <Field label="Emissão">{{ ativo.emissao }}</Field>
        <Field label="Entrada">{{ ativo.entrada }}</Field>
        <Field label="Vencimento">{{ ativo.vencimento }}</Field>
      </div>
    </Section>
    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="ativo.cedenteNome" :cnpj="ativo.cedenteDocumento" :icon="Building2" />
        <Participant role="Sacado" :name="ativo.sacadoNome" :cnpj="ativo.sacadoDocumento" :icon="User" />
      </div>
    </Section>
  </div>
</template>
