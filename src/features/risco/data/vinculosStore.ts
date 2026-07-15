import { ref } from 'vue';
import {
  OPERACOES_VINCULAVEIS_SEED,
  type OperacaoVinculavel,
  type VeiculoOperacao,
} from './riscoData';

function cloneOperacoes(): OperacaoVinculavel[] {
  return OPERACOES_VINCULAVEIS_SEED.map((o) => ({
    ...o,
    agrupamentoIds: [...o.agrupamentoIds],
    grupoIds: [...o.grupoIds],
  }));
}

/** Shared vinculação state across list/detail (mock in-memory). */
export const operacoesVinculaveis = ref<OperacaoVinculavel[]>(cloneOperacoes());

type VeiculoMeta = { taxaCessaoPadrao: number; preferencial: boolean };
/** Preserves taxa/preferencial por grupo+nome ao re-sincronizar vínculos. */
const metaPorGrupoVeiculo = ref<Record<string, VeiculoMeta>>({});

function metaKey(grupoId: string, veiculoNome: string) {
  return `${grupoId}::${veiculoNome}`;
}

export function setOperacoesVinculaveis(ops: OperacaoVinculavel[]) {
  operacoesVinculaveis.value = ops;
}

export function veiculosFromVinculos(grupoId: string): VeiculoOperacao[] {
  return operacoesVinculaveis.value
    .filter((o) => o.grupoIds.includes(grupoId))
    .map((o) => {
      const saved = metaPorGrupoVeiculo.value[metaKey(grupoId, o.nome)];
      return {
        id: `vo-${o.id}`,
        veiculo: o.nome,
        taxaCessaoPadrao: saved?.taxaCessaoPadrao ?? 0,
        preferencial: saved?.preferencial ?? false,
      };
    });
}

export function rememberVeiculosMeta(grupoId: string, veiculos: VeiculoOperacao[]) {
  const linkedNames = new Set(
    operacoesVinculaveis.value.filter((o) => o.grupoIds.includes(grupoId)).map((o) => o.nome),
  );
  for (const v of veiculos) {
    if (!linkedNames.has(v.veiculo)) continue;
    metaPorGrupoVeiculo.value[metaKey(grupoId, v.veiculo)] = {
      taxaCessaoPadrao: v.taxaCessaoPadrao,
      preferencial: v.preferencial,
    };
  }
  // Drop meta for unlinked vehicles
  for (const key of Object.keys(metaPorGrupoVeiculo.value)) {
    if (!key.startsWith(`${grupoId}::`)) continue;
    const nome = key.slice(grupoId.length + 2);
    if (!linkedNames.has(nome)) delete metaPorGrupoVeiculo.value[key];
  }
}

/** Apply ops update for a grupo and return synced preferential vehicles. */
export function applyGrupoVinculos(
  grupoId: string,
  ops: OperacaoVinculavel[],
): VeiculoOperacao[] {
  setOperacoesVinculaveis(ops);
  return veiculosFromVinculos(grupoId);
}
