<script setup lang="ts">
import { computed, ref } from 'vue';
import { STATUS_OPERACAO_OPTS, type StatusOperacao } from '../../data/gruposCadastroData';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ grupoNome: string; statusAtual: StatusOperacao }>();
const emit = defineEmits<{ close: []; confirm: [status: StatusOperacao] }>();

const status = ref<StatusOperacao>(props.statusAtual);
const canConfirm = computed(() => status.value !== props.statusAtual);
</script>

<template>
  <AdminModal :width="440" eyebrow="Grupos empresariais" title="Editar status de operação" :subtitle="grupoNome" @close="emit('close')">

    <div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
        Status atual
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-default); margin-bottom: 18px">{{ statusAtual }}</div>

      <label style="display: block">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
          Novo status
        </div>
        <AdminSelect v-model="status" :options="[...STATUS_OPERACAO_OPTS.map((opt) => ({ value: opt, label: opt }))]" />
      </label>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canConfirm" @click="emit('confirm', status)" type="button">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
