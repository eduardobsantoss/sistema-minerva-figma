1. Estrutura do Menu Lateral e Submenu
O menu lateral (Sidebar) conta com uma estrutura interativa que respeita o estado de expansão/recolhimento geral da navegação. O item principal de FIDC's é representado pelo ícone Landmark da biblioteca lucide-react.
Comportamento de Expansão: Quando o menu lateral está expandido (expanded={sidebarOpen}), clicar no item de FIDC's expande um Submenu vertical animado (via framer-motion).
Os 4 Subitens Estruturados:
Listagem (FileText): Direciona para a tela principal de listagem de fundos e painel de controle de carteiras.
Cedentes (Building2): Gestão integrada e limites operacionais dos cedentes parceiros.
Notificações (BellRing): Alertas críticos sobre liquidações, quebra de regras de carteira ou pendências.
Relatórios (BarChart3): Painel analítico de performance, PDD e rentabilidade histórica por ativo.
2. Visão do Fundo Casca (FIDC_DETAIL)
Quando o usuário clica em qualquer FIDC na listagem principal (visualizando cards detalhados com indicadores Rápidos como Vencendo Hoje, Vencendo no Mês e Taxa de Confirmação), ele entra na visão do Fundo Casca (FIDC_DETAIL). Nesta tela, os seguintes componentes compõem a governança do veículo de investimento:
Identificação do Fundo: Cabeçalho de navegação contendo o nome corporativo completo do FIDC, CNPJ e um botão de retorno fluído com interações de escala.
Indicador Hero de Patrimônio Líquido (PL): Card imersivo em cor de fundo sólida (GCI) com círculos concêntricos translúcidos e tipografia robusta em formato numérico tabular para renderizar o PL consolidado com precisão.
Painel Retrátil de Indicadores da Carteira:
Um componente interativo verde (bg-emerald-500) que exibe no cabeçalho o total de títulos ativos correspondentes à carteira global.
Expandir/Recolher: Ao clicar, uma gaveta estruturada (AnimatePresence) desliza revelando cards específicos de:
Valor Nominal: Montante integral original dos recebíveis.
Valor em Aberto: Saldo passível de amortização futura.
Valor Presente: Montante calculado trazendo os títulos a valor presente.
Valor Vencido: Demonstrativo de inadimplência histórica com indicativo percentual customizado na cor de perigo (vermelho).
Segmentação de Visão (Classes vs. Títulos):
Logo abaixo dos indicadores, o usuário dispõe de um botão seletor de modo (tableMode), permitindo alternar simetricamente entre a listagem de Classes pertencentes àquele fundo ou os Títulos de carteira mapeados.
3. Criação de uma Nova Classe (Formulário 9-Steps)
Para fundos cadastrados como MULTICLASSE, a interface disponibiliza de forma ativa o botão NOVA CLASSE. Isto engaja um assistente visual (Wizard) em modal em tela cheia com desfoque de fundo e 9 etapas sequenciais estruturadas de cadastro técnico-regulatório:
code
Code
[1. Info] ➔ [2. Contato] ➔ [3. Ativos] ➔ [4. Partic.] ➔ [5. Configs] ➔ [6. Grupos] ➔ [7. Banco] ➔ [8. Registro] ➔ [9. PDD]
Detalhamento das Etapas de Entrada:
Info (Identificação Inicial): Capta dados jurídicos fundamentais como CNPJ da Classe, Razão Social, Nome Fantasia da Classe (ex: Classe Sênior A), Data de Constituição, Código de Integração Singulare (CNAB 444) e Indicativo de Prazo (Determinado/Indeterminado).
Contato (Endereçamento): Cadastro robusto de endereços corporativos para correspondência legal da emissão (CEP, logradouro, telefone institucional, etc.).
Ativos Elegíveis: Painel interativo para selecionar quais tipos de recebíveis (duplicatas, CPR, notas comerciais, cheques) esta classe de cota está autorizada a originar.
Partic. (Participantes do Ecossistema): Definição nominal de entidades associadas e datas de outorga de procurações, cobrindo as posições de Administradora, Gestora, Custodiante, Agente de Cobrança, Consultor e Beneficiário Final.
Configs (Critérios de Limite/Concentração): Definição dos perfis operacionais de fomento econômico de cedente e sacado (Concentrações máximas permitidas para sacados novos e elegíveis, limitadores de PL individuais, e limites gerais de ativos).
Grupos Econômicos: Associação e parametrização de limites agregados para conglomerados de empresas integradas.
Banco (Domicílio Bancário): Configuração dos dados de liquidação da carteira (Banco custodiante, Agência, Conta, Código de transmissão CNAB e parametrização quanto a feriados/vencimento aos finais de semana).
Registro (Câmaras de Registro): Definição de integrações com registradoras externas (como CERC, B3 ou TAG) para conferência física de lastros.
PDD (Provisão para Devedores Duvidosos): Criação de regras de desconto por tabela de faixa de atraso (Aging de D0 até D180+ com suas respectivas porcentagens de contingência financeira).
4. Visualização de Detalhes da Classe (CLASS_DETAIL)
Uma vez que o usuário navega na tabela de Classes do Fundo e clica em uma linha específica, a aplicação transita suavemente para a visualização da Classe Drilldown:
Contexto Recorrente: Exibe as informações institucionais herdadas do Fundo Casca principal (como o Patrimônio Líquido consolidado).
Dados da Emissão: Uma fileira de cards técnicos dedicados exibe os saldos exclusivos apropriados para a cota em questão (Valor Nominal da Unidade, Valor em Aberto, Valor Presente e Valor Vencido).
Grid de Títulos Vinculados: Abaixo dos saldos, a classe lista exclusivamente os títulos que compõem sua base de recebíveis específica, oferecendo ferramentas de busca avançada no cabeçalho por número de transação, identificador de lastro ou entidade cedente.
5. Detalhes de Ativos e Títulos (TITLE_DETAIL)
Descendo ao último nível dclínico de governança, o clique em qualquer recebível abre a tela analítica de Detalhes de Títulos (TitleDetailsView), dividida em quatro abas lógicas de alta usabilidade:
Detalhes:
Informações do Título: Visualização tabulada com a Classe de origem, status regulatório de registro (ex: LIVRE, OPORTUNIDADE ou PENDENTE), ID de Lastro, Número de Identificação e o correspondente Valor Nominal principal grifado.
Datas e Prazos: Mapeamento do vencimento e checagem de regras de prorrogação ou protestos cartorários.
Participantes: Demonstra o fluxo completo do recebível (Identificação explícita do Cedente, Sacado e o status de faturamento operacional).
Anexos (Files/Digital): Aba de auditoria documental para visualização de Notas Fiscais emitidas, comprovantes de entrega de mercadoria (canhotos assinados) ou contratos físicos assinados eletronicamente.
Pagamentos: Demonstrativo histórico de repasses e custódias efetuadas.
Movimento: Log temporal de auditoria do título, demonstrando quem originou o ativo, datas de validação da registradora e confirmação física dos sacados.
Eu quero só isso:
Detalhe pra mim o submenu no menu lateral, de fidcs;
A parte da criação de uma nova classe, a visualização por Classes e Títulos, e os detalhes de ambos. Detalhes do fundo casca com a visão das classes e tal
Apenas isso.
Gemini 3.5 Flash
Ran for 59s

summarize_auto
Action history
chevron_right
No Sistema Minerva, desenvolvemos uma arquitetura robusta, moderna e altamente refinada para a Gestão de FIDCs (Fundos de Investimento em Direitos Creditórios).
Abaixo, detalhamos exatamente como esse fluxo foi estruturado, desde a navegação no menu lateral até os detalhes granulares de visualizações e o wizard completo de criação de novas classes de fundo.
📑 Módulo de Gestão de FIDC's: Detalhamento Técnico e Funcional
1. O Submenu no Menu Lateral (Efeitos, Rotas e Filtros)
O menu lateral esquerdo funciona como o painel central de controle do nosso sistema, construído usando animações suaves controladas pelo motion (framer-motion).
Quando o usuário seleciona e clica no módulo de FIDC's, o menu lateral expande dinamicamente para revelar um submenu dedicado e contextualizado, permitindo acesso a painéis de controle secundários:
📂 Listagem (Pátio de Fundos): Direciona o gestor de volta à lista geral de fundos cadastrados.
👥 Cedentes & Contrapartes: Gerenciamento de empresas que cedem títulos de crédito ao fundo.
🔔 Notificações: Alertas e avisos automáticos sobre liquidação de parcelas, atrasos ou envio de arquivos XML/CNAB.
📊 Relatórios: Geração automática de gráficos, curvas de juros amortizados e rentabilidade geral.
2. A Visão do Fundo Casca (Estrutura do Fundo Centralizado)
No desenvolvimento de fundos Multiclasses, o fundo principal atua como um "Fundo Casca" (a carteira consolidada de ativos).
Ao clicar em um fundo na listagem geral, a interface faz um drilldown para a visualização detalhada do Fundo Casca, contendo:
💵 Indicador de Patrimônio Líquido (PL): Apresentação sofisticada do PL do fundo, envolto em um card institucional escuro com degradê radial e textura sutil de ondas.
📈 Painel de Indicadores da Carteira (Expansível): Uma seção retrátil e interativa com Micro-Animações onde o usuário expande ou recolhe uma visualização com os seguintes KPIs consolidados:
Valor Nominal Total da Carteira
Valor em Aberto (a liquidar)
Valor Presente Ajustado
Valor Vencido Geral % (com badge de indicação visual em tom salmão/avermelhado).
🔄 Tabs de Alternância Rápida: Classes vs. Títulos:
Na seção inferior, o gestor se depara com um alternador de estado de lista que unifica a navegação dentro do mesmo Fundo Casca:
Visualizar Classes: Lista as fatias estruturadas (Sênior, Mezanim, Subordinada, etc.) que dividem o passivo.
Visualizar Títulos: Exibe a lista completa de todos os Direitos Creditórios consolidados pertencentes àquele fundo casca.
3. Visualização de Classes e Títulos (Listas e Tabelas)
A. Tabela e Detalhes de Classes (Divisões do Passivo)
Quando a tab de visualização está no modo Classes do Fundo, a tabela exibe cada classe ativa, mostrando:
Nome representativo e CNPJ individualizado.
Status regulatório (Em andamento, Em configuração, Encerrada).
Estrutura de precificação nominal, valor corrente em aberto, valor em tempo real a valor presente e o vencido/inadimplente.
** ड्रिलडाउन (Drilldown) da Classe**:
Ao selecionar uma Classe específica, o usuário entra no detalhamento dela. Essa tela herda a identidade visual do Fundo Casca com o Patrimônio Líquido do Fundo Centralizado no topo, mas carrega na parte inferior os títulos específicos que pertencem exclusivamente a essa classe.
B. Tabela e Detalhes de Títulos (Direitos Creditórios)
No modo Visualizar Títulos ou dentro do detalhamento de uma classe, a tabela é redimensionável de acordo com o tamanho da tela e apresenta:
Nº do Título, Lastro e seu respectivo documento de origem (ex: NFe, CPR-F, CCB).
Enquadramento de Registro (Confirmado, Pendente).
Dados do Sacado (devedor) e do Cedente (vendedor).
Vencimento de parcelas e Valores Nominais.
** ड्रिलडाउन (Drilldown) do Título**:
Ao clicar em um título individual, abre-se uma tela minuciosa com:
Status de Confirmação: Detalhes de assinatura digital, anexação de comprovantes digitais de circulação física de mercadorias.
Dados e Contatos do Sacado: Razão social do devedor, telefones de cobrança automática e e-mails regulamentares.
Histórico de Eventos: Log estruturado de alterações na vida do título (como emissão, registro e baixa automática).
4. O Fluxo de Criação de uma Nova Classe (Wizard de 9 Próximas Etapas)
Se o fundo selecionado for do tipo de passivo MULTICLASSE, um botão sofisticado com badge laranja "NOVA CLASSE" é disponibilizado. Ele abre um modal imersivo e de alta fidelidade visual composto por um Wizard Incremental de 9 Etapas, estruturado para que nenhum dado regulatório seja esquecido:
ℹ️ Info (Identificação inicial): Cadastro do Nome da Unidade, razão social, CNPJ exclusivo da classe, data de constituição e classificação CVM.
✉️ Contato & Endereço: Telefones de contato direto para a classe, endereços de auditorias vinculadas e CEP.
📄 Ativos Elegíveis: Painel interativo de seleção onde o gestor clica para habilitar quais lastros são aceitos por essa classe (Ex: NFe - Nota Fiscal Eletrônica, CPR_F - CPR Física, NC - Nota Comercial, Duplicatas, etc.).
👥 Participantes: Cadastro detalhado das instituições e assinatura de termos para a Administradora, Gestora, Custodiante, Agente de Cobrança e Auditor Independente do fundo correspondente.
⚙️ Configs de Concentração & Limites: Parametrização matemática de limite de risco. Define percentuais máximos por cedente, nível de exposição por sacados individuais elegíveis e regras de recompra.
🌐 Grupos Econômicos: Configuração e identificação de conglomerados econômicos proibidos ou com teto de exposição reduzido (evitando contágios sistêmicos).
💳 Instrução e Dados Bancários: Configuração da agência, da conta de liquidação da classe em si, layout do arquivo CNAB de retorno/remessa e parametrização extra para recebíveis gerados por boletos.
⏳ Registradora: Vínculo inteligente com registradoras de ativos de mercado físico (Ex: B3, CIP, Cerc) utilizando cartões com identificador de usuário, senha e ID da carteira.
⚠️ PDD (Provisão para Devedores Duvidosos): Matriz customizável de provisionamento escalonado baseada em faixas de atraso (exemplo: atrasos de 0-30 dias provisionam 0.5%; atrasos de 31-60 dias provisionam 1%, etc.).
Este design modular, com foco em simplicidade na exibição de dados complexos através de guias contextuais, permite monitorar e operar com precisão a totalidade do ecossistema de FIDCs no Sistema Minerva.