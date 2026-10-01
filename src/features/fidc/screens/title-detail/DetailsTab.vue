<script setup lang="ts">
import { Mail, Phone, Building2, User, Pencil } from 'lucide-vue-next';
import type { Cessao, Title, FidcClass } from '../../data/fidcsData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{
  title: Title;
  klass: FidcClass;
  cessaoVeiculo?: Cessao | null;
}>();

const emit = defineEmits<{ editCessao: [] }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Classe de Origem">{{ klass.name }}</Field>
        <Field label="ID de Lastro">LST-{{ title.numero }}</Field>
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ title.numero }}<CopyButton :value="title.numero" /></span>
        </Field>
        <Field label="Tipo de Ativo">{{ title.lastro.replace('_', '-') }}</Field>
        <Field label="Nome da Cessão">
          <span class="flex items-center" style="gap: 6px; min-width: 0">
            <span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ cessaoVeiculo?.nome ?? '—' }}
            </span>
            <button
              v-if="cessaoVeiculo"
              type="button"
              aria-label="Editar cessão"
              class="flex items-center justify-center"
              style="
                width: 28px;
                height: 28px;
                flex-shrink: 0;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-default);
                background: var(--surface-card);
                cursor: pointer;
                color: var(--text-muted);
              "
              @click="emit('editCessao')"
            >
              <Pencil :size="13" />
            </button>
          </span>
        </Field>
      </div>
    </Section>

    <Section title="Datas e Prazos">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Data de Emissão">{{ title.emissao }}</Field>
        <Field label="Data de Vencimento">{{ title.vencimento }}</Field>
        <Field label="Prorrogação">Não aplicável</Field>
        <Field label="Protesto">—</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="title.cedente" :cnpj="title.cedenteCnpj" :icon="Building2" />
        <Participant role="Sacado" :name="title.sacado" :cnpj="title.sacadoCnpj" :icon="User" />
      </div>
    </Section>

    <Section title="Contato Regulatório">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 24px">
        <Field label="Email">
          <span class="flex items-center" style="gap: 6px">
            <Mail :size="14" color="var(--text-muted)" /> cobranca@cedente.com.br
            <CopyButton value="cobranca@cedente.com.br" />
          </span>
        </Field>
        <Field label="Telefone">
          <span class="flex items-center" style="gap: 6px">
            <Phone :size="14" color="var(--text-muted)" /> +55 (11) 4002-8922
            <CopyButton value="+55 (11) 4002-8922" />
          </span>
        </Field>
      </div>
    </Section>
  </div>
</template>
