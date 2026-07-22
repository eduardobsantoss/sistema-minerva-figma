<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import { brl, type ContratoAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ contrato: ContratoAtivoGlobal }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Dados do Contrato">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">{{ contrato.numero }}<CopyButton :value="contrato.numero" /></span>
        </Field>
        <Field label="Tipo do Ativo">{{ contrato.tipoAtivo }}</Field>
        <Field label="Quantidade de Parcelas">{{ contrato.qtdParcelas }}</Field>
        <Field label="Veículo">{{ contrato.veiculoNome }}</Field>
        <Field label="Grupo Empresarial">{{ contrato.grupoEmpresarial }}</Field>
        <Field label="Data de Primeira Entrada">{{ contrato.dataPrimeiraEntrada }}</Field>
        <Field label="Último Vencimento">{{ contrato.ultimoVencimento }}</Field>
      </div>
    </Section>

    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(contrato.valorNominal) }}</Field>
        <Field label="Valor Emissão">{{ brl(contrato.valorEmissao) }}</Field>
        <Field label="Valor Aquisição">{{ brl(contrato.valorAquisicao) }}</Field>
        <Field label="Valor Presente">{{ brl(contrato.valorPresente) }}</Field>
        <Field label="Valor Aberto">{{ brl(contrato.valorAberto) }}</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="contrato.cedenteNome" :cnpj="contrato.cedenteDocumento" :icon="Building2" />
        <Participant role="Sacado" :name="contrato.sacadoNome" :cnpj="contrato.sacadoDocumento" :icon="User" />
      </div>
    </Section>
  </div>
</template>
