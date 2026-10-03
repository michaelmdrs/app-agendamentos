<template>
  <div class="max-w-md mx-auto min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 shadow-2xl flex flex-col pb-24 border-x border-slate-200/60 font-sans relative antialiased selection:bg-brand-500 selection:text-white">
    
    <!-- TELA DE TESTE EXPIRADO (BLOQUEIO SUAVE DE MENSALIDADE) -->
    <div v-if="subscriptionInfo.expired" class="p-8 my-auto text-center space-y-6 animate-fadeIn">
      <div class="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-500/20">
        ⏳
      </div>
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ org.name }}</h2>
        <div class="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold py-1.5 px-3.5 rounded-full shadow-xs">
          <span>●</span>
          <span>Agenda online temporariamente pausada</span>
        </div>
      </div>
      <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
        Os agendamentos online deste estabelecimento estão passando por uma rápida atualização. Agende seu horário agora mesmo falando direto no WhatsApp!
      </p>
      <a
        v-if="org.phone"
        :href="`https://wa.me/55${org.phone.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20agendar%20um%20horário!`"
        target="_blank"
        class="inline-flex items-center justify-center gap-2.5 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-2xl shadow-xl shadow-green-600/25 transition-all text-sm tracking-wide"
      >
        <span>📲 Chamar no WhatsApp</span>
      </a>
    </div>

    <!-- FLUXO NORMAL DE AGENDAMENTO -->
    <template v-else>
      
      <!-- HERO HEADER VIBRANTE COM BANNER E IDENTIDADE VISUAL -->
      <div class="relative bg-slate-950 text-white">
        <!-- Banner de Capa com Gradiente Vibrante e Efeito Overlay -->
        <div class="relative h-44 w-full overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800">
          <img
            :src="org.banner_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80'"
            alt="Capa"
            class="w-full h-full object-cover opacity-60 scale-105"
          />
          <!-- Gradientes de profundidade -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-950"></div>
          
          <!-- Badges flutuantes no topo da imagem -->
          <div class="absolute top-3 inset-x-4 flex justify-between items-center text-xs">
            <span class="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30 text-[11px]">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Aberto para Agendamentos
            </span>

            <span class="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-400/30 text-[11px]">
              ⭐ 4.9 (128)
            </span>
          </div>
        </div>

        <!-- Logotipo em Destaque e Identidade da Empresa -->
        <div class="px-5 pb-5 pt-0 relative flex flex-col items-center -mt-14 text-center">
          <div class="w-24 h-24 rounded-3xl p-1 bg-white shadow-2xl relative ring-4 ring-black/10 overflow-hidden transform hover:scale-105 transition duration-300">
            <img :src="org.logo_url || 'https://via.placeholder.com/150'" :alt="org.name" class="w-full h-full object-cover rounded-2xl" />
          </div>

          <div class="mt-3 space-y-1">
            <div class="flex items-center gap-1.5 justify-center">
              <h1 class="text-xl font-black text-white tracking-tight">{{ org.name || 'Carregando...' }}</h1>
              <span class="bg-blue-500 text-white p-0.5 rounded-full text-[10px] w-4 h-4 inline-flex items-center justify-center font-bold shadow-sm" title="Verificado">
                ✓
              </span>
            </div>
            
            <p class="text-xs text-slate-300 flex items-center justify-center gap-1 font-medium">
              <span>📍 {{ org.address || 'Endereço não informado' }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- STEPPER / BARRA DE ETAPAS MODERNA COM CORES E ÍCONES -->
      <div class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-y border-slate-200/80 shadow-xs px-4 py-2.5">
        <div class="flex items-center justify-between gap-1 max-w-sm mx-auto">
          
          <button
            type="button"
            @click="step > 1 && (step = 1)"
            :class="[
              'flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
              step === 1
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : step > 1
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-400 bg-slate-100/70'
            ]"
          >
            <span>{{ step > 1 ? '✓' : '✂️' }}</span>
            <span class="truncate">1. Serviços</span>
          </button>

          <span class="text-slate-300 text-xs">➔</span>

          <button
            type="button"
            @click="selectedService && selectedResource && (step = 2)"
            :disabled="!selectedService || !selectedResource"
            :class="[
              'flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
              step === 2
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : step > 2
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-400 bg-slate-100/70'
            ]"
          >
            <span>{{ step > 2 ? '✓' : '📅' }}</span>
            <span class="truncate">2. Horário</span>
          </button>

          <span class="text-slate-300 text-xs">➔</span>

          <button
            type="button"
            :disabled="step < 3"
            :class="[
              'flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
              step === 3
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 bg-slate-100/70'
            ]"
          >
            <span>✅</span>
            <span class="truncate">3. Confirmar</span>
          </button>
        </div>
      </div>

      <!-- ETAPA 1: SERVIÇOS & PROFISSIONAIS (DESIGN VIBRANTE) -->
      <div v-if="step === 1" class="p-5 space-y-6 animate-fadeIn">
        
        <!-- Seleção de Serviço -->
        <div>
          <div class="flex items-center justify-between mb-3.5">
            <div>
              <h2 class="font-black text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5">
                <span class="text-brand-600">✂️</span>
                <span>Escolha o Serviço</span>
              </h2>
              <p class="text-xs text-slate-400 font-medium">Toque para selecionar</p>
            </div>
            <span class="text-xs bg-slate-200/70 text-slate-700 font-extrabold px-2.5 py-1 rounded-full">
              {{ services.length }} opções
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              :class="[
                'p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex justify-between items-center group relative overflow-hidden',
                selectedService?.id === service.id
                  ? 'border-brand-500 bg-gradient-to-r from-brand-50/80 to-blue-50/40 shadow-lg shadow-brand-500/10 ring-2 ring-brand-500/20 scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              ]"
            >
              <!-- Barra lateral de cor quando selecionado -->
              <div
                v-if="selectedService?.id === service.id"
                class="absolute left-0 inset-y-0 w-1.5 bg-brand-600"
              ></div>

              <div class="space-y-1.5 pl-1">
                <div class="flex items-center gap-2.5">
                  <div
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedService?.id === service.id
                        ? 'border-brand-600 bg-brand-600 text-white text-xs font-black shadow-xs'
                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                    ]"
                  >
                    <span v-if="selectedService?.id === service.id">✓</span>
                  </div>
                  <h3 class="font-extrabold text-slate-900 group-hover:text-brand-700 transition text-sm">
                    {{ service.name }}
                  </h3>
                </div>

                <div class="flex items-center gap-2 pl-7.5">
                  <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 border border-slate-200/60">
                    ⏱ {{ service.duration_minutes }} min
                  </span>
                  <p v-if="service.description" class="text-[11px] text-slate-400 italic line-clamp-1">
                    {{ service.description }}
                  </p>
                </div>
              </div>

              <!-- Preço em Destaque Estilo Badge Colorida -->
              <div class="text-right pl-3 shrink-0">
                <span class="inline-block px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black text-sm tracking-tight shadow-xs">
                  R$ {{ Number(service.price).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Seleção de Profissional -->
        <div v-if="selectedService" class="pt-2 animate-fadeIn space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-black text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5">
                <span class="text-brand-600">👤</span>
                <span>Escolha o Profissional</span>
              </h2>
              <p class="text-xs text-slate-400 font-medium">Quem vai te atender?</p>
            </div>
          </div>

          <div v-if="filteredProfessionals.length === 0" class="text-xs text-slate-500 p-4 border rounded-2xl bg-white text-center shadow-xs">
            Nenhum profissional disponível para este serviço no momento.
          </div>

          <div v-else class="grid grid-cols-2 gap-3">
            <button
              v-for="res in filteredProfessionals"
              :key="res.id"
              type="button"
              @click="selectedResource = res"
              :class="[
                'p-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 text-left relative overflow-hidden group',
                selectedResource?.id === res.id
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:shadow-md'
              ]"
            >
              <div class="relative shrink-0">
                <div class="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center font-black text-base shadow-sm ring-2 ring-brand-500/40">
                  <img v-if="res.avatar_url" :src="res.avatar_url" :alt="res.name" class="w-full h-full object-cover" />
                  <span v-else :class="selectedResource?.id === res.id ? 'text-white' : 'text-brand-700'">
                    {{ res.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div class="truncate">
                <p class="font-black text-xs truncate">{{ res.name }}</p>
                <p :class="['text-[11px] truncate mt-0.5', selectedResource?.id === res.id ? 'text-slate-300' : 'text-slate-400 font-medium']">
                  {{ res.specialty || 'Especialista' }}
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>

      <!-- ETAPA 2: DATA E HORÁRIOS (SELETOR DE DIAS VIBRANTE) -->
      <div v-if="step === 2" class="p-5 space-y-6 animate-fadeIn">
        
        <!-- Carrossel de Dias da Semana -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-black text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5">
              <span class="text-brand-600">📅</span>
              <span>Escolha o Dia</span>
            </h2>
            <span class="text-xs text-brand-600 font-bold">Próximos 7 dias</span>
          </div>

          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              v-for="d in availableDays"
              :key="d.dateStr"
              type="button"
              @click="selectedDate = d.dateStr"
              :class="[
                'shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-2xl border-2 transition-all font-sans',
                selectedDate === d.dateStr
                  ? 'border-brand-600 bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/30 scale-105'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              ]"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider opacity-80">{{ d.dayName }}</span>
              <span class="text-lg font-black mt-0.5 leading-none">{{ d.dayNumber }}</span>
              <span class="text-[9px] font-medium opacity-70 mt-1">{{ d.monthName }}</span>
            </button>
          </div>
        </div>

        <!-- Grade de Horários Disponíveis -->
        <div v-if="selectedDate" class="space-y-3.5 pt-2">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-black text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5">
                <span class="text-brand-600">⏱️</span>
                <span>Horários Disponíveis</span>
              </h2>
              <p class="text-xs text-slate-400 font-medium">Com {{ selectedResource?.name }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2.5">
            <button
              v-for="slot in computedTimeSlots"
              :key="slot.time"
              :disabled="slot.isBooked || slot.isPast"
              @click="!slot.isBooked && !slot.isPast && (selectedTime = slot.time)"
              :class="[
                'py-3.5 rounded-2xl border-2 font-black text-sm transition-all flex flex-col items-center justify-center relative overflow-hidden',
                slot.isBooked || slot.isPast
                  ? 'bg-slate-100 text-slate-300 border-slate-200/70 cursor-not-allowed line-through'
                  : selectedTime === slot.time
                    ? 'border-brand-600 bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-xl shadow-brand-600/30 scale-105 ring-2 ring-brand-500/20'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-sm'
              ]"
            >
              <span>{{ slot.time }}</span>
              <span v-if="slot.isBooked" class="text-[9px] font-bold text-red-400 no-underline -mt-0.5">Ocupado</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ETAPA 3: CONFIRMAÇÃO (ESTILO BILHETE / TICKET VIP) -->
      <div v-if="step === 3" class="p-5 space-y-6 animate-fadeIn">
        
        <!-- Ticket VIP com corte e detalhes -->
        <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden relative">
          <!-- Topo do Ticket -->
          <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 relative">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[10px] uppercase font-black tracking-widest text-brand-400 bg-brand-950/80 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                  Resumo da Reserva
                </span>
                <h3 class="text-lg font-black mt-2 tracking-tight">{{ selectedService?.name }}</h3>
              </div>
              <span class="text-2xl">🎟️</span>
            </div>
          </div>

          <!-- Corpo do Ticket -->
          <div class="p-5 space-y-3 bg-gradient-to-b from-white to-slate-50/50 text-xs">
            <div class="flex justify-between items-center py-1 border-b border-dashed border-slate-200">
              <span class="text-slate-400 font-medium">Profissional:</span>
              <span class="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <span>👤</span> {{ selectedResource?.name }}
              </span>
            </div>

            <div class="flex justify-between items-center py-1 border-b border-dashed border-slate-200">
              <span class="text-slate-400 font-medium">Data & Horário:</span>
              <span class="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <span>📅</span> {{ formatDate(selectedDate) }} às {{ selectedTime }}
              </span>
            </div>

            <div class="flex justify-between items-center py-1 border-b border-dashed border-slate-200">
              <span class="text-slate-400 font-medium">Tempo de atendimento:</span>
              <span class="font-extrabold text-slate-800">{{ selectedService?.duration_minutes }} minutos</span>
            </div>

            <div class="pt-2 flex justify-between items-center">
              <div>
                <span class="text-xs text-slate-500 font-semibold block">Valor total:</span>
                <span class="text-[10px] text-emerald-600 font-bold">Pague no local após o atendimento</span>
              </div>
              <span class="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                R$ {{ Number(selectedService?.price).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Formulário do Cliente -->
        <div class="bg-white p-5 rounded-3xl border-2 border-slate-200/90 shadow-sm space-y-4">
          <h2 class="font-black text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5">
            <span>📝</span>
            <span>Seus Dados para Contato</span>
          </h2>

          <div class="space-y-3">
            <div>
              <label class="text-xs font-extrabold text-slate-700 block mb-1">Seu Nome Completo *</label>
              <input
                v-model="clientName"
                placeholder="Ex: João da Silva"
                class="w-full p-3.5 border-2 border-slate-200 rounded-2xl outline-none focus:border-brand-500 font-medium text-sm transition"
                required
              />
            </div>

            <div>
              <label class="text-xs font-extrabold text-slate-700 block mb-1">WhatsApp / Celular com DDD *</label>
              <input
                v-model="clientPhone"
                placeholder="(11) 98888-7777"
                class="w-full p-3.5 border-2 border-slate-200 rounded-2xl outline-none focus:border-brand-500 font-medium text-sm transition"
                required
              />
            </div>
          </div>
        </div>

      </div>

      <!-- ETAPA 4: SUCESSO & BOTÃO DO WHATSAPP OFICIAL -->
      <div v-if="step === 4" class="p-6 text-center space-y-6 my-auto animate-fadeIn">
        <div class="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-emerald-300 text-white rounded-3xl flex items-center justify-center mx-auto text-4xl font-black shadow-2xl shadow-emerald-500/30">
          ✓
        </div>
        
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Agendamento Realizado!</h2>
          <p class="text-slate-500 text-xs max-w-xs mx-auto">
            Obrigado <strong class="text-slate-800">{{ clientName }}</strong>, seu horário foi reservado com sucesso no sistema da <strong>{{ org.name }}</strong>.
          </p>
        </div>

        <!-- Card de Resumo -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 shadow-sm">
          <div class="flex justify-between border-b pb-1.5">
            <span class="text-slate-400">Serviço:</span>
            <span class="font-bold text-slate-800">{{ selectedService?.name }}</span>
          </div>
          <div class="flex justify-between border-b pb-1.5">
            <span class="text-slate-400">Profissional:</span>
            <span class="font-bold text-slate-800">{{ selectedResource?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Data e Hora:</span>
            <span class="font-bold text-slate-800">{{ formatDate(selectedDate) }} às {{ selectedTime }}</span>
          </div>
        </div>

        <!-- Botão Oficial do WhatsApp com Efeito de Destaque -->
        <div class="space-y-2 pt-2">
          <a
            v-if="whatsappConfirmationUrl"
            :href="whatsappConfirmationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-2xl shadow-xl shadow-green-600/30 transition-all flex items-center justify-center gap-2.5 text-base tracking-wide transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>📲</span>
            <span>Enviar Confirmação via WhatsApp</span>
          </a>
          <p class="text-[11px] text-slate-400 font-medium">Toque para avisar a barbearia pelo WhatsApp em 1 clique</p>
        </div>

        <button
          @click="resetForm"
          class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs"
        >
          Fazer Outro Agendamento
        </button>
      </div>

      <!-- BARRA FIXA INFERIOR (STICKY ACTION BAR ESTILO APP NATIVO) -->
      <div
        v-if="step < 4"
        class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl p-3.5 max-w-md mx-auto"
      >
        <div class="flex items-center justify-between gap-3">
          
          <button
            v-if="step > 1"
            type="button"
            @click="step--"
            class="px-4 py-3.5 border-2 border-slate-200 font-bold rounded-2xl text-slate-600 hover:bg-slate-100 transition text-xs"
          >
            Voltar
          </button>

          <!-- Preço ou Info no Canto Esquerdo se estiver no Step 1 ou 2 -->
          <div v-if="selectedService" class="flex-1 truncate">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selecionado</p>
            <p class="text-xs font-black text-slate-900 truncate">{{ selectedService.name }}</p>
            <p class="text-xs font-extrabold text-emerald-600">R$ {{ Number(selectedService.price).toFixed(2) }}</p>
          </div>

          <!-- Botões de Avançar -->
          <button
            v-if="step === 1"
            type="button"
            :disabled="!selectedService || !selectedResource"
            @click="step = 2"
            :class="[
              'py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg',
              selectedService && selectedResource
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand-600/30 hover:opacity-95 transform active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            ]"
          >
            <span>Horários</span>
            <span>➔</span>
          </button>

          <button
            v-if="step === 2"
            type="button"
            :disabled="!selectedDate || !selectedTime"
            @click="step = 3"
            :class="[
              'py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg',
              selectedDate && selectedTime
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand-600/30 hover:opacity-95 transform active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            ]"
          >
            <span>Confirmar</span>
            <span>➔</span>
          </button>

          <button
            v-if="step === 3"
            type="button"
            :disabled="!clientName.trim() || !clientPhone.trim()"
            @click="confirmBooking"
            :class="[
              'flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl',
              clientName.trim() && clientPhone.trim()
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-emerald-600/30 hover:opacity-95 transform active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            ]"
          >
            <span>Finalizar Reserva</span>
            <span>✓</span>
          </button>

        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { dataService } from '../services/database'

const route = useRoute()
const currentSlug = computed(() => route.params.slug || 'barbeariagriffs')

const step = ref(1)
const org = ref({
  id: '',
  name: '',
  address: '',
  phone: '',
  logo_url: '',
  banner_url: '',
  primary_color: '#0284c7'
})
const subscriptionInfo = ref({ active: true, expired: false })
const services = ref([])
const resources = ref([])
const bookedTimes = ref([])

const selectedService = ref(null)
const selectedResource = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const clientName = ref('')
const clientPhone = ref('')

// Gera próximos 7 dias para o carrossel interativo
const availableDays = computed(() => {
  const days = []
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    days.push({
      dateStr,
      dayNumber: d.getDate(),
      dayName: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : weekDays[d.getDay()],
      monthName: months[d.getMonth()]
    })
  }
  return days
})

const today = computed(() => availableDays.value[0]?.dateStr || '')

const baseTimes = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

// Computa horários livres checando ocupação
const computedTimeSlots = computed(() => {
  const now = new Date()
  const currentHours = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  const isToday = selectedDate.value === today.value

  return baseTimes.map(time => {
    const isBooked = bookedTimes.value.includes(time)
    const isPast = isToday && time <= currentHours
    return { time, isBooked, isPast }
  })
})

// Filtra profissionais disponíveis para o serviço selecionado
const filteredProfessionals = computed(() => {
  if (!selectedService.value) return resources.value.filter(p => p.active !== false)
  return resources.value.filter(prof => {
    if (prof.active === false) return false
    if (!prof.service_ids || prof.service_ids.length === 0) return true
    return prof.service_ids.includes(selectedService.value.id)
  })
})

const selectService = (service) => {
  selectedService.value = service
  // Se o profissional selecionado antes não faz esse serviço, reseta
  if (selectedResource.value && !filteredProfessionals.value.some(p => p.id === selectedResource.value.id)) {
    selectedResource.value = null
  }
}

// Busca horários já ocupados
watch([selectedResource, selectedDate], async ([res, date]) => {
  if (res && date) {
    bookedTimes.value = await dataService.getBookedTimes(res.id, date)
  } else {
    bookedTimes.value = []
  }
})

const loadData = async () => {
  const organizationData = await dataService.getOrganization(currentSlug.value)
  if (organizationData) {
    org.value = organizationData
    subscriptionInfo.value = dataService.checkSubscription(org.value)

    if (org.value.id && !subscriptionInfo.value.expired) {
      services.value = await dataService.getServices(org.value.id, true)
      resources.value = await dataService.getProfessionals(org.value.id)
      
      // Pré-seleciona primeiro profissional se só tiver 1
      if (resources.value.length === 1) {
        selectedResource.value = resources.value[0]
      }
    }
  }
}

onMounted(() => {
  loadData()
  if (availableDays.value.length > 0) {
    selectedDate.value = availableDays.value[0].dateStr
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

const whatsappConfirmationUrl = computed(() => {
  if (!org.value?.phone || !selectedService.value || !selectedResource.value) return ''
  const cleanPhone = org.value.phone.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Olá! Acabei de fazer um agendamento na *${org.value.name}*:\n\n` +
    `✂️ *Serviço:* ${selectedService.value.name} (R$ ${Number(selectedService.value.price).toFixed(2)})\n` +
    `👤 *Profissional:* ${selectedResource.value.name}\n` +
    `📅 *Data:* ${formatDate(selectedDate.value)} às ${selectedTime.value}\n` +
    `🙋‍♂️ *Cliente:* ${clientName.value}\n` +
    `📱 *Telefone:* ${clientPhone.value}\n\n` +
    `Poderia confirmar por gentileza?`
  )
  return `https://wa.me/55${cleanPhone}?text=${message}`
})

const confirmBooking = async () => {
  await dataService.addAppointment({
    service_id: selectedService.value.id,
    resource_id: selectedResource.value.id,
    date: selectedDate.value,
    time: selectedTime.value,
    client_name: clientName.value,
    client_phone: clientPhone.value
  }, org.value?.id)
  step.value = 4
}

const resetForm = () => {
  step.value = 1
  selectedService.value = null
  selectedResource.value = null
  if (availableDays.value.length > 0) {
    selectedDate.value = availableDays.value[0].dateStr
  }
  selectedTime.value = ''
  clientName.value = ''
  clientPhone.value = ''
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}

/* Ocultar barra de rolagem horizontal mantendo navegação */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>