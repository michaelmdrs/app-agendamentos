# 📅 AgendaFlex — Plataforma de Agendamentos Multisetor

> Um MVP de sistema de agendamentos moderno, responsivo e adaptável para barbearias, clínicas, estúdios, pet shops e prestadores de serviços em geral.

---

## 📸 Screenshots da Aplicação

### 📱 Visão do Cliente (`/`)
*Fluxo responsivo (mobile-first) em 3 etapas simples para a seleção de serviço, profissional, data/horário e confirmação.*

| 1. Seleção de Serviço & Profissional | 2. Escolha de Data & Hora | 3. Dados e Confirmação |
| :---: | :---: | :---: |
| ![Visão do Cliente - Serviços](assets/img/tela-1.png) | ![Visão do Cliente - Data e Hora](assets/img/tela-2.png) | ![Visão do Cliente - Confirmação](assets/img/tela-3.png) |

---

### 💻 Painel do Gestor / Admin (`/admin`)
*Visualização em tempo real dos agendamentos do dia, controle de status (Confirmado, Concluído, Cancelado) e acompanhamento rápido.*

![Painel Admin](assets/img/tela-4.png)

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** [Vue.js 3](https://vuejs.org/) (Composition API / Script Setup)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Roteamento:** [Vue Router](https://router.vuejs.org/)
- **Persistência de Dados (Dev/Mock):** LocalStorage API (pronto para migração para PostgreSQL/Supabase)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina (versão 18 ou superior).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/app-agendamento.git](https://github.com/seu-usuario/app-agendamento.git)
   cd app-agendamento
