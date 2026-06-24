import { useState } from 'react';
import { CraListScreen } from './CraListScreen';
import { CraDetailScreen } from './CraDetailScreen';
import { CraOperacaoDetailScreen } from './CraOperacaoDetailScreen';
import { CraTitleDetailScreen } from './CraTitleDetailScreen';
import { CreateCraModal, type NewCraData } from '../components/CreateCraModal';
import { CreateCraOperacaoModal, type NewCraOperacaoData } from '../components/CreateCraOperacaoModal';
import { cras as initialCras, type Cra, type CraOperacao } from '../data/craData';

type Route =
  | { level: 'list' }
  | { level: 'cra'; craId: string }
  | { level: 'operacao'; craId: string; operacaoId: string }
  | { level: 'titulo'; craId: string; operacaoId: string; tituloId: string };

function buildCraFromForm(data: NewCraData): Cra {
  return {
    id: `cra-${Date.now()}`,
    nome: data.nomeFantasia || 'NOVO CRA',
    cnpj: '—',
    cessionaria: '—',
    status: 'EM ANDAMENTO',
    operacoes: [],
  };
}

function buildOperacaoFromForm(data: NewCraOperacaoData): CraOperacao {
  const id = `op-${Date.now()}`;
  return {
    id,
    nome: data.nome || 'NOVA OPERAÇÃO',
    tipo: data.tipoOperacao === 'Mono CRA' ? 'MONO CRA' : 'MULTI CRA',
    numeroEmissao: data.numeroEmissao || '—',
    cessionaria: data.cessionaria || '—',
    prestadorServico: data.prestadorServico || '—',
    custodiante: data.custodiante || '—',
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    partesRelacionadas: { pct: 0, valor: 0 },
    novosSacados: { pct: 0, valor: 0 },
    valorEmissao: parseFloat((data.valorEmissao ?? '').replace(/[^\d,]/g, '').replace(',', '.')) || 0,
    dataEmissao: data.dataEmissao || '',
    dataInicio: data.dataInicio || '',
    dataVencimento: data.dataVencimento || '',
    titulos: [],
  };
}

export function CraScreen() {
  const [route, setRoute] = useState<Route>({ level: 'list' });
  const [creating, setCreating] = useState(false);
  const [creatingOperacao, setCreatingOperacao] = useState(false);
  const [craList, setCraList] = useState<Cra[]>(initialCras);

  const handleCreateCra = (data: NewCraData) => {
    setCraList((prev) => [...prev, buildCraFromForm(data)]);
    setCreating(false);
  };

  const handleCreateOperacao = (data: NewCraOperacaoData) => {
    if (route.level !== 'cra') return;
    const operacao = buildOperacaoFromForm(data);
    setCraList((prev) =>
      prev.map((c) =>
        c.id === route.craId ? { ...c, operacoes: [...c.operacoes, operacao] } : c,
      ),
    );
    setCreatingOperacao(false);
  };

  // ── List ────────────────────────────────────────────────────────
  if (route.level === 'list') {
    return (
      <>
        <CraListScreen
          cras={craList}
          onOpen={(craId) => setRoute({ level: 'cra', craId })}
          onNew={() => setCreating(true)}
        />
        {creating && (
          <CreateCraModal onClose={() => setCreating(false)} onCreate={handleCreateCra} />
        )}
      </>
    );
  }

  const cra = craList.find((c) => c.id === route.craId);
  if (!cra) return null;

  // ── CRA detail ──────────────────────────────────────────────────
  if (route.level === 'cra') {
    return (
      <>
        <CraDetailScreen
          cra={cra}
          onBack={() => setRoute({ level: 'list' })}
          onCreateOperacao={() => setCreatingOperacao(true)}
          onOpenOperacao={(operacaoId) =>
            setRoute({ level: 'operacao', craId: cra.id, operacaoId })
          }
          onOpenTitulo={(operacaoId, tituloId) =>
            setRoute({ level: 'titulo', craId: cra.id, operacaoId, tituloId })
          }
        />
        {creatingOperacao && (
          <CreateCraOperacaoModal
            onClose={() => setCreatingOperacao(false)}
            onCreate={handleCreateOperacao}
          />
        )}
      </>
    );
  }

  const operacao = cra.operacoes.find((o) => o.id === route.operacaoId);
  if (!operacao) return null;

  // ── Operação detail ─────────────────────────────────────────────
  if (route.level === 'operacao') {
    return (
      <CraOperacaoDetailScreen
        cra={cra}
        operacao={operacao}
        onBack={() => setRoute({ level: 'cra', craId: cra.id })}
        onOpenTitulo={(tituloId) =>
          setRoute({ level: 'titulo', craId: cra.id, operacaoId: operacao.id, tituloId })
        }
      />
    );
  }

  // ── Título detail ───────────────────────────────────────────────
  const titulo = operacao.titulos.find((t) => t.id === route.tituloId);
  if (!titulo) return null;

  return (
    <CraTitleDetailScreen
      cra={cra}
      operacao={operacao}
      titulo={titulo}
      onBack={() =>
        setRoute({ level: 'operacao', craId: cra.id, operacaoId: operacao.id })
      }
    />
  );
}
