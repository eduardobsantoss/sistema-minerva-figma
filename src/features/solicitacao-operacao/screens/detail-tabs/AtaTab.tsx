import { MessageSquare, Paperclip, Send, User } from 'lucide-react';
import { Section, EmptyState } from './shared';

export function AtaTab() {
  return (
    <Section title="Ata de Deliberação">
      <div className="flex" style={{ gap: 14 }}>
        <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: '9999px', background: 'var(--gci-light)', color: 'var(--gci-base)', flexShrink: 0, fontWeight: 'var(--weight-bold)' }}>
          <User size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            placeholder="Escreva uma mensagem para a ata de deliberação..."
            rows={3}
            style={{ width: '100%', padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', resize: 'vertical', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontFamily: 'inherit' }}
          />
          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            <button className="flex items-center" style={{ gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em' }}>
              <Paperclip size={15} /> ANEXAR
            </button>
            <button className="flex items-center" style={{ gap: 8, height: 40, padding: '0 18px', background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
              <Send size={14} /> Postar
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <EmptyState icon={MessageSquare} title="Nenhuma mensagem ainda" hint="As deliberações e comentários do time aparecerão aqui em ordem cronológica." />
      </div>
    </Section>
  );
}
