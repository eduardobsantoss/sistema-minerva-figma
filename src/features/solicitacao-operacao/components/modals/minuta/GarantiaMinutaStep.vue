<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X, Trash2, Shield, Home } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  ToggleRow,
  AddButton,
  EmptyState,
} from '../adicionar-contrato';
import {
  TIPO_GARANTIA_MINUTA_OPTS,
  ZONA_OPTS,
  TIPO_IMOVEL_OPTS,
  TIPO_LOCACAO_OPTS,
  UNIDADE_MEDIDA_OPTS,
  PERIODICIDADE_RELATORIO_OPTS,
  cidadesDaUf,
  emptyGarantiaMinuta,
  type GarantiaMinuta,
  type EstoqueItem,
} from '../../../data/minutaData';

const garantias = defineModel<GarantiaMinuta[]>('garantias', { default: () => [] });

const showNova = ref(false);
const form = reactive<GarantiaMinuta>(emptyGarantiaMinuta());
const estoqueDraft = reactive({ propriedade: '', proprietario: '' });

const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];
const ufOpts = computed(() => ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)));
const cidadeRegistroOpts = computed(() => cidadesDaUf(form.ufRegistro));
const cidadeEnderecoOpts = computed(() => cidadesDaUf(form.estado));

const naturezaLocado = computed({
  get: () => (form.tipoPessoaLocado === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.tipoPessoaLocado = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});
const naturezaProprietario = computed({
  get: () => (form.tipoPessoaProprietario === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.tipoPessoaProprietario = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

watch(
  () => form.ufRegistro,
  () => {
    if (form.cidadeRegistro && !cidadeRegistroOpts.value.includes(form.cidadeRegistro)) {
      form.cidadeRegistro = '';
    }
  },
);
watch(
  () => form.estado,
  () => {
    if (form.cidade && !cidadeEnderecoOpts.value.includes(form.cidade)) {
      form.cidade = '';
    }
  },
);

function openNova() {
  Object.assign(form, emptyGarantiaMinuta());
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
  showNova.value = true;
}

function addEstoque() {
  if (!estoqueDraft.propriedade && !form.nomeImovel) return;
  const item: EstoqueItem = {
    propriedade: estoqueDraft.propriedade || form.nomeImovel,
    proprietario: estoqueDraft.proprietario || form.nomeContratante || '—',
  };
  form.estoques.push(item);
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
}

function removeEstoque(i: number) {
  form.estoques.splice(i, 1);
}

function cadastrar() {
  if (!form.tipo) return;
  const valor = form.areaTotal || form.valor || '—';
  garantias.value = [...garantias.value, { ...JSON.parse(JSON.stringify(form)), valor }];
  showNova.value = false;
}

function removeGarantia(i: number) {
  garantias.value = garantias.value.filter((_, idx) => idx !== i);
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => garantias.value,
  { defaultPageSize: 10 },
);

function globalIndex(pageIdx: number) {
  return (page.value - 1) * pageSize.value + pageIdx;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex justify-end">
      <AddButton @click="openNova">Adicionar garantia</AddButton>
    </div>

    <EmptyState
      v-if="garantias.length === 0"
      :icon="Shield"
      title="Nenhuma garantia adicionada"
      hint="Clique em Adicionar garantia para incluir AF. Estoque ou Penhor de Estoque."
    />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1.4fr 1fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Tipo</div>
        <div>Valor</div>
        <div />
      </div>
      <div
        v-for="(g, pageIdx) in pageItems"
        :key="pageIdx"
        class="grid items-center"
        style="
          grid-template-columns: 1.4fr 1fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
        <div>{{ g.valor || '—' }}</div>
        <button
          aria-label="Remover"
          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
          @click="removeGarantia(globalIndex(pageIdx))"
        >
          <Trash2 :size="14" />
        </button>
      </div>
      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <!-- Sub-modal Nova Garantia -->
    <div
      v-if="showNova"
      style="
        position: fixed;
        inset: 0;
        background: rgba(8, 60, 74, 0.55);
        backdrop-filter: blur(8px);
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
      "
    >
      <div
        style="
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 860px;
          height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        "
        @click.stop
      >
        <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
          <div>
            <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong)">Nova Garantia</h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">AF. Estoque ou Penhor de Estoque</p>
          </div>
          <button
            aria-label="Fechar"
            class="flex items-center justify-center"
            style="
              width: 36px;
              height: 36px;
              border-radius: var(--radius-lg);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click="showNova = false"
          >
            <X :size="18" />
          </button>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 20px">
            <StepGrid>
              <SelectField label="Selecione o tipo" :options="TIPO_GARANTIA_MINUTA_OPTS" placeholder="Selecione" :span="5" v-model="form.tipo" />
            </StepGrid>

            <BentoBox title="Estoque de formação" :icon="Home">
              <div class="flex flex-col" style="gap: 14px">
                <StepGrid>
                  <FormField label="Nome do imóvel" placeholder="—" :span="6" v-model="form.nomeImovel" />
                  <FormField label="Matrícula" placeholder="—" :span="6" v-model="form.matricula" />
                  <SelectField label="Zona" :options="ZONA_OPTS" placeholder="Selecione" :span="3" v-model="form.zona" />
                  <SelectField label="Tipo" :options="TIPO_IMOVEL_OPTS" placeholder="Selecione" :span="3" v-model="form.tipoImovel" />
                  <FormField label="Área total afetada" placeholder="—" :span="3" v-model="form.areaTotal" />
                  <SelectField label="Unidade de medida" :options="UNIDADE_MEDIDA_OPTS" placeholder="Selecione" :span="3" v-model="form.unidadeMedidaArea" />
                  <FormField label="Cartório de registro" placeholder="—" :span="4" v-model="form.cartorioRegistro" />
                  <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
                  <SelectField
                    label="Cidade de registro"
                    :options="cidadeRegistroOpts"
                    placeholder="Selecione"
                    :span="4"
                    :disabled="!form.ufRegistro"
                    v-model="form.cidadeRegistro"
                  />
                </StepGrid>

                <ToggleRow label="Imóvel locado" :on="form.imovelLocado" compact @toggle="form.imovelLocado = !form.imovelLocado" />

                <template v-if="form.imovelLocado">
                  <BentoBox title="Informações da locação">
                    <StepGrid>
                      <SelectField label="Tipo de Locação" :options="TIPO_LOCACAO_OPTS" placeholder="Selecione" required :span="4" v-model="form.tipoLocacao" />
                      <FormField label="Data de início" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataInicio" />
                      <div style="grid-column: span 4; align-self: end">
                        <ToggleRow
                          label="Prazo indeterminado"
                          :on="form.prazoIndeterminado"
                          compact
                          @toggle="form.prazoIndeterminado = !form.prazoIndeterminado"
                        />
                      </div>
                      <FormField
                        v-if="!form.prazoIndeterminado"
                        label="Data de término"
                        placeholder="dd/mm/aaaa"
                        required
                        :span="4"
                        v-model="form.dataTermino"
                      />
                    </StepGrid>
                  </BentoBox>

                  <BentoBox title="Proprietário do imóvel locado">
                    <StepGrid>
                      <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" v-model="naturezaLocado" />
                    </StepGrid>
                  </BentoBox>

                  <BentoBox title="Partes">
                    <StepGrid>
                      <FormField label="Nome do contratante" placeholder="—" :span="6" v-model="form.nomeContratante" />
                      <FormField label="Nome do contratado" placeholder="—" :span="6" v-model="form.nomeContratado" />
                    </StepGrid>
                  </BentoBox>
                </template>
              </div>
            </BentoBox>

            <StepGrid>
              <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
              <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
              <FormField label="Informações adicionais" placeholder="—" :span="5" v-model="form.infoAdicionais" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado" />
              <SelectField
                label="Cidade"
                :options="cidadeEnderecoOpts"
                placeholder="Selecione"
                :span="5"
                :disabled="!form.estado"
                v-model="form.cidade"
              />
              <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais" />
            </StepGrid>

            <BentoBox title="Informações do proprietário da garantia">
              <StepGrid>
                <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" v-model="naturezaProprietario" />
              </StepGrid>
            </BentoBox>

            <div class="flex justify-end">
              <AddButton @click="addEstoque">Adicionar dados do estoque</AddButton>
            </div>

            <BentoBox title="Estoques">
              <div v-if="form.estoques.length === 0" style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
                Nenhum estoque adicionado.
              </div>
              <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                <div
                  class="grid"
                  style="
                    grid-template-columns: 1fr 1fr auto;
                    padding: 10px 14px;
                    background: var(--surface-sunken);
                    font-size: 10px;
                    font-weight: var(--weight-bold);
                    letter-spacing: 0.12em;
                    color: var(--text-muted);
                    text-transform: uppercase;
                  "
                >
                  <div>Propriedade</div>
                  <div>Proprietário</div>
                  <div />
                </div>
                <div
                  v-for="(e, i) in form.estoques"
                  :key="i"
                  class="grid items-center"
                  style="
                    grid-template-columns: 1fr 1fr auto;
                    padding: 10px 14px;
                    border-top: 1px solid var(--border-default);
                    font-size: var(--text-sm);
                  "
                >
                  <div>{{ e.propriedade }}</div>
                  <div>{{ e.proprietario }}</div>
                  <button
                    aria-label="Remover"
                    style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
                    @click="removeEstoque(i)"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </BentoBox>

            <BentoBox title="Informações do relatório">
              <StepGrid>
                <FormField label="Data do relatório" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataRelatorio" />
                <SelectField
                  label="Periodicidade do relatório"
                  :options="PERIODICIDADE_RELATORIO_OPTS"
                  placeholder="Selecione"
                  :span="4"
                  v-model="form.periodicidadeRelatorio"
                />
                <FormField label="Data da primeira atualização" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataPrimeiraAtualizacao" />
              </StepGrid>
            </BentoBox>
          </div>
        </div>

        <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default)">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="showNova = false"
          >
            Cancelar
          </button>
          <button
            class="flex items-center"
            :style="{
              height: '44px',
              padding: '0 24px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: form.tipo ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: form.tipo ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: form.tipo ? '#fff' : 'var(--text-disabled)',
            }"
            :disabled="!form.tipo"
            @click="cadastrar"
          >
            CADASTRAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
