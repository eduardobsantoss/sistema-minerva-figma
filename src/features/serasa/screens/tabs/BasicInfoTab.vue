<script setup lang="ts">
import type { BasicInfo } from '../../data/serasaTypes';
import { formatDateOnly } from '../../utils/serasaFormatters';
import JsonListBlock from '../../components/JsonListBlock.vue';
import { TabCard } from '@/features/risco/screens/detail-tabs/shared';
import { User, Building2 } from 'lucide-vue-next';

defineProps<{ basicInfo: BasicInfo }>();

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

    <div class="flex flex-col" style="gap: 10px">
      <JsonListBlock title="Endereços" :data="basicInfo.addresses ?? []" />
      <JsonListBlock title="Telefones" :data="basicInfo.phones ?? []" />
      <JsonListBlock title="E-mails" :data="basicInfo.emails ?? []" />
      <JsonListBlock title="Atividades / CNAEs" :data="basicInfo.activities ?? []" />
      <JsonListBlock :title="basicInfo.personType === 'PF' ? 'Pessoas relacionadas' : 'Sócios / relacionados'" :data="basicInfo.relatedPeople ?? []" />
      <JsonListBlock title="Vínculos societários" :data="basicInfo.businessRelationships ?? []" />
    </div>
  </TabCard>
</template>
