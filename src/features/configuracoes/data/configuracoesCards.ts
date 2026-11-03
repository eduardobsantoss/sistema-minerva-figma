export type ConfiguracoesCardKey =
  | 'componentes'
  | 'telas'
  | 'nps'
  | 'auth-forgot'
  | 'auth-2fa'
  | 'auth-2fa-setup';

export interface ConfiguracoesCard {
  key: ConfiguracoesCardKey;
  title: string;
  description: string;
  cta: string;
  /** Cards que abrem modal e também permitem copiar o MD (como em Telas). */
  copyable?: boolean;
}

export const CONFIGURACOES_CARDS: ConfiguracoesCard[] = [
  {
    key: 'componentes',
    title: 'Componentes',
    description:
      'Galeria de referência visual: botões, tabelas, campos, tipografia, espaçamento e tokens para manter fidelidade à prototipação.',
    cta: 'Abrir galeria',
  },
  {
    key: 'telas',
    title: 'Telas',
    description:
      'Dissecção por tela em Markdown: imports, componente e style scoped para colar no front sem reinventar o visual.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'nps',
    title: 'Pesquisa de usabilidade',
    description:
      'Pesquisa interna: avalie de 0 a 10 a usabilidade do Minerva no seu dia a dia e justifique a nota atribuída.',
    cta: 'Abrir modal',
    copyable: true,
  },
  {
    key: 'auth-forgot',
    title: 'Esqueceu a senha?',
    description:
      'Modal de recuperação: o usuário informa só o e-mail e recebe a senha temporária por e-mail.',
    cta: 'Abrir modal',
    copyable: true,
  },
  {
    key: 'auth-2fa',
    title: 'Autenticação em dois fatores',
    description:
      'Modal de entrada com código de 6 dígitos gerado no Microsoft Authenticator.',
    cta: 'Abrir modal',
    copyable: true,
  },
  {
    key: 'auth-2fa-setup',
    title: 'Configurar 2FA (QR Code)',
    description:
      'Modal de setup: QR Code, chave manual e confirmação do código do autenticador.',
    cta: 'Abrir modal',
    copyable: true,
  },
];
