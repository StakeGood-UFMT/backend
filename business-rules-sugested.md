
# Regras de Negócio e Arquitetura da API (StakeGood Backend)

**Objetivo deste documento:** A API não é um sistema de custódia (ela não guarda o dinheiro) e não é um sistema de banco de dados tradicional. Ela atua como um **Orquestrador de Confiança**. Sua missão é blindar o contrato inteligente contra requisições ilegais (barrando usuários sem biometria), espelhar a blockchain com atraso zero (Worker) e transformar o capital bruto em inteligência de mercado (cálculo de probabilidades epistêmicas).

## 1. Arquitetura Lógica e Padrões de Design
* **Separação de Responsabilidades (CQRS):** A arquitetura deve dividir estritamente o fluxo de "Leitura" do fluxo de "Escrita".
    * *Leitura (Queries):* Consultas de histórico, portfólio e probabilidades consomem dados unicamente do banco de dados relacional (PostgreSQL), alimentado pelo Indexador, garantindo tempo de resposta em milissegundos. Nenhuma rota "GET" deve consultar a rede Stellar em tempo real.
    * *Escrita (Commands):* Qualquer intenção de mutação de estado (Apostar, Votar, Sacar) aciona o motor de construção de transações XDR, que cruza dados com os provedores de conformidade antes de autorizar a intenção.
* **Stateless Absoluto:** A API não guarda sessão em memória. Toda autenticação e controle de permissões trafega via JWT assinado com tempo de expiração curto, contendo no payload a chave pública do usuário e o seu nível de verificação de identidade.

---

## 2. Regras de Autenticação e Conformidade
A API atua como a fronteira legal do sistema.

* **Login Criptográfico (Sem Senhas):** O sistema rechaça senhas de texto. A regra exige um fluxo de "Desafio e Resposta". O usuário solicita um desafio (Nonce aleatório), assina esse desafio com a sua carteira local (Freighter), e a API valida criptograficamente se a assinatura confere com a chave pública.
* **Gatilho de Identidade Biométrica:** O sistema exige integração com um provedor de KYC (ex: SumSub). O fluxo de apostas é bloqueado até que o provedor dispare um *webhook* para a API confirmando que a face humana atrelada àquela carteira é real, única e não consta em listas de lavagem de dinheiro (AML).
* **Trava de Gastos e Prevenção ao Vício:** A API deve implementar uma janela deslizante (Rolling Window) de 30 dias. Antes de autorizar a montagem de qualquer transação de previsão, a API calcula quanto o usuário já depositou naquele mês. Se o novo depósito romper o teto financeiro legal estabelecido pela regulamentação, a API aborta a operação e retorna um erro de conformidade.

---

## 3. O Motor de Construção de Transações (XDR Builders)
Esta é a regra de segurança anti-fraude mais crítica da arquitetura. O Frontend é proibido de construir a transação que será enviada para a blockchain.

* **Prevenção de Manipulação de Frontend:** Se o frontend construísse a transação, um usuário malicioso poderia interceptar o código e alterar os parâmetros (ex: pedir para apostar 100 USDC na interface, mas enviar uma transação on-chain que custa 1 USDC e registra 100 USDC no contrato).
* **Fluxo Parametrizado:** O Frontend envia apenas a *intenção* ("Quero prever SIM no mercado X com 50 USDC"). A API valida tudo, constrói o envelope binário da rede Stellar (XDR) injetando o contrato inteligente correto e as casas decimais estritas (stroops), e devolve este "contrato digital" para o usuário apenas assinar na extensão do navegador.

---

## 4. O Motor de Indexação e Sincronização (Worker)
Como a API escuta a blockchain e atualiza o banco de dados.

* **Sincronização por Cursor (Idempotência):** A rede Stellar emite milhares de eventos por minuto. O Worker da API usa um "marca-página" (Cursor). A regra dita que o Worker pega os últimos 1000 eventos e os salva no banco de dados. O cursor só é atualizado se a transação do banco for commitada com sucesso. Se a API cair ou reiniciar, ela volta a ler do último cursor salvo, garantindo que nenhuma previsão suma e nenhuma previsão seja salva duas vezes.
* **Backoff Exponencial:** Se o nó RPC da Stellar sair do ar ou demorar a responder, o Worker não deve bombardear o nó com requisições. A regra obriga o uso de esperas crescentes (1s, 2s, 4s, 8s) até a rede voltar.
* **Notificação Otimista (WebSocket):** Assim que o Worker consolida um bloco de eventos no banco, a API dispara um evento em tempo real para os clientes conectados. É isso que faz o status de "Processando" da aposta sumir na tela do usuário.

---

## 5. Mapeamento Exaustivo de Endpoints (REST API)

Todas as rotas requerem o cabeçalho de autenticação JWT, exceto as marcadas como `[Pública]`.

### Domínio: Autenticação e KYC
* **`GET /api/v1/auth/nonce?wallet={public_key}` [Pública]:** Gera e salva temporariamente um código alfanumérico para a carteira solicitante.
* **`POST /api/v1/auth/verify` [Pública]:** Recebe o Nonce assinado criptograficamente. Valida e retorna o token JWT e o status do KYC.
* **`POST /api/v1/auth/kyc/webhook` [Pública - Protegida por HMAC do Provedor]:** Rota cega que recebe os laudos da análise facial do provedor terceirizado (Aprovado/Reprovado) e atualiza o perfil do usuário no banco.

### Domínio: Mercados Preditivos e Inteligência
* **`GET /api/v1/markets` [Pública]:** Retorna a lista de mercados. Regra: Deve suportar filtros complexos (categoria, volume financeiro, mercados em tendência). O payload deve incluir a probabilidade implícita calculada on-the-fly pelo banco de dados.
* **`GET /api/v1/markets/{market_id}` [Pública]:** Detalha um mercado específico. Traz o título, regras de resolução, e a liquidez atualizada de cada cenário (ex: Sim, Não, Empate).
* **`GET /api/v1/markets/{market_id}/history` [Pública]:** Retorna um array de séries temporais. Regra: Usado para montar o gráfico da interface. Mostra como a "crença do mercado" oscilou dia após dia.

### Domínio: Construção de Transações (Comandos de Ação)
* **`POST /api/v1/transactions/build-prediction`:**
    * *Entrada:* `market_id`, `outcome_id`, `amount_usdc`.
    * *Regra:* Verifica KYC, verifica Lei de Limite de Perdas, verifica se o mercado ainda está na fase `OPEN`. Constrói o Envelope XDR de "place_prediction" e retorna em Base64.
* **`POST /api/v1/transactions/build-vote`:**
    * *Entrada:* `market_id`, `ong_wallet`, `desired_votes`.
    * *Regra:* Consulta o banco de dados para checar se o usuário possuía dinheiro no lado vencedor. Calcula off-chain se o saldo cobre o custo do Voto Quadrático (apenas para feedback de UI). Constrói o Envelope XDR de "cast_philanthropic_vote".
* **`POST /api/v1/transactions/build-claim`:**
    * *Entrada:* `market_id`.
    * *Regra:* Constrói a transação para o usuário sacar seu prêmio, aplicável apenas se o mercado estiver `RESOLVED` ou `CANCELED`.

### Domínio: Governança e Filantropia
* **`GET /api/v1/governance/organizations` [Pública]:** Retorna a "Whitelist" de ONGs com seus dados de transparência (nome, missão, métricas de impacto).
* **`GET /api/v1/governance/markets/{market_id}/votes` [Pública]:** Retorna o placar em tempo real de como o poder de voto filantrópico está sendo alocado pelos vencedores de um mercado específico.

### Domínio: Perfil e Reputação On-Chain do Usuário
* **`GET /api/v1/users/me/portfolio`:** Retorna o capital total travado em mercados ativos, o saldo aguardando saque (prêmios) e o poder de voto filantrópico acumulado não utilizado.
* **`GET /api/v1/users/me/history`:** Retorna a trilha de auditoria do usuário: tudo o que ele previu, quando previu, e qual impacto social ele ajudou a direcionar indiretamente.

---

## 6. Arquitetura de Testes Exigida (QA Backend)
A suíte de testes do NestJS deve cobrir rigorosamente as bordas do sistema:

* **Teste de Idempotência do Indexador:** Simular a queda do Worker no meio de um lote de 500 eventos. O teste deve provar que, ao religar, a API retoma a leitura sem inserir transações duplicadas e sem pular nenhum registro.
* **Teste de Barreira de Conformidade:** Tentar forçar o motor de construção de XDR (`build-prediction`) a gerar uma transação para um usuário cujo limite legal de depósito daquele mês já foi atingido. A suíte deve esperar uma rejeição HTTP 403 antes que qualquer biblioteca da rede Stellar seja importada na memória.
* **Teste de Lógica Epistêmica (Cálculo de Odds):** Injetar dados sintéticos no banco de dados (Ex: 300 USDC no Sim, 700 USDC no Não) e garantir que a rota de mercado `/markets/{id}` retorna exatamente a string/JSON garantindo que a "Probabilidade Implícita de 'Sim' é 30%".
* **Teste Anti-Spoofing Criptográfico:** Enviar um Nonce válido, porém assinado com uma chave privada genérica diferente da declarada. A API deve rejeitar imediatamente a geração do JWT.
