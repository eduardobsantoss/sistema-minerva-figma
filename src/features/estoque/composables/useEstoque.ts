import { computed, ref } from 'vue';
import {
  CONTRATO_STATUS,
  estoqueSeed,
  todayIso,
  type EstoqueContrato,
  type EstoqueImovel,
  type EstoqueMonitoramento,
  type NovoImovelInput,
  type VeiculoRef,
} from '../data/estoqueData';

/**
 * Estoque de imóveis dos veículos (CRA/FIDC). Estado único do protótipo:
 * a aba do veículo, o relatório consolidado e "Executar garantia" leem e gravam aqui.
 */
const imoveis = ref<EstoqueImovel[]>(estoqueSeed());
let seq = 0;

function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

function patch(id: string, fn: (i: EstoqueImovel) => EstoqueImovel) {
  imoveis.value = imoveis.value.map((i) => (i.id === id ? fn(i) : i));
}

export function useEstoque() {
  const todos = computed(() => imoveis.value);

  function get(id: string): EstoqueImovel | undefined {
    return imoveis.value.find((i) => i.id === id);
  }

  function doVeiculo(veiculo: Pick<VeiculoRef, 'tipo' | 'id'>): EstoqueImovel[] {
    return imoveis.value.filter((i) => i.veiculoTipo === veiculo.tipo && i.veiculoId === veiculo.id);
  }

  function foiExecutada(garantiaId: string): EstoqueImovel | undefined {
    return imoveis.value.find((i) => i.garantiaOrigem?.garantiaId === garantiaId);
  }

  function add(input: NovoImovelInput): EstoqueImovel {
    const novo: EstoqueImovel = {
      ...input,
      id: nextId('imv'),
      monitoramentos: [],
      criadoEm: todayIso(),
    };
    imoveis.value = [novo, ...imoveis.value];
    return novo;
  }

  function update(id: string, input: NovoImovelInput) {
    patch(id, (i) => ({ ...i, ...input }));
  }

  function remove(id: string) {
    imoveis.value = imoveis.value.filter((i) => i.id !== id);
  }

  function addMonitoramento(id: string, data: Omit<EstoqueMonitoramento, 'id'>) {
    patch(id, (i) => ({
      ...i,
      monitoramentos: [{ ...data, id: nextId('mon') }, ...i.monitoramentos],
    }));
  }

  /** Grava o contrato e leva o status do imóvel para o que o contrato implica (vendido, locado, arrendado). */
  function setContrato(id: string, contrato: EstoqueContrato) {
    patch(id, (i) => ({ ...i, contrato, status: CONTRATO_STATUS[contrato.tipo] }));
  }

  /** Baixa manual: não há conciliação bancária, quem recebe lança aqui. */
  function baixarParcela(imovelId: string, parcelaId: string, valor: number, data: string) {
    patch(imovelId, (i) => {
      if (!i.contrato) return i;
      return {
        ...i,
        contrato: {
          ...i.contrato,
          parcelas: i.contrato.parcelas.map((p) =>
            p.id === parcelaId
              ? {
                  ...p,
                  valorPago: Math.round((p.valorPago + valor) * 100) / 100,
                  baixas: [...p.baixas, { id: nextId('baixa'), data, valor }],
                }
              : p,
          ),
        },
      };
    });
  }

  return {
    imoveis: todos,
    get,
    doVeiculo,
    foiExecutada,
    add,
    update,
    remove,
    addMonitoramento,
    setContrato,
    baixarParcela,
  };
}
