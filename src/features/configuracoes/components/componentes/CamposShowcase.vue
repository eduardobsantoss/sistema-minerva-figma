<script setup lang="ts">
import { ref } from 'vue';
import ShowcaseSection from './ShowcaseSection.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const textValue = ref('');
const selectValue = ref('');
const dateValue = ref('');
const checked = ref(true);
const switchOn = ref(true);
const segment = ref('lista');

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)' as const,
  letterSpacing: '0.10em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
};
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Text / Select / Date"
      description="Label 10px uppercase bold muted. Input altura 38px, --radius-lg, --text-sm."
      token="padrão Relatórios / formulários"
    >
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px">
        <div>
          <div :style="labelStyle">Nome</div>
          <input v-model="textValue" type="text" placeholder="Ex.: Grupo Agro" :style="inputStyle" />
        </div>
        <div>
          <div :style="labelStyle">Status</div>
          <select v-model="selectValue" :style="inputStyle">
            <option value="">Selecione</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Data</div>
          <input v-model="dateValue" type="date" :style="inputStyle" />
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Checkbox"
      description="Componente compartilhado Checkbox (16px, --gci-base quando marcado)."
      token="Checkbox.vue"
    >
      <div class="flex items-center" style="gap: 10px">
        <Checkbox :checked="checked" @change="checked = !checked" />
        <span style="font-size: var(--text-sm); color: var(--text-default)">
          Aceito os termos da operação
        </span>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Switch"
      description="Toggle inline no padrão ToggleRow (pill 36×20)."
      token="padrão ToggleRow"
    >
      <button
        type="button"
        class="flex items-center"
        style="gap: 12px; background: none; border: none; cursor: pointer; padding: 0"
        @click="switchOn = !switchOn"
      >
        <span
          :style="{
            width: '36px',
            height: '20px',
            borderRadius: 'var(--radius-full)',
            background: switchOn ? 'var(--gci-base)' : 'var(--neutral-300)',
            position: 'relative',
            transition: 'background var(--duration-base) var(--ease-standard)',
            flexShrink: 0,
          }"
        >
          <span
            :style="{
              position: 'absolute',
              top: '2px',
              left: switchOn ? '18px' : '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: 'var(--shadow-xs)',
              transition: 'left var(--duration-base) var(--ease-standard)',
            }"
          />
        </span>
        <span style="font-size: var(--text-sm); color: var(--text-default)">
          Operação para quitação de vencidos
        </span>
      </button>
    </ShowcaseSection>

    <ShowcaseSection
      title="Segmented toggle"
      description="Abas nível 1 / toggle de vista. Componente SegmentedToggle."
      token="SegmentedToggle.vue"
    >
      <SegmentedToggle
        v-model="segment"
        :options="[
          { key: 'lista', label: 'Lista' },
          { key: 'cards', label: 'Cards' },
          { key: 'mapa', label: 'Mapa' },
        ]"
      />
    </ShowcaseSection>

    <ShowcaseSection
      title="Estado de erro"
      description="Borda --danger-base + texto de erro --text-xs abaixo do campo."
    >
      <div style="max-width: 280px">
        <div :style="labelStyle">Número da solicitação</div>
        <input
          type="text"
          value="abc"
          :style="{ ...inputStyle, borderColor: 'var(--danger-base)' }"
          readonly
        />
        <div style="font-size: var(--text-xs); color: var(--danger-base); margin-top: 6px; line-height: 1.4">
          Informe apenas números.
        </div>
      </div>
    </ShowcaseSection>
  </div>
</template>
