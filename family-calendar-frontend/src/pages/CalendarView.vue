<template>
  <div class="calendar-page">
    <!-- Nagłówek -->
    <header class="calendar-header">
      <div class="header-top">
        <h1>📅 Kalendarz Rodzinny</h1>
        <button class="logout-btn" @click="handleLogout">Wyloguj</button>
      </div>
      <div class="month-nav">
        <button @click="prevMonth">&lt;</button>
        <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <button @click="nextMonth">&gt;</button>
        <button class="add-event-btn" @click="showModal = true">+ Dodaj wydarzenie</button>
      </div>
    </header>

    <!-- Grid kalendarza -->
    <div class="calendar-grid">
      <div class="day-name" v-for="day in weekDays" :key="day">{{ day }}</div>

      <div
        class="day-cell"
        v-for="day in calendarDays"
        :key="day.date"
        :class="{ today: isToday(day.date) }"
      >
        <div class="date-number">{{ day.number }}</div>
        <ul class="events">
          <li
            v-for="event in day.events"
            :key="event.id"
            :class="event.color"
          >
            {{ event.title }}
          </li>
        </ul>
      </div>
    </div>

    <!-- MODAL DODAWANIA EVENTU -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Dodaj wydarzenie</h3>
        <form @submit.prevent="addEvent">
          <label>Tytuł:</label>
          <input v-model="newEvent.title" type="text" placeholder="Wydarzenie" required />

          <label>Data:</label>
          <input v-model="newEvent.date" type="date" required />

          <label>Osoba:</label>
          <select v-model="newEvent.color" required>
            <option value="event-mama">Mama</option>
            <option value="event-tata">Tata</option>
            <option value="event-dziecko">Dziecko</option>
          </select>

          <div class="modal-actions">
            <button type="submit" class="btn">Dodaj</button>
            <button type="button" class="btn cancel" @click="closeModal">Anuluj</button>
          </div>
        </form>
      </div>
    </div>

    <!-- TOAST WYLOGOWANIA -->
    <div v-if="showToast" class="toast">
      Wylogowano pomyślnie!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
const monthNames = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
]

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const events = ref([
  { id: 1, date: `${today.getFullYear()}-${today.getMonth()+1}-5`, title: 'Wizyta u lekarza', color: 'event-mama' },
  { id: 2, date: `${today.getFullYear()}-${today.getMonth()+1}-12`, title: 'Spotkanie z dziadkami', color: 'event-tata' },
  { id: 3, date: `${today.getFullYear()}-${today.getMonth()+1}-20`, title: 'Urodziny Ani', color: 'event-dziecko' },
])

const showModal = ref(false)
const newEvent = ref({ title: '', date: '', color: 'event-mama' })
const showToast = ref(false)

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const days = []

  let startWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  for (let i = 0; i < startWeek; i++) days.push({ number: '', date: '', events: [] })

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${currentYear.value}-${currentMonth.value + 1}-${i}`
    const dayEvents = events.value.filter(e => e.date === dateStr)
    days.push({ number: i, date: dateStr, events: dayEvents })
  }

  return days
})

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}
const isToday = (dateStr) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return d.toDateString() === today.toDateString()
}
const closeModal = () => {
  showModal.value = false
  newEvent.value = { title: '', date: '', color: 'event-mama' }
}
const addEvent = () => {
  events.value.push({
    id: Date.now(),
    title: newEvent.value.title,
    date: newEvent.value.date,
    color: newEvent.value.color
  })
  closeModal()
}

// --- WYLOGOWANIE Z TOAST ---
const handleLogout = () => {
  authStore.logout()
  events.value = []
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
    router.push('/login')
  }, 1500) // toast widoczny 1,5s
}
</script>

<style scoped>
.calendar-page {
  padding: 1rem;
  font-family: Arial, sans-serif;
}

/* Header i nawigacja */
.calendar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.header-top {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.logout-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.logout-btn:hover {
  background: #dc2626;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.month-nav button {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s;
}
.month-nav button:hover { background: #1d4ed8; }
.add-event-btn {
  background: #10b981;
}
.add-event-btn:hover { background: #059669; }

/* Grid kalendarza */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}
.day-name {
  font-weight: bold;
  text-align: center;
  padding: 0.5rem 0;
  border-radius: 8px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  color: white;
}
.day-cell {
  min-height: 80px;
  border-radius: 8px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: transform 0.2s, background 0.2s;
}
.day-cell:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #bfdbfe, #93c5fd);
}
.day-cell.today { border: 2px solid #2563eb; }
.date-number { font-weight: bold; margin-bottom: 0.3rem; color: #1e3a8a; }

/* Eventy kolorowe */
.events { list-style: none; padding: 0; margin: 0; font-size: 0.75rem; }
.events li { padding: 2px 6px; border-radius: 6px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-mama { background: #f87171; color: #fff; }
.event-tata { background: #34d399; color: #fff; }
.event-dziecko { background: #fbbf24; color: #fff; }

/* Toast wylogowania */
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
  animation: fadeIn 0.3s, fadeOut 0.3s 1.2s;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  animation: fadeInUp 0.3s ease-out;
}
.modal h3 { margin-top: 0; margin-bottom: 1rem; font-size: 1.3rem; color: #1e3a8a; text-align: center; }
.modal input, .modal select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  transition: all 0.2s;
}
.modal input:focus, .modal select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}
.modal-actions { display: flex; gap: 0.5rem; }
.modal-actions .btn {
  flex: 1;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-actions .btn:hover { background: linear-gradient(90deg, #1d4ed8, #2563eb); }
.modal-actions .cancel {
  background: linear-gradient(90deg, #ef4444, #f87171);
}
.modal-actions .cancel:hover { background: linear-gradient(90deg, #dc2626, #ef4444); }

/* Animacja */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Responsywność */
@media (max-width: 768px) {
  .calendar-grid { grid-template-columns: repeat(2, 1fr); }
  .day-cell { min-height: 60px; font-size: 0.9rem; }
}
@media (max-width: 480px) {
  .calendar-grid { grid-template-columns: 1fr; }
}
</style>