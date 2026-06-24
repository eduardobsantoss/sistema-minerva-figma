import { useState } from 'react';
import {
  ArrowLeft, FileText, TrendingUp, AlertCircle, Search, Filter, Settings2,
} from 'lucide-react';
import { brl, num, type Cra, type CraOperacao, type CraTitulo } from '../data/craData';

interface Props {
  cra: Cra;
  operacao: CraOperacao;
  onBack: () => void;
  onOpenTitulo: (tituloId: string) => void;
}

export function CraOperacaoDetailScreen({ cra, operacao, onBack, onOpenTitulo }: Props) {
  const [q, setQ] = useState('');
  const [showColPanel, setShowColPanel] = useState(false);

  const filtered = operacao.titulos.filter(
    (t) =>
      !q ||
      t.numero.includes(q) ||
      t.cedente.toLowerCase().includes(q.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.toLowerCase()),
  );

  // All titles in this operação belong to classe 1
  const classMap: Record<string, string> = Object.fromEntries(
    operacao.titulos.map((t) => [t.operacaoId, '1']),
  );

  const statusStyle = (s: CraTitulo['status']) => ({
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE:   { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
    VENCIDO:    { bg: 'var(--danger-light)',  fg: 'var(--danger-base)' },
  }[s]);

  const cols = '0.5fr 0.8fr 0.6fr 1.4fr 1.4fr 0.7fr 0.9fr 0.65fr';

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={onBack} aria-label="Voltar" className="flex items-center justify-center" style={{
          width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
          cursor: 'pointer', color: 'var(--text-strong)',
        }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 4 }}>
            {cra.nome}
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {operacao.nome}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {operacao.tipo} · {operacao.cessionaria}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { icon: TrendingUp, label: 'Valor de Emissão', value: brl(operacao.valorEmissao), tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
          { icon: FileText,   label: 'Valor em Carteira', value: brl(operacao.carteira.valor), tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
          { icon: AlertCircle,label: 'Valor Vencido',    value: brl(operacao.vencido.valor),   tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
          { icon: FileText,   label: 'Títulos Ativos',   value: num(operacao.carteira.titulos), tone: { bg: '#EEF0FF', fg: '#4F46E5' } },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="flex items-center" style={{ gap: 14, padding: 16, background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-xl)' }}>
              <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }}>
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Titles panel */}
      <div style={{ background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div className="flex items-center" style={{ gap: 16, padding: 20, borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', color: 'var(--gci-base)' }}>
            <FileText size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>Títulos da Operação</div>
            <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>
              {operacao.titulos.length} títulos cadastrados
            </div>
          </div>
          <div className="flex items-center" style={{ gap: 6, position: 'relative' }}>
            <button aria-label="Colunas" onClick={() => setShowColPanel((v) => !v)} className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Settings2 size={16} />
            </button>
            <button aria-label="Filtros" className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Filter size={16} />
            </button>
            {showColPanel && (
              <>
                <div onClick={() => setShowColPanel(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                <div style={{ position: 'absolute', top: 48, right: 0, zIndex: 20, background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 16, minWidth: 200, boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Colunas visíveis</div>
                  {['Classe', 'Nº Título', 'Tipo', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'].map((c) => (
                    <label key={c} className="flex items-center" style={{ gap: 10, cursor: 'pointer', marginBottom: 8 }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gci-base)', width: 14, height: 14 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{c}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-default)' }}>
          <div className="relative" style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por número, cedente ou sacado..."
              style={{ width: '100%', height: 44, paddingLeft: 44, paddingRight: 16, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }} />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Nenhum título encontrado.</div>
        ) : (
          <div>
            <div className="grid" style={{ gridTemplateColumns: cols, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Classe</div>
              <div>Nº Título</div>
              <div>Tipo</div>
              <div>Cedente</div>
              <div>Sacado</div>
              <div>Vencimento</div>
              <div>VR. Nominal</div>
              <div style={{ textAlign: 'right' }}>Status</div>
            </div>
            {filtered.map((r) => {
              const sc = statusStyle(r.status);
              const classeNum = classMap[r.operacaoId] ?? '1';
              return (
                <div key={r.id} onClick={() => onOpenTitulo(r.id)} className="grid items-center" style={{ gridTemplateColumns: cols, padding: '16px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--status-neutral-bg)', color: 'var(--status-neutral-text)' }}>
                      {classeNum}
                    </span>
                  </div>
                  <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>#{r.numero}</div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 7px', borderRadius: 'var(--radius-sm)', background: 'var(--gci-light)', color: 'var(--gci-base)' }}>{r.tipo}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.cedente}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{r.cedenteCnpj}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.sacado}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{r.sacadoCnpj}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{r.vencimento}</div>
                  <div style={{ fontWeight: 'var(--weight-bold)', color: r.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(r.vrNominal)}</div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 8px', borderRadius: '9999px', background: sc.bg, color: sc.fg }}>{r.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Exibindo <span style={{ color: 'var(--text-strong)' }}>{filtered.length}</span> de <span style={{ color: 'var(--text-strong)' }}>{operacao.titulos.length}</span> registros
          </div>
        </div>
      </div>
    </div>
  );
}
