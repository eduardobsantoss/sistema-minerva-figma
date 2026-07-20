<script setup lang="ts">
import { ref } from 'vue';
import type { Sacado } from '../../data/fidcsData';
import FormField from '../../components/create-class/FormField.vue';
import SelectField from '../../components/create-class/SelectField.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';
import ContatosSubTab from './ContatosSubTab.vue';
import EnderecosSubTab from './EnderecosSubTab.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const SUB_TABS = ['Contatos', 'Endereços'] as const;
type SubTab = (typeof SUB_TABS)[number];

const subTab = ref<SubTab>('Contatos');

const local = ref({ ...props.sacado });

function patch(field: keyof Sacado, value: string) {
  local.value = { ...local.value, [field]: value };
  emit('update', { ...local.value });
}

function onSacadoUpdate(s: Sacado) {
  local.value = s;
  emit('update', s);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 16px">
        {{ sacado.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica' }}
      </div>
      <StepGrid>
        <FormField
          :model-value="local.documento"
          label="Documento"
          disabled
          :span="4"
          @update:model-value="patch('documento', $event)"
        />
        <FormField
          :model-value="local.nome"
          label="Nome / Razão Social"
          :span="8"
          @update:model-value="patch('nome', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.nomeFantasia ?? ''"
          label="Nome Fantasia"
          :span="6"
          @update:model-value="patch('nomeFantasia', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.inscricaoEstadual ?? ''"
          label="Inscrição Estadual"
          :span="3"
          @update:model-value="patch('inscricaoEstadual', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.inscricaoMunicipal ?? ''"
          label="Inscrição Municipal"
          :span="3"
          @update:model-value="patch('inscricaoMunicipal', $event)"
        />
        <FormField
          v-if="sacado.pessoaFisica"
          :model-value="local.inscricaoProdutorRural ?? ''"
          label="Inscrição Produtor Rural"
          :span="6"
          @update:model-value="patch('inscricaoProdutorRural', $event)"
        />
        <FormField
          :model-value="local.tipo"
          label="Tipo"
          :span="3"
          @update:model-value="patch('tipo', $event)"
        />
        <FormField
          :model-value="local.grupoEconomico"
          label="Grupo Econômico"
          :span="5"
          @update:model-value="patch('grupoEconomico', $event)"
        />
        <SelectField
          :model-value="local.metodoNotificacao ?? 'E-mail'"
          label="Método de Notificação"
          :options="['E-mail', 'WhatsApp', 'Telefone']"
          :span="4"
          @update:model-value="patch('metodoNotificacao', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.atividadePrincipal ?? ''"
          label="Atividade Principal"
          :span="12"
          @update:model-value="patch('atividadePrincipal', $event)"
        />
      </StepGrid>
    </div>

    <div style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
      <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap; margin-bottom: 20px">
        <button
          v-for="t in SUB_TABS"
          :key="t"
          type="button"
          :style="{
            padding: '10px 4px', marginRight: '22px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
            color: subTab === t ? 'var(--text-strong)' : 'var(--text-muted)',
            borderBottom: subTab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px', whiteSpace: 'nowrap',
          }"
          @click="subTab = t"
        >{{ t }}</button>
      </div>
      <ContatosSubTab v-if="subTab === 'Contatos'" :sacado="local" @update="onSacadoUpdate" />
      <EnderecosSubTab v-else :sacado="local" @update="onSacadoUpdate" />
    </div>
  </div>
</template>
