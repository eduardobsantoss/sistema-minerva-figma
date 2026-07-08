<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { NACIONALIDADE_OPTS, ESTADO_CIVIL_OPTS, type Cedente } from '../../data/riscoData';
import { FieldLabel, FormField, SelectField } from '../../screens/detail-tabs/shared';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ close: []; update: [cedente: Cedente] }>();

const isPF = props.cedente.tipo === 'Pessoa Física';

const rg = ref(props.cedente.rg ?? '');
const inscricaoProdutorRural = ref(props.cedente.inscricaoProdutorRural ?? '');
const nacionalidade = ref(props.cedente.nacionalidade ?? '');
const profissao = ref(props.cedente.profissao ?? '');
const estadoCivil = ref(props.cedente.estadoCivil ?? '');

const nomeFantasia = ref(props.cedente.nomeFantasia ?? '');
const tipoEmpresa = ref(props.cedente.tipoEmpresa ?? '');
const porte = ref(props.cedente.porte ?? '');
const atividadePrincipal = ref(props.cedente.atividadePrincipal ?? '');
const naturezaJuridica = ref(props.cedente.naturezaJuridica ?? '');
const inscricaoMunicipal = ref(props.cedente.inscricaoMunicipal ?? '');
const inscricaoEstadual = ref(props.cedente.inscricaoEstadual ?? '');

function handleAtualizar() {
  if (isPF) {
    emit('update', { ...props.cedente, rg: rg.value, inscricaoProdutorRural: inscricaoProdutorRural.value, nacionalidade: nacionalidade.value, profissao: profissao.value, estadoCivil: estadoCivil.value });
  } else {
    emit('update', {
      ...props.cedente, nomeFantasia: nomeFantasia.value, tipoEmpresa: tipoEmpresa.value, porte: porte.value,
      atividadePrincipal: atividadePrincipal.value, naturezaJuridica: naturezaJuridica.value,
      inscricaoMunicipal: inscricaoMunicipal.value, inscricaoEstadual: inscricaoEstadual.value,
    });
  }
}
</script>

<template>
  <div
    style="
      position: fixed; inset: 0;
      background: rgba(8,60,74,0.55); backdrop-filter: blur(8px);
      z-index: 450; display: flex; align-items: center; justify-content: center;
      padding: 32px; animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 760px; max-height: 90vh;
        overflow: hidden; box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between" style="padding: 20px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
          Editar Cadastro
        </h2>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Body -->
      <div style="padding: 24px; overflow: auto">
        <div v-if="isPF" class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 4">
            <FieldLabel>CPF</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.documento || '—' }}
            </div>
          </div>
          <div style="grid-column: span 5">
            <FieldLabel>Nome</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.nome || '—' }}
            </div>
          </div>
          <div style="grid-column: span 3">
            <FormField label="RG" placeholder="—" v-model="rg" />
          </div>

          <div style="grid-column: span 4">
            <FormField label="Inscrição do produtor rural" placeholder="—" v-model="inscricaoProdutorRural" />
          </div>
          <div style="grid-column: span 4">
            <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :value="nacionalidade" @change="nacionalidade = ($event.target as HTMLSelectElement).value" />
          </div>
          <div style="grid-column: span 4">
            <FieldLabel>Data de nascimento</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.dataNascimento || '—' }}
            </div>
          </div>

          <div style="grid-column: span 6">
            <FormField label="Profissão" placeholder="—" v-model="profissao" />
          </div>
          <div style="grid-column: span 6">
            <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" :value="estadoCivil" @change="estadoCivil = ($event.target as HTMLSelectElement).value" />
          </div>
        </div>
        <div v-else class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 4">
            <FieldLabel>CNPJ</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.documento || '—' }}
            </div>
          </div>
          <div style="grid-column: span 5">
            <FieldLabel>Razão Social</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.razaoSocial ?? cedente.nome ?? '—' }}
            </div>
          </div>
          <div style="grid-column: span 3">
            <FormField label="Nome Fantasia" placeholder="—" v-model="nomeFantasia" />
          </div>

          <div style="grid-column: span 4">
            <FieldLabel>Data de abertura</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.dataAbertura || '—' }}
            </div>
          </div>
          <div style="grid-column: span 4">
            <FormField label="Tipo" placeholder="—" v-model="tipoEmpresa" />
          </div>
          <div style="grid-column: span 4">
            <FormField label="Porte" placeholder="—" v-model="porte" />
          </div>

          <div style="grid-column: span 6">
            <FormField label="Atividade principal" placeholder="—" v-model="atividadePrincipal" />
          </div>
          <div style="grid-column: span 6">
            <FormField label="Natureza Jurídica" placeholder="—" v-model="naturezaJuridica" />
          </div>

          <div style="grid-column: span 6">
            <FormField label="Inscrição municipal" placeholder="—" v-model="inscricaoMunicipal" />
          </div>
          <div style="grid-column: span 6">
            <FormField label="Inscrição estadual" placeholder="—" v-model="inscricaoEstadual" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default); flex-shrink: 0">
        <button
          style="height: 40px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 40px; padding: 0 24px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
          @click="handleAtualizar"
        >
          ATUALIZAR
        </button>
      </div>
    </div>
  </div>
</template>
