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

type VeiculoMeta = { taxaCessaoPadrao: number; preferencial: boolean; apto: boolean };
/** Preserves taxa/preferencial/apto por grupo+nome ao re-sincronizar vínculos. */
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

export interface VeiculoApto {
  id: string;
  veiculo: string;
  apto: boolean;
}

/** Veículos vinculados ao grupo com flag apto (para Habilitar para operar). */
export function veiculosAptoFromVinculos(grupoId: string): VeiculoApto[] {
  return operacoesVinculaveis.value
    .filter((o) => o.grupoIds.includes(grupoId))
    .map((o) => {
      const saved = metaPorGrupoVeiculo.value[metaKey(grupoId, o.nome)];
      return {
        id: `vo-${o.id}`,
        veiculo: o.nome,
        apto: saved?.apto ?? false,
      };
    });
}

export function rememberVeiculosApto(grupoId: string, veiculos: VeiculoApto[]) {
  for (const v of veiculos) {
    const key = metaKey(grupoId, v.veiculo);
    const prev = metaPorGrupoVeiculo.value[key];
    metaPorGrupoVeiculo.value[key] = {
      taxaCessaoPadrao: prev?.taxaCessaoPadrao ?? 0,
      preferencial: prev?.preferencial ?? false,
      apto: v.apto,
    };
  }
}

export function rememberVeiculosMeta(grupoId: string, veiculos: VeiculoOperacao[]) {
  const linkedNames = new Set(
    operacoesVinculaveis.value.filter((o) => o.grupoIds.includes(grupoId)).map((o) => o.nome),
  );
  for (const v of veiculos) {
    if (!linkedNames.has(v.veiculo)) continue;
    const prev = metaPorGrupoVeiculo.value[metaKey(grupoId, v.veiculo)];
    metaPorGrupoVeiculo.value[metaKey(grupoId, v.veiculo)] = {
      taxaCessaoPadrao: v.taxaCessaoPadrao,
      preferencial: v.preferencial,
      apto: prev?.apto ?? false,
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
