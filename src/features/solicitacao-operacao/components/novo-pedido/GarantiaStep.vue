<script setup lang="ts">
import { Shield, ShieldCheck } from 'lucide-vue-next';
import type { GarantiaItem } from './types';
import FieldLabel from './FieldLabel.vue';
import SelectField from './SelectField.vue';
import AddButton from './AddButton.vue';
import DataTable from './DataTable.vue';
import Switch from './Switch.vue';
import SectionGroup from './SectionGroup.vue';

defineProps<{
  requer: boolean;
  itens: GarantiaItem[];
  gForm: GarantiaItem;
}>();
const emit = defineEmits<{ toggleRequer: []; add: []; remove: [i: number] }>();

const TIPO_GARANTIA_OPTS = ['Penhor Agrícola', 'Alienação Fiduciária', 'Aval', 'Hipoteca', 'CPR Física'];

const cols: { key: keyof GarantiaItem; label: string; width: string }[] = [
  { key: 'tipo', label: 'Tipo', width: '1fr' },
  { key: 'nome', label: 'Nome', width: '1.6fr' },
  { key: 'valor', label: 'Valor', width: '1fr' },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <!-- Toggle em destaque -->
    <div
      class="flex items-center justify-between"
      :style="{
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: requer ? 'var(--gci-base)' : 'var(--border-default)',
        background: requer ? 'var(--gci-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }"
      @click="emit('toggleRequer')"
    >
      <div class="flex items-center" style="gap: 12px">
        <Shield :size="20" :color="requer ? 'var(--gci-base)' : 'var(--text-muted)'" />
        <div>
          <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
            Requer garantia
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Ative para vincular garantias reais ou fidejussórias à operação.
          </div>
        </div>
      </div>
      <Switch :on="requer" />
    </div>

    <!-- Empty state orientativo -->
    <div
      v-if="!requer"
      class="flex flex-col items-center justify-center"
      style="gap: 12px; padding: 48px 24px; text-align: center"
    >
      <div
        class="flex items-center justify-center"
        style="width: 64px; height: 64px; border-radius: 9999px; background: var(--surface-sunken); color: var(--neutral-400)"
      >
        <Shield :size="28" :stroke-width="1.5" />
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted); max-width: 360px; line-height: 1.5">
        Esta operação não requer garantia. Clique em
        <strong style="color: var(--text-default)">"Próxima etapa"</strong> para continuar.
      </div>
    </div>

    <template v-else>
      <SectionGroup title="Adicionar garantia" :icon="ShieldCheck">
        <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr 1fr auto; gap: 12px">
          <div>
            <FieldLabel>Tipo de garantia</FieldLabel>
            <SelectField :options="TIPO_GARANTIA_OPTS" placeholder="Selecione" v-model="gForm.tipo" />
          </div>
          <div>
            <FieldLabel>Nome da garantia</FieldLabel>
            <input
              v-model="gForm.nome"
              placeholder="Ex: Penhor Safra 2026"
              style="
                width: 100%;
                height: 40px;
                padding: 0 14px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                outline: none;
                font-size: var(--text-sm);
                color: var(--text-strong);
              "
            />
          </div>
          <div>
            <FieldLabel>Valor da garantia</FieldLabel>
            <input
              v-model="gForm.valor"
              placeholder="R$ 0,00"
              style="
                width: 100%;
                height: 40px;
                padding: 0 14px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                outline: none;
                font-size: var(--text-sm);
                color: var(--text-strong);
              "
            />
          </div>
          <AddButton @click="emit('add')" />
        </div>
      </SectionGroup>

      <DataTable :cols="cols" :rows="itens" empty="Nenhuma garantia adicionada." @remove="emit('remove', $event)" />
    </template>
  </div>
</template>
