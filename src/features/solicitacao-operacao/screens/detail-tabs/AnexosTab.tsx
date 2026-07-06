import { Download, FileText, Paperclip, Plus, Trash2 } from 'lucide-react';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section, GhostButton } from './shared';

export function AnexosTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Documentos Anexados" action={<GhostButton icon={Download}>Baixar todos</GhostButton>}>
      {/* Linha de upload */}
      <div className="flex items-center" style={{ gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="flex items-center" style={{ gap: 8, flex: 1, minWidth: 220, height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          <Paperclip size={15} /> Selecionar arquivo...
        </div>
        <div style={{ minWidth: 180, height: 42, padding: '0 14px', display: 'flex', alignItems: 'center', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Tipo</div>
        <button className="flex items-center" style={{ gap: 8, height: 42, padding: '0 18px', background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
          <Plus size={15} /> Inserir
        </button>
      </div>

      <div className="flex flex-col" style={{ gap: 10 }}>
        {det.anexos.map((a) => (
          <div key={a.arquivo} className="flex items-center" style={{ gap: 14, padding: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gci-light)', color: 'var(--gci-base)', flexShrink: 0 }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{a.nome}</span>
                <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: a.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)', color: a.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)', textTransform: 'uppercase' }}>
                  {a.obrigatorio ? 'Obrigatório' : 'Opcional'}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.arquivo}</div>
            </div>
            <button aria-label="Baixar" className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--gci-base)' }}>
              <Download size={15} />
            </button>
            <button aria-label="Excluir" className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}
