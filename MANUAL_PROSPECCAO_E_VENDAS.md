# 🚀 Manual Completo de Prospecção, Vendas e Gestão Comercial (AgendaFlex v1.0)

Este manual é o seu guia passo a passo para transformar o **AgendaFlex** em uma máquina de receita recorrente mensal (MRR). Aqui você encontrará modelos de abordagem, precificação, quebra de objeções, roteiro de demonstração e o mecanismo do teste grátis de 14 dias.

---

## 📌 Sumário
1. [Proposta Única de Valor (Por que o cliente compra?)](#1-proposta-única-de-valor)
2. [Público-Alvo Ideal (ICP)](#2-público-alvo-ideal)
3. [Tabela de Preços e Modelos de Assinatura](#3-tabela-de-preços-e-modelos-de-assinatura)
4. [A Estratégia do "Teste Piloto de 14 Dias Sem Risco"](#4-a-estratégia-do-teste-piloto-de-14-dias)
5. [Controle Técnico do Período de Teste (Bloqueio Automático)](#5-controle-técnico-do-período-de-teste)
6. [Scripts de Abordagem (Copie e Cole)](#6-scripts-de-abordagem)
7. [Roteiro de Demonstração em 3 Minutos](#7-roteiro-de-demonstração-em-3-minutos)
8. [Como Quebrar as 5 Maiores Objeções](#8-como-quebrar-as-5-maiores-objeções)
9. [Script de Fechamento no 14º Dia](#9-script-de-fechamento-no-14º-dia)
10. [Metas de Crescimento e Projeção Financeira](#10-metas-de-crescimento-e-projeção-financeira)

---

## 1. Proposta Única de Valor

O grande erro de sistemas tradicionais de agendamento é que eles obrigam o cliente a baixar um aplicativo pesado (de 50 MB) ou criar conta com e-mail e senha antes de conseguir marcar um corte. O cliente desiste e manda mensagem no WhatsApp.

### O diferencial matador do AgendaFlex:
* **Zero Fricção:** O cliente abre o link direto na Bio do Instagram ou WhatsApp.
* **3 Cliques:** Escolhe o serviço, escolhe o profissional/horário e confirma.
* **Confirmação no WhatsApp:** Sem custos com gateways de SMS; o próprio cliente dispara a confirmação formatada para o WhatsApp do lojista.
* **Anti-Overbooking:** O lojista nunca mais marca dois clientes no mesmo horário por engano.

---

## 2. Público-Alvo Ideal (ICP)

Foque inicialmente em negócios com fluxo diário de clientes e atendimentos com hora marcada:

| Segmento | Dor Principal do Dono |
| :--- | :--- |
| **Barbearias (2 a 6 barbeiros)** | Perdem clientes enquanto estão cortando cabelo e não podem digitar no WhatsApp. |
| **Salões de Beleza & Cabeleireiras** | Dificuldade em conciliar agenda de múltiplos serviços (cabelo, química, lavagem). |
| **Designers de Sobrancelhas & Nails** | Alto volume de mensagens no direct do Instagram perguntando "tem horário hoje?". |
| **Estúdios de Tatuagem / Piercing** | Desorganização nos horários vagos entre sessões longas. |
| **Estética & Massoterapia** | Clientes que desmarcam de última hora e deixam janelas ociosas. |

---

## 3. Tabela de Preços e Modelos de Assinatura

Para quem está começando a prospectar, a simplicidade de planos fecha mais vendas do que muitas opções.

### 💰 Planos Recomendados:

#### 🔹 Plano Essencial (Solo / Individual)
- **R$ 49,90 / mês** (ou **R$ 479,00 / ano** à vista)
- Para profissionais autônomos que atendem sozinhos.
- 1 Profissional ativo.
- Serviços ilimitados e agendamentos ilimitados.
- Link personalizado para Bio (`agendaflex.com/nome-do-profissional`).

#### 🔹 Plano Equipe (Barbearias e Salões)
- **R$ 79,90 / mês** (ou **R$ 779,00 / ano** à vista)
- Para estabelecimentos com 2 a 8 profissionais.
- Cadastro de toda a equipe com fotos individuais.
- Separação de horários e serviços por profissional.
- Painel com filtro por dia e profissional.

> 💡 **Dica de Negociação:** Mostre que o valor mensal (R$ 49,90 ou R$ 79,90) equivale ao valor de **apenas 1 ou 2 cortes de cabelo no mês**. Se o sistema salvar 2 clientes que iriam embora pela demora no WhatsApp, ele já se pagou 100%!

---

## 4. A Estratégia do "Teste Piloto de 14 Dias Sem Risco"

Nunca chegue tentando vender uma assinatura imediata. Use a técnica do **"Onboarding Concierge"**:

1. **Pesquisa Prévia (2 minutos):**
   - Acesse o Instagram da barbearia/salão da sua cidade.
   - Baixe a foto do perfil e veja 3 serviços que eles oferecem.
2. **Setup Rápido:**
   - No seu painel administrativo, configure a empresa com o nome dela, foto e os 3 serviços.
   - O link dela já nasce pronto (ex: `agendaflex.com/barbearia-do-carlos`).
3. **Apresentação de Impacto:**
   - Você entrega o link já funcionando com a cara da loja dele.
   - Oferece **14 dias de degustação total sem cartão e sem compromisso**.

---

## 5. Controle Técnico do Período de Teste (Bloqueio Automático)

Para controlar o período de degustação de 14 dias sem precisar monitorar manualmente no calendário:

### Regra no Banco de Dados (PostgreSQL):
Na tabela `organizations`:
- `trial_ends_at`: Data em que os 14 dias terminam (calculado como `NOW() + INTERVAL '14 days'`).
- `subscription_status`: Pode ser `'trial'`, `'active'`, ou `'expired'`.

### Comportamento do Sistema:
1. **Durante os 14 dias (`subscription_status = 'trial'`):**
   - O painel exibe um aviso sutil: *"Você está no 5º dia do seu teste gratuito de 14 dias"*.
   - Todas as funções funcionam 100%.
2. **Após o 14º dia (`trial_ends_at` expirado e não pago):**
   - **No Painel do Lojista:** Bloqueia as ações e exibe um modal elegante:
     > *"Seu período de teste de 14 dias terminou! Seus clientes adoraram a praticidade. Para continuar recebendo agendamentos automáticos, ative sua assinatura por apenas R$ 59,90/mês."*
     > Botão: **[Pagar via Pix / Falar no WhatsApp]**
   - **Na Página do Cliente (`/:slug`):** Exibe um aviso amigável:
     > *"A agenda online deste estabelecimento está temporariamente pausada. Entre em contato diretamente pelo WhatsApp: [Botão WhatsApp]"*.
3. **Ao receber o pagamento via Pix:**
   - Você acessa o Supabase ou o painel mestre e altera `subscription_status = 'active'`. O sistema é liberado instantaneamente.

---

## 6. Scripts de Abordagem (Copie e Cole)

### 📲 Abordagem 1: Mensagem no WhatsApp / Direct do Instagram

> *"Fala [Nome], tudo bem?*
> 
> *Acompanho o trabalho de vocês aqui na [Nome da Barbearia/Salão] e vejo que o movimento é top!*
> 
> *Notei que vocês atendem muito pelo WhatsApp e sei o quanto é chato ter que parar o corte ou atendimento só pra responder: 'tem horário hoje às 16h?'.*
> 
> *Eu desenvolvi um sistema de agendamento online rápido (sem precisar baixar aplicativo) feito sob medida para o seu público marcar pela Bio do seu Instagram em 30 segundos.*
> 
> *Inclusive, **já montei uma prévia com o logo e serviços da sua barbearia** para você ver como fica lindo no celular:*
> 👉 *[Link: agendaflex.com/sua-barbearia]*
> 
> *Gostaria de liberar 14 dias grátis para você testar na prática essa semana com seus clientes, sem compromisso nenhum. Posso te mandar o acesso?"*

---

### 🚶 Abordagem 2: Presencial (Entrando no Estabelecimento)

1. Vá até o local em um horário de movimento moderado (terça a quinta à tarde).
2. Peça para falar com o responsável ou corte o próprio cabelo lá para criar rapport.
3. Fale com naturalidade:
   > *"Cara, o atendimento de vocês aqui é sensacional. Mas deixa eu te perguntar: como vocês organizam os agendamentos hoje? É no caderninho ou pelo WhatsApp?"*
4. Quando ele responder que perde muito tempo no WhatsApp:
   > *"Pois é, eu sou desenvolvedor e criei uma solução exatamente para isso. Deixa eu te mostrar em 30 segundos no meu celular como o seu cliente agendaria com você."*
5. Abra o link no seu celular e faça a simulação na frente dele.

---

## 7. Roteiro de Demonstração em 3 Minutos

1. **Minuto 1: A Experiência do Cliente**
   - Abra a página `/:slug` no smartphone.
   - Mostre a fluidez: toque no serviço ➔ escolha o profissional ➔ escolha o horário ➔ digite o nome.
   - Pressione **Confirmar Agendamento**.
2. **Minuto 2: A Notificação no WhatsApp**
   - Mostre o botão verde: *"📲 Enviar Confirmação via WhatsApp"*.
   - Explique: *"O cliente clica aqui e você já recebe no seu WhatsApp a confirmação prontinha sem você precisar digitar nada."*
3. **Minuto 3: O Painel de Gestão**
   - Abra a tela `/admin`:
   - *"E olha o seu dia aqui: todos os horários organizados em ordem, o faturamento previsto do dia e o horário que acabou de ser marcado já fica bloqueado automaticamente para ninguém marcar em cima."*

---

## 8. Como Quebrar as 5 Maiores Objeções

### Objeção 1: *"Eu já uso o caderninho de papel e funciona bem."*
> **Resposta:** *"O caderninho funciona enquanto você está na barbearia. Mas e quando são 22h, você está jantando com sua família e um cliente quer marcar para o dia seguinte? Ou no domingo? Com o link na bio, você acorda com a agenda cheia sem precisar trabalhar no seu descanso."*

### Objeção 2: *"Meus clientes são mais velhos, não sabem usar aplicativo."*
> **Resposta:** *"Exatamente por isso que o AgendaFlex não é um aplicativo de baixar. É apenas um link. Se o seu cliente sabe abrir um link no WhatsApp, ele sabe agendar aqui. Leva menos de 30 segundos e não pede cadastro com senha."*

### Objeção 3: *"Não tenho tempo para cadastrar e configurar isso."*
> **Resposta:** *"Não se preocupe, eu faço todo o cadastro inicial para você agora em 5 minutos. Você só precisa colocar o link na bio do seu Instagram."*

### Objeção 4: *"Achei caro R$ 59,90 por mês."*
> **Resposta:** *"Quanto você cobra no corte? R$ 40? Então com apenas UM cliente que deixaria de ir embora pela demora em responder no WhatsApp, o sistema já pagou a mensalidade inteira do mês. Todo o resto é lucro e economia de tempo para você."*

### Objeção 5: *"Já testei outros sistemas e achei muito complicado."*
> **Resposta:** *"Os outros sistemas tentam fazer de tudo: controle financeiro complexo, emissão de nota, estoque... O AgendaFlex foi feito com um único objetivo: **fazer seu cliente agendar no menor tempo possível sem te atrapalhar**."*

---

## 9. Script de Fechamento no 14º Dia

Quando o período de teste estiver completando 13 ou 14 dias, envie a seguinte mensagem:

> *"Fala [Nome], tudo bem?*
> 
> *Acompanhei aqui e vi que nesses 14 dias de teste você já teve **[Número de Agendamentos, ex: 42] agendamentos automáticos** pelo link da bio!*
> 
> *Isso significa que foram 42 vezes que você não precisou parar de atender para responder horário no WhatsApp.*
> 
> *O período piloto encerra amanhã. Para mantermos seu link ativo e sua agenda rodando no próximo mês, o valor é de apenas **R$ 59,90/mês** (menos de R$ 2,00 por dia).*
> 
> *Posso te enviar a chave Pix para renovar e mantermos o link no ar sem interrupção?"*

---

## 10. Metas de Crescimento e Projeção Financeira

Com custo operacional praticamente **ZERO** no Supabase e na Vercel:

| Etapa | Estabelecimentos Ativos | Valor Médio | Faturamento Recorrente Mensal (MRR) |
| :--- | :--- | :--- | :--- |
| **Mês 1 (Validação)** | 5 estabelecimentos | R$ 59,90 | **R$ 299,50 / mês** |
| **Mês 2 (Tração Local)** | 15 estabelecimentos | R$ 69,90 | **R$ 1.048,50 / mês** |
| **Mês 3 (Escala de Bairro)** | 35 estabelecimentos | R$ 69,90 | **R$ 2.446,50 / mês** |
| **Mês 6 (Expansão Regional)** | 80 estabelecimentos | R$ 79,90 | **R$ 6.392,00 / mês** |

---

> 💡 **Próximo Passo:** Mantenha este arquivo como sua bíblia de vendas diária. Toda semana visite 3 novos estabelecimentos ou envie 10 directs personalizados no Instagram!
