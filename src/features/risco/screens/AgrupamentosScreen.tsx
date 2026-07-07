import { useState } from 'react';
import { Plus, Layers, Pencil, Trash2 } from 'lucide-react';
import {
  AGRUPAMENTOS_SEED, OPERACOES_VINCULAVEIS_SEED, contarVinculos,
  type Agrupamento, type OperacaoVinculavel,
} from '../data/riscoData';
import { CreateAgrupamentoModal } from '../components/modals/CreateAgrupamentoModal';
import { DeleteAgrupamentoModal } from '../components/modals/DeleteAgrupamentoModal';
import { VincularAgrupamentoModal } from '../components/modals/VincularAgrupamentoModal';

const COLS = '2fr 0.8fr 0.8fr 0.8fr 1fr auto';

export function AgrupamentosScreen() {
  const [agrupamentos, setAgrupamentos] = useState<Agrupamento[]>(AGRUPAMENTOS_SEED);
  const [operacoes, setOperacoes] = useState<OperacaoVinculavel[]>(OPERACOES_VINCULAVEIS_SEED);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Agrupamento | null>(null);
  const [deleting, setDeleting] = useState<Agrupamento | null>(null);
  const [vinculando, setVinculando] = useState<Agrupamento | null>(null);

  const handleCreate = (nome: string) => {
    setAgrupamentos((prev) => [
      ...prev,
      { id: `agp-${Date.now()}`, nome, cras: 0, fidcs: 0, criadoEm: new Date().toLocaleDateString('pt-BR') },
    ]);
    setCreating(false);
  };

  const handleRename = (nome: string) => {
    if (!editing) return;
    setAgrupamentos((prev) => prev.map((a) => (a.id === editing.id ? { ...a, nome } : a)));
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setAgrupamentos((prev) => prev.filter((a) => a.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Identificação + ação primária */}
      <div className="flex items-center justify-between" style={{ gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 'var(--weight-bold)', marginBottom: 6 }}>
            Cadastro Global · Risco
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Agrupamentos de Limite
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {agrupamentos.length} {agrupamentos.length === 1 ? 'agrupamento cadastrado' : 'agrupamentos cadastrados'}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center"
          style={{
            gap: 8, height: 48, padding: '0 22px',
            background: 'var(--agro-base)', color: '#fff',
            borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
            boxShadow: '0 10px 24px -8px rgba(242,125,38,0.40)', transition: 'background var(--duration-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--agro-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--agro-base)')}
        >
          <span className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: '9999px', background: 'rgba(255,255,255,0.20)' }}>
            <Plus size={14} />
          </span>
          NOVO AGRUPAMENTO
        </button>
      </div>

      {/* Tabela */}
      {agrupamentos.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--surface-card)' }}>
          <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Agrupamento</div><div>CRAs</div><div>FIDCs</div><div>Total</div><div>Criado em</div><div style={{ textAlign: 'right' }}>Ações</div>
          </div>
          {agrupamentos.map((a) => {
            const { cras, fidcs, total } = contarVinculos(a.id, operacoes);
            return (
              <div
                key={a.id}
                onClick={() => setVinculando(a)}
                className="grid items-center"
                style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{a.nome}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-default)' }}>{cras}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-default)' }}>{fidcs}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{total}</div>
                <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{a.criadoEm}</div>
                <div className="flex items-center justify-end" style={{ gap: 8 }}>
                  <button
                    aria-label="Renomear agrupamento"
                    onClick={(e) => { e.stopPropagation(); setEditing(a); }}
                    className="flex items-center justify-center"
                    style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'none', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    aria-label="Excluir agrupamento"
                    onClick={(e) => { e.stopPropagation(); setDeleting(a); }}
                    className="flex items-center justify-center"
                    style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'none', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--action-danger-text-only)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && <CreateAgrupamentoModal onClose={() => setCreating(false)} onSave={handleCreate} />}
      {editing && <CreateAgrupamentoModal initial={editing} onClose={() => setEditing(null)} onSave={handleRename} />}
      {deleting && <DeleteAgrupamentoModal agrupamento={deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} />}
      {vinculando && (
        <VincularAgrupamentoModal
          agrupamento={vinculando}
          agrupamentos={agrupamentos}
          operacoes={operacoes}
          onUpdateOperacoes={setOperacoes}
          onClose={() => setVinculando(null)}
          onEdit={() => { setEditing(vinculando); setVinculando(null); }}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Layers size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>Nenhum agrupamento cadastrado</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>Use "Novo agrupamento" para cadastrar o primeiro agrupamento de limite.</div>
    </div>
  );
}
