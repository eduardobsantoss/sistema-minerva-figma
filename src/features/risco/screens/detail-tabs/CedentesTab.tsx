import { useState } from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Users } from 'lucide-react';
import type { Cedente } from '../../data/riscoData';
import { EmptyState } from './shared';
import { CedenteDetailModal } from '../../components/modals/CedenteDetailModal';

interface Props {
  cedentes: Cedente[];
  onUpdateCedente: (cedente: Cedente) => void;
}

const COLS = '1.2fr 1.8fr 1.6fr 1fr 1fr';

export function CedentesTab({ cedentes, onUpdateCedente }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const selecionado = cedentes.find((c) => c.id === selecionadoId) ?? null;

  const totalPages = Math.max(1, Math.ceil(cedentes.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = cedentes.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  if (cedentes.length === 0) {
    return <EmptyState icon={Users} title="Nenhum cedente vinculado" hint="Este grupo ainda não possui cedentes cadastrados." />;
  }

  return (
    <>
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        <div>Documento</div><div>Nome</div><div>E-mail</div><div>Cidade-UF</div><div>Tipo</div>
      </div>
      {pageItems.map((c) => (
        <div
          key={c.id}
          onClick={() => setSelecionadoId(c.id)}
          className="grid items-center"
          style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{c.documento}</div>
          <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{c.nome}</div>
          <div style={{ color: c.email ? 'var(--text-default)' : 'var(--text-muted)' }}>{c.email ?? 'Não cadastrado'}</div>
          <div style={{ color: 'var(--text-default)' }}>{c.cidade}-{c.uf}</div>
          <div style={{ color: 'var(--text-default)' }}>{c.tipo}</div>
        </div>
      ))}

      <div className="flex items-center justify-between" style={{ padding: '12px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span>Itens por página</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            style={{ height: 30, padding: '0 8px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', color: 'var(--text-default)', fontSize: 'var(--text-xs)' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center" style={{ gap: 14 }}>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {(clampedPage - 1) * pageSize + 1}–{Math.min(clampedPage * pageSize, cedentes.length)} de {cedentes.length}
          </span>
          <div className="flex items-center" style={{ gap: 4 }}>
            <PageButton onClick={() => setPage(1)} disabled={clampedPage === 1}><ChevronsLeft size={14} /></PageButton>
            <PageButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1}><ChevronLeft size={14} /></PageButton>
            <PageButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages}><ChevronRight size={14} /></PageButton>
            <PageButton onClick={() => setPage(totalPages)} disabled={clampedPage === totalPages}><ChevronsRight size={14} /></PageButton>
          </div>
        </div>
      </div>
    </div>

    {selecionado && (
      <CedenteDetailModal
        cedente={selecionado}
        onClose={() => setSelecionadoId(null)}
        onUpdate={onUpdateCedente}
      />
    )}
    </>
  );
}

function PageButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center"
      style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: disabled ? 'not-allowed' : 'pointer', color: disabled ? 'var(--text-disabled)' : 'var(--text-muted)' }}
    >
      {children}
    </button>
  );
}
