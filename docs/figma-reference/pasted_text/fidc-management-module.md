Módulo de Gestão de FIDC's — Minerva Gestão
Este documento detalha tudo o que foi desenvolvido e implementado no módulo de FIDC's (Fundos de Investimento em Direitos Creditórios) da plataforma Minerva Gestão, incluindo as integrações visuais do menu lateral, os dashboards de indicadores, os fluxos de drill-down de carteira/classe/títulos e os wizards avançados de cadastro.
O design do módulo consolida uma estética corporativa premium, utilizando a paleta oficial da Minerva (Navy Blue/GCI e Agro Orange), amplos espaços negativos, tipografia de alta performance e animações fluidas controladas por estado.
1. Menu Lateral (Sidebar) & Layout do Dashboard
O menu lateral funciona como o hub centralizador de navegação entre os módulos do sistema. Ele foi implementado no componente principal Dashboard.tsx de forma dinâmica e interativa:
Identidade Visual e Logotipo: Integração do logotipo institucional no cabeçalho e atalho direto para a visão geral de módulos ao clicar na logo.
Controle de Expansão (Colapsável): Animações suaves de largura de sidebar controladas pela biblioteca motion (motion.aside que transiciona dinamicamente entre 280px de largura quando expandido e 80px quando colapsado).
Estados Ativos & Interatividade: Cada item do menu apresenta comportamento visual responsivo:
Mudança de cor de fundo e bordas ao passar o cursor (hover:bg-white/10).
Indicação clara do módulo selecionado através de barras de status, cores contrastantes e preenchimento de ícone.
Inclusão do Atalho Direto: Criação do link dedicado para o módulo de FIDC's (utilizando o ícone Landmark) e do módulo de Passivo (ícone Database).
Cabeçalho Dinâmico (Header do Dashboard): O título exibido no topo da tela principal acompanha em tempo real a visualização ativa (ex: 'Bem-vindo(a) ao Minerva Gestão' na raiz, 'Gestão de FIDC\'s' dentro do módulo de FIDC e 'Passivo' na área de gestão de cotas).
2. Visão Geral da Tela de FIDC's (FIDCScreen.tsx)
A tela de gestão de FIDC's é dividida em uma estrutura hierárquica e inteligente de 4 níveis de navegação por drill-down, permitindo que o usuário parta de uma visão global até o nível mais granular de um título de crédito.
Nível 1: Listagem Geral de Fundos
Esta é a tela inicial do módulo, composta pelos seguintes sub-sistemas:
A. Central de Pesquisa e Filtros
Pesquisa de busca livre sofisticada com foco visual ativo por borda. Permite buscar fundos de forma instantânea pelo Nome do Fundo ou CNPJ.
B. Painel Geral de Indicadores (KPIs Globais)
Um grid de 4 cartões com dados agregados da plataforma:
Total de Fundos: Quantidade de fundos ativos na base.
Valor Total: Volume sob custódia expressado em formato financeiro (ex: R$ 552.1M).
Títulos Ativos: Quantidade total de direitos creditórios vigentes.
Pendências: Volume de liquidações ou aprovações pendentes.
C. Grid de Cards de FIDC (FIDCCard)
Componente modular otimizado para expor o resumo executivo de cada veículo:
Nome completo e CNPJ do Fundo.
Tag indicando a categoria do fundo (MONOCLASSE ou MULTICLASSE) com destaque de cor específico.
Badge dinâmico de Status (ex: EM ANDAMENTO em verde esmeralda com pulsação visual).
Painel Interno de Carteira vs. Vencidos: Exibe o Valor Nominal total em carteira e a quantidade de títulos ativos associados, lado a lado com o montante de títulos Vencidos com realce em vermelho.
Indicadores de Curto Prazo: Exposição rápida de valores de Vencendo Hoje, Vencendo no Mês e Taxa de Confirmação (percentual de lastro verificado).
Efeito Hover Premium: Ao passar o mouse, o card eleva-se verticalmente (y: -5px utilizando Framer Motion) e revela de forma elegante um botão flutuante com a legenda "Ver Detalhes".
3. Navegação Interna do Fundo (Níveis 2, 3 e 4)
Ao selecionar um FIDC da lista, a tela transiciona horizontalmente para focar inteiramente nos dados específicos deste fundo:
Nível 2: Detalhamento do Fundo selecionado (FIDC_DETAIL)
Indicador Principal de PL: Um painel com fundo azul-marinho reflexivo que exibe o Patrimônio Líquido do fundo de forma proeminente, acompanhado pelo ícone de tendência de crescimento (TrendingUp).
Carteira do Fundo Colapsável: Painel de controle de custódia com sumário totalizador de títulos. Ao clicar no sumário, ele abre ou recolhe uma gaveta contendo o detalhamento de:
Valor Nominal
Valor em Aberto
Valor Presente (Descontado)
Valor Vencido (com indicador percentual do total da carteira).
Alternador de Abas (Modo de Visualização): Permite o chaveamento instantâneo via interface de Abas entre:
Visualizar Classes do Fundo: Exibe a lista das classes ativas (Sênior, Mezanino, Subordinada) com suas respectivas especificações financeiras.
Visualizar Títulos da Carteira: Uma listagem completa de cada papel de direito creditório contido no fundo.
Tabela de Classes (ClassesTable): Exibe as partições financeiras do veículo contendo Nome da Unidade, Status, Valor Nominal, Valor em Aberto, Valor Presente e Valor Vencido com link para detalhamento específico.
Tabela de Títulos (TitlesTable): Exibe informações completas de registro, código do título, cedente, sacado, vencimento, valor nominal e status de pagamento.
Nível 3: Detalhamento de Classe/Cota selecionada (CLASS_DETAIL)
Foca os indicadores financeiros exclusivamente na partição selecionada do fundo (Ex: Classe Única, Cota Mezanino, Cota Sênior), herdando as tabelas e os fluxos de filtragem direcionados unicamente para a classe em análise.
Nível 4: Auditoria do Título de Crédito (TITLE_DETAIL)
Uma tela de visualização profunda de um título individual para acompanhamento do lastro físico e do ciclo de vida regulatório:
Status de Registro: Indica se está Confirmado ou Pendente na coletora de dados.
Ficha Cadastral do Título: Detalhamento do número do título, série, tipo de ativo, data de emissão, data de vencimento e valor nominal de face.
Identificação de Participantes: Dados completos de identificação do Cedente (vendedor do crédito) e do Sacado (devedor final do título).
Seção de Evidências Físicas e Lastro: Visualização do arquivo associado, XML ou Nota Fiscal emitida que dá lastro ao crédito.
4. Formulários e Wizards de Cadastro Inteligente
Para viabilizar a entrada de novos veículos de investimento, foram desenvolvidos dois grandes modais multi-etapas baseados em estado de Wizard:
A. Cadastro de FIDC (CreateFIDCModal — 2 Etapas)
Etapa 1: Informações de Identificação do Veículo:
CNPJ do Veículo (com validação visual).
Identificação Interna, Razão Social e Nome Fantasia.
Data de Constituição e Natureza Legal.
Atividade Principal, indicação de Matriz/Filial, Categoria CVM (FIDC, Fiagro, FII, etc.) e Tipo do Fundo (Multi ou Monoclasse).
Etapa 2: Contato e Endereço:
Email oficial, DDI, DDD e Telefone para contato.
Endereço completo estruturado com CEP, Logradouro, Número, Complemento, Bairro, Cidade, Estado e País.
B. Cadastro de Classe Avançado (CreateClassModal — 9 Etapas)
O cadastro de uma nova classe ou emissão é composto por 9 etapas interdependentes, correspondendo à complexidade regulatória estipulada pela CVM:
code
Code
[1. Info] ──> [2. Contato] ──> [3. Ativos] ──> [4. Partic.] ──> [5. Configs]
                                                                        │
  [9. PDD]  <──  [8. Registro] <──  [7. Banco]  <──  [6. Grupos] <──────┘
Info (Dados Gerais da Classe): Cadastro de identificação secundária, CNPJ próprio da classe, Código Singulare de compensação e escolha de indicativo do prazo (Prazo Determinado com data fim ou Indeterminado).
Contato: Endereço e contatos exclusivos daquela série/emissão.
Ativos Elegíveis: Painel interativo de múltipla seleção para definir quais tipos de direitos creditórios são aceitos na classe (DM - Duplicata Mercantil, DS - Duplicata de Serviço, NFE - Nota Fiscal, CTE - Conhecimento de Transporte, CPR_F - Cédula de Produto Rural, NC - Nota Comercial, CH - Cheque, etc.).
Participantes (Prestadores de Serviço): Entrada de dados cadastrais e envio de procurações/documentações dos parceiros técnicos do fundo:
Administradora
Gestora
Custodiante
Agente de Cobrança
Consultor de Investimento
Beneficiário Final
Configs (Parâmetros de Limites):
Seleção de Tipo de Cedente (Monocedente / Multicedente) e Tipo de Sacado.
Definição de parâmetros percentuais de limites de concentração por sacados novos, sacados elegíveis, limites individuais e limites gerais.
Inclusão interativa nas tabelas de TOP Cedente, TOP Sacado e TOP Ativos (limites máximos de exposição aceitáveis na carteira).
Grupos Econômicos: Configuração e seleção de quais grupos econômicos corporativos (Ex: Grupo Agro Industrial, Grupo Alimentos S.A) estão aptos para operar nesta classe.
Dados Bancários / Cobrança:
Estruturação da conta de liquidação da classe: Nome da carteira, Banco, Número da carteira de cobrança, Leiaute de arquivo (CNAB 400 ou CNAB 240), Agência, Conta e Código da Empresa.
Configuração especializada de dados do beneficiário para os boletos gerados e permissão para prorrogar datas de vencimento que coincidam com finais de semana.
Registradoras: Painel interativo para inclusão e gerenciamento das registradoras homologadas (B3, CERC, TAG, etc.), solicitando identificador da carteira na registradora, usuário e criptografia de senha.
Provisionamento de PDD (Provisão para Devedores Duvidosos):
Painel flexível para parametrização das faixas de atraso em dias (Ex: de 0 a 30 dias, de 31 a 60 dias).
Definição do rating associado para o risco (A, B, C, etc.) e o percentual de provisão financeira obrigatória para proteção daquela faixa de inadimplência.
5. Resumo da Stack Tecnológica & Visual
Tecnologia Base: React e TypeScript, garantindo tipagem forte em todo o fluxo de formulários (FIDC, Class, Title, PDD, Registradora).
Design de Componentes: Tailwind CSS para toda a estilização utilitária de modo modular.
Livraria de Ícones: Integração com a suíte lucide-react para os controles contextuais (Search, Landmark, Filter, CheckCircle, etc.).
Animações e Transições: motion/react (Framer Motion) com transições no eixo X e Y em todos os modais, tabelas e alternadores de visualização para proporcionar uma experiência fluida no navegador.