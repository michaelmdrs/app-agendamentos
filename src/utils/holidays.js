/**
 * Utilitário de calendário para cálculo de dias úteis e feriados nacionais brasileiros
 * (fixos e móveis baseados no cálculo da Páscoa).
 */

const FIXED_HOLIDAYS = [
  '01-01', // Confraternização Universal (Ano Novo)
  '04-21', // Tiradentes
  '05-01', // Dia do Trabalhador
  '09-07', // Independência do Brasil
  '10-12', // Nossa Senhora Aparecida
  '11-02', // Finados
  '11-15', // Proclamação da República
  '11-20', // Dia Nacional de Zumbi e da Consciência Negra
  '12-25'  // Natal
]

/**
 * Calcula a data do Domingo de Páscoa para um determinado ano (Algoritmo de Meeus/Jones/Butcher)
 */
function getEasterDate(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function addDaysFormatted(baseDate, daysOffset) {
  const d = new Date(baseDate)
  d.setDate(d.getDate() + daysOffset)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Retorna um Set com todos os feriados nacionais (YYYY-MM-DD) do ano informado
 */
export function getYearHolidays(year) {
  const holidays = new Set()

  // Feriados fixos
  for (const monthDay of FIXED_HOLIDAYS) {
    holidays.add(`${year}-${monthDay}`)
  }

  // Feriados móveis baseados na Páscoa
  const easter = getEasterDate(year)
  holidays.add(addDaysFormatted(easter, -48)) // Segunda-feira de Carnaval
  holidays.add(addDaysFormatted(easter, -47)) // Terça-feira de Carnaval
  holidays.add(addDaysFormatted(easter, -2))  // Sexta-feira Santa (Paixão de Cristo)
  holidays.add(addDaysFormatted(easter, 60))  // Corpus Christi

  return holidays
}

/**
 * Verifica se uma data (Date ou string YYYY-MM-DD) é feriado no calendário
 */
export function isCalendarHoliday(dateInput) {
  let year, dateStr

  if (typeof dateInput === 'string') {
    dateStr = dateInput
    year = Number(dateInput.split('-')[0])
  } else if (dateInput instanceof Date) {
    year = dateInput.getFullYear()
    const month = String(dateInput.getMonth() + 1).padStart(2, '0')
    const day = String(dateInput.getDate()).padStart(2, '0')
    dateStr = `${year}-${month}-${day}`
  } else {
    return false
  }

  const holidays = getYearHolidays(year)
  return holidays.has(dateStr)
}

/**
 * Verifica se o dia está disponível para agendamento:
 * - Segunda a Sábado (getDay() de 1 a 6; Domingo = 0 é desconsiderado)
 * - Não é feriado no calendário
 */
export function isAvailableBookingDay(dateObj) {
  const dayOfWeek = dateObj.getDay()
  // 0 = Domingo (estabelecimento fechado)
  if (dayOfWeek === 0) return false
  // Feriados do calendário (estabelecimento fechado)
  if (isCalendarHoliday(dateObj)) return false
  return true
}
