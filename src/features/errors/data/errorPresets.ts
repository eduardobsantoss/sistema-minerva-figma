export interface ErrorScreenProps {
  code: string | number;
  title: string;
  description: string;
  primaryLabel: string;
}

export const ERROR_PRESETS: Record<string, Omit<ErrorScreenProps, 'code'>> = {
  '401': {
    title: 'Não autorizado',
    description:
      'Sua sessão não tem permissão para acessar este recurso. Entre novamente ou fale com o administrador.',
    primaryLabel: 'Fazer login',
  },
  '402': {
    title: 'Pagamento necessário',
    description:
      'Esta operação exige uma condição financeira pendente. Regularize para continuar.',
    primaryLabel: 'Ver pendências',
  },
  '403': {
    title: 'Acesso negado',
    description:
      'Você não possui perfil para esta área. Se acredita que isso é um engano, contate a equipe de TI.',
    primaryLabel: 'Voltar',
  },
  '404': {
    title: 'Página não encontrada',
    description:
      'O endereço não existe ou foi movido. Confira o link ou volte para o início da plataforma.',
    primaryLabel: 'Voltar',
  },
  '500': {
    title: 'Erro interno',
    description:
      'Algo deu errado ao processar a solicitação. Tente novamente em instantes. Se persistir, acione o suporte.',
    primaryLabel: 'Tentar novamente',
  },
};

export function resolveErrorPreset(code: string | number): ErrorScreenProps {
  const key = String(code);
  const preset = ERROR_PRESETS[key] ?? {
    title: 'Algo deu errado',
    description: 'Não foi possível concluir esta ação. Tente novamente ou volte ao início.',
    primaryLabel: 'Tentar novamente',
  };
  return { code: key, ...preset };
}
