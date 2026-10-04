# 🚀 Guia Oficial: Produção, Integração PostgreSQL e Prospecção Comercial (Marcô)

Este documento reúne a auditoria técnica completa, as correções necessárias, o esquema de banco de dados **PostgreSQL**, o passo a passo de deploy em plataformas **gratuitas/open-source** e o roteiro comercial para prospectar seus primeiros clientes com sucesso.

---

## 📌 Sumário
1. [Auditoria de Segurança e Erros de Lógica (Diagnóstico Crítico)](#1-auditoria-de-segurança-e-erros-de-lógica)
2. [Arquitetura Recomendada (100% Gratuita e Open Source)](#2-arquitetura-recomendada)
3. [Esquema do Banco de Dados PostgreSQL (DDL SQL)](#3-esquema-do-banco-de-dados-postgresql)
4. [Passo a Passo: Configuração do PostgreSQL Gratuito (Supabase / Neon)](#4-passo-a-passo-configuração-do-postgresql)
5. [Passo a Passo: Deploy do Frontend (Vercel / Cloudflare Pages)](#5-passo-a-passo-deploy-do-frontend)
6. [Adaptação do Código Frontend (Substituindo o Mock)](#6-adaptação-do-código-frontend)
7. [Regras de Negócio Indispensáveis para o MVP](#7-regras-de-negócio-indispensáveis)
8. [Roteiro de Prospecção e Vendas para Pequenos Negócios](#8-roteiro-de-prospecção-e-vendas)

---

## 1. Auditoria de Segurança e Erros de Lógica

> ⚠️ **AVISO IMPORTANTE:** O projeto atual é um protótipo visual excelente, mas **NÃO está pronto para ser comercializado ou colocado em produção** no estado atual. A seguir estão os motivos críticos:

### 🔴 1.1. O Problema Fatal da Arquitetura Atual: LocalStorage Isolado
- **Como funciona hoje:** Quando um cliente acessa `https://seusite.com/` no smartphone dele e agenda, os dados são salvos exclusivamente no `localStorage` **do próprio aparelho do cliente**.
- **Impacto no Negócio:** O dono da barbearia/salão, acessando no computador ou celular dele, **nunca verá o agendamento**, pois o `localStorage` não é compartilhado entre dispositivos. Sem um banco de dados centralizado na nuvem, o aplicativo não funciona comercialmente.

### 🔴 1.2. Vulnerabilidades Críticas de Segurança
1. **Bypass Trivial de Autenticação (Client-Side Auth):**
   - O arquivo `services/auth.js` valida o login apenas no navegador.
   - Qualquer pessoa com conhecimentos básicos pode abrir o Console do Navegador (F12) e executar:
     ```javascript
     localStorage.setItem('marco_admin_session', JSON.stringify({ loggedIn: true }))
     ```
     e terá acesso irrestrito ao painel administrativo `/admin`.
2. **Credenciais Hardcoded no Código:**
   - O e-mail `admin@marco.com` e a senha `admin123` estão expostos no código-fonte javascript compilado. Qualquer usuário pode encontrá-los inspecionando os arquivos `.js`.
3. **Senhas em Texto Puro (Plaintext):**
   - Não há criptografia (hash com `bcrypt` ou `argon2`). Armazenar senhas em texto puro viola as boas práticas e leis de privacidade (LGPD).
4. **Falta de Isolamento Multiusuário (Multi-Tenancy):**
   - O aplicativo trata apenas uma única organização global. Se você vender para a "Barbearia do Carlos" e para o "Salão da Maria", ambos disputariam o mesmo cadastro. É fundamental suportar múltiplos estabelecimentos (ex: `seusite.com/empresa-a` ou `seusite.com/empresa-b`).

### 🔴 1.3. Erros de Lógica e Regras de Negócio
1. **Ausência de Bloqueio de Horários (Overbooking):**
   - A lista de horários (`08:00, 09:00, 10:00...`) é fixa e não filtra horários que já foram agendados para aquele profissional naquela data. Dez clientes podem agendar o mesmo barbeiro no mesmo horário.
2. **Bug de Fuso Horário (Timezone UTC):**
   - A expressão `new Date().toISOString().split('T')[0]` gera a data em UTC. No Brasil (UTC-3), a partir das 21:00 horas, o sistema passa a considerar a data como sendo a de amanhã.
3. **Agendamento em Horários que já Passaram:**
   - Se o cliente abrir o agendamento hoje às 16:30, os botões das 08:00, 09:00 e 10:00 continuam visíveis e clicáveis.
4. **CRUD de Serviços Incompleto:**
   - O arquivo `views/ServicesProfessionals.vue` está incompleto (sem script funcional) e não há como o lojista cadastrar novos serviços ou alterar preços pelo painel.
5. **Inconsistência de IDs (`prof-` vs `res-`):**
   - Há duplicação entre `professionals` e `resources` no `mockStorage.js` com IDs conflitantes gerados (`prof-1` vs `res-1`).

---

## 2. Arquitetura Recomendada (100% Gratuita e Open Source)

Para começar com custo **R$ 0,00**, máxima velocidade e segurança profissional:

```
[ Cliente Mobile / Web ]  ──┐
                            ├─► [ Vercel / Cloudflare Pages ] (Frontend Vue 3 - SSL Grátis)
[ Painel Admin Lojista ]  ──┘                 │
                                              ▼
                             [ Supabase (PostgreSQL 15+) ]
                             - Autenticação Segura (JWT)
                             - Banco Relacional PostgreSQL
                             - Row Level Security (RLS)
                             - API REST Automática (PostgREST)
```

### Por que usar Supabase com PostgreSQL?
- **100% Open Source:** Você não fica preso a tecnologias proprietárias. O banco por trás é puro PostgreSQL.
- **Camada Gratuita Generosa (Free Tier):**
  - Banco PostgreSQL dedicado de 500 MB (suficiente para mais de 500 mil agendamentos em texto).
  - Autenticação inclusa para até 50.000 usuários ativos por mês.
  - API REST gerada automaticamente sobre as tabelas com suporte direto no Vue 3.
  - Certificado SSL, backups e dashboard visual para gerenciar tabelas.

---

## 3. Esquema do Banco de Dados PostgreSQL (DDL SQL)

Execute o script SQL abaixo no editor SQL do seu PostgreSQL (ex: no Supabase SQL Editor ou DBeaver/pgAdmin):

```sql
-- Habilita extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE ORGANIZAÇÕES (EMPRESAS / CLIENTES DO SEU SAAS)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(80) UNIQUE NOT NULL, -- Ex: 'barbearia-griffs', usado na URL
    phone VARCHAR(30) NOT NULL,
    address VARCHAR(255),
    logo_url TEXT,
    banner_url TEXT,
    primary_color VARCHAR(10) DEFAULT '#0284c7',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE SERVIÇOS
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PROFISSIONAIS
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    specialty VARCHAR(120),
    phone VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE AGENDAMENTOS
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    client_name VARCHAR(120) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- REGRA DE INTEGRIDADE: Evita duplo agendamento para o mesmo profissional no mesmo dia e horário
    CONSTRAINT unique_professional_timeslot UNIQUE (professional_id, booking_date, start_time)
);

-- ÍNDICES PARA ALTA PERFORMANCE
CREATE INDEX idx_appointments_org_date ON appointments(organization_id, booking_date);
CREATE INDEX idx_appointments_professional ON appointments(professional_id, booking_date);
CREATE INDEX idx_services_org ON services(organization_id);
CREATE INDEX idx_professionals_org ON professionals(organization_id);

-- DADOS INICIAIS DE TESTE (ORGANIZAÇÃO PADRÃO)
INSERT INTO organizations (id, name, slug, phone, address, logo_url, banner_url, primary_color)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Barbearia & Estilo Griffs',
    'barbeariagriffs',
    '(11) 99999-8888',
    'Rua das Flores, 123 - Centro',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
    '#0284c7'
);

INSERT INTO services (organization_id, name, duration_minutes, price) VALUES
('a0000000-0000-0000-0000-000000000001', 'Corte de Cabelo', 30, 40.00),
('a0000000-0000-0000-0000-000000000001', 'Barba Terapia', 30, 35.00),
('a0000000-0000-0000-0000-000000000001', 'Combo Corte + Barba', 60, 65.00),
('a0000000-0000-0000-0000-000000000001', 'Sobrancelha / Detalhe', 15, 20.00);

INSERT INTO professionals (organization_id, name, specialty, phone) VALUES
('a0000000-0000-0000-0000-000000000001', 'Carlos Barbeiro', 'Barbeiro Clássico', '(11) 98888-1111'),
('a0000000-0000-0000-0000-000000000001', 'Lucas Especialista', 'Cortes Modernos', '(11) 98888-2222');
```

---

## 4. Passo a Passo: Configuração do PostgreSQL Gratuito (Supabase / Neon)

### Opção Recomendada: Supabase (Mais rápido para conectar com Vue)
1. Crie uma conta gratuita em [supabase.com](https://supabase.com/).
2. Clique em **"New Project"**, defina o nome (ex: `marco-db`) e uma senha segura para o banco. Escolha a região mais próxima (`São Paulo (sa-east-1)`).
3. No menu lateral esquerdo, vá em **SQL Editor**, cole todo o script da seção 3 e clique em **Run**.
4. No menu lateral, clique em **Project Settings** -> **API**.
5. Copie duas informações essenciais:
   - `Project URL` (ex: `https://xyzcompany.supabase.co`)
   - `anon public key` (chave segura para ser usada no frontend).

### Instalando a biblioteca no projeto Vue:
No terminal do projeto:
```bash
npm install @supabase/supabase-js
```

Crie o arquivo de conexão `src/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Crie o arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://sua-url-aqui.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```
*(Certifique-se de adicionar `.env` no seu `.gitignore` para nunca expor chaves no GitHub)*

---

## 5. Passo a Passo: Deploy do Frontend (Vercel / Cloudflare Pages)

Tanto a **Vercel** quanto a **Cloudflare Pages** são gratuitas e fornecem SSL automático (`https://`).

### Deploy na Vercel (Recomendado):
1. Suba seu código atualizado para o seu repositório no **GitHub**.
2. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
3. Clique em **"Add New..."** -> **"Project"** e selecione o repositório `app-agendamentos`.
4. Em **Framework Preset**, a Vercel detectará automaticamente **Vite**.
5. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`: sua URL do Supabase.
   - `VITE_SUPABASE_ANON_KEY`: sua chave pública anon do Supabase.
6. Clique em **Deploy**.
7. Em menos de 2 minutos você terá uma URL ativa (ex: `https://marco.vercel.app`).

### Configuração de Rotas no Vue Router (SPA Refresh Fix):
Para que rotas como `/admin` funcionem ao atualizar a página (F5) na Vercel, crie um arquivo `vercel.json` na raiz:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 6. Adaptação do Código Frontend (Substituindo o Mock)

### 6.1. Serviço Real de Dados (`services/api.js`)
Substitua as chamadas do `mockStorage.js` por queries no PostgreSQL via Supabase:

```javascript
import { supabase } from '../src/supabase'

export const api = {
  // Busca dados da empresa pelo slug da URL
  async getOrganization(slug = 'barbeariagriffs') {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },

  // Busca serviços ativos
  async getServices(orgId) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('organization_id', orgId)
      .eq('active', true)
    if (error) throw error
    return data
  },

  // Busca profissionais ativos
  async getProfessionals(orgId) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('organization_id', orgId)
      .eq('active', true)
    if (error) throw error
    return data
  },

  // Busca horários já ocupados para evitar conflito
  async getBookedTimes(professionalId, date) {
    const { data, error } = await supabase
      .from('appointments')
      .select('start_time')
      .eq('professional_id', professionalId)
      .eq('booking_date', date)
      .neq('status', 'cancelled')
    if (error) throw error
    return data.map(item => item.start_time.slice(0, 5)) // Retorna array ['10:00', '14:00']
  },

  // Salva o agendamento real
  async createAppointment(payload) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select()
    if (error) throw error
    return data[0]
  }
}
```

### 6.2. Corrigindo o Fuso Horário Local no Vue
Em vez de `new Date().toISOString()`, use:
```javascript
// Retorna a data no formato YYYY-MM-DD considerando o fuso local do Brasil
const getLocalDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
```

---

## 7. Regras de Negócio Indispensáveis para o MVP

Antes de bater na porta de um lojista para vender, estas três funcionalidades são cruciais:

1. **Notificação / Confirmação via WhatsApp (Sem API Paga):**
   - Ao finalizar o agendamento no Step 4, crie um botão:
     ```html
     <a :href="whatsappUrl" target="_blank" class="block w-full py-3 bg-green-600 text-white font-bold rounded-xl text-center">
       📲 Enviar Confirmação no WhatsApp da Empresa
     </a>
     ```
   - O link monta automaticamente:
     `https://wa.me/5511999998888?text=Olá,%20acabei%20de%20agendar%20Corte%20com%20Carlos%20no%20dia%2015/10%20às%2010:00!`
   - Isso elimina faltas e dá segurança imediata ao dono do negócio sem gastar nada com APIs de SMS/WhatsApp.
2. **Slug da Empresa na Rota (Multi-Tenancy):**
   - Rota no Vue Router: `/:slug` (ex: `agenda.app/griffes-barbearia`).
   - O app carrega as cores, serviços e logotipo do cliente específico com base no slug.
3. **Cancelamento Simples pelo Cliente:**
   - Link gerado na mensagem para o cliente conseguir cancelar com até 2h de antecedência, liberando o horário para outros.

---

## 8. Roteiro de Prospecção e Vendas para Pequenos Negócios

### 🎯 Público-Alvo Inicial:
- Barbearias de bairro com 2 a 5 barbeiros.
- Manicures e Designers de Sobrancelhas.
- Clínicas de Estética / Massoterapia.
- Estúdios de Tatuagem.

### 💼 Modelo de Oferta "Piloto Sem Risco" (Estratégia de Entrada):
Não tente vender uma mensalidade no primeiro contato. Use o modelo de **Validação em Campo**:

1. **Abordagem Presencial ou no WhatsApp:**
   > *"Olá [Nome do Dono], tudo bem? Notei que você tem um movimento excelente aqui. Eu desenvolvi um sistema de agendamento online rápido pelo WhatsApp que evita você perder clientes que mandam mensagem fora do horário comercial ou enquanto você está cortando cabelo. Queria instalar para você testar por **15 dias grátis**, sem compromisso nenhum. Se não gostar, não paga nada. Posso cadastrar seus serviços hoje?"*

2. **Setup Rápido em 10 Minutos:**
   - Cadastre o logo, o nome e os serviços da barbearia no banco.
   - Entregue a ele o link pronto: `marco.app/barbearia-do-ze`.
   - Peça para ele colocar o link na bio do Instagram e na mensagem automática do WhatsApp Business.

3. **Fechamento após os 15 dias:**
   - Mostre o relatório: *"Fulano, nesses 15 dias você teve 38 agendamentos automáticos pelo sistema, sem precisar ficar parando seu atendimento para responder horário."*
   - Oferta: **R$ 49,90 a R$ 89,90 por mês** (preço extremamente acessível para quem economizou horas de trabalho manual).
   - Com 15 barbearias a R$ 69,00/mês você atinge seus primeiros **R$ 1.000,00/mês de receita recorrente (MRR)** com custo de infraestrutura zero.

---

## ✅ Resumo dos Próximos Passos
1. [ ] Criar o projeto no **Supabase** e rodar o script SQL de tabelas.
2. [ ] Instalar `@supabase/supabase-js` e conectar com as variáveis de ambiente.
3. [ ] Atualizar `ClientBooking.vue` e `AdminDashboard.vue` para ler e salvar no Supabase em vez do `localStorage`.
4. [ ] Implementar verificação de conflitos de horário.
5. [ ] Subir para a **Vercel** e validar em 2 celulares diferentes.
6. [ ] Iniciar a prospecção da primeira barbearia piloto!
