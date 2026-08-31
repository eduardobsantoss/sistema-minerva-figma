<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { MoreVertical, Pencil, Trash2, X } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import type { EstoqueItem } from '@/features/solicitacao-operacao/data/minutaData';

const props = defineProps<{ items: EstoqueItem[] }>();
const emit = defineEmits<{ update: [items: EstoqueItem[]] }>();

const menuOpen = ref<number | null>(null);
const showEdit = ref(false);
const editingIndex = ref<number | null>(null);
const draft = reactive({ propriedade: '', proprietario: '' });

function closeMenu() {
  menuOpen.value = null;
}

function toggleMenu(i: number) {
  menuOpen.value = menuOpen.value === i ? null : i;
}

function onClickOutside(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (t?.closest('[data-estoque-row-menu]')) return;
  closeMenu();
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));

function openEdit(i: number) {
  closeMenu();
  editingIndex.value = i;
  draft.propriedade = props.items[i]?.propriedade ?? '';
  draft.proprietario = props.items[i]?.proprietario ?? '';
  showEdit.value = true;
}

function closeEdit() {
  showEdit.value = false;
  editingIndex.value = null;
}

function saveEdit() {
  if (editingIndex.value == null) return;
  const next = [...props.items];
  next[editingIndex.value] = {
    propriedade: draft.propriedade.trim(),
    proprietario: draft.proprietario.trim(),
  };
  emit('update', next);
  closeEdit();
}

function remove(i: number) {
  closeMenu();
  emit('update', props.items.filter((_, idx) => idx !== i));
}
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; background: var(--surface-card)">
    <div
      class="grid items-center"
      style="grid-template-columns: 1fr 1fr 48px; padding: 10px 14px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase"
    >
      <div>Propriedade</div>
      <div>Proprietário</div>
      <div style="text-align: right">Ações</div>
    </div>

    <div
      v-if="items.length === 0"
      style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      Não foi encontrado nenhum resultado.
    </div>

    <div
      v-for="(item, i) in items"
      :key="`${item.propriedade}-${i}`"
      class="grid items-center"
      style="grid-template-columns: 1fr 1fr 48px; padding: 12px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ item.propriedade }}</div>
      <div style="color: var(--text-default)">{{ item.proprietario }}</div>
      <div class="flex justify-end" style="position: relative" data-estoque-row-menu>
        <button
          type="button"
          aria-label="Ações"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click.stop="toggleMenu(i)"
        >
          <MoreVertical :size="15" />
        </button>
        <div
          v-if="menuOpen === i"
          class="flex flex-col"
          style="position: absolute; top: 36px; right: 0; z-index: 50; min-width: 160px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
        >
          <button
            type="button"
            class="flex items-center estoque-action-item"
            style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
            @click="openEdit(i)"
          >
            <Pencil :size="14" style="color: var(--text-muted); flex-shrink: 0" />
            Editar
          </button>
          <button
            type="button"
            class="flex items-center estoque-action-item"
            style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
            @click="remove(i)"
          >
            <Trash2 :size="14" style="flex-shrink: 0" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showEdit"
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 520; background: rgba(15, 23, 42, 0.45); padding: 24px"
    @click.self="closeEdit"
  >
    <div
      style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 18px 22px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); margin: 0">
          Editar item do estoque
        </h3>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="closeEdit"
        >
          <X :size="16" />
        </button>
      </div>
      <div class="flex flex-col" style="gap: 14px; padding: 22px">
        <FormField v-model="draft.propriedade" label="Propriedade" placeholder="—" />
        <FormField v-model="draft.proprietario" label="Proprietário" placeholder="—" />
      </div>
      <div class="flex items-center justify-end" style="gap: 10px; padding: 16px 22px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 40px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="closeEdit"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="height: 40px; padding: 0 18px; background: var(--gci-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="saveEdit"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.estoque-action-item:hover {
  background: var(--surface-sunken);
}
</style>
