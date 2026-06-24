📋 Etapa 1: Info (Informações Cadastrais Básicas)
CNPJ do Veículo (Classe): Campo de texto formatado (00.000.000/0000-00) para o cadastro individual da classe de cota.
Identificação do Veículo: String curta identificadora do lote (Ex: CLASSE TECH A).
Razão Social: Campo longo para o nome empresarial completo registrado em cartório/CVM.
Nome Fantasia / Nome Classe: Nome amigável de exibição comercial (Ex: Sênior Classe A).
Data de Constituição: Seleção de data (type="date") em que a classe foi integralizada.
Natureza Legal: Campo de texto descritivo (Padrão sugerido: Fundo).
Atividade Principal: Campo para definição regulatória (Ex: Direitos Creditórios).
Tipo de Empresa: Caixa de seleção (select) com opções:
Matriz
Filial
Código Singulare (CNAB 444): Campo de texto para o identificador numérico de integração de custódia (Ex: 000).
Indicativo de Prazo: Caixa de seleção (select):
Prazo Determinado (com data de fim prevista)
Prazo Indeterminado (sem previsão de vencimento)
Categoria CVM: Campo pré-selecionado e desabilitado (conforme diretrizes operacionais do regulador).
✉️ Etapa 2: Contato e Endereço
Dividida em duas subseções:
Contato:
Email do Veículo: E-mail de contato oficial do fundo / custódia.
DDI: Código de telefonia internacional (Padrão: +55).
DDD: Código de área regional (Ex: 11).
Telefone: Número para contato telefônico com formatação padrão.
Endereço:
CEP: Campo com formatação de busca postal.
Endereço: Nome da via (Rua, Avenida, etc.).
Número: Número do imóvel.
Complemento: Designação de andares, salas ou blocos.
Bairro: Bairro de localização.
Cidade: Município de registro.
Estado: Unidade Federativa (Ex: SP).
País: País do domicílio fiscal (Padrão: Brasil).
📄 Etapa 3: Ativos (Tipos de Direitos Creditórios Permitidos)
Uma lista de caixas de seleção (checkbox) interativas com os códigos regulados de tipos de ativos que esta classe tem autorização de adquirir.
Os ativos disponíveis são:
COOP — Direitos Creditórios provenientes de Cooperativas
CRAG — Direitos Creditórios do Agronegócio (CRA)
DUPL — Duplicatas Mercantis / de prestação de serviços
FIAG — Cotas de Fiagro / Fundos Imobiliários Agro
FINA — Contratos de Empréstimos / Setor Financeiro
IMOB — Direitos do setor Imobiliário
NCOM — Notas de Crédito Comercial
NPME — Títulos de Pequenas e Médias Empresas
👥 Etapa 4: Participantes Operacionais
Seção avançada para atribuição de responsabilidades. Para cada participante, há um bloco com Três campos cadastrais: Nome do Participante, CNPJ correspondente e Data de início do vínculo. Algumas funções podem ser ativadas/desativadas via chave seletora (Toggle).
Administradora: Nome comercial, CNPJ e Data de Início.
Gestor: Nome comercial, CNPJ e Data de Início.
Custodiante: (Ativável via Toggle: "Fundo tem Custodiante") — Nome, CNPJ e Data de Início.
Agente de Cobrança: (Ativável via Toggle: "Fundo tem Agente de cobrança") — Nome, CNPJ e Data de Início.
Consultor: (Ativável via Toggle: "Fundo tem Consultor") — Nome, CNPJ e Data de Início.
Beneficiário Final: (Ativável via Toggle: "Fundo tem Beneficiário final") — Nome, CNPJ e Data de Início.
⚙️ Etapa 5: Configs (Regras de Concentração por Sacado e Tipo de Ativo)
Tipo de Cedente: Seleção do nível de diversificação do pool de cedentes:
MONOCEDENTE
MULTICESSADO (Padrão)
Tipo de Sacado: Seleção do nível de concentração da carteira de sacados:
MONOSACADO
MULTISSACADO (Padrão)
% Concentração por Sacado (Novos/Individuais): Porcentagem de concentração máxima permitida para novas entidades emissoras de dívida individual.
% Concentração por Sacado (Elegíveis/Individuais): Limite de diversificação limite por sacado ativo em relação ao PL.
% Concentração Total dos Sacados (Novos): Limite de teto consolidado para novos sacados da carteira.
% Concentração Total dos Sacados (Elegíveis): Limite total consolidado de sacados elegíveis.
Gestão de Limite por Tipo de Ativo (Grid de Listagem Dinâmica):
Permite selecionar um Tipo de Ativo (Ex: DUPL) e definir um Limite de Concentração (%) individual.
O usuário clica no Botão Adicionar (Verde, com ícone de "+") e o limite é carregado para a tabela dinâmica do backend, viabilizando monitoramento de risco por subclasse de recebíveis.
🌐 Etapa 6: Grupos (Grupos Empresariais Vinculados)
Pesquisa Dinâmica de Grupos: Campo de input com ícone de busca para filtros em tempo real.
Listagem de Seleção: Exibição em cartões com checkbox e ícone de edifício (Building2).
Aqui são marcados e adicionados à classe os grupos corporativos elegíveis à negociação de recebíveis, vinculando riscos sistêmicos e controladoras financeiras.
🏦 Etapa 7: Banco (Dados Financeiros e de Cobrança)
Dividida entre as informações bancárias e a emissão/cadastro de faturamento:
Dados da Carteira:
Nome da carteira: Identificador amigável da carteira de cobrança (Ex: Agrovita FIDC - Santander).
Selecione o banco: Dropdown contendo grandes instituições parceiras (Ex: Santander, Itaú, Bradesco).
Selecione a carteira: Identificador do lote bancário (Ex: Carteira 1, Carteira 2).
Selecione o CNAB: Padrão do arquivo magnético de liquidação:
CNAB 240 (Padrão do banco para transferência e conciliação detalhada)
CNAB 400 (Padrão de cobrança histórica de layout simplificado)
Número da conta: Conta corrente para crédito das liquidações.
Número da agência: Agência de relacionamento.
Código da empresa: Código identificador da convênio da empresa junto ao banco.
Campo extra 1 & Campo extra 2: Parâmetros específicos adicionais definidos por contratos de banco individuais.
Configuração de dados padrões para boleto: Texto de instrução ou termos para impressão nos documentos de pagamento.
Permitir vencimento em finais de semana e feriados (Chave Toggle): Se ativo, permite o acolhimento de parcelas e liquidação sem prorrogação automática para o dia útil subsequente.
Dados do Beneficiário:
CNPJ: CNPJ emissor da cobrança.
Nome: Razão social completa do beneficiário de repasse.
CEP / Endereço / Número / Complemento / Bairro / Cidade / Estado: Informações detalhadas de localização e domicílio para registro nacional de cobrança registrada (Febraban).
📜 Etapa 8: Registro (Configuração de Registradoras)
Área de integração com as centrais de registradoras financeiras para coibir duplicidade de recebíveis e garantir a unicidade de notas e títulos:
Registradora (Dropdown): Opções integradas:
B3
CERC
TAG
CIP
ID Carteira: Identificador do contrato e custódia da registradora.
Usuário: String de acesso para autenticação (API/SFTP).
Senha: Credencial de segurança associada.
Tabela Dinâmica: Os registros são adicionáveis um a um com ações de exclusão no final da tabela.
⚠️ Etapa 9: PDD (Provisão para Devedores Duvidosos)
A régua de envelhecimento e provisionamento de perdas por atraso, calculando o risco contábil:
Dias Mínimos / Dias Máximos (Inputs Numéricos): Intervalo de dias que define a faixa de atraso (Ex: 0 a 30 dias).
% de PDD (Input Numérico): Porcentagem de perda provisionada exigida para a faixa (Ex: 0,5%).
Classificação (Dropdown de Rating): Classificação reguladora atribuída da faixa (A, B, C, D, E, F).
Grade dinâmico de faixas cadastradas: Exibe as regras operacionais sequenciais consolidadas, auxiliando a controladoria do Minerva no acompanhamento de provisões automáticas de carteira.