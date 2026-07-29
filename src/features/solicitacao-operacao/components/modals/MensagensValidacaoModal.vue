<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Paperclip, MessageSquare, Download, Trash2, FileText } from 'lucide-vue-next';
import type { ItemValidacao, ValidacaoMensagem } from '../../data/operacaoData';

const props = defineProps<{ validacao: ItemValidacao }>();
const emit = defineEmits<{ close: [] }>();

const texto = ref('');
const anexoNome = ref('');
const touched = ref(false);

const mensagens = computed(() => props.validacao.mensagens ?? []);
const showRequired = computed(() => touched.value && !texto.value.trim());
const canPost = computed(() => texto.value.trim().length > 0);

function nowLabel(): string {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  anexoNome.value = file?.name ?? '';
  input.value = '';
}

function removeAnexo() {
  anexoNome.value = '';
}

function postar() {
  touched.value = true;
  if (!canPost.value) return;
  const msg: ValidacaoMensagem = {
    id: `msg-${Date.now()}`,
    autor: 'usuario.atual',
    data: nowLabel(),
    texto: texto.value.trim(),
    anexo: anexoNome.value
      ? { nome: anexoNome.value, arquivo: anexoNome.value }
      : undefined,
  };
  if (!props.validacao.mensagens) props.validacao.mensagens = [];
  props.validacao.mensagens.unshift(msg);
  texto.value = '';
  anexoNome.value = '';
  touched.value = false;
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Mensagens
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ validacao.titulo }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px" class="flex flex-col" :style="{ gap: '28px' }">
        <!-- Composer -->
        <div class="flex" style="gap: 14px">
          <div
            class="flex items-center justify-center"
            style="
              width: 40px;
              height: 40px;
              border-radius: 9999px;
              background: var(--gci-base);
              color: #fff;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
              flex-shrink: 0;
            "
          >
            U
          </div>
          <div style="flex: 1; min-width: 0">
            <label style="font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)">
              Mensagem
            </label>
            <textarea
              v-model="texto"
              rows="3"
              placeholder="Escreva uma mensagem…"
              :style="{
                width: '100%',
                marginTop: '6px',
                padding: '12px 14px',
                border: `1px solid ${showRequired ? 'var(--danger-base)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-lg)',
                outline: 'none',
                resize: 'vertical',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-strong)',
                background: 'var(--surface-card)',
                fontFamily: 'inherit',
              }"
              @blur="touched = true"
            />
            <div class="flex items-center justify-between" style="margin-top: 6px">
              <span
                v-if="showRequired"
                style="font-size: var(--text-xs); color: var(--danger-base); font-weight: var(--weight-semibold)"
              >
                Campo obrigatório
              </span>
              <span v-else />
              <span style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
                {{ texto.length }}
              </span>
            </div>

            <div class="flex items-center justify-between" style="margin-top: 12px; gap: 12px; flex-wrap: wrap">
              <div class="flex flex-col" style="gap: 8px; min-width: 0">
                <label
                  class="flex items-center"
                  style="gap: 8px; cursor: pointer; color: var(--gci-base); font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
                >
                  <Paperclip :size="15" />
                  ANEXAR
                  <input type="file" style="display: none" @change="onFileChange" />
                </label>
                <div
                  v-if="anexoNome"
                  class="flex items-center"
                  style="gap: 8px; font-size: var(--text-xs); color: var(--text-muted); max-width: 360px"
                >
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                    Arquivo selecionado: {{ anexoNome }}
                  </span>
                  <button
                    type="button"
                    aria-label="Remover anexo"
                    style="background: none; border: none; cursor: pointer; color: var(--action-danger-text-only); padding: 0; flex-shrink: 0"
                    @click="removeAnexo"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                class="btn-animated"
                :class="{ 'btn-primary': canPost }"
                :disabled="!canPost"
                :style="{
                  height: '40px',
                  padding: '0 20px',
                  background: canPost ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                  color: canPost ? 'var(--action-primary-text)' : 'var(--text-disabled)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: canPost ? 'pointer' : 'not-allowed',
                  fontWeight: 'var(--weight-bold)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                }"
                @click="postar"
              >
                POSTAR
              </button>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div v-if="mensagens.length" style="position: relative; padding-left: 28px">
          <div
            style="
              position: absolute;
              left: 15px;
              top: 8px;
              bottom: 8px;
              width: 2px;
              background: var(--border-default);
            "
          />
          <div class="flex flex-col" style="gap: 20px">
            <div v-for="m in mensagens" :key="m.id" style="position: relative">
              <div
                class="flex items-center justify-center"
                style="
                  position: absolute;
                  left: -28px;
                  top: 0;
                  width: 32px;
                  height: 32px;
                  border-radius: 9999px;
                  background: var(--gci-base);
                  color: #fff;
                "
              >
                <MessageSquare :size="14" />
              </div>
              <div style="padding-left: 12px">
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 8px">
                  De: {{ m.autor }} · {{ m.data }}
                </div>
                <div
                  style="
                    padding: 14px 16px;
                    border-radius: var(--radius-lg);
                    background: color-mix(in srgb, var(--gci-base) 8%, transparent);
                    border: 1px solid color-mix(in srgb, var(--gci-base) 16%, transparent);
                  "
                >
                  <p style="font-size: var(--text-sm); color: var(--text-strong); margin: 0; line-height: 1.45; white-space: pre-wrap">
                    {{ m.texto }}
                  </p>
                  <div
                    v-if="m.anexo"
                    class="flex items-center"
                    style="
                      gap: 12px;
                      margin-top: 12px;
                      padding: 10px 12px;
                      background: var(--surface-card);
                      border: 1px solid var(--border-default);
                      border-radius: var(--radius-md);
                    "
                  >
                    <FileText :size="18" style="color: var(--gci-base); flex-shrink: 0" />
                    <div style="flex: 1; min-width: 0">
                      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                        {{ m.anexo.nome }}
                      </div>
                      <div style="font-size: var(--text-xs); color: var(--text-muted)">Anexo de mensagem</div>
                    </div>
                    <button
                      type="button"
                      aria-label="Baixar anexo"
                      style="background: none; border: none; cursor: pointer; color: var(--gci-base); padding: 4px"
                    >
                      <Download :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
        >
          Nenhuma mensagem ainda. Seja o primeiro a postar.
        </div>
      </div>
    </div>
  </div>
</template>
