import { useState } from 'react';
import { Plus, Gauge, Pencil } from 'lucide-react';
import { RATINGS_SEED, fmtPct, type Rating } from '../data/riscoData';
import { CreateRatingModal } from '../components/modals/CreateRatingModal';

const COLS = '1fr 1fr 1fr auto';

export function RatingsScreen() {
  const [ratings, setRatings] = useState<Rating[]>(RATINGS_SEED);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Rating | null>(null);

  const handleCreate = (data: { nome: string; taxa: number }) => {
    setRatings((prev) => [
      ...prev,
      { id: `rating-${Date.now()}`, nome: data.nome, taxa: data.taxa, criadoEm: new Date().toLocaleDateString('pt-BR') },
    ]);
    setCreating(false);
  };

  const handleEdit = (data: { nome: string; taxa: number }) => {
    if (!editing) return;
    setRatings((prev) => prev.map((r) => (r.id === editing.id ? { ...r, nome: data.nome, taxa: data.taxa } : r)));
    setEditing(null);
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
            Ratings
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {ratings.length} {ratings.length === 1 ? 'rating cadastrado' : 'ratings cadastrados'}
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
          NOVO RATING
        </button>
      </div>

      {/* Tabela */}
      {ratings.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--surface-card)' }}>
          <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Nome</div><div>Taxa</div><div>Criado em</div><div style={{ textAlign: 'right' }}>Ações</div>
          </div>
          {ratings.map((r) => (
            <div key={r.id} className="grid items-center" style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{r.nome}</div>
              <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-default)' }}>{fmtPct(r.taxa)}</div>
              <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{r.criadoEm}</div>
              <div className="flex justify-end">
                <button
                  aria-label="Editar rating"
                  onClick={() => setEditing(r)}
                  className="flex items-center justify-center"
                  style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'none', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && <CreateRatingModal onClose={() => setCreating(false)} onSave={handleCreate} />}
      {editing && <CreateRatingModal initial={editing} onClose={() => setEditing(null)} onSave={handleEdit} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Gauge size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>Nenhum rating cadastrado</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>Use "Novo rating" para cadastrar o primeiro indicativo de rating do cliente.</div>
    </div>
  );
}
