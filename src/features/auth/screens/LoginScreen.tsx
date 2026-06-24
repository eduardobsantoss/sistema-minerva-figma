import { useState, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import logoSrc from '@/assets/logo-azul-sem-bg.png';

const HERO_IMG =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop';

interface Props {
  onSubmit: () => void;
}

export function LoginScreen({ onSubmit }: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const inputBase: React.CSSProperties = {
    background: 'var(--surface-sunken)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    borderRadius: 'var(--radius-xl)',
    height: 50,
    color: 'var(--text-strong)',
  };

  const focusStyle: React.CSSProperties = {
    borderColor: 'var(--gci-base)',
    boxShadow: '0 0 0 4px rgba(8,60,74,0.06)',
  };

  return (
    <div
      className="grid h-full w-full"
      style={{ gridTemplateColumns: '560px 1fr', background: 'var(--surface-page)' }}
    >
      {/* Coluna esquerda */}
      <div
        className="flex flex-col"
        style={{
          background: 'var(--surface-card)',
          padding: '56px 64px 48px',
        }}
      >
        <div style={{ marginBottom: 'auto' }}>
          <ImageWithFallback
            src={logoSrc}
            alt="Grupo Ceres Investimentos"
            style={{ height: 96, width: 'auto', objectFit: 'contain' }}
          />
        </div>

        <form onSubmit={handle} style={{ maxWidth: 384, width: '100%', marginTop: 'auto' }}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Acesso Interno
          </h1>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 32,
            }}
          >
            Bem-vindo à plataforma interna do Grupo Ceres. Acesse para gerenciar as operações do
            agronegócio.
          </p>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 'var(--weight-bold)',
                color: 'var(--neutral-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}
            >
              E-mail corporativo
            </label>
            <div className="relative">
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--neutral-400)',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="exemplo@empresa.com.br"
                style={{
                  ...inputBase,
                  ...(focused === 'email' ? focusStyle : {}),
                  width: '100%',
                  paddingLeft: 44,
                  paddingRight: 16,
                  outline: 'none',
                  fontSize: 'var(--text-base)',
                  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
                }}
              />
            </div>
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--neutral-400)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Senha
              </label>
              <a
                href="#"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--gci-base)',
                  fontWeight: 'var(--weight-bold)',
                  textDecoration: 'none',
                }}
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--neutral-400)',
                }}
              />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                style={{
                  ...inputBase,
                  ...(focused === 'password' ? focusStyle : {}),
                  width: '100%',
                  paddingLeft: 44,
                  paddingRight: 44,
                  outline: 'none',
                  fontSize: 'var(--text-base)',
                  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--neutral-400)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label="Mostrar senha"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="group"
            style={{
              width: '100%',
              height: 48,
              borderRadius: 'var(--radius-xl)',
              background: 'var(--action-primary-bg)',
              color: 'var(--action-primary-text)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-base)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 10px 24px -8px rgba(8,60,74,0.18)',
              transition: 'background var(--duration-base)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--action-primary-bg-hover)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--action-primary-bg)')}
          >
            Entrar no Sistema
            <ChevronRight size={18} />
          </button>

          <div
            style={{
              borderTop: '1px solid var(--neutral-100)',
              marginTop: 32,
              paddingTop: 20,
              fontSize: 12,
              color: 'var(--neutral-400)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Problemas com o acesso? Por favor, entre em contato com a{' '}
            <a
              href="#"
              style={{
                color: 'var(--gci-base)',
                fontWeight: 'var(--weight-bold)',
                textDecoration: 'none',
              }}
            >
              Equipe de TI
            </a>
            .
          </div>
        </form>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 48,
            fontSize: 10,
            textTransform: 'uppercase',
            color: 'var(--neutral-400)',
            letterSpacing: '0.18em',
          }}
        >
          © 2025 Grupo Ceres Investimentos.
        </div>
      </div>

      {/* Coluna direita — hero */}
      <div className="relative overflow-hidden" style={{ background: 'var(--gci-base)' }}>
        <ImageWithFallback
          src={HERO_IMG}
          alt="Agronegócio ao pôr do sol"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover' }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(8,60,74,0.80) 0%, rgba(8,60,74,0.40) 45%, transparent 100%)',
            zIndex: 1,
          }}
        />
        {/* Blobs decorativos */}
        <div
          className="absolute"
          style={{
            top: -120,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.05)',
            filter: 'blur(60px)',
            zIndex: 1,
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: -100,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: '9999px',
            background: 'rgba(242,125,38,0.10)',
            filter: 'blur(60px)',
            zIndex: 1,
          }}
        />

        {/* Conteúdo */}
        <div
          className="absolute flex flex-col"
          style={{ left: 64, right: 64, bottom: 64, zIndex: 2 }}
        >
          <div
            style={{
              width: 48,
              height: 4,
              background: 'var(--agro-base)',
              borderRadius: 2,
              marginBottom: 24,
            }}
          />
          <h2
            style={{
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#fff',
              lineHeight: 1.05,
              textShadow: '0 2px 16px rgba(0,0,0,0.25)',
              marginBottom: 20,
              maxWidth: 720,
            }}
          >
            Gestão interna e estratégica do agronegócio.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.82)',
              fontWeight: 'var(--weight-medium)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: 560,
            }}
          >
            Ferramentas integradas para eficiência operacional e análise de dados estratégica do
            Grupo Ceres.
          </p>
        </div>
      </div>
    </div>
  );
}
