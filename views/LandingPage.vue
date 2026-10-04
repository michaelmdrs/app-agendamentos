<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
    
    <!-- HEADER / NAVBAR MODERNA -->
    <header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition">
            📅
          </div>
          <span class="text-xl font-black tracking-tight text-white">
            Agenda<span class="text-brand-500">Flex</span>
          </span>
        </router-link>

        <!-- Navegação Desktop -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#como-funciona" class="hover:text-white transition">Como Funciona</a>
          <a href="#recursos" class="hover:text-white transition">Recursos</a>
          <a href="#planos" class="hover:text-white transition">Planos</a>
          <a href="#faq" class="hover:text-white transition">Dúvidas</a>
        </nav>

        <!-- Botões de Ação -->
        <div class="flex items-center gap-3">
          <router-link
            to="/admin"
            class="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition"
          >
            Acessar Painel
          </router-link>

          <router-link
            to="/barbeariagriffs"
            class="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-black bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition transform hover:scale-105"
          >
            <span>Ver Demonstração</span>
            <span>↗</span>
          </router-link>
        </div>

      </div>
    </header>

    <!-- HERO SECTION DE ALTO IMPACTO -->
    <section class="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
      <!-- Glows de fundo ambientais -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <!-- Lado Esquerdo: Textos & CTAs -->
          <div class="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <div class="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-brand-400 text-xs font-black px-4 py-1.5 rounded-full shadow-inner">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>A Plataforma Nº 1 para Barbearias e Salões</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Não deixe que a agenda manual seja uma
              <span class="bg-gradient-to-r from-brand-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                dor de cabeça.
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Automatize seus agendamentos pela Bio do Instagram e WhatsApp. Seus clientes marcam sozinhos em 30 segundos sem precisar baixar aplicativo e sem você parar o atendimento.
            </p>

            <!-- Botões Principais de Conversão -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#planos"
                class="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-brand-600 via-cyan-600 to-brand-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-base rounded-2xl shadow-xl shadow-brand-600/30 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                Quero 14 Dias Grátis
              </a>

              <router-link
                to="/barbeariagriffs"
                class="w-full sm:w-auto text-center px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700/80 transition flex items-center justify-center gap-2"
              >
                <span>📱 Testar no Celular</span>
                <span class="text-slate-400">➔</span>
              </router-link>
            </div>

            <!-- Microcopy de Confiança -->
            <div class="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 pt-2 font-medium">
              <span class="text-emerald-400 text-sm">✓</span>
              <span>Sem cartão de crédito</span>
              <span class="text-slate-600">•</span>
              <span class="text-emerald-400 text-sm">✓</span>
              <span>Setup pronto em 5 minutos</span>
              <span class="text-slate-600">•</span>
              <span class="text-emerald-400 text-sm">✓</span>
              <span>Cancele quando quiser</span>
            </div>

          </div>

          <!-- Lado Direito: Mockup Interativo do Smartphone -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-[340px] rounded-[42px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-brand-500/10 border-4 border-slate-700/50">
              
              <!-- Câmera / Notch do Smartphone -->
              <div class="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20"></div>

              <!-- Tela Interna do Smartphone -->
              <div class="rounded-[34px] overflow-hidden bg-slate-950 border border-slate-800 relative space-y-4 pb-6">
                
                <!-- Mini Header da Loja -->
                <div class="relative h-28 bg-gradient-to-r from-blue-900 to-slate-900 overflow-hidden">
                  <div class="absolute inset-0 bg-black/40"></div>
                  <div class="absolute bottom-2 left-3 flex items-center gap-2">
                    <div class="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md">
                      <div class="w-full h-full rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-black">
                        ✂️
                      </div>
                    </div>
                    <div>
                      <p class="text-xs font-black text-white">Barbearia & Estilo</p>
                      <p class="text-[10px] text-emerald-400 font-bold">● Aberto para agendar</p>
                    </div>
                  </div>
                </div>

                <!-- Simulação de Passos de Agendamento -->
                <div class="px-4 space-y-3">
                  <div class="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>1. SELECIONE O SERVIÇO</span>
                    <span class="text-brand-400">Passo 1 de 3</span>
                  </div>

                  <!-- Card Mini Serviço -->
                  <div class="p-2.5 rounded-xl border border-brand-500/50 bg-brand-950/40 flex justify-between items-center text-xs">
                    <div>
                      <p class="font-black text-white text-[11px]">Corte Degradê + Barba</p>
                      <p class="text-[9px] text-slate-400">⏱ 45 min</p>
                    </div>
                    <span class="text-emerald-400 font-black text-xs">R$ 65,00</span>
                  </div>

                  <!-- Mini Horários -->
                  <div class="space-y-1.5 pt-1">
                    <p class="text-[10px] font-bold text-slate-400">2. HORÁRIOS DISPONÍVEIS</p>
                    <div class="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-center">
                      <div class="py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 line-through">09:00</div>
                      <div class="py-1 rounded-lg bg-brand-600 text-white shadow-xs">10:00 ✓</div>
                      <div class="py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">11:00</div>
                    </div>
                  </div>

                  <!-- Botão Simulado -->
                  <div class="pt-2">
                    <div class="w-full py-2.5 bg-[#25D366] text-white font-black text-center rounded-xl text-[11px] shadow-lg flex items-center justify-center gap-1">
                      <span>📲 Confirmar via WhatsApp</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- NÚMEROS / MÉTRICAS DE IMPACTO -->
    <section class="border-y border-slate-800 bg-slate-900/50 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="space-y-1">
            <p class="text-3xl sm:text-4xl font-black text-white tracking-tight">30s</p>
            <p class="text-xs text-slate-400 font-medium">Tempo médio para o cliente agendar</p>
          </div>
          <div class="space-y-1">
            <p class="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">0%</p>
            <p class="text-xs text-slate-400 font-medium">Zero taxa ou comissão por atendimento</p>
          </div>
          <div class="space-y-1">
            <p class="text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight">24h</p>
            <p class="text-xs text-slate-400 font-medium">Sua agenda captando clientes enquanto dorme</p>
          </div>
          <div class="space-y-1">
            <p class="text-3xl sm:text-4xl font-black text-brand-400 tracking-tight">+85%</p>
            <p class="text-xs text-slate-400 font-medium">Redução de tempo gasto no WhatsApp</p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMO FUNCIONA (3 PASSOS SIMPLES) -->
    <section id="como-funciona" class="py-20 sm:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span class="text-xs font-black tracking-widest text-brand-400 uppercase bg-brand-950/80 px-3 py-1 rounded-full border border-brand-500/30">
            Simplicidade Total
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Como funciona na prática?
          </h2>
          <p class="text-sm text-slate-400">
            Apenas 3 passos para acabar com as mensagens perdidas no WhatsApp.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          
          <!-- Passo 1 -->
          <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div class="w-14 h-14 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center text-2xl font-black shadow-inner">
              1
            </div>
            <h3 class="text-xl font-bold text-white">Você divulga seu link exclusivo</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Coloque o link da sua agenda na Bio do seu Instagram e configure uma resposta rápida no WhatsApp Business.
            </p>
          </div>

          <!-- Passo 2 -->
          <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div class="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-2xl font-black shadow-inner">
              2
            </div>
            <h3 class="text-xl font-bold text-white">O cliente agenda em 3 cliques</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Ele clica no link, escolhe o serviço, o profissional preferido e o horário vago. Sem login chato e sem instalar nada.
            </p>
          </div>

          <!-- Passo 3 -->
          <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div class="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-black shadow-inner">
              3
            </div>
            <h3 class="text-xl font-bold text-white">Seu dia fica organizado</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Você recebe a notificação no WhatsApp e o horário cai diretamente no seu painel de gestão, bloqueando duplicidades.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- RECURSOS ESSENCIAIS -->
    <section id="recursos" class="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span class="text-xs font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
            Tecnologia que Resolve
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tudo o que seu negócio precisa para crescer
          </h2>
          <p class="text-sm text-slate-400">
            Desenvolvido pensando na rotina corrida de prestadores de serviços.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="text-3xl">🚫</div>
            <h3 class="font-bold text-white text-base">Anti-Overbooking</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              O sistema bloqueia instantaneamente horários marcados. Dois clientes nunca disputarão a mesma cadeira.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="text-3xl">📲</div>
            <h3 class="font-bold text-white text-base">Confirmação via WhatsApp</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              O cliente envia o resumo da reserva direto no WhatsApp da barbearia com 1 toque, garantindo que ele não falte.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="text-3xl">👥</div>
            <h3 class="font-bold text-white text-base">Gestão de Equipe & Fotos</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Cadastre cada profissional com foto, especialidade e os serviços que ele executa de forma independente.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="text-3xl">⏱️</div>
            <h3 class="font-bold text-white text-base">Serviços, Tempo e Valores</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Defina a duração exata de cada serviço (15m, 30m, 60m) e o preço para cálculo do faturamento diário.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="text-3xl">📊</div>
            <h3 class="font-bold text-white text-base">Previsão de Faturamento</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Acompanhe no painel quanto seu estabelecimento vai faturar no dia somando todos os serviços marcados.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="text-3xl">🎨</div>
            <h3 class="font-bold text-white text-base">Personalização com sua Marca</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Adicione seu logotipo, foto de capa e escolha a cor principal do seu estabelecimento.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- PLANOS E PRECIFICAÇÃO TRANSPARENTE -->
    <section id="planos" class="py-20 sm:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span class="text-xs font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Valores Acessíveis
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Planos simples que cabem no seu bolso
          </h2>
          <p class="text-sm text-slate-400">
            Experimente 14 dias grátis. Menos que o valor de um corte de cabelo por mês.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          <!-- Plano Solo -->
          <div class="rounded-3xl p-8 bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Para Profissionais Autônomos</span>
              <h3 class="text-2xl font-black text-white">Plano Solo</h3>
              <p class="text-xs text-slate-400">Ideal para quem atende sozinho e quer organizar o dia.</p>
              
              <div class="pt-2">
                <span class="text-4xl font-black text-white">R$ 49,90</span>
                <span class="text-slate-400 text-xs">/mês</span>
              </div>

              <ul class="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li class="flex items-center gap-2">✓ 1 Profissional ativo</li>
                <li class="flex items-center gap-2">✓ Agendamentos ilimitados</li>
                <li class="flex items-center gap-2">✓ Link exclusivo na Bio</li>
                <li class="flex items-center gap-2">✓ Confirmação no WhatsApp</li>
                <li class="flex items-center gap-2">✓ Painel administrativo completo</li>
              </ul>
            </div>

            <a
              href="https://wa.me/5511999998888?text=Olá,%20gostaria%20de%20iniciar%20meu%20teste%20grátis%20no%20Plano%20Solo%20do%20AgendaFlex!"
              target="_blank"
              class="w-full py-4 text-center bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl border border-slate-700 transition"
            >
              Testar 14 Dias Grátis
            </a>
          </div>

          <!-- Plano Equipe (Mais Popular / Destaque) -->
          <div class="rounded-3xl p-8 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-500 shadow-2xl shadow-brand-500/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div class="absolute top-4 right-4 bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Mais Escolhido
            </div>

            <div class="space-y-4">
              <span class="text-xs font-black text-brand-400 uppercase tracking-wider">Para Barbearias e Salões</span>
              <h3 class="text-2xl font-black text-white">Plano Equipe</h3>
              <p class="text-xs text-slate-400">Para estabelecimentos com equipe de 2 a 8 profissionais.</p>
              
              <div class="pt-2">
                <span class="text-4xl font-black text-white">R$ 79,90</span>
                <span class="text-slate-400 text-xs">/mês</span>
              </div>

              <ul class="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li class="flex items-center gap-2">✓ Até 8 Profissionais com foto e cargo</li>
                <li class="flex items-center gap-2">✓ Agendamentos e clientes ilimitados</li>
                <li class="flex items-center gap-2">✓ Link personalizado para Instagram e WhatsApp</li>
                <li class="flex items-center gap-2">✓ Previsão de faturamento diário</li>
                <li class="flex items-center gap-2">✓ Suporte prioritário no WhatsApp</li>
              </ul>
            </div>

            <a
              href="https://wa.me/5511999998888?text=Olá,%20gostaria%20de%20iniciar%20meu%20teste%20grátis%20no%20Plano%20Equipe%20do%20AgendaFlex!"
              target="_blank"
              class="w-full py-4 text-center bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-brand-500/25 transition transform hover:scale-[1.02] active:scale-95"
            >
              Começar Teste de 14 Dias Grátis
            </a>
          </div>

        </div>

      </div>
    </section>

    <!-- FAQ (PERGUNTAS FREQUENTES COM ACCORDION) -->
    <section id="faq" class="py-20 bg-slate-900/40 border-t border-slate-800/80">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center space-y-3 mb-14">
          <span class="text-xs font-black tracking-widest text-brand-400 uppercase bg-brand-950/80 px-3 py-1 rounded-full border border-brand-500/30">
            Dúvidas Comuns
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, index) in faqList"
            :key="index"
            class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full p-5 text-left font-bold text-white flex justify-between items-center text-sm hover:text-brand-400 transition"
            >
              <span>{{ item.question }}</span>
              <span class="text-slate-400 text-lg ml-4">{{ activeFaq === index ? '−' : '+' }}</span>
            </button>

            <div v-if="activeFaq === index" class="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
              {{ item.answer }}
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- FOOTER COMERCIAL -->
    <footer class="border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div class="flex items-center gap-2">
          <span class="text-base">📅</span>
          <span class="font-bold text-slate-300">AgendaFlex</span>
          <span>— Sistema de Agendamento Online</span>
        </div>

        <p>© 2026 Todos os direitos reservados.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeFaq = ref(null)

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const faqList = [
  {
    question: 'O meu cliente precisa baixar algum aplicativo?',
    answer: 'Não! O seu cliente clica no link na bio do seu Instagram ou no WhatsApp e a tela abre instantaneamente no navegador do celular dele em menos de 1 segundo. Ele não precisa baixar nada nem criar conta com senha.'
  },
  {
    question: 'É necessário cadastrar cartão de crédito para testar?',
    answer: 'Não. Você tem 14 dias de teste completo e irrestrito sem colocar nenhum dado de cartão de crédito. Se você gostar e quiser continuar, faz o Pix da mensalidade.'
  },
  {
    question: 'Funciona para quantos profissionais?',
    answer: 'O sistema suporta desde profissionais autônomos que atendem sozinhos até barbearias, clínicas e salões com múltiplos profissionais cadastrados com fotos e horários separados.'
  },
  {
    question: 'Como os clientes sabem onde agendar?',
    answer: 'Você coloca o link exclusivo da sua agenda (ex: agendaflex.com/sua-barbearia) na Bio do seu Instagram e configura como mensagem de ausência no seu WhatsApp Business.'
  },
  {
    question: 'Existe fidelidade ou multa de cancelamento?',
    answer: 'Zero fidelidade. A assinatura é mensal e você pode pausar ou cancelar a qualquer momento sem pagar nenhuma multa.'
  }
]
</script>
