<script setup lang="ts">
import { Mail, Phone, Building2, User } from 'lucide-vue-next';
import { brl, type CraOperacao, type CraTitulo, type CessaoStatus } from '../../data/craData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ titulo: CraTitulo; operacao: CraOperacao }>();

const cessaoTone: Record<CessaoStatus, { bg: string; fg: string }> = {
  LIQUIDADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  PARCIAL: { bg: '#FFF3CD', fg: '#856404' },
};
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <!-- ── Informações do Título ─────────────────────────────── -->
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Operação de Origem">{{ operacao.nome }}</Field>
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ titulo.numero }}<CopyButton :value="titulo.numero" /></span>
        </Field>
        <Field label="Tipo de Ativo">{{ titulo.tipo }}</Field>
        <Field label="Status">{{ titulo.status }}</Field>
      </div>
    </Section>

    <!-- ── Valores ───────────────────────────────────────────── -->
    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(titulo.vrNominal) }}</Field>
        <Field label="Valor de Aquisição">{{ titulo.vrAquisicao != null ? brl(titulo.vrAquisicao) : '—' }}</Field>
        <Field label="Valor Presente">{{ titulo.vrPresente != null ? brl(titulo.vrPresente) : '—' }}</Field>
        <Field label="Valor em Aberto">{{ titulo.vrAberto != null ? brl(titulo.vrAberto) : '—' }}</Field>
      </div>
    </Section>

    <!-- ── Datas e Prazos ────────────────────────────────────── -->
    <Section title="Datas e Prazos">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Data de Emissão">{{ titulo.emissao }}</Field>
        <Field label="Data de Vencimento">{{ titulo.vencimento }}</Field>
        <Field label="Prorrogação">Não aplicável</Field>
        <Field label="Protesto">—</Field>
      </div>
    </Section>

    <!-- ── Dados Fiscais ─────────────────────────────────────── -->
    <Section v-if="titulo.chaveNfe" title="Dados Fiscais">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <div style="grid-column: span 2">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Chave NF-e
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; word-break: break-all">
            {{ titulo.chaveNfe }}
            <CopyButton :value="titulo.chaveNfe ?? ''" />
          </div>
        </div>
        <Field label="CFOP">{{ titulo.cfop ?? '—' }}</Field>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <Field label="Série">{{ titulo.serie ?? '—' }}</Field>
          <Field label="Modelo">{{ titulo.modelo ?? '—' }}</Field>
        </div>
      </div>
    </Section>

    <!-- ── Participantes ─────────────────────────────────────── -->
    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="titulo.cedente" :cnpj="titulo.cedenteCnpj" :icon="Building2" />
        <Participant role="Sacado" :name="titulo.sacado" :cnpj="titulo.sacadoCnpj" :icon="User" />
      </div>
    </Section>

    <!-- ── Dados de Cessão ───────────────────────────────────── -->
    <Section v-if="titulo.cessao" title="Dados de Cessão">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Cessionário">{{ titulo.cessao.cessionario }}</Field>
        <Field label="Data da Cessão">{{ titulo.cessao.data }}</Field>
        <Field label="Valor Cedido">{{ brl(titulo.cessao.valor) }}</Field>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Status
          </div>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 10px',
              borderRadius: '9999px',
              background: cessaoTone[titulo.cessao.status].bg,
              color: cessaoTone[titulo.cessao.status].fg,
            }"
          >
            {{ titulo.cessao.status }}
          </span>
        </div>
      </div>
    </Section>

    <!-- ── Contato Regulatório ───────────────────────────────── -->
    <Section title="Contato Regulatório">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 24px">
        <Field label="Email">
          <span class="flex items-center" style="gap: 6px"><Mail :size="14" color="var(--text-muted)" /> cobranca@cedente.com.br<CopyButton value="cobranca@cedente.com.br" /></span>
        </Field>
        <Field label="Telefone">
          <span class="flex items-center" style="gap: 6px"><Phone :size="14" color="var(--text-muted)" /> +55 (11) 4002-8922<CopyButton value="+55 (11) 4002-8922" /></span>
        </Field>
      </div>
    </Section>
  </div>
</template>
