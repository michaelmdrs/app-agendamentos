# 🗄️ Guia Passo a Passo: Configuração do Supabase + PostgreSQL

Este documento orienta detalhadamente como configurar seu banco de dados **PostgreSQL** gratuito no **Supabase**, criar as tabelas e conectar de forma definitiva ao seu aplicativo **Marcô**.

---

## 📌 Perguntas Frequentes & Esclarecimentos Importantes

### ❓ 1. Preciso conectar o repositório do projeto no Supabase?
> **NÃO!** Você **não** precisa (e nem deve) conectar o repositório do GitHub dentro do Supabase.
>
> **Por que?**
> - O **Supabase** funciona exclusivamente como seu **Banco de Dados (PostgreSQL na nuvem)** e gerador de API.
> - O seu frontend em **Vue 3** se conecta ao Supabase pela internet via HTTP através das chaves que ficam no arquivo `.env`.
> - Quem conecta ao repositório do GitHub é o serviço de hospedagem do frontend (como a **Vercel** ou **Cloudflare Pages**) no momento em que você for colocar o site no ar.

---

### ❓ 2. Qual a diferença entre `.env` e `.env.example`?
> - **`.env.example`**: É apenas um arquivo modelo/exemplo para outros desenvolvedores saberem quais variáveis o projeto usa. O Vite e o Node.js **ignoram completamente** o `.env.example`.
> - **`.env`**: É o arquivo real que o Vite carrega ao executar `npm run dev` ou `npm run build`. Ele fica na raiz do projeto e **não** é enviado ao GitHub (já protegido no `.gitignore`).
>
> **Regra:** Suas chaves sempre devem estar no arquivo nomeado exatamente como `.env`.

---

### ❓ 3. Qual o formato correto da `VITE_SUPABASE_URL`?
> A URL deve ser apenas o domínio base do seu projeto:
> - ✅ **Correto:** `https://qgnxyeanscyhdwwiupzi.supabase.co`
> - ❌ **Incorreto:** `https://qgnxyeanscyhdwwiupzi.supabase.co/rest/v1/`
>
> *(Nota: O código em `src/supabase.js` foi configurado para limpar automaticamente `/rest/v1/` caso seja inserido por engano, mas a boa prática é manter a URL limpa).*

---

## 🚀 Passo 1: Criar sua Conta e Projeto no Supabase

1. Acesse o site do Supabase: [https://supabase.com/](https://supabase.com/)
2. Clique em **"Start your project"** e faça login com seu **GitHub**.
3. No painel inicial (Dashboard), clique em **"New Project"**.
4. Configure o projeto:
   - **Name:** `agendaflex-db` (ou o nome que preferir).
   - **Database Password:** Crie uma senha forte e guarde-a.
   - **Region:** Selecione **São Paulo (sa-east-1)** para menor latência no Brasil.
   - **Pricing Plan:** Selecione o plano **Free** (Gratuito).
5. Clique em **"Create new project"** e aguarde cerca de 1 a 2 minutos até o provisionamento concluir.

---

## 📜 Passo 2: Executar o Script SQL no PostgreSQL

1. No menu lateral esquerdo do Supabase, clique no ícone **SQL Editor**.
2. Clique no botão **"New query"**.
3. Cole todo o código SQL abaixo e clique no botão verde **"Run"** (no canto inferior direito):

```sql
-- 1. Habilita extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE ORGANIZAÇÕES (EMPRESAS / CLIENTES DO SEU SISTEMA)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(80) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address VARCHAR(255),
    logo_url TEXT,
    banner_url TEXT,
    primary_color VARCHAR(10) DEFAULT '#0284c7',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE SERVIÇOS (COM TEMPO DE DURAÇÃO E VALOR)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE PROFISSIONAIS (COM FOTO E SERVIÇOS ATENDIDOS)
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    specialty VARCHAR(120),
    phone VARCHAR(30),
    avatar_url TEXT,
    service_ids JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE AGENDAMENTOS (COM CONTROLE DE OVERBOOKING)
CREATE TABLE IF NOT EXISTS appointments (
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
    
    -- REGRA DE INTEGRIDADE: Impede agendamento duplo para o mesmo profissional no mesmo horário
    CONSTRAINT unique_professional_timeslot UNIQUE (professional_id, booking_date, start_time)
);

-- 6. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_appointments_org_date ON appointments(organization_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_services_org ON services(organization_id);
CREATE INDEX IF NOT EXISTS idx_professionals_org ON professionals(organization_id);

-- 7. DADOS INICIAIS DA BARBEARIA PADRÃO
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO services (organization_id, name, duration_minutes, price, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'Corte de Cabelo', 30, 40.00, 'Corte clássico ou moderno com máquina e tesoura.'),
('a0000000-0000-0000-0000-000000000001', 'Barba Terapia', 30, 35.00, 'Modelagem de barba com toalha quente e óleos especiais.'),
('a0000000-0000-0000-0000-000000000001', 'Combo Corte + Barba', 60, 65.00, 'Atendimento completo de cabelo e barba.'),
('a0000000-0000-0000-0000-000000000001', 'Sobrancelha / Detalhe', 15, 20.00, 'Alinhamento na navalha ou pinça.')
ON CONFLICT DO NOTHING;

INSERT INTO professionals (organization_id, name, specialty, phone) VALUES
('a0000000-0000-0000-0000-000000000001', 'Carlos Barbeiro', 'Barbeiro Clássico', '(11) 98888-1111'),
('a0000000-0000-0000-0000-000000000001', 'Lucas Especialista', 'Cortes Modernos e Degradê', '(11) 98888-2222')
ON CONFLICT DO NOTHING;
```

---

## 🛡️ Passo 3: Habilitar Políticas de Segurança (Row Level Security - RLS)

No mesmo **SQL Editor**, abra uma nova aba e execute o script de permissões abaixo:

```sql
-- Habilita RLS em todas as tabelas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
CREATE POLICY "Leitura pública de organizações" ON organizations FOR SELECT USING (true);
CREATE POLICY "Leitura pública de serviços" ON services FOR SELECT USING (true);
CREATE POLICY "Leitura pública de profissionais" ON professionals FOR SELECT USING (true);
CREATE POLICY "Leitura pública de agendamentos" ON appointments FOR SELECT USING (true);

-- Políticas de Escrita
CREATE POLICY "Clientes podem criar agendamentos" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de agendamentos" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Permitir modificação de serviços" ON services FOR ALL USING (true);
CREATE POLICY "Permitir modificação de profissionais" ON professionals FOR ALL USING (true);
CREATE POLICY "Permitir atualização da organização" ON organizations FOR ALL USING (true);
```

---

## 🔑 Passo 4: Obter as Credenciais da API no Supabase

1. No menu lateral esquerdo, clique no ícone de engrenagem ⚙️ (**Project Settings**).
2. Clique na aba **Data API** (ou **API**).
3. Copie:
   - **Project URL:** Ex: `https://qgnxyeanscyhdwwiupzi.supabase.co`
   - **Project API keys (anon / publishable):** Ex: `sb_publishable_...` ou `eyJhbG...`

---

## 💻 Passo 5: Criar e Preencher o Arquivo `.env` na Raiz

Crie um arquivo chamado **`.env`** (sem extensão `.example`) na pasta raiz do projeto com o conteúdo:

```env
VITE_SUPABASE_URL=https://qgnxyeanscyhdwwiupzi.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

---

## 🧪 Passo 6: Iniciar e Validar a Conexão

1. No terminal do projeto, execute:
   ```bash
   npm run dev
   ```
2. Abra `http://localhost:5173/admin` no navegador:
   - Veja o topo da página: o badge indicará **"PostgreSQL Conectado"** (em verde).
3. Teste o funcionamento em tempo real:
   - Cadastre um novo serviço em `/admin/servicos`.
   - Acesse o painel do Supabase em **Table Editor > services**: o serviço cadastrado estará salvo no banco PostgreSQL!
   - Acesse a tela do cliente em `http://localhost:5173/` e faça um agendamento: ele será gravado no Supabase e aparecerá instantaneamente no painel `/admin`.

---

## ☁️ Passo 7: Como Conectar o Supabase na Vercel (Produção sem Mock)

### ❓ Por que o meu teste na Vercel estava usando Mock?
O arquivo `.env` está no `.gitignore` por segurança (para que suas chaves secretas não fiquem expostas publicamente no GitHub).
Quando a Vercel faz o download do código do GitHub e roda o comando `npm run build`, o arquivo `.env` **não existe lá por padrão**.
Como o sistema foi desenhado para ser resiliente e nunca quebrar na frente do cliente, se ele não encontra as variáveis da nuvem, ele ativa automaticamente o modo de contingência **"Mock Local"**.

---

### 🛠️ Passo a Passo para Ativar o PostgreSQL Real na Vercel:

1. Acesse seu painel na Vercel: [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Clique no seu projeto (**app-agendamentos** ou o nome que você deu).
3. No menu superior, clique em ⚙️ **Settings** e depois em **Environment Variables** (no menu lateral esquerdo).
4. Adicione as 2 variáveis exatamente com esses nomes:

   | Key (Nome da Variável) | Value (Valor) | Ambientes Marcados |
   | :--- | :--- | :--- |
   | `VITE_SUPABASE_URL` | `https://qgnxyeanscyhdwwiupzi.supabase.co` | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | *(Sua chave anon copiada do arquivo .env ou do Supabase)* | Production, Preview, Development |

5. Clique em **Save**.

---

### ⚠️ ETAPA OBRIGATÓRIA: Fazer o Redeploy!
Como o **Vite** é um compilador de frontend estático, as variáveis `VITE_*` são gravadas nos arquivos JavaScript no momento em que o build acontece. 
Portanto, salvar as variáveis só surtirá efeito quando você rodar um novo build:

1. Na Vercel, clique na aba **Deployments** (no topo).
2. No primeiro deploy da lista (o mais recente), clique no botão de **três pontinhos (`...`)** do lado direito.
3. Clique em **Redeploy**.
4. Desmarque ou marque a caixa se perguntar e confirme em **Redeploy**.
5. Aguarde cerca de 45 segundos até o status ficar verde (**Ready**).

---

### ✅ Como Confirmar que Deu Certo:
Acesse o seu link da Vercel no caminho do administrador:
`https://seu-projeto.vercel.app/admin`

- No topo da página, ao lado do título, o badge exibirá **"PostgreSQL Conectado"** (badge verde) em vez de "Mock Local".
- Qualquer agendamento, novo serviço ou novo barbeiro cadastrado agora será salvo permanentemente no seu banco PostgreSQL do Supabase!
