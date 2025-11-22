De acordo com a documentação do Cypress, cy.intercept() é um comando usado para ouvir e modificar requisições de rede, permitindo que você intercepte requisições HTTP para simular respostas de API, controlar o comportamento do teste e criar ambientes de teste mais estáveis. Ele pode espionar requisições passivamente, simular o corpo, o código de status ou cabeçalhos da resposta, e simular falhas de rede ou atrasos.

Principais usos e funcionalidades: Simulação de respostas de API (Mocking): Você pode retornar uma resposta pré-definida (como um JSON estático) para uma requisição, o que é útil para testar a aplicação com dados simulados, especialmente quando a API real não está pronta ou disponível.Controle do comportamento da aplicação: É possível modificar requisições ou simular o que acontece se uma requisição falhar, como retornar um código de erro \(500\).Testes mais estáveis: Ao interceptar requisições e usar cy.wait() com um alias, você pode garantir que um teste prossiga apenas após uma requisição específica ser concluída, tornando os testes mais confiáveis e menos propensos a falhas flutuantes.Melhoria da velocidade do teste: Simular respostas de API pode acelerar o processo de teste, evitando a necessidade de esperar por chamadas de rede reais. Como funciona: Chame cy.intercept() antes da requisição: O comando deve ser executado antes da ação que dispara a requisição HTTP, como um clique em um botão.Especifique a requisição: O primeiro argumento de cy.intercept() é um padrão para a requisição a ser interceptada (como um método e URL).Especifique a resposta (opcional): O segundo argumento pode ser um objeto com a resposta que você deseja simular (status, corpo, cabeçalhos) ou uma função de retorno para manipular a requisição ou resposta de forma mais complexa.Use cy.wait() para esperar: Depois que a requisição for disparada, você pode usar cy.wait() para aguardar a requisição interceptada por seu alias e, assim, continuar com as asserções.

# Guia prático — `cy.intercept()` e `cy.wait()` (somente explicações)

> **Objetivo**: visão completa, clara e progressiva sobre o que são, para que servem e como usar corretamente `cy.intercept()` e `cy.wait()` no Cypress — **sem exercícios e sem exemplos de código extensos**.

---

## 1) O que é `cy.intercept()` (visão de alto nível)

**Função — observar/controle de tráfego do app no navegador (XHR/fetch/GraphQL).**  
`cy.intercept()` “ouve” as chamadas HTTP que **a sua aplicação** faz enquanto está rodando no navegador controlado pelo Cypress. Ele permite **inspecionar** (spy) ou **modificar** (stub) essas chamadas.

- Exemplos de tráfego que o Cypress captura:
  - **XHR/REST:** `GET /api/products?page=2`, `POST /auth/login`.
  - **fetch + JSON:** `fetch('/api/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Ana' }) })`.
  - **GraphQL:** `POST /graphql` com body `{ "query": "mutation Login($u:String!,$p:String!){...}", "variables": { "u": "ana", "p": "123" } }` (você pode casar pela URL e inspecionar o conteúdo do body).

> Se você **não** usa `intercept` nesses casos, perde visibilidade sobre **quando** a requisição termina e **o que** foi enviado/recebido; tende a recorrer a `cy.wait(tempo)` (flaky).

---

**Modos de uso.**

- **Spy (escutar passivamente):** você registra o intercept, dá um **alias** e **não altera** a resposta. Isso já permite:

  - **Sincronizar**: `cy.wait('@alias')` para seguir **exatamente** quando a requisição/resposta terminar.
  - **Inspecionar**: ver `request.method`, `request.url`, `request.body`, `response.statusCode`, etc.

  _Exemplo de cenário:_ ouvir `GET /api/todos` para só validar a UI **após** a resposta chegar.

  _Se não fizer:_ o teste pode seguir **antes** da resposta (condição de corrida), gerando intermitência.

- **Stub (simular resposta):** você **responde no lugar do servidor**, definindo `statusCode`, `headers`, `body`, `delay` ou até **falha de rede**:

  - **Sucesso controlado (200):** retorna uma lista pequena para validar layout/paginação.
  - **Erro (500/403/422):** valida toasts, mensagens de erro e fluxos alternativos.
  - **Latência:** adiciona `delay` para testar loaders/spinners.
  - **Falha de rede:** simula `forceNetworkError`/timeout para ver fallback da UI.

  _Se não fizer quando precisa:_ fica dependente do backend para reproduzir estados raros (500, timeouts, payloads específicos), tornando alguns testes **impraticáveis** ou **instáveis**.

---

**Propósito central — previsibilidade e observabilidade.**  
`cy.intercept()` + `cy.wait('@alias')`:

- **Elimina esperas fixas** (como `cy.wait(3000)`), reduzindo flakiness.
- **Acelera** a suíte (segue assim que a rede resolve).
- **Expõe dados** de `request/response` para asserções e depuração (status, headers, body, URL, método).

_Se ignorar esse propósito:_ você cai em sleeps e “torcida”, com testes mais lentos e sujeitos a falsos negativos/positivos.

---

**Contraexemplo importante — o que `intercept` não é:**

- `cy.intercept()` **não intercepta** `cy.request()` (que faz a chamada HTTP **direto** do Cypress, fora do navegador).
- `cy.intercept()` **não** é um sniffer do sistema operacional: ele só vê o tráfego da **sessão de navegador** controlada pelo Cypress (o site aberto via `cy.visit()`).

_Se você assumir o contrário:_ asserções baseadas no alias podem **nunca** acontecer (ex.: `cy.wait('@alias')` dá **timeout**), porque a chamada não passou pelo navegador da aplicação.

---

## 2) Para que serve (usos práticos)

**2.1 Sincronização real com a rede (substitui `cy.wait(tempo)`)**

- **Exemplo (boa prática):** após clicar em “Buscar”, você espera **a requisição exata** (`@getProducts`) terminar e só então valida a lista/render.  
  _O que ganha:_ teste determinístico; segue no **momento certo**, sem “adivinhar” tempo.
- **Se não seguir:** usar `cy.wait(3000)` pode falhar em máquinas lentas/rápidas (flaky). Pode passar “no acaso” ou quebrar esporadicamente.

**2.2 Simulação de cenários difíceis (stub de sucesso/erro/vazio/latência/falha de rede)**

- **Exemplos úteis:**
  - **Erro 500** para validar mensagem de fallback (“Tente novamente”).
  - **Lista vazia (200 + `[]`)** para validar “empty state”.
  - **Latência alta** para validar spinner/loader.
  - **Falha de rede** para validar reconexão/retentativa.  
    _O que ganha:_ cobertura de **estados raros** sem depender do backend.
- **Se não seguir:** você fica refém do backend para reproduzir esses estados; muitos bugs de UX/erro **não são testados** ou viram testes instáveis.

**2.3 Isolamento do front-end (quando o backend não está pronto/estável)**

- **Exemplo:** times paralelos; você já valida o fluxo de “Cadastro de Projeto” devolvendo um payload estável via stub enquanto a API real está em desenvolvimento.  
  _O que ganha:_ avanço de QA em paralelo ao backend; feedback cedo sobre UI/fluxo.
- **Se não seguir:** bloqueio do QA até a API estar confiável; atrasos e menor cobertura inicial.

**2.4 Inspeção de tráfego (request/response) para QA funcional**

- **Exemplo:** validar que o **payload** do “Salvar” envia `name`, `email`, `roles` corretos; conferir `statusCode`/headers de resposta.  
  _O que ganha:_ assert **preciso** do contrato que o front envia/consome; diagnóstico rápido quando a UI falha.
- **Se não seguir:** testes “caixa-preta” excessivos; erros de payload passam despercebidos (UI aparenta correto, mas back recebe errado).

**2.5 Descoberta de endpoints e ordem de chamadas**

- **Exemplo:** começar com um intercept amplo (p.ex. `POST **`) para **descobrir a URL real** do login e então refinar para `**/login`.  
  _O que ganha:_ mapeia dependências da UI, identifica duplicidades/ordem e otimiza asserts.
- **Se não seguir:** dificuldade em entender por que a UI “não carregou”; perda de tempo rastreando manualmente chamadas no DevTools durante o teste.

**2.6 Aceleração da suíte (quando usar stub em vez de I/O real)**

- **Exemplo:** em testes puramente de layout/paginação, retornar fixture pequena em vez de baixar 2 MB de dados.  
  _O que ganha:_ testes **mais rápidos**, menos variância de rede.
- **Se não seguir:** suíte lenta e sujeita a picos de latência/instabilidades externas.

**2.7 Redução de flakiness em componentes reativos**

- **Exemplo:** grids que renderizam somente após o GET; usar `cy.wait('@getGrid')` antes de validar quantidades/ordenar filtros.  
  _O que ganha:_ evita condição de corrida entre render e assert.
- **Se não seguir:** “às vezes passa, às vezes quebra” porque o assert corre antes da UI terminar.

**2.8 Testes de UX sob falhas reais (delay, erro, retry)**

- **Exemplo:** simular 3 falhas seguidas (429/timeout) e ver se o botão “Tentar novamente” funciona e o estado visual se mantém acessível.  
  _O que ganha:_ garante padrões de UX mesmo sob falhas; cobre “edge-cases” críticos.
- **Se não seguir:** regressões de UX só aparecem em produção, quando a rede falha de verdade.

**2.9 Verificação de segurança e privacidade do front**

- **Exemplo:** inspecionar se dados sensíveis **não** são enviados (ex.: campo de senha em claro em endpoints errados).  
  _O que ganha:_ captura violações cedo.
- **Se não seguir:** risco de vazamento não percebido em testes — só descoberto em auditoria/produção.

**2.10 Controle de feature flags/experimentos via stub**

- **Exemplo:** retornar no GET de `/features` um flag `beta=true` para exercitar o fluxo novo sem precisar mexer no ambiente real.  
  _O que ganha:_ cobertura rápida de variações de produto.
- **Se não seguir:** dependência de alternar flags no ambiente; menor agilidade de QA.

**2.11 Documentação viva do contrato (front ↔ API)**

- **Exemplo:** assertions explícitas no objeto `request`/`response` funcionam como “garantia executável” do contrato.  
  _O que ganha:_ se a API mudar, o teste grita; conversa entre equipes fica objetiva.
- **Se não seguir:** divergências silenciosas; a UI pode “parecer” ok, mas integrar errado (quebra em produção).

---

## 3) Como `cy.intercept()` “casa” a rota (Route Matching) — versão simples (“infantil”)

Pense assim: você precisa dizer ao Cypress **quais pedidos da rede** ele deve notar.  
Você descreve isso com “regrinhas de reconhecimento”. Se a regra bater, ele escuta (ou simula).  
Abaixo estão as formas comuns, com exemplos em **linguagem natural** e o que acontece se errar.

---

### 3.1 Método + URL exata

- **Como falar pro Cypress:** “Olhe SOMENTE para quando a página fizer **GET** em **/api/products**.”
- **Quando usar:** quando você sabe exatamente qual caminho e método a tela usa.
- **Se não colocar o método:** ele pode pegar POST/PUT/DELETE também, confundindo seu `wait`.
- **Se errar a URL (barra a mais, query diferente):** não bate na regra → seu `wait` fica esperando e dá timeout.

---

### 3.2 Glob (curinga com `*` e `**`)

- **Como falar:** “Olhe GETs para QUALQUER caminho que termine com **/api/products** e que possa ter **qualquer** coisa depois (queries, etc.).”
- **Quando usar:** quando a URL muda um pouco (ex.: tem `?page=1`, `?category=tv`).
- **Se for genérico demais (ex.: “olhe tudo de /api/”)**: você pega coisa demais → `wait` pode capturar a rota errada.
- **Se for específico demais (ex.: só `page=1`)**: quando vier `page=2`, não casa → timeout.

---

### 3.3 Regex (regrinha “matemática” para URLs)

- **Como falar:** “Olhe qualquer URL que seja /api/products com ou sem query no final.”
- **Quando usar:** quando a URL muda bastante e você quer uma regra única.
- **Se a regex estiver ruim:** ou pega coisa demais (rota errada) ou não pega nada (timeout).

---

### 3.4 RouteMatcher (objeto com vários filtros)

- **Como falar:** “Olhe quando for GET para /api/products **e** vier com page=1 e limit=20 **e** o header x-tenant for ‘eu’ ou ‘us’.”
- **Tradução:** é a forma mais **detalhada** de dizer exatamente **como** o pedido deve ser para contar.
- **Quando usar:** quando o contrato é rígido (precisa ter certos parâmetros e headers).
- **Se você “apertar demais” a regra:** qualquer variação legítima (ex.: limit=50) já não bate → timeout.
- **Se você “afrouxar demais” (sem método/sem filtros):** pega pedido demais → `wait` casa com a chamada errada e sua asserção quebra.

---

### 3.5 Sempre que possível, inclua o **método**

- **Como falar:** “Olhe só GET” ou “Olhe só POST”.
- **Por quê:** evita capturar chamadas diferentes na mesma URL.
- **Se omitir:** você pode pegar POST quando queria GET (ou vice-versa) e confundir o teste.

---

### 3.6 Query params (os “?coisinhas=valor” da URL)

- **Quando considerar:** se a paginação/filtro **fazem parte do contrato** do cenário.
- **Se ignorar queries importantes:** o teste pode “passar” sem garantir que a UI mandou os filtros certos.
- **Se exigir queries demais:** pequenas mudanças (ex.: outro limit) fazem a regra não bater → timeout.

---

### 3.7 Headers (informações extras do pedido)

- **Quando considerar:** se o cenário precisa garantir, por exemplo, que mandou “authorization” ou “x-tenant”.
- **Se ignorar headers obrigatórios:** você não descobre que a UI parou de mandar algo crítico.
- **Se exigir headers em todo caso:** mudanças de infra podem quebrar sua regra sem necessidade.

---

### 3.8 Corpo (body) — melhor validar **depois** que bater

- **Dica prática:** use a regra só para **reconhecer** a rota (método + URL).  
  Depois, quando o `wait` devolver a interceptação, **aí** você olha o `request.body` ou `response.body`.
- **Se tentar casar pelo body na própria regra:** fica frágil (diferenças de formatação/serialização fazem não bater) → timeout.

---

### 3.9 Ordem: **registre a regra antes** da ação

- **Como proceder:** primeiro descreva a regra; depois clique/submit/visite.
- **Se fizer ao contrário:** a requisição já aconteceu; a regra não vê → `wait` dá timeout.

---

### 3.10 Domínio (mesmo site x outro site)

- **Quando a chamada vai para outro domínio:** pense em uma regra que considere o host (ex.: “olhe pedidos que vão para api.exemplo.com”).
- **Se usar caminho “curto” para pedido cross-origin:** a regra não bate → timeout.

---

### 3.11 Estratégia prática: comece amplo, depois afunile

- **Como fazer:** primeiro “olhe qualquer POST” só para **descobrir** qual URL real aparece no teste.  
  Depois troque para uma regra **mais específica** (método + parte certa da URL).
- **Se começar super específico sem saber a rota:** pequenos detalhes impedem o match → você perde tempo com timeouts.

### O que acontece se você **não** especificar o **método** no `cy.intercept`?

**Resposta curta:**  
Sem declarar o método (GET/POST/PUT/DELETE/OPTIONS…), a sua regra vira **genérica** e pode casar **qualquer** chamada que tenha a mesma URL. Isso causa **overmatch** (pega coisa demais), deixa o `cy.wait('@alias')` **confuso** (pode “acertar” a requisição errada) e torna o teste **flaky**.

---

#### Efeitos práticos (com exemplos):

- **Pega o método errado (GET vs POST na mesma URL).**  
  Ex.: a tela faz `GET /api/products` para listar e `POST /api/products` para criar.  
  **Sem método:** o alias pode casar com o **GET** quando você queria esperar o **POST** do “Salvar”.  
  **Sintoma:** `cy.wait('@alias')` retorna uma resposta 200 com corpo “lista”, mas sua asserção esperava o payload de criação → **falha**.

- **Pega o **preflight** `OPTIONS` (CORS) em vez da chamada “real”.**  
  Em requests com CORS, o navegador pode enviar `OPTIONS /api/...` antes do `POST`.  
  **Sem método:** o alias casa com o `OPTIONS`; o `cy.wait('@alias')` “passa” cedo demais.  
  **Sintoma:** você acha que esperou o login, mas só esperou o preflight; a UI ainda não mudou → **intermitência**.

- **Mistura de múltiplos métodos em sequência.**  
  Fluxos complexos podem disparar `GET` (carregar), depois `POST` (salvar), depois `GET` (atualizar).  
  **Sem método:** o primeiro `cy.wait('@alias')` pode capturar o primeiro `GET` e bagunçar a ordem dos seguintes.  
  **Sintoma:** asserts lidos “fora de ordem” (status/body não batem), testes que “às vezes passam”.

- **Stub aplicado no endpoint **errado**.**  
  Você quer simular só o `GET /api/users`, mas a regra sem método acaba **stubando** também o `POST /api/users`.  
  **Sintoma:** a tela de criar usuário falha de forma estranha (recebe lista mockada onde esperava confirmação de criação).

- **Diagnóstico mais difícil.**  
  Logs do runner mostram o alias disparando “toda hora”, porque **várias** chamadas casam.  
  **Sintoma:** difícil saber qual foi “aquela” exata requisição que seu teste deveria validar.

---

#### Como fica **correto** (regra de bolso):

- **Sempre** informe o método quando souber a intenção (ex.: “quero o POST de login”, “quero o GET da grade”).
- Se ainda **não sabe** a rota/método, use uma regra **ampla só para descobrir** (por exemplo “olhe qualquer POST”), veja no runner **qual** URL/método saem, e **depois refine** (fixe o método certo).

> **Resumo:** sem o método, você abre a porta para **overmatch** e `wait` **errado**; com o método, você filtra exatamente o que precisa e ganha **determinismo**.

---

## 4) Como responder (quando simular é necessário)

> Ideia simples: quando você **não quer** (ou **não pode**) depender da resposta real do backend, o `cy.intercept()` pode **responder no lugar do servidor**. Há três jeitos comuns: **resposta estática**, **função (route handler)** e **fixtures**.

---

### 4.1 Resposta estática (stub simples)

- **O que é:** você devolve uma resposta “pronta” (status, headers, body e até delay).
- **Exemplos práticos (sem código):**
  - “Para `GET /api/products`, devolva **200** com um **JSON pequenininho** de 2 itens.”
  - “Para `GET /api/products`, devolva **200** com **lista vazia** para validar estado ‘sem resultados’.”
  - “Para `POST /auth/login`, devolva **500** com uma **mensagem de erro** para testar o alerta da UI.”
  - “Para `GET /orders`, devolva **200** com **delay de 2s** para ver spinner/loader.”
- **Quando usar:** cenários previsíveis, controle de estados (sucesso/erro/vazio/lento), validação de UI **independente do backend**.
- **Se você não usar (e depender do backend):**
  - Pode **não conseguir** reproduzir erro 500, timeouts ou payloads específicos.
  - Testes ficam **lentos/instáveis** quando a rede oscila.
  - Bugs de UX em estados raros passam **sem cobertura**.

---

### 4.2 Função (route handler)

- **O que é:** em vez de uma resposta fixa, você usa uma **função** para decidir **na hora** o que fazer com a requisição.
  - Pode **responder** (customizar body/status/headers/delay).
  - Pode **deixar seguir** ao servidor real e **mexer na resposta** que voltar.
  - Pode **forçar falha de rede** (simular queda).
- **Exemplos práticos (sem código):**
  - “Se a requisição vier com `page=999`, **responda** com 200 e body vazio; caso contrário, **deixe seguir** e só **adicionar** um header na resposta.”
  - “Se o header `x-tenant` for `eu`, **atrasar** 1500 ms; se for `us`, responder normal.”
  - “Forçar **falha de rede** para ver o fallback da UI (botão ‘Tentar novamente’).”
- **Quando usar:** lógica condicional, experimentos A/B, simular erros **apenas em certas condições**, mexer parcialmente na resposta.
- **Se você não usar (e só tiver estático):**
  - Perde **flexibilidade** (não dá para variar por query/header).
  - Fica difícil representar **regras do mundo real** (latência variável, respostas dependentes de parâmetros).

---

### 4.3 Fixtures (responder com arquivos)

- **O que é:** devolver o **conteúdo de um arquivo** (por exemplo, `products.json`) como corpo da resposta.
- **Exemplos práticos (sem código):**
  - “Para `GET /api/products`, use `fixtures/products-small.json` para testar layout com poucos itens.”
  - “Para `GET /api/products`, use `fixtures/products-large.json` para validar paginação/scroll.”
  - “Para `GET /api/features`, use `fixtures/flags.json` para ligar/desligar **feature flags** no front.”
- **Quando usar:** dados **reutilizáveis** entre testes, massa de dados **maior** ou **estruturada**, manutenção mais fácil.
- **Se você não usar (e embutir JSON em linha):**
  - Os testes ficam **poluídos** e difíceis de manter.
  - Repetição de dados em várias specs; qualquer ajuste exige **múltiplas edições**.

---

### 4.4 Dicas de equilíbrio (stub × mundo real)

- **Use stub** quando precisa de **controle** (erro, vazio, latência, flags) e **velocidade/estabilidade**.
- **Use mundo real** quando precisa validar **integração** (cookies reais, redirecionamentos, CORS, autenticação).
- **Estratégia saudável:** mantenha **alguns testes com backend real** (smoke/integrados) e **vários com stub** (rápidos/estáveis para UI).

**Se você pender só para stub:** pode **não perceber** mudanças do backend (contrato/headers/códigos) e ter surpresas na integração.  
**Se você pender só para mundo real:** a suíte fica **lenta**, **frágil** e **difícil de reproduzir** cenários de erro.

---

## 5) Papel do **alias** e do `cy.wait()` (sincronização determinística)

> Ideia simples: dê um **nome** para a rota que você está ouvindo (alias) e **espere por esse nome**.  
> Assim, o teste só avança quando **aquela** requisição terminar — sem “adivinhar tempo”.

---

### 5.1 Alias — por que nomear?

- **O que é:** depois de dizer “ouça essa rota”, você dá um **apelido** (ex.: `@postLogin`).
- **Para que serve:** facilita **esperar** e **enxergar** no runner qual requisição foi capturada.
- **Exemplos (sem código):**
  - “Ouça o **POST de login** e chame de `@postLogin`.”
  - “Ouça o **GET da grade de produtos** e chame de `@getProducts`.”
- **Se você não usar alias:**
  - Fica sem um **alvo claro** para o `cy.wait`.
  - Depuração mais difícil (no log, você não sabe “qual foi qual”).
  - Tendência a cair em `cy.wait(tempo)` → **flaky**.

---

### 5.2 `cy.wait('@alias')` — por que esperar pelo **nome**?

- **O que é:** esperar **exatamente** a requisição com aquele alias terminar.
- **O que você ganha:**
  - **Precisão:** nada de tempo fixo; avança quando a resposta chega.
  - **Velocidade:** se a rede for rápida, o teste segue rápido; se for lenta, ele espera o necessário.
  - **Diagnóstico:** o `wait` te entrega o “pacote” da requisição (método, URL, status, body) para inspecionar.
- **Se você esperar tempo fixo (ex.: 3s) em vez do alias:**
  - Em máquinas rápidas, você **perde tempo**.
  - Em máquinas lentas, a asserção **corre antes** da resposta → **intermitência**.

---

### 5.3 Várias ocorrências (ordem importa)

- **Como funciona:** cada `cy.wait('@alias')` pega a **próxima** ocorrência daquela rota.
- **Exemplos (sem código):**
  - “A tela faz 2 GETs iguais; faça 2 `waits` sequenciais: pega o 1º e depois o 2º.”
  - “Após salvar (POST), a tela faz um GET de atualização; `wait` no POST e depois no GET, nessa **ordem**.”
- **Se ignorar a ordem:**
  - O primeiro `wait` pode pegar a **requisição errada** (ex.: um GET anterior), e sua asserção falha por **status/body inesperados**.

---

### 5.4 Registrar **antes** da ação (ordem correta)

- **Regra de ouro:** primeiro **registre** o intercept + alias, **depois** clique/submit/visite, **depois** `wait`.
- **Se registrar depois do clique/submit:**
  - A requisição **já aconteceu**; o alias não a pegou.
  - Resultado: `cy.wait('@alias')` **time-out** (nunca chega).

---

### 5.5 Timeouts realistas

- **Quando aumentar:** rotas com **redirecionamento** (302/303), upload/download, ou **latência** conhecida (simulada com delay).
- **Se não ajustar:** o `wait` pode **estourar** mesmo com a app funcionando → **falso negativo**.

---

### 5.6 Ruídos comuns (evite casar com a coisa errada)

- **Preflight CORS (`OPTIONS`):** sem método no match, o alias pode casar com o **OPTIONS** em vez do **POST real**.
- **Pings/ads/telemetria:** podem disparar POSTs que não te interessam.
- **Como evitar:** use **método + parte da URL** correta ou crie um intercept separado para **silenciar** esses ruídos.
- **Se não filtrar:** `wait` casa com o **alvo errado**, sua asserção quebra (status/body não batem).

---

### 5.7 Quando **não** usar `cy.wait('@alias')`

- **Cenários simples e determinísticos** onde a UI dá um **sinal imediato** suficiente (ex.: mudança de URL confiável e instantânea).
- **Atenção:** em fluxos sensíveis (auth, salvar, carregar listas, uploads), **é melhor esperar o alias**.
- **Se omitir em casos sensíveis:** risco alto de validar a UI **antes** do backend → **flaky**.

---

### 5.8 Resumo prático

- Sempre que a UI **depender de rede**, prefira **alias + `cy.wait('@alias')`**.
- Se não souber a rota ainda, comece **amplo para descobrir** e **refine** depois.
- Ajuste **timeouts** onde fizer sentido e **filtre ruídos** (método + URL).
- Benefícios: **determinismo**, **velocidade** e **diagnóstico** muito melhores.

---

## 6) Diferença essencial: `cy.intercept()` × `cy.request()`

> **Frase-chave:**  
> `cy.intercept()` observa/controle o **que a UI (navegador)** chama.  
> `cy.request()` faz uma **chamada HTTP direta** (fora do navegador).

---

### 6.1 Quem dispara a chamada

- **`cy.intercept()`**: não dispara nada; ele **escuta** (e pode responder no lugar do servidor) as requisições que **a página** faz.
  - **Exemplo (sem código):** “Quando eu clicar em **Entrar**, a página faz um **POST /login**. O `intercept` escuta esse POST.”
  - **Se você depender do intercept para ‘criar dados’**: não vai funcionar, porque intercept **não envia** requisições; ele só observa (ou responde).
- **`cy.request()`**: **envia** uma requisição HTTP por conta própria, sem precisar de UI.
  - **Exemplo:** “Antes do teste, **crie** um usuário via **POST /users** usando `request`.”
  - **Se você tentar ‘ouvir’ um `cy.request()` com `intercept`**: não vai ouvir; `request` **não passa** pelo intercept.

---

### 6.2 Onde acontece (navegador × fora do navegador)

- **`cy.intercept()`**: atua no **navegador** controlado pelo Cypress (o mesmo da sua app).
  - **Exemplo:** a UI chama `GET /products`; o intercept vê **URL, método, headers, body**, e você pode simular a resposta.
  - **Se você fechar os olhos para isso:** pode achar que ele “capta tudo do sistema”, mas **não** — só o que a **página** pedir.
- **`cy.request()`**: acontece **fora do navegador** (no Node do Cypress).
  - **Exemplo:** `request` em `POST /login` **loga** e guarda cookie/token para próximos passos **sem abrir tela**.
  - **Se você tentar validar um loader/spinner com `request`**: não dá; não tem render, porque não passou pela UI.

---

### 6.3 Objetivo típico

- **`cy.intercept()`**: validar **como a UI consome a API** (esperar o alias, checar payloads/respostas, simular erro/latência, testar UX sob falha).
  - **Exemplo:** confirmar que, ao salvar, a página enviou `name/email` corretos e, com erro 500, mostra alerta.
  - **Se você não usar intercept aqui:** tende a usar `wait(tempo)` (flaky) e perde visibilidade de request/response.
- **`cy.request()`**: testar **a API em si** e/ou **preparar dados** (setup/teardown) **rápido** e **sem UI**.
  - **Exemplo:** criar usuário, criar projeto, apagar dados “sujos” antes/depois do teste.
  - **Se você usar UI para tudo:** seus testes ficam **lentos e frágeis** para tarefas que poderiam ser diretas.

---

### 6.4 Interação entre eles (o que **não** acontece)

- `cy.intercept()` **não intercepta** `cy.request()`.
  - **Exemplo:** você faz `request POST /users` para preparar massa; o intercept **não** vê esse POST.
  - **Se você esperar `@alias` após `request`**: vai dar **timeout**, porque não houve requisição do **navegador**.
- `cy.request()` **não** testa UI (não renderiza, não dispara eventos visuais).
  - **Exemplo:** `request POST /login` funciona para autenticar, mas **não valida** se o botão “Entrar” mostra spinner certo.

---

### 6.5 Quando escolher cada um (regra de bolso)

- **Use `intercept` quando:**
  - Precisa **sincronizar** a UI com a rede (alias + wait).
  - Quer **inspecionar** request/response que a UI **de fato** envia/recebe.
  - Precisa **simular** respostas (erro/vazio/delay/falha) e observar o **comportamento visual**.
- **Use `request` quando:**
  - Precisa **criar/limpar dados** rápido (setup/teardown).
  - Quer **validar a API** diretamente (contratos, status, headers) **sem** interface.
  - Quer **autenticar** sem passar pela tela de login (ganho de tempo).

**Se você inverter:**

- Usar `request` para coisas 100% de UI → você **não** valida UX/regras visuais.
- Usar `intercept` para preparar dados → você **não** cria nada (porque intercept **não envia** calls).

---

### 6.6 Combinação vencedora (estratégia mista)

- **Setup com `cy.request()`**: crie o usuário/projeto, gere token/cookie.
- **Fluxo com `cy.intercept()`**: abra a tela, acione a ação real, **espere o alias**, e valide tanto **payload/response** quanto **efeito visual**.
- **Se não combinar:**
  - Só intercept: suíte **lenta** (porque cria tudo via UI) e difícil simular massas grandes.
  - Só request: você **não vê** se a UI reage certo (spinners, mensagens, estados).

> **Resumo final:**  
> `intercept` = **UI ↔ Rede** (observa/controle);  
> `request` = **Rede direta** (setup/teardown/API).  
> Juntos, dão **cobertura completa**: dados prontos + UI confiável.

---

## 7) Escopo e limites (o que o `intercept` vê)

> Pense no `cy.intercept()` como um “guardinha” que fica **dentro do navegador do teste**.  
> Ele só enxerga o que **essa** aba/página pedir à rede.

---

### 7.1 Onde o `intercept` funciona (escopo correto)

- **Dentro da sessão do navegador controlada pelo Cypress** (a página que você abriu com `cy.visit`).
- **Chamadas da própria aplicação**: XHR, `fetch`, GraphQL, assets e formulários que **a UI** dispara.
- **Exemplos (sem código):**
  - A página faz `GET /api/products`: o `intercept` vê e pode simular.
  - O formulário de login envia `POST /auth/login`: o `intercept` vê e pode simular.
  - A UI chama `https://cdn.exemplo.com/styles.css`: o `intercept` vê (mesmo sendo outro domínio).

**Se você assumir que ele “pega tudo do sistema”:**

- Vai tentar capturar tráfego que **não passa** pela aba do Cypress (outros apps, outros navegadores, scripts externos).
- **Sintoma:** `cy.wait('@alias')` dá **timeout** continuamente, porque “nada” casa.

---

### 7.2 O que ele **não** vê

- **`cy.request()`** (chamadas diretas do Node do Cypress) → **não passam** pelo `intercept`.
- **Outros aplicativos** (Postman, navegador fora do Cypress, serviços de fundo).
- **Outras abas/janelas** que não sejam a **do teste**.
- **Exemplo (sem código):** você cria um usuário com `cy.request POST /users` e tenta “ouvir” com `intercept`: **não vai ouvir**.

**Se você tentar mesmo assim:**

- Vai esperar um alias que **nunca** dispara → **timeout** e diagnóstico confuso (“mas eu fiz um POST!”).

---

### 7.3 Cross-origin (outro domínio)

- **Boa notícia:** o `intercept` enxerga **chamadas para outros domínios** feitas pela sua página (ex.: `https://api.externo.com/v1/...`).
- **Cuidados práticos:**
  - **Casa a URL certa** (use parte do host/caminho no padrão).
  - Em fluxos que **navegam** para outro domínio (redirecionam a UI), você pode precisar **ajustar o escopo de interação** (ex.: `cy.origin`), mas a camada de rede continua observável.
- **Se você casar só caminho relativo** quando a chamada é absoluta para outro host:
  - A regra **não bate** → `cy.wait` **timea**.

---

### 7.4 Iframes e embeds

- Se a **sua** aplicação carrega um **iframe** de outro domínio que faz requisições próprias:
  - O `intercept` pode **ver** as chamadas do iframe (ainda é rede do navegador), **mas** interagir com a UI do iframe é outra história (isolamento de domínio).
- **Se você achar que o intercept “não pega” por causa do iframe:**
  - Verifique o **padrão de URL/método** e ruídos (às vezes está batendo em rota de ads/telemetria em vez da sua).

---

### 7.5 Ruídos que aparecem no escopo (e não interessam)

- **Ads, pings, telemetria, prefetch, preflight CORS (`OPTIONS`)**.
- **Efeito:** o alias casa com “coisas barulhentas” e **não** com a rota do seu cenário.
- **Como lidar:**
  - Use **método + parte da URL correta** para o seu endpoint.
  - Crie intercepts específicos para **silenciar** domínios de ads/pings (responder 204).
- **Se você ignorar:**
  - `cy.wait('@alias')` pode disparar em **rotas erradas**, quebrando asserções (status/body inesperados).

---

### 7.6 Ambientes e proxies (dev/homolog/prod)

- Em ambientes com **proxy/rewrites**, a URL final pode mudar (ex.: `/api` vira `/v1`).
- **Dica:** comece com um padrão **um pouco mais amplo** para **descobrir** o caminho real e **depois refine**.
- **Se você casar um caminho que não existe naquele ambiente:**
  - **Nada casa** → `wait` em **timeout**, embora a app funcione.

---

### 7.7 Regras de bolso (para não sair do escopo)

- **Garanta que a UI realmente dispara** a requisição (ex.: e-mail válido em `type="email"`; sem modal/overlay bloqueando).
- **Registre o intercept antes** da ação.
- **Filtre por método** e pela **parte relevante** da URL (evite genérico demais).
- **Descubra → refine**: se ainda não sabe a rota, comece amplo (ex.: “ouça qualquer POST”), veja no runner o que sai e depois afunile (método + parte relevante da URL).

Se não fizer: você chuta um padrão específico que não bate → wait em timeout e perda de tempo.

---

## 8) O que costuma aparecer na interceptação (para inspecionar/validar)

> Ideia: quando você espera pelo alias, o Cypress te entrega um “pacote” com **request** (o que foi enviado) e **response** (o que voltou).  
> Validar os campos **certos** evita falsos positivos e acelera o diagnóstico.

---

### 8.1 No **Request** (o que a UI enviou)

- **method**: GET, POST, PUT, DELETE…

  - **Por que olhar:** garante que você está validando a **ação certa** (ex.: salvar == POST).
  - **Se ignorar:** você pode estar checando um GET “de carregamento” achando que é o POST de salvar (asserções erradas).

- **url** + **query** (tudo após `?`, como `page=2`, `limit=20`)

  - **Por que olhar:** confirma **filtros/paginação** enviados; evita aceitar `page=999` sem perceber.
  - **Se ignorar:** o teste “passa” mesmo com filtro errado; bug aparece só em produção.

- **headers** (ex.: `content-type`, `authorization`, `x-tenant`)

  - **Por que olhar:** tokens/tenancy/idioma podem ser **obrigatórios**.
  - **Se ignorar:** a UI pode ter parado de mandar um header crítico e você não nota.

- **body** (pode vir em dois jeitos comuns):
  - **`application/x-www-form-urlencoded`** (form HTML): parece `chave=valor&email=ana%40ex.com`.
    - **Cuidados:** valores vêm **codificados** (`@` vira `%40`).
    - **Se você “comparar texto cru” sem decodificar:** acha que está diferente e falha à toa.
  - **`application/json`**: objeto JSON (às vezes **serializado como string**).
    - **Cuidados:** pode ser objeto **ou** string JSON (dependendo do framework).
    - **Se assumir que é sempre objeto:** acesso direto falha; se assumir que é sempre string, também falha — resultado: falsos negativos.

---

### 8.2 No **Response** (o que a UI recebeu)

- **statusCode** (200, 201, 204, 302/303, 400, 401, 403, 404, 500…)

  - **Por que olhar:** UX muda por status (sucesso, erro, redirect).
  - **Se ignorar:** testar UI de sucesso quando, na verdade, veio 500; você “passa” sem cobrir o fluxo de erro.

- **headers** (ex.: `content-type`, cache, CORS, cookies)

  - **Por que olhar:** cookies/same-site, idioma, cache podem afetar **estado** e render.
  - **Se ignorar:** problemas de sessão/cache podem ser mascarados até o ambiente real.

- **body** (lista de itens, mensagens, objeto salvo)

  - **Por que olhar:** a tela exibe **isso**. Se o contrato mudou (campo renomeado), a UI pode quebrar silenciosamente.
  - **Se ignorar:** o teste só “vê” a UI final, mas não sabe **por que** falhou (diagnóstico pobre).

- **tempo/latência** (implícito; útil quando você **simula delay**)
  - **Por que olhar:** valida loaders/spinners e botões desabilitados durante a espera.
  - **Se ignorar:** o loader pode sumir cedo ou ficar travado e você não percebe.

---

### 8.3 O que **validar** de forma objetiva (e o que acontece se não validar)

- **Ação certa** (method) + **rota certa** (url):

  - **Se não validar:** confusão de chamadas; `wait` pega a errada → teste “quebra” ou “passa no acaso”.

- **Parâmetros críticos** (query do filtro/paginação):

  - **Se não validar:** front envia filtro incorreto; usuário vê dados inconsistentes e o teste não acusa.

- **Contrato mínimo de payload** (campos-chave no request e no response):

  - **Se não validar:** mudanças de campo (ex.: `firstName` → `givenName`) passam despercebidas; a UI quebra mais à frente.

- **Status esperado para o fluxo** (200/201/204 para sucesso; 400+/500 para erro):

  - **Se não validar:** você pode “testar sucesso” num cenário de erro real (o teste não diz).

- **Headers obrigatórios** (auth/tenant/idioma) **quando aplicável**:

  - **Se não validar:** queda silenciosa de segurança/tenancy; bug só aparece em produção.

- **Comportamento da UI após a resposta** (mensagem, redirecionamento, render):
  - **Se não validar:** você confirma a rede, mas não confirma **a experiência real** (botão não habilita, lista não atualiza, etc.).

---

### 8.4 Regrinhas simples para evitar dor de cabeça

- **Decida antes**: o que é **crítico** para este cenário? (ex.: método/rota, 2–3 campos de request/response, status esperado, 1 reflexo visual).
  - **Se você tentar validar “tudo sempre”:** teste vira frágil, caro de manter e quebra por detalhes irrelevantes.
- **Valide o **mínimo significativo\*\* (contrato essencial + efeito visual).
  - **Se validar de menos:** passa bug; se validar demais, vira flake.

---

### 8.5 Exemplos de “checagens inteligentes” (descritas em palavras)

- “Garantir que o **POST de salvar** foi para a **URL certa** e levou **nome e e-mail** no corpo, e que a **UI mostrou toast de sucesso**.”
- “Garantir que o **GET da grade** foi chamado com `page=2&limit=20`, retornou **200**, e a **tabela renderizou 20 linhas**.”
- “Garantir que ao simular **500** no salvar, a **mensagem de erro** aparece e o **botão** permite **tentar novamente**.”

> **Resumo:** olhe **o que importa** em `request` e `response`, no nível **que o seu cenário exige**, e sempre conecte isso a **um efeito visível na UI**. Se você ignorar esses pontos, o teste pode “passar” sem cobrir o que realmente quebra em produção — ou “quebrar” por detalhes que não importam.

---

## 9) Fluxo recomendado (mental model) — do jeitinho certo e o que acontece se não seguir

> Pense em 5 passos simples, sempre nessa ordem. Isso evita 90% dos “bugs de teste”.

---

### Passo 1 — **Registrar a interceptação**

- **O que fazer:** antes de qualquer clique/submit/visit, descreva **o que quer ouvir** (método + parte da URL) e dê um **alias** (ex.: `@getList`, `@postSave`).
- **Se não fizer:** a requisição pode acontecer **antes** do intercept existir → o alias **não pega nada** → `cy.wait('@alias')` dá **timeout**.

---

### Passo 2 — **Dar um alias claro**

- **O que fazer:** nomes descritivos e únicos por cenário (ex.: `@postLogin`, `@getProductsPage2`).
- **Se não fizer:** você se perde no runner (vários alias parecidos ou nenhum alias) → depuração difícil; tendência a usar `wait(tempo)` → **flaky**.

---

### Passo 3 — **Executar a ação que dispara a chamada**

- **O que fazer:** clicar, submeter o formulário, navegar para a rota… garantindo que **nada bloqueia** (ex.: e-mail válido em input `type="email"`, sem modal por cima).
- **Se não fizer direito:** a UI **não dispara** a request (HTML5 barra submit, overlay tampa botão) → alias nunca é chamado → `wait` **timea** e você caça fantasma.

---

### Passo 4 — **Esperar pelo alias e (se precisar) inspecionar**

- **O que fazer:** `cy.wait('@alias')` para sincronizar exatamente com a requisição certa.  
  Se o cenário pedir, **olhe** `request`/`response` (método, URL, query, headers, body, status).
- **Se não fizer:** usa `cy.wait(tempo)` e reza. Em máquina lenta, a asserção roda **antes** da resposta; em máquina rápida, você **perde tempo** à toa. Resultado: teste **instável** e **lento**.

---

### Passo 5 — **Validar o efeito na UI**

- **O que fazer:** depois da resposta, confirme o **reflexo visual** correto (mensagem, redirecionamento, tabela renderizada, botão habilitado…).
- **Se não fizer:** você até confirma a rede, mas **não confirma a experiência real**; bugs de UX passam direto (ex.: toast não aparece, spinner não some).

---

### Extras úteis nesse fluxo

- **Descobrir → Refine:** não sabe a rota exata? Comece **amplo** (por exemplo: “ouça qualquer POST”), veja o que sai no runner, **troque** para um padrão **específico** (método + URL relevante).

  - **Se pular isso:** você chuta um padrão hiper-específico e toma **timeouts** sem entender por quê.

- **Ordem importa:** intercept **antes**, ação **depois**, `wait` **por último**.

  - **Se inverter:** o teste “corre na frente” da rede → `wait` pega a rota errada ou **nada**.

- **Timeouts realistas:** rotas com redirect/latência precisam de **timeout maior só nelas**.

  - **Se ignorar:** falsos negativos por timeout, mesmo com app funcionando.

- **Filtre ruído:** sempre que puder, **inclua o método** e um pedaço **exato** da URL.  
  Ads, pings e preflight CORS geram barulho.
  - **Se não filtrar:** o `wait` casa com **coisa errada** e sua asserção quebra por status/body que **não** são do seu cenário.

---

### Resumo do fluxo vencedor

1. **Intercept** (método + URL) → 2) **Alias** → 3) **Ação** → 4) **`wait('@alias')`** (+ inspeção se precisar) → 5) **Validação visual**.  
   Seguindo isso, você ganha **determinismo**, **velocidade** e **diagnóstico**. Ignorando, você ganha **flakiness**, **timeouts** e **dor de cabeça**.

---

## 10) Boas práticas — exemplos e o que acontece se não seguir

> Regras simples que evitam flakiness, timeouts e diagnósticos ruins.

---

### 10.1 Intercepte **antes** da ação

- **Exemplo (certo):** primeiro “ouça o POST de salvar”, **depois** clique em “Salvar”.
- **Se não seguir:** a requisição acontece **antes** do intercept existir → o alias não pega nada → `cy.wait('@alias')` dá **timeout**.

---

### 10.2 **Especifique o método** (GET/POST/PUT/DELETE)

- **Exemplo (certo):** “ouça **POST** em /auth/login”, não apenas “/auth/login”.
- **Se não seguir:** a regra casa com **qualquer** método (inclui `OPTIONS` de CORS) → `wait` pega a chamada errada → asserções quebram por status/body inesperados (overmatch).

---

### 10.3 Use **alias descritivos** e consistentes

- **Exemplo (certo):** `@postLogin`, `@getProductsPage2`.
- **Se não seguir:** você se perde no runner (qual alias é qual?) → depuração confusa; tendência a recorrer a `cy.wait(tempo)` → **flaky**.

---

### 10.4 Prefira `cy.wait('@alias')` a `cy.wait(tempo)`

- **Exemplo (certo):** “espere o **GET da grade** terminar” (alias), e só então valide a tabela.
- **Se não seguir:** em máquina lenta, a asserção roda **antes** da resposta; em máquina rápida, você **perde tempo** parado. Resultado: testes **instáveis** e **lentos**.

---

### 10.5 **Proteja dados sensíveis**

- **Exemplo (certo):** não imprimir senha; validar “tem `password` no body” sem logar valor; usar `Cypress.env`.
- **Se não seguir:** credenciais expostas em logs/CI; risco de segurança e necessidade de limpar históricos.

---

### 10.6 Ajuste **timeouts** apenas onde precisa

- **Exemplo (certo):** aumentar timeout **só** no `wait` do login com redirect.
- **Se não seguir:** falsos negativos por timeout (se curto demais) **ou** suíte lenta (se alargar tudo sem critério).

---

### 10.7 Refine o matcher: **descubra → afunile**

- **Exemplo (certo):** começar ouvindo “qualquer POST” para **descobrir** a URL real; depois trocar para “POST em **/auth/login**”.
- **Se não seguir:** apostar num padrão hiper-específico que não bate → **timeouts** e perda de tempo.

---

### 10.8 Equilíbrio **stub × real**

- **Exemplo (certo):** maioria dos testes com **stub** (rápidos/estáveis) + alguns **reais** (smoke de integração).
- **Se não seguir:**
  - Só stub → pode não perceber mudanças de contrato do backend (surpresas na integração).
  - Só real → suíte **lenta** e **frágil**, difícil simular erros raros (500/timeout).

---

### 10.9 Valide o **mínimo significativo**

- **Exemplo (certo):** método/rota certos, 1–3 campos críticos de request/response e **um** reflexo visual (toast, render, redirect).
- **Se não seguir:**
  - Validar **de menos** → bug passa despercebido.
  - Validar **demais** → teste frágil (quebra por detalhe irrelevante).

---

### 10.10 Filtre **ruído** (ads, pings, preflight `OPTIONS`)

- **Exemplo (certo):** matcher com método + parte exata da URL; intercept separado para **silenciar** domínios de ads (responder 204).
- **Se não seguir:** `wait` casa com rota errada (telemetria/ads) → asserções falham por status/body que não são do seu cenário.

---

### 10.11 Garanta que a UI **dispara** a requisição

- **Exemplo (certo):** e-mail **válido** em input `type="email"`, remover overlay/modal que bloqueia o botão, submeter **o form correto**.
- **Se não seguir:** a requisição **não acontece** → alias nunca dispara → `cy.wait` **timea** e você debuga o que não é problema de rede, e sim de **interação/validação HTML5**.

---

### 10.12 Separe **dados de teste** (fixtures) do teste

- **Exemplo (certo):** `fixtures/users.json` para listas grandes; usa no stub quando necessário.
- **Se não seguir:** JSONs enormes dentro de teste → código poluído, duplicado; manutenção trabalhosa.

---

### 10.13 Combine com `cy.request()` para **setup/teardown**

- **Exemplo (certo):** criar usuário com `request` (rápido) e testar a tela com `intercept` (UX).
- **Se não seguir:** criar massa via UI → testes **lentos**; tentar preparar dados com `intercept` → **não cria nada** (intercept só observa/controle).

---

### 10.14 Documente **intenção** no nome do alias

- **Exemplo (certo):** `@getInventoryAfterSave` (diz _quando_ e _por quê_).
- **Se não seguir:** nomes genéricos (`@data`, `@req1`) atrapalham leitura e review; mais chance de uso incorreto do alias.

---

### 10.15 Reavalie matchers quando o ambiente muda

- **Exemplo (certo):** em staging a rota virou `/v1/products`; ajuste o glob/regex.
- **Se não seguir:** o matcher não bate mais → `wait` em **timeout** e “teste quebrado” sem motivo funcional.

---

**Resumo:** aplicar essas práticas traz **determinismo**, **clareza** e **velocidade**. Ignorá-las cobra preço em **flakiness**, **timeouts** e **diagnóstico difícil**.

---

## 11) Erros comuns e como pensar (causas, sintomas, correção)

> Guia “ache e conserte” para os problemas que mais aparecem usando `cy.intercept()` + `cy.wait()`.

---

### 11.1 `cy.wait('@alias')` em **timeout**

- **Causa provável:** o intercept foi **registrado depois** da ação; o matcher **não bate** (URL/método errados); a UI **não disparou** a requisição.
- **Sintomas:** `Timed out retrying... No request ever occurred`.
- **Como pensar/corrigir:**
  - **Ordem:** Intercept **antes** → ação (clique/submit) → `wait`.
  - **Matcher:** comece **amplo** (ex.: “olhe qualquer POST”) para **descobrir** a rota e depois **afunile** (método + parte da URL).
  - **UI disparou?** E-mail válido em `type="email"`, submeter **o form certo**, remover modal/overlay.

---

### 11.2 Alias “pega” a requisição **errada** (overmatch)

- **Causa provável:** matcher **genérico** (sem método; glob largo), ruídos (ads/pings/telemetria, preflight CORS `OPTIONS`).
- **Sintomas:** `wait` retorna status/body **inesperados** (ex.: você esperava POST de salvar, pegou GET da grade).
- **Como pensar/corrigir:**
  - **Inclua método** (POST/GET) e uma **parte específica** da URL.
  - **Silencie ruídos** (domínios de ads/telemetria) com intercept separado retornando 204.
  - Evite casar com `OPTIONS` (CORS): use método correto no matcher.

---

### 11.3 Misturar **GET** e **POST** na mesma URL

- **Causa provável:** intercept sem método (apenas a URL).
- **Sintomas:** `wait` ora pega o GET de listar, ora o POST de salvar (ou vice-versa) → asserções quebram.
- **Como pensar/corrigir:** sempre **fixe o método** no matcher; use **aliases distintos** (`@getProducts`, `@postProducts`).

---

### 11.4 Preflight **`OPTIONS`** “enganando” o teste

- **Causa provável:** CORS; sem método no matcher, o alias bate no `OPTIONS` (e **não** na chamada real).
- **Sintomas:** `wait` termina **rápido demais**; UI ainda **não mudou**.
- **Como pensar/corrigir:** especifique o **método real** (ex.: POST) e evite casar `OPTIONS`.

---

### 11.5 Formulário **não envia** (validação HTML5 / alvo errado)

- **Causa provável:** input `type="email"` com valor inválido; `cy.get('form')` retornou **vários forms**; botão bloqueado por modal/overlay.
- **Sintomas:** você “clicou”, mas **nenhuma** request ocorreu → `wait` **timea**.
- **Como pensar/corrigir:**
  - Use **e-mail válido**; submeta o **form correto** (ex.: via botão → `.closest('form')`).
  - Remova overlay/modal; garanta visibilidade/clicabilidade.

---

### 11.6 Regex/glob **ruins** (ou específicos demais)

- **Causa provável:** padrão que não cobre variações (barra final, versão `/v1/`, query), ou cobre **coisa demais**.
- **Sintomas:** ou **não casa nunca** (timeout) ou casa com **rotas indesejadas** (falhas aleatórias).
- **Como pensar/corrigir:** primeiro **descubra** a URL no runner, depois escreva um padrão **preciso**, mas **tolerante** a pequenas diferenças (ex.: glob com `**/api/products*`).

---

### 11.7 Validar **body** do request de forma frágil

- **Causa provável:** comparar **string crua** de `x-www-form-urlencoded` (com `%40` no lugar de `@`) ou assumir que JSON **sempre** é objeto (às vezes vem como **string**).
- **Sintomas:** asserções que falham “do nada” (mesmo envio estando correto).
- **Como pensar/corrigir:**
  - Para **form-urlencoded**, **decode** (pense em “chave=valor”).
  - Para JSON, **considere** os dois casos (objeto ou string JSON) antes de acess: pode vir como objeto (já parseado) ou como string JSON (precisa parsear) antes de acessar campos.
- **Se assumir errado:** suas asserções falham “do nada” apesar do envio estar correto.

---

### Conclusão

- **`cy.intercept()`** fornece **controle e visibilidade** sobre chamadas de rede feitas pela UI.
- **`cy.wait('@alias')`** sincroniza o teste com a **requisição exata** e expõe dados para validação.
- Usados juntos, aumentam **confiabilidade**, **rapidez** e **clareza diagnóstica** dos testes de front-end.
