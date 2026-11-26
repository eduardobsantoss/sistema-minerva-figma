<script setup lang="ts">
import type { BasicInfo } from '../../data/serasaTypes';
import { formatDateOnly } from '../../utils/serasaFormatters';
import { TabCard } from '@/features/risco/screens/detail-tabs/shared';
import { User, Building2 } from 'lucide-vue-next';

defineProps<{ basicInfo: BasicInfo }>();

function linha(item: unknown, keys: string[]) {
  if (!item || typeof item !== 'object') return '';
  const row = item as Record<string, unknown>;
  return keys
    .map((key) => row[key])
    .filter((value) => value != null && String(value).trim())
    .map(String)
    .join(' · ');
}

function blocos(info: BasicInfo) {
  return [
    { title: 'Endereços', linhas: (info.addresses ?? []).map((item) => linha(item, ['tipo', 'logradouro', 'numero', 'km', 'bairro', 'cidade', 'uf', 'cep'])) },
    { title: 'Telefones', linhas: (info.phones ?? []).map((item) => linha(item, ['tipo', 'ddd', 'numero'])) },
    { title: 'E-mails', linhas: (info.emails ?? []).map((item) => linha(item, ['email'])) },
    { title: 'Atividades', linhas: (info.activities ?? []).map((item) => linha(item, ['codigo', 'descricao'])) },
    { title: info.personType === 'PF' ? 'Pessoas relacionadas' : 'Sócios', linhas: (info.relatedPeople ?? []).map((item) => linha(item, ['nome', 'vinculo', 'participacao'])) },
    { title: 'Vínculos', linhas: (info.businessRelationships ?? []).map((item) => linha(item, ['empresa', 'vinculo'])) },
  ].filter((bloco) => bloco.linhas.some((texto) => texto));
}

function field(label: string, value: string | null | undefined) {
  return { label, value: value?.trim() ? value : null };
}
</script>

<template>
  <TabCard :title="basicInfo.personType === 'PF' ? 'Pessoa física' : 'Pessoa jurídica'" :icon="basicInfo.personType === 'PF' ? User : Building2">
    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px 24px; margin-bottom: 20px">
      <div>
        <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Situação CPF/CNPJ</div>
        <span
          :style="{
            display: 'inline-block',
            marginTop: '4px',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.08em',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'var(--status-success-bg)',
            color: 'var(--status-success-text)',
          }"
        >
          {{ basicInfo.taxIdStatus }}
        </span>
      </div>

      <div v-for="f in [
        field('Nome / Razão social', basicInfo.name),
        ...(basicInfo.personType === 'PF' ? [
          field('Data de nascimento', formatDateOnly(basicInfo.birthDate)),
          field('Nome da mãe', basicInfo.motherName),
        ] : [
          field('Nome fantasia', basicInfo.officialName),
          field('Capital social', basicInfo.capital),
          field('Porte', basicInfo.companySize),
        ]),
        field('Risco', basicInfo.riskScreening),
        field('Operabilidade', basicInfo.operabilityIndicator),
      ].filter((f) => f.value)" :key="f.label">
        <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">{{ f.label }}</div>
        <div style="font-size: var(--text-sm); color: var(--text-strong); margin-top: 4px">{{ f.value }}</div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 16px">
      <div v-for="bloco in blocos(basicInfo)" :key="bloco.title">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px">
          {{ bloco.title }}
        </div>
        <div v-for="(texto, index) in bloco.linhas" :key="index" style="font-size: var(--text-sm); color: var(--text-strong); padding: 6px 0">
          {{ texto }}
        </div>
      </div>
    </div>
  </TabCard>
</template>
